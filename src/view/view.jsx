import React from 'react';
import './view.css';
import { userLikeHandler, LikeHandler } from './LikeHandler.js';

export function View() {
  const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://startup.robertthompson.click' 
  : 'http://localhost:4000';
  const [posts, setPosts] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          userLikeHandler.initToken(token);
        }

        const res = await fetch(`${API_BASE}/api/posts`);
        if (res.ok) {
          const data = await res.json();
          console.debug('GET /api/posts response:', data);
          // Accept either an array response or an object { posts: [...] }
          const postsData = Array.isArray(data) ? data : (Array.isArray(data.posts) ? data.posts : []);
          if (!Array.isArray(postsData)) {
            console.warn('Unexpected posts shape from /api/posts', data);
          }
          setPosts(postsData);
        } else {
          console.warn('posts not found', res.status);
          setPosts([]);
        }
      } catch (err) {
        console.error('Review fetch error:', err);
        setPosts([]);
      }
    })();
  }, []);

  function heartIcon(liked) {
    if (liked) {
      return (
        <svg className="heart-svg" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      )
    } else {
      return (
        <svg className="empty-heart-svg" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      )
    }
  };

  function PostCard({ post }) {
    const id = String(post._id);
    const [liked, setLiked] = React.useState(() => userLikeHandler.isLiked(id));
    const [likes, setLikes] = React.useState(() => Number(userLikeHandler.likeCount(id) || post.likes || 0));
    //sets default avatar and formats steam page link
    const avatar = post.avatar && post.avatar.length ? post.avatar : '/pfp_default.jpg';
    const author = post.steamID ? (
      <a href={`https://steamcommunity.com/profiles/${post.steamID}`} target="_blank" rel="noopener noreferrer">{post.username}</a>
    ) : (
      <span>{post.username}</span>
    );
    userLikeHandler.setLikeCount(id, post.likes);

    //structure of each post card
    return (
      <div className="card text-bg-secondary mb-3">
        <div className="card-body">
          <h5 className="card-title">
            <img src={avatar} alt="Profile" width="20" height="20" /> {author} | {post.title}
          </h5>
          <h6 className="card-subtitle">Score: <strong>{post.score}</strong> | Completion: <strong>{post.completion}</strong> in <strong>{post.hours}</strong> hours</h6>
          <h6 className="card-subtitle">Tags: <strong>{post.tags}</strong></h6>
          <p>{post.review}</p>
          <button className="btn btn-sm btn-outline-light" onClick={() => userLikeHandler.changeLike(id)}>
            {heartIcon(liked)} {likes}
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="container-fluid bg-secondary text-center">
      <section>
        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          <div id="all-posts">
            {posts.map((post, idx) => (
              <PostCard key={post.id || idx} post={post} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}