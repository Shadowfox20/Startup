import React from 'react';
import './post.css';

export function Post() {
    return (
        <main className="container-fluid bg-secondary text-center">
            <section>
                <h2>Post a Review</h2>
            </section>

            <section>
                <br />
                <label for="title">Title of Game:</label>
                <input type="text" id="title" name="titleInput" placeholder="Game Title" />
                <label for="score"> Your Score:</label>
                <input type="number" id="score" name="scoreInput" min="1" max="10" />
                <br /> <br />
                <label for="tags">Tags:</label>
                <input type="search" id="tags" name="tagsInput" placeholder="Add tags here..." />
                <label for="hours"> Hours Played:</label>
                <input type="number" id="hours" name="hoursInput" min="1" max="99999" />
                <br /> <br />
                <textarea id="description" name="descriptionInput" rows="6" cols="54"
                    placeholder="Write your review here..."></textarea>
                <br /> <br />
                <label for="completion"> completion level: </label>
                <select id="completion" name="completionInput">
                    <option value="starting">First Impressions</option>
                    <option value="inProgress">In Progress</option>
                    <option value="finished">Finished</option>
                    <option value="completed">100% Completion</option>
                    <option value="multiple">Multiple Playthroughs</option>
                    <option selected value="noCampaign">Not Applicable</option>
                </select>
                <br />
                <label for="steamAPI"> Link Steam account for achievements:</label>
                <input type="checkbox" id="steamAPI" name="steamAPIConnect" /> *placeholder for Steam API*
            </section>

            <section>
                <button type="submit">Submit Review</button>
            </section>
        </main>
    );
}