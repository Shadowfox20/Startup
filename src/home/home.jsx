import './home.css';
import React from 'react';

export function Home() {
    return (
        <main className="container-fluid bg-secondary text-center">
            <p>
                Welcome to Game Shelf! A place to post and view reviews of your favorite games.
                Please login or create a profile to get started.
            </p>
            <p>
                This website was developed by Robert Thompson for CS 260 at BYU.
                Contact me for questions, comments or suggestions!
                Also, let me know what games you would like to be able to review.
            </p>
        </main>
    );
}