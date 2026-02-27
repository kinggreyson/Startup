import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Create() {
  const [title, setTitle] = useState('');
  const [items, setItems] = useState(['', '', '', '', '']);
  const [joinCode, setJoinCode] = useState('');
  const navigate = useNavigate();


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
    const tierList = { 
      title, 
      items: items.filter(item => item.trim() !== ''),
      date: new Date().toLocaleDateString() 
    };
    localStorage.setItem('currentTierList', JSON.stringify(tierList));
    alert('Tier list created!');
  }

  function handleViewSaved() {
    alert('View saved rankings  *Will implement later with storage*');
  }

  function handleJoinSession(event) {
    event.preventDefault();
    if (joinCode.length === 4) {
      alert(`Joining session with code: ${joinCode} *Will implement with web socket*`);
    }
  }

  function handleCreateTierList(event) {
    event.preventDefault();
    const tierList = { 
      title, 
      items: items.filter(item => item.trim() !== ''),
      date: new Date().toLocaleDateString(),
      joinCode: generateJoinCode() 
    };
    localStorage.setItem('currentTierList', JSON.stringify(tierList));
    navigate('/voting');
  }

  function generateJoinCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  return (
    <main>
      <section id="tier-list-creator">
        <h2>Title:</h2>
        <form>
          <input 
            type="text" 
            id="Title" 
            name="Title" 
            placeholder="Title" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required 
          />
        </form>
        
        <h3>Add Items to Rank:</h3>
        <form onSubmit={handleCreateTierList}>
          {items.map((item, index) => (
            <div key={index}>
              <label htmlFor={`item${index + 1}`}>Item {index + 1}:</label>
              <input 
                type="text" 
                id={`item${index + 1}`}
                name={`item${index + 1}`}
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
          <br />
          <br />
        </form>

        <h2>View Saved Rankings</h2>
        <form>
          <button type="button" onClick={handleViewSaved}>View</button>
        </form>

        <br />
        <h2>Join an ongoing session</h2>
        <p>Enter the join code provided by your session creator:</p>
        <form onSubmit={handleJoinSession}>
          <label htmlFor="joinCode">Join Code:</label>
          <input 
            type="text" 
            id="joinCode" 
            name="joinCode" 
            placeholder="Enter 4-digit code" 
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            maxLength="4"
            required 
          />
          <button type="submit">Join Session</button>
        </form>
      </section>
    </main>
  );
}