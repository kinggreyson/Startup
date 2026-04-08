import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export function Create() {
  const [title, setTitle] = useState('');
  const [items, setItems] = useState(['', '', '', '', '']);
  const [joinCode, setJoinCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const joinCodeRef = useRef('');

  useEffect(() => {
    joinCodeRef.current = joinCode;
  }, [joinCode]);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'session_created' && msg.joinCode === joinCodeRef.current.toUpperCase()) {
        localStorage.setItem('currentTierList', JSON.stringify(msg.tierList));
        navigate('/voting');
      }
    };
    return () => socket.close();
  }, [navigate]);

  function handleCreateTierList(e) {
    e.preventDefault();
    const code = Math.random().toString(36).substring(2, 6).toUpperCase();
    const tierList = { title, items: items.filter(i => i.trim() !== ''), joinCode: code };
    localStorage.setItem('currentTierList', JSON.stringify(tierList));
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'session_created', joinCode: code, tierList }));
    }
    navigate('/voting');
  }

  function handleJoinSession(e) {
    e.preventDefault();
    setJoinError('');
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'join_request', joinCode: joinCode.toUpperCase() }));
      setTimeout(() => setJoinError('Session not found.'), 3000);
    }
  }

  const updateItem = (i, val) => { const n = [...items]; n[i] = val; setItems(n); };

  return (
    <main>
      <h2>Create</h2>
      <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
      {items.map((item, i) => <input key={i} value={item} onChange={e => updateItem(i, e.target.value)} />)}
      <button onClick={handleCreateTierList}>Create</button>
      <hr />
      <h2>Join</h2>
      <input value={joinCode} onChange={e => setJoinCode(e.target.value)} maxLength="4" />
      <button onClick={handleJoinSession}>Join</button>
      {joinError && <p style={{color: 'red'}}>{joinError}</p>}
    </main>
  );
}