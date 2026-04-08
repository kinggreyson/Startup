import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export function Create() {
  const [title, setTitle] = useState('');
  const [items, setItems] = useState(['', '', '', '', '']); // Starts with 5 slots
  const [joinCode, setJoinCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const joinCodeRef = useRef('');

  // Keeps the latest joinCode available to the WebSocket without restarts
  useEffect(() => {
    joinCodeRef.current = joinCode;
  }, [joinCode]);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      // If someone else created the session we are trying to join
      if (msg.type === 'session_created') {
        if (msg.joinCode === joinCodeRef.current.toUpperCase()) {
          localStorage.setItem('currentTierList', JSON.stringify(msg.tierList));
          navigate('/voting');
        }
      }
    };

    return () => socket.close();
  }, [navigate]);

  
  function addItem() {
    setItems([...items, '']);
  }

  function removeItem() {
    if (items.length > 1) {
      setItems(items.slice(0, -1));
    }
  }

  function updateItem(index, value) {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  }


  function handleCreateTierList(event) {
    event.preventDefault();
    
    // Generate a clean 4-character code
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const tierList = {
      title,
      items: items.filter(item => item.trim() !== ''),
      date: new Date().toLocaleDateString(),
      joinCode: code,
    };

    localStorage.setItem('currentTierList', JSON.stringify(tierList));

    // Broadcast the new session so others can join via code
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'session_created',
        joinCode: code,
        tierList,
      }));
    }

    navigate('/voting');
  }

  function handleJoinSession(event) {
    event.preventDefault();
    setJoinError('');
    const code = joinCode.toUpperCase();

    if (code.length !== 4) {
      setJoinError('Please enter a 4-character code.');
      return;
    }

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'join_request',
        joinCode: code,
      }));
      
      // If no session_created message comes back in 3s, show error
      setTimeout(() => {
        setJoinError('Session not found. Check your code and try again.');
      }, 3000);
    }
  }

  return (
    <main>
      <section id="tier-list-creator">
        <h2>Title:</h2>
        <input
          type="text"
          placeholder="Enter Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <h3>Add Items to Rank:</h3>
        <form onSubmit={handleCreateTierList}>
          {items.map((item, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <label>Item {index + 1}: </label>
              <input
                type="text"
                placeholder="Enter item name"
                value={item}
                onChange={(e) => updateItem(index, e.target.value)}
              />
            </div>
          ))}
          <div className="button-group">
            <button type="button" onClick={addItem}>+ Add Item</button>
            <button type="button" onClick={removeItem} disabled={items.length <= 1}>
              - Remove Item
            </button>
          </div>
          <br />
          <button type="submit" className="primary-btn">Create Tier List</button>
        </form>

        <hr />

        <h2>Join an ongoing session</h2>
        <p>Enter the 4-character join code:</p>
        <form onSubmit={handleJoinSession}>
          <input
            type="text"
            placeholder="ABCD"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            maxLength="4"
            style={{ textTransform: 'uppercase', width: '100px', textAlign: 'center' }}
            required
          />
          <button type="submit">Join Session</button>
          {joinError && <p style={{ color: 'red', marginTop: '10px' }}>{joinError}</p>}
        </form>
      </section>
    </main>
  );
}