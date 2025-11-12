import React from 'react';
import './post.css';
import { useNavigate } from 'react-router-dom';

export function Post() {
  const navigate = useNavigate();
  const [title, setTitle] = React.useState('');
  const [score, setScore] = React.useState('');
  const [tags, setTags] = React.useState('');
  const [hours, setHours] = React.useState('');
  const [review, setReview] = React.useState('');
  const [completion, setCompletion] = React.useState('');

  function handleSubmit() {
    let postContent = {
      title: title,
      score: score,
      tags: tags,
      hours: hours,
      review: review,
      completion: completion,
    };

    addPost(postContent);
  }

  async function addPost(postContent) {
    try {
      //verify login
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to post a review');
        navigate('/login');
        return;
      }
      
      //send post to backend
      const res = await fetch('http://localhost:4000/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ postContent }),
      });

      if (res.ok) {
        navigate('/profile');
      } 
      
      //failure and error cases
      else {
        const data = await res.json();
        alert(data.msg || 'Failed to post review');
      }
    } catch (err) {
      console.error('Auth error:', err);
      alert('Failed to connect to the server');
    }
  }

  return (
    <main className="container-fluid bg-secondary text-center">
      <section>
        <h2>Post a Review</h2>
      </section>

      <section>
        <br />
        <label htmlFor="title">Title of Game:</label>
        <input type="text" id="title" name="titleInput" placeholder="Game Title" onChange={(e) => setTitle(e.target.value)} />
        <label htmlFor="score"> Your Score:</label>
        <input type="number" id="score" name="scoreInput" min="1" max="10" onChange={(e) => setScore(e.target.value)} />
        <br /> <br />
        <label htmlFor="tags">Tags:</label>
        <input type="search" id="tags" name="tagsInput" placeholder="Add tags here..." onChange={(e) => setTags(e.target.value)} />
        <label htmlFor="hours"> Hours Played:</label>
        <input type="number" id="hours" name="hoursInput" min="1" max="99999" onChange={(e) => setHours(e.target.value)} />
        <br /> <br />
        <textarea id="description" name="descriptionInput" rows="6" cols="54"
          placeholder="Write your review here..." onChange={(e) => setReview(e.target.value)}></textarea>
        <br /> <br />
        <label htmlFor="completion"> completion level: </label>
        <select id="completion" name="completionInput" onChange={(e) => setCompletion(e.target.value)}>
          <option value="n/a">Not Applicable</option>
          <option value="First Impressions">First Impressions</option>
          <option value="In Progress">In Progress</option>
          <option value="Finished">Finished</option>
          <option value="100%">100% Completion</option>
          <option value="Multiple Playthroughs">Multiple Playthroughs</option>
        </select>
      </section>

      <section>
        <button type="submit" onClick={() => handleSubmit()}>Submit Review</button>
      </section>
    </main>
  );
}