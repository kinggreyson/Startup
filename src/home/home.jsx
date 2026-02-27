import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  function handleLogin(event) {
    event.preventDefault();
    localStorage.setItem('username', username);
    navigate('/create');
  }

  return (
    <main>
      <h2>Login to Create</h2>
      <form onSubmit={handleLogin}>
        <label htmlFor="Username"></label>
        <input 
          type="text" 
          id="Username" 
          name="Username" 
          placeholder="Enter Username" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required 
        />
        <label htmlFor="Password"></label>
        <input 
          type="password" 
          id="Password" 
          name="Password" 
          placeholder="Enter Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
        />
        <button type="submit">submit</button>
      </form>
    </main>
  );
}