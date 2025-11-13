import './login.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';

export function Login() {
  const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://startup.robertthompson.click' 
  : 'http://localhost:4000';
  const navigate = useNavigate();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { setSignedIn } = useAuth();

  function handleLogin() {
    createAuth('PUT');
  }

  function handleRegister() {
    createAuth('POST');
  }

  async function createAuth(method) {
    try {
      //send data to backend
      const res = await fetch(`${API_BASE}/api/auth`, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      //updates local token & auth state
      if (res.ok) {
        if (data && data.token) {
          localStorage.setItem('token', data.token);
        }
        setSignedIn(true);
        navigate('/profile');
      } 
      
      //failure & error cases
      else {
        alert(data.msg || 'Authentication failed');
      }
    } catch (err) {
      console.error('Auth error:', err);
      alert('Failed to connect to the server');
    }
  }

  return (
    <main className="container-fluid bg-secondary text-center">
      <section>
        <h2>Login to view profile:</h2>
        <div>
          <label>Username:</label>
          <input type="text" id="username" name="usernameInput" placeholder="..." onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label> Password:</label>
          <input type="password" id="pwd" name="passwordInput" placeholder="..." onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" disabled={!(username && password)} onClick={handleLogin}>Login</button>
        <button type="submit" disabled={!(username && password)} onClick={handleRegister}>Create Profile</button>
      </section>
    </main>
  );
}