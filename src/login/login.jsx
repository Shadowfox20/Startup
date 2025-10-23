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
        const res = await fetch('api/auth', {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        await res.json();
        if (res.ok) {
            navigate('/profile');
        } else {
            alert('Authentication failed');
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