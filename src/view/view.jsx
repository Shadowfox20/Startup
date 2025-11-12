import React from 'react';
import './view.css';

export function View() {
  const [posts, setPosts] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch('http://localhost:4000/api/posts');
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

  function PostCard({ post }) {
    //sets default avatar and formats steam page link
    const avatar = post.avatar && post.avatar.length ? post.avatar : '/pfp_default.jpg';
    const author = post.steamID ? (
      <a href={`https://steamcommunity.com/profiles/${post.steamID}`} target="_blank" rel="noopener noreferrer">{post.username}</a>
    ) : (
      <span>{post.username}</span>
    );

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