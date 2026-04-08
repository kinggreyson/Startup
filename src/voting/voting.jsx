import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export function Voting() {
  const [tierList, setTierList] = useState(null);
  const [tiers, setTiers] = useState({ S: [], A: [], B: [], C: [], D: [] });
  const [unranked, setUnranked] = useState([]);
  const [votedItems, setVotedItems] = useState(new Set());
  const [activity, setActivity] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showChat, setShowChat] = useState(true);
  const [userCount, setUserCount] = useState(1);
  const navigate = useNavigate();
  const socketRef = useRef(null);

  // 1. Initial Load and WebSocket Setup
  useEffect(() => {
    const saved = localStorage.getItem('currentTierList');
    if (saved) {
      const data = JSON.parse(saved);
      setTierList(data);
      setUnranked(data.items);
    }

    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
    socketRef.current = socket;

    socket.onopen = () => console.log('WebSocket connected');
    
    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      handleIncomingMessage(msg);
    };

    socket.onclose = () => console.log('WebSocket disconnected');

    return () => socket.close();
  }, []); // Empty dependency array keeps the connection stable

  // 2. Logic to handle messages from OTHER users
  function handleIncomingMessage(msg) {
    if (msg.type === 'vote') {
      setActivity(prev => [`${msg.user} voted ${msg.item} to ${msg.tier} tier`, ...prev].slice(0, 5));
    } else if (msg.type === 'vote_result') {
      setUnranked(prev => prev.filter(i => i !== msg.item));
      setTiers(prev => ({ ...prev, [msg.tier]: [...prev[msg.tier], msg.item] }));
      setActivity(prev => [`✅ ${msg.item} placed in ${msg.tier} tier!`, ...prev].slice(0, 5));
    } else if (msg.type === 'chat') {
      setChatMessages(prev => [...prev, { user: msg.user, message: msg.message }]);
    } else if (msg.type === 'user_count') {
      setUserCount(msg.count);
    } else if (msg.type === 'revote') {
      setVotedItems(prev => {
        const next = new Set(prev);
        next.delete(msg.item);
        return next;
      });
      setActivity(prev => [`🔁 Tie on ${msg.item}! Revote!`, ...prev].slice(0, 5));
    }
  }

  // 3. Auto-navigate when finished
  useEffect(() => {
    if (tierList && unranked.length === 0 && 
       (tiers.S.length > 0 || tiers.A.length > 0 || tiers.B.length > 0 || tiers.C.length > 0 || tiers.D.length > 0)) {
      const completedTierList = {
        ...tierList,
        tiers,
        completedDate: new Date().toLocaleDateString(),
        votedBy: userCount,
      };
      localStorage.setItem('completedTierList', JSON.stringify(completedTierList));
      setTimeout(() => navigate('/results'), 500);
    }
  }, [unranked, tiers, tierList, navigate, userCount]);

  // 4. Action: Voting on an item
  function rankItem(item, tier) {
    const username = localStorage.getItem('username') || 'Newplayer';
    if (votedItems.has(item)) return;

    setVotedItems(prev => new Set(prev).add(item));
    const msg = { type: 'vote', user: username, item, tier, joinCode: tierList?.joinCode };

    setActivity(prev => [`You voted ${item} to ${tier} tier (waiting...)`, ...prev].slice(0, 5));

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(msg));
    }
  }

  // 5. Action: Sending a chat
  function sendMessage() {
    if (newMessage.trim()) {
      const username = localStorage.getItem('username') || 'Newplayer';
      const msg = { 
        type: 'chat', 
        user: username, 
        message: newMessage, 
        joinCode: tierList?.joinCode 
      };
      
      setChatMessages(prev => [...prev, { user: username, message: newMessage }]);
      
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify(msg));
      }
      setNewMessage('');
    }
  }

  if (!tierList) return <main><h2>No active tier list</h2><p>Please create one first!</p></main>;

  const username = localStorage.getItem('username') || 'Newplayer';

  return (
    <main>
      <h3>User: {username}</h3>
      <p>Join Code: {tierList.joinCode}</p>
      <h2>Tier List: {tierList.title}</h2>
      <p>Users currently voting: {userCount}</p>
      <hr />

      {['S', 'A', 'B', 'C', 'D'].map(tierName => (
        <div key={tierName}>
          <h3>{tierName} Tier</h3>
          {tiers[tierName].length > 0
            ? tiers[tierName].map((item, index) => <p key={index}>{item}</p>)
            : <p>(Empty)</p>}
          <hr />
        </div>
      ))}

      <h3>Unranked</h3>
      {unranked.map((item, index) => (
        <p key={index}>
          {item}{' '}
          {votedItems.has(item)
            ? <em>(waiting for others...)</em>
            : <>
                <button onClick={() => rankItem(item, 'S')}>S</button>{' '}
                <button onClick={() => rankItem(item, 'A')}>A</button>{' '}
                <button onClick={() => rankItem(item, 'B')}>B</button>{' '}
                <button onClick={() => rankItem(item, 'C')}>C</button>{' '}
                <button onClick={() => rankItem(item, 'D')}>D</button>
              </>
          }
        </p>
      ))}

      <hr />
      <h3>Activity</h3>
      {activity.map((act, index) => <p key={index}>{act}</p>)}

      <hr />
      <button onClick={() => setShowChat(!showChat)}>
        {showChat ? 'Hide Chat' : 'Open Chat'}
      </button>

      {showChat && (
        <>
          <h3>Chat</h3>
          <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
            {chatMessages.map((msg, index) => (
              <p key={index}><strong>{msg.user}:</strong> {msg.message}</p>
            ))}
          </div>
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </>
      )}
      <br /><br />
    </main>
  );
}