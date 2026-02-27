import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


export function Voting() {
  const [tierList, setTierList] = useState(null);
  const [tiers, setTiers] = useState({
    S: [],
    A: [],
    B: [],
    C: [],
    D: []
  });
  const [unranked, setUnranked] = useState([]);
  const [activity, setActivity] = useState([]);
  const [chatMessages, setChatMessages] = useState([
    { user: 'User1', message: 'Put it in S tier' },
    { user: 'User2', message: 'NO should be in D' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [showChat, setShowChat] = useState(true);
  const navigate = useNavigate();

  // load tier list from create/local storage
  useEffect(() => {
    const saved = localStorage.getItem('currentTierList');
    if (saved) {
      const data = JSON.parse(saved);
      setTierList(data);
      setUnranked(data.items);
    }
  }, []);
  useEffect(() => {
    if (tierList && unranked.length === 0 && 
        (tiers.S.length > 0 || tiers.A.length > 0 || tiers.B.length > 0 || 
         tiers.C.length > 0 || tiers.D.length > 0)) {
      // Save final results
      const completedTierList = {
        ...tierList,
        tiers: tiers,
        completedDate: new Date().toLocaleDateString(),
        votedBy: 5 // Mock number of voters
      };
      localStorage.setItem('completedTierList', JSON.stringify(completedTierList));
      
      // Navigate to results after a brief moment
      setTimeout(() => {
        navigate('/results');
      }, 500);
    }
  }, [unranked, tiers, tierList, navigate]);

    //Show fake activity *PLACEHOLDER*
  useEffect(() => {
    const interval = setInterval(() => {
      const users = ['User1', 'User2', 'User3'];
      const tierNames = ['S', 'A', 'B', 'C', 'D'];
      const randomUser = users[Math.floor(Math.random() * users.length)]; //Random user
      const randomTier = tierNames[Math.floor(Math.random() * tierNames.length)]; //Random tier
      
      const newActivity = `${randomUser} voted an item to ${randomTier} tier`;
      setActivity(prev => [newActivity, ...prev].slice(0, 5)); // Keep last 5
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  function rankItem(item, tier) {
    //Removes from list
    setUnranked(prev => prev.filter(i => i !== item));
    
    // Adds to tier
    setTiers(prev => ({
      ...prev,
      [tier]: [...prev[tier], item]
    }));

    //Add vote to activity
    const username = localStorage.getItem('username') || 'Newplayer';
    setActivity(prev => [`${username} voted ${item} to ${tier} tier`, ...prev].slice(0, 5));
  }

  function sendMessage() {
    if (newMessage.trim()) {
      const username = localStorage.getItem('username') || 'Newplayer';
      setChatMessages(prev => [...prev, { user: username, message: newMessage }]);
      setNewMessage('');
    }
  }

  if (!tierList) {
    return (
      <main>
        <h2>No active tier list</h2>
        <p>Please create a tier list first!</p>
      </main>
    );
  }

  const username = localStorage.getItem('username') || 'Newplayer';

  return (
    <main>
      <h3>User: {username}</h3>
      <p>Generated Join Code: {tierList.joinCode}</p>
      <h2>Tier List: {tierList.title}</h2>
      
      <p>Users currently voting: 5</p>
      
      <hr />
      
      {/* Display each tier */}
      {['S', 'A', 'B', 'C', 'D'].map(tierName => (
        <div key={tierName}>
          <h3>{tierName} Tier</h3>
          {tiers[tierName].length > 0 ? (
            tiers[tierName].map((item, index) => (
              <p key={index}>{item}</p>
            ))
          ) : (
            <p>(Empty)</p>
          )}
          <hr />
        </div>
      ))}
      
      <h3>Unranked</h3>
      {unranked.map((item, index) => (
        <p key={index}>
          {item}{' '}
          <button onClick={() => rankItem(item, 'S')}>S</button>{' '}
          <button onClick={() => rankItem(item, 'A')}>A</button>{' '}
          <button onClick={() => rankItem(item, 'B')}>B</button>{' '}
          <button onClick={() => rankItem(item, 'C')}>C</button>{' '}
          <button onClick={() => rankItem(item, 'D')}>D</button>
        </p>
      ))}

      <hr />
      
      <h3>Activity</h3>
      {activity.map((act, index) => (
        <p key={index}>{act}</p>
      ))}
      
      <hr />
      <button onClick={() => setShowChat(!showChat)}>
        {showChat ? 'Hide Chat' : 'Open Chat'}
      </button>
      
      {showChat && (
        <>
          <h3>Chat</h3>
          {chatMessages.map((msg, index) => (
            <p key={index}>
              <strong>{msg.user}:</strong> {msg.message}
            </p>
          ))}
          <input 
            type="text" 
            placeholder="Type a message..." 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </>
      )}
      
      <br /><br />
    </main>
  );
}