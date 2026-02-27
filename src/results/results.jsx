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

    // Load saved tier lists (placeholder)
    const saved = localStorage.getItem('savedTierLists');
    if (saved) {
      setSavedLists(JSON.parse(saved));
    } else {
      //ex saved listss
      setSavedLists([
        { title: 'Top Movies of All Time', date: '01/25/2026' },
        { title: 'Best Video Games', date: '01/20/2026' },
        { title: 'Favorite Foods', date: '01/15/2026' }
      ]);
    }
  }, []);

  function saveTierList() {
    if (completedList) {
      const newList = {
        title: completedList.title,
        date: completedList.completedDate
      };
      const updated = [newList, ...savedLists];
      setSavedLists(updated);
      localStorage.setItem('savedTierLists', JSON.stringify(updated));
      alert('Tier list saved to database!');
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