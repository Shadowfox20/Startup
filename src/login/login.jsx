import './login.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    function handleLogin() {
        createAuth('PUT');
    }

    function handleRegister() {
        createAuth('POST');
    }

    async function createAuth(method) {
        try {
            const res = await fetch('/api/auth', {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();
            if (res.ok) {
                navigate('/profile');
            } else {
                alert(data.msg || 'Authentication failed');
            }
        } catch (err) {
            console.error('Auth error:', err);
            alert('Failed to connect to the server');
        }
    }

    return (
        <main className="container-fluid bg-secondary text-center">
            <p>*uploads/checks information with DB*</p>
            <section>
                <h2>Login to view profile:</h2>
                <div>
                    <label for="username">Username:</label>
                    <input type="text" id="username" name="usernameInput" placeholder="..." onChange={(e) => setUsername(e.target.value)}/>
                </div>
                <div>
                    <label for="pwd"> Password:</label>
                    <input type="password" id="pwd" name="passwordInput" placeholder="..." onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <button type="submit" disabled={!(username && password)} onClick={handleLogin}>Login</button>
                <button type="submit" disabled={!(username && password)} onClick={handleRegister}>Create Profile</button>
            </section>
        </main>
    );
}