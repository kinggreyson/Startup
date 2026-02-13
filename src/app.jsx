import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

export default function App() {
  return (
    <div className="body bg-dark text-light">
      <header>
        <h1>Ranking with Friends</h1>
        <nav>
          <a href="index.html">Home</a>
          <a href="create.html">Create</a>
          <a href="voting.html">Vote</a>
          <a href="results.html">Results</a>
          <a href="about.html">About</a>
        </nav>
      </header>

      <main>App components go here</main>

      <footer>
        <p>Greyson King</p>
        <a href="https://github.com/kinggreyson/Startup">GitHub</a>
      </footer>
    </div>
  );
}