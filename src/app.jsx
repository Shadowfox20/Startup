import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Profile } from './profile/profile';
import { Post } from './post/post';
import { Home } from './home/home';
import { View } from './view/view';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-body">
        <header>
          <h1>Game Shelf</h1>
          <nav>
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink className="nav-link" to="">
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="login">
                  Profile
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="post">
                  Post
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="view">
                  View
                </NavLink>
              </li>
            </ul>
          </nav>
        </header>
        <Routes>
          <Route path='/' element={<Home />} exact />
          <Route path='/login' element={<Login />} />
          <Route path='/post' element={<Post />} />
          <Route path='/view' element={<View />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
        <footer className="footer">
          <p>
            Game Shelf by Robert Thompson. Used for CS 260 at BYU.
            <br className="portrait-only" />
            <a href="https://github.com/Shadowfox20/Startup"> GitHub </a>
          </p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

function NotFound() {
  return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
}