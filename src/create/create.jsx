import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function Create() {
  const [title, setTitle] = useState('');
  const [items, setItems] = useState(['', '', '', '', '']);
  const [joinCode, setJoinCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const navigate = useNavigate();
  const socketRef = React.useRef(null);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      // Someone created a session — if we sent a join request, load the tier list
      if (msg.type === 'session_created') {
        if (msg.joinCode === joinCode.toUpperCase()) {
          localStorage.setItem('currentTierList', JSON.stringify(msg.tierList));
          navigate('/voting');
        }
      }
    };

    return () => socket.close();
  }, [joinCode, navigate]);

  function addItem() {
    setItems([...items, '']);
  }

  function removeItem() {
    if (items.length > 1) setItems(items.slice(0, -1));
  }

  function updateItem(index, value) {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  }

  function generateJoinCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  function handleCreateTierList(event) {
    event.preventDefault();
    const code = generateJoinCode();
    const tierList = {
      title,
      items: items.filter(item => item.trim() !== ''),
      date: new Date().toLocaleDateString(),
      joinCode: code,
    };

    localStorage.setItem('currentTierList', JSON.stringify(tierList));

    // Send the session out so others can join
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

    // Determine if session exists
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'join_request',
        joinCode: code,
      }));
    }

    //No response within 3 seconds, wrong code
    setTimeout(() => {
      setJoinError('Session not found. Check your code and try again.');
    }, 3000);
  }

  return (
    <main>
      <section id="tier-list-creator">
        <h2>Title:</h2>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <h3>Add Items to Rank:</h3>
        <form onSubmit={handleCreateTierList}>
          {items.map((item, index) => (
            <div key={index}>
              <label>Item {index + 1}:</label>
              <input
                type="text"
                placeholder="Enter item"
                value={item}
                onChange={(e) => updateItem(index, e.target.value)}
              />
            </div>
          ))}
          <button type="button" onClick={addItem}>Add Item</button>
          <button type="button" onClick={removeItem}>Remove Item</button>
          <br />
          <button type="submit">Create Tier List</button>
        </form>

        <br />
        <h2>Join an ongoing session</h2>
        <p>Enter the join code provided by your session creator:</p>
        <form onSubmit={handleJoinSession}>
          <label>Join Code:</label>
          <input
            type="text"
            placeholder="Enter 4-character code"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            maxLength="4"
            required
          />
          <button type="submit">Join Session</button>
          {joinError && <p style={{ color: 'red' }}>{joinError}</p>}
        </form>
      </section>
    </main>
  );
}