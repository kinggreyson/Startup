import React, { useState, useEffect } from 'react';

export function Results() {
  const [completedList, setCompletedList] = useState(null);
  const [savedLists, setSavedLists] = useState([]);
  const username = localStorage.getItem('username') || 'Newplayer';

  useEffect(() => {
    // Loads completed list
    const completed = localStorage.getItem('completedTierList');
    if (completed) {
      setCompletedList(JSON.parse(completed));
    }
      fetch('/api/tierlists')
        .then(r => r.json())
        .then(data => setSavedLists(data))
        .catch(() => {});
  }, []);

  async function saveTierList() {
    if (completedList) {
      const response = await fetch('/api/tierlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(completedList),
      });
      if (response.ok) {
        const saved = await response.json();
        setSavedLists(prev => [saved, ...prev]);
        alert('Saved Successfully');
      }
    }
  }

  if (!completedList) {
    return (
      <main>
        <h3>User: {username}</h3>
        <h2>No Results Yet</h2>
        <p>Complete a voting session to see results!</p>
        
        <hr />
        
        <h2>Saved Tier Lists (Database)</h2>
        <ul>
          {savedLists.map((list, index) => (
            <li key={index}>
              <a href="#">{list.title} - {list.date}</a>
            </li>
          ))}
        </ul>
      </main>
    );
  }

  return (
    <main>
      <h3>User: {username}</h3>
      <h2>Final Results: {completedList.title}</h2>
      
      <p>Voting completed by {completedList.votedBy} users</p>
      
      <hr />
      
      {['S', 'A', 'B', 'C', 'D'].map(tierName => (
        <div key={tierName}>
          <h3>{tierName} Tier</h3>
          {completedList.tiers[tierName].length > 0 ? (
            completedList.tiers[tierName].map((item, index) => (
              <p key={index}>{item}</p>
            ))
          ) : (
            <p>(Empty)</p>
          )}
          <hr />
        </div>
      ))}
      
      <h2>Saved Tier Lists (Database)</h2>
      <ul>
        {savedLists.map((list, index) => (
          <li key={index}>
            <a href="#">{list.title} - {list.date}</a>
          </li>
        ))}
      </ul>
      <button onClick={saveTierList}>Save This Tier List</button>
    </main>
  );
}