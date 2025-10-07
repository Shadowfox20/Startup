import './login.css';
import React from 'react';

export function Login() {
    return (
        <main className="container-fluid bg-secondary text-center">
            <p>*uploads/checks information with DB*</p>
            <section>
                <h2>Login to view profile:</h2>
                <p>Note: until it is working, click "Login" to view example profile page</p>
                <label for="username">Username:</label>
                <input type="text" id="username" name="usernameInput" placeholder="..." />
                <br />
                <label for="pwd"> Password:</label>
                <input type="password" id="pwd" name="passwordInput" placeholder="..." />
                <br />
                <button type="submit" onclick="document.location='profile'">Login</button>
                <button type="submit">Forgot Password</button>
            </section>
            <hr />
            <section>
                <h2>Create a new profile:</h2>
                <label for="newUsername">Username:</label>
                <input type="text" id="newUsername" name="newUsernameInput" placeholder="..." />
                <br />
                <label for="newPwd"> Password:</label>
                <input type="password" id="newPwd" name="newPasswordInput" placeholder="..." />
                <br />
                <label for="email"> Email:</label>
                <input type="email" id="email" name="emailInput" placeholder="address@example.com" />
                <br />
                <button type="submit">Create Profile</button>
            </section>
        </main>
    );
}