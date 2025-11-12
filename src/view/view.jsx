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
          setPosts(data.posts || []);
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

  function showAllPosts(posts) {
    var postQty = posts.length;
    if (!posts || postQty === 0) {
      return <p>No posts yet.</p>
    }

    //helper to link Steam profile if available
    function linkSteam(post) {
      if (post.steamID === '') {
        return `${post.username}`;
      } else {
        return `<a href="https://steamcommunity.com/profiles/${post.steamID}">${post.username}</a>`;
      }
    }

    //loops through posts, converting to HTML
    var postElements = ``;
    while (postQty > 0) {
      if (postQty === 1) {
        const post = posts[0];
        postElements += 
          `<div class="card text-bg-secondary mb-3">
            <div class="card-body">
              <h5 class="card-title"><img src=${post.avatar} alt="Profile Picture" width="20" height="20" />
                ${linkSteam(post)} | ${post.title}</h5>
              <h6 class="card-subtitle">Score: <strong>${post.score}</strong> | Completion:
                <strong>${post.completion}</strong> in <strong>${post.hours}</strong> hours </h6>
              <h6 class="card-subtitle">Tags: <strong>${post.tags}</strong>
              </h6>
              <p>${post.review}</p>
            </div>
          </div>`;
        postQty -= 1;
      }

      //if it can, make pairs of posts which can be displayed side-by-side based on window size via css flexbox
      else {
        const post = posts[postQty - 1];
        const post1 = posts[postQty - 2];

        postElements += 
          `<div class="card-pair">
            <div class="card text-bg-secondary mb-3">
              <div class="card-body">
                <h5 class="card-title"><img src=${post.avatar} alt="Profile Picture" width="20" height="20" />
                  ${linkSteam(post)} | ${post.title}</h5>
                <h6 class="card-subtitle">Score: <strong>${post.score}</strong> | Completion:
                  <strong>${post.completion}</strong> in <strong>${post.hours}</strong> hours </h6>
                <h6 class="card-subtitle">Tags: <strong>${post.tags}</strong>
                </h6>
                <p>${post.review}</p>
              </div>
            </div>
            <div class="card text-bg-secondary mb-3">
              <div class="card-body">
                <h5 class="card-title"><img src=${post.avatar} alt="Profile Picture" width="20" height="20" />
                  ${linkSteam(post1)} | ${post1.title}</h5>
                <h6 class="card-subtitle">Score: <strong>${post1.score}</strong> | Completion:
                  <strong>${post1.completion}</strong> in <strong>${post1.hours}</strong> hours </h6>
                <h6 class="card-subtitle">Tags: <strong>${post1.tags}</strong>
                </h6>
                <p>${post1.review}</p>
              </div>
            </div>
          </div>`;
        postQty -= 2;
      }
    }
    document.getElementById('all-posts').innerHTML = postElements;
  }

  return (
    <main className="container-fluid bg-secondary text-center">
      <section>
        <div id="all-posts" />
        {showAllPosts(posts)}
      </section>
    </main>
  );
}