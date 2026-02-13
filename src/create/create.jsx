import React from 'react';

export function Create() {
  return (
    <main>
      <section id="tier-list-creator">
        <h2>Title:</h2>
        <form>
          <input type="text" id="Title" name="Title" placeholder="Title" required />
        </form>
        
        <h3>Add Items to Rank:</h3>
        <form>
          <label htmlFor="item1">Item 1:</label>
          <input type="text" id="item1" name="item1" placeholder="Enter item" />
          
          <label htmlFor="item2">Item 2:</label>
          <input type="text" id="item2" name="item2" placeholder="Enter item" />
          
          <label htmlFor="item3">Item 3:</label>
          <input type="text" id="item3" name="item3" placeholder="Enter item" />
          
          <label htmlFor="item4">Item 4:</label>
          <input type="text" id="item4" name="item4" placeholder="Enter item" />
          
          <label htmlFor="item5">Item 5:</label>
          <input type="text" id="item5" name="item5" placeholder="Enter item" />
          
          <button type="button">Add Item</button>
          <button type="button">Remove Item</button>
          <br />
          <button type="submit">Create Tier List</button>
          <br />
          <br />
        </form>

        <h2>View Saved Rankings</h2>
        <form>
          <button type="button">View</button>
        </form>

        <br />
        <h2>Join an ongoing session</h2>
        <p>Enter the join code provided by your session creator:</p>
        <form>
          <label htmlFor="joinCode">Join Code:</label>
          <input type="text" id="joinCode" name="joinCode" placeholder="Enter 4-digit code" required />
          <button type="submit">Join Session</button>
        </form>
      </section>
    </main>
  );
}