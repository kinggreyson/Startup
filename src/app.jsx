import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Home } from './home/home';
import { Create } from './create/create';
import { Voting } from './voting/voting';
import { Results } from './results/results';
import { About } from './about/about';

export default function App() {
  return (
    <BrowserRouter>
        <div className="body bg-dark text-light">
        <header>
            <h1>Ranking with Friends</h1>
                <nav>
                <NavLink to="">Home</NavLink>
                <NavLink to="create">Create</NavLink>
                <NavLink to="voting">Vote</NavLink>
                <NavLink to="results">Results</NavLink>
                <NavLink to="about">About</NavLink>
                </nav>
        </header>

        <Routes>
            <Route path='/' element={<Home />} exact />
            <Route path='/create' element={<Create />} />
            <Route path='/voting' element={<Voting />} />
            <Route path='/results' element={<Results />} />
            <Route path='/about' element={<About />} />
            <Route path='*' element={<NotFound />} />
        </Routes>

        <footer>
            <p>Greyson King</p>
            <a href="https://github.com/kinggreyson/Startup">GitHub</a>
        </footer>
        </div>
    </BrowserRouter>
  );
}

function NotFound() {
  return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
}