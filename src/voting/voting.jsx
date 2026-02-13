import React from 'react';

export function Voting() {
  return (
    <main>
      <h3>User: Newplayer</h3>
      <p>Generated Join Code: A64T</p>
      <h2>Tier List: Best NBA Players</h2>
      
      <p>Users currently voting: 5</p>
      
      <hr />
      
      <h3>S Tier</h3>
      <p>LeBron James</p>
      <p>Michael Jordan</p>
      
      <hr />
      
      <h3>A Tier</h3>
      <p>Kobe Bryant</p>
      <p>Stephen Curry</p>
      
      <hr />
      
      <h3>B Tier</h3>
      <p>Kevin Durant</p>
      
      <hr />
      
      <h3>C Tier</h3>
      <p>Dwyane Wade</p>
      
      <hr />
      
      <h3>D Tier</h3>
      <p>(Empty)</p>
      
      <hr />
      
      <h3>Unranked</h3>
      <p>Russell Westbrook <button>S</button> <button>A</button> <button>B</button> <button>C</button> <button>D</button></p>
      <p>Shai Gilgeous-Alexander</p>
      <p>Nikola Jokic</p>

      <hr />
      
      <h3>Activity</h3>
      <p>User123 voted LeBron James to S tier</p>
      <p>User456 voted Kobe Bryant to A tier</p>
      
      <hr />
      <button>Open Chat</button>
      
      <h3>Chat</h3>
      <p><strong>User123:</strong> LeBron is the GOAT!</p>
      <p><strong>User456:</strong> MJ is better</p>
      <input type="text" placeholder="Type a message..." />
      <button>Send</button>
      
      <br /><br />
    </main>
  );
}