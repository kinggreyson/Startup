import React from 'react';

export function Home() {
  return (
    <main>
      <h2>Login to Create</h2>
      <form>
        <label htmlFor="Username"></label>
        <input type="text" id="Username" name="Username" placeholder="Enter Username" required />
        <label htmlFor="Password"></label>
        <input type="text" id="Password" name="Password" placeholder="Enter Password" required />
        <button type="submit">submit</button>
      </form>
    </main>
  );
}