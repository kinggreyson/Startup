import React from 'react';

export function Results() {
  return (
    <main>
      <h3>User: Newplayer</h3>
      <h2>Final Results: Best NBA Players</h2>
      
      <p>Voting completed by 5 users</p>
      
      <hr />
      
      <h3>S Tier</h3>
      <p>LeBron James</p>
      <p>Michael Jordan</p>
      
      <hr />
      
      <h3>A Tier</h3>
      <p>Kobe Bryant</p>
      <p>Shai Gilgeous-Alexander</p>
      <p>Stephen Curry</p>
      <p>Nikola Jokic</p>
      
      <hr />
      
      <h3>B Tier</h3>
      <p>Kevin Durant</p>
      
      <hr />
      
      <h3>C Tier</h3>
      <p>Dwyane Wade</p>
      <p>Russell Westbrook</p>
      
      <hr />
      
      <h3>D Tier</h3>
      <p>(Empty)</p>
      
      <hr />
      
      <h2>Saved Tier Lists (Database)</h2>
      <ul>
        <li><a href="#">Best NBA Players - 01/28/2026</a></li>
        <li><a href="#">Top Movies of All Time - 01/25/2026</a></li>
        <li><a href="#">Best Video Games - 01/20/2026</a></li>
        <li><a href="#">Favorite Foods - 01/15/2026</a></li>
      </ul>
      <button>Save This Tier List</button>
    </main>
  );
}