import React from 'react';
import './view.css';

export function View() {
  const [posts, setPosts] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/posts');
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
    var postElements = ``;
    while (postQty > 0) {
      if (postQty === 1) {
        const post = posts[0];
        postElements += 
          `<div class="card text-bg-secondary mb-3">
            <div class="card-body">
              <h5 class="card-title"><img src="pfp_default.jpg" alt="Default Profile Picture" width="20" height="20" />
                ${post.username} | ${post.title}</h5>
              <h6 class="card-subtitle">Score: <strong>${post.score}</strong> | Completion:
                <strong>${post.completion}</strong> in <strong>${post.hours}</strong> hours </h6>
              <h6 class="card-subtitle">Tags: <strong>${post.tags}</strong>
              </h6>
              <p>${post.review}</p>
            </div>
          </div>`;
        postQty -= 1;
      }
      else {
        const post = posts[postQty - 1];
        const post1 = posts[postQty - 2];

        postElements += 
          `<div class="card-pair">
            <div class="card text-bg-secondary mb-3">
              <div class="card-body">
                <h5 class="card-title"><img src="pfp_default.jpg" alt="Default Profile Picture" width="20" height="20" />
                  ${post.username} | ${post.title}</h5>
                <h6 class="card-subtitle">Score: <strong>${post.score}</strong> | Completion:
                  <strong>${post.completion}</strong> in <strong>${post.hours}</strong> hours </h6>
                <h6 class="card-subtitle">Tags: <strong>${post.tags}</strong>
                </h6>
                <p>${post.review}</p>
              </div>
            </div>
            <div class="card text-bg-secondary mb-3">
              <div class="card-body">
                <h5 class="card-title"><img src="pfp_default.jpg" alt="Default Profile Picture" width="20" height="20" />
                  ${post1.username} | ${post1.title}</h5>
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
        {/* <div class="card-pair">
          <div class="card text-bg-secondary mb-3">
            <div class="card-body">
              <h5 class="card-title"><img src="pfp_default.jpg" alt="Default Profile Picture" width="20" height="20" />
                Username | Clair Obscur: Expedition 33</h5>
              <h6 class="card-subtitle">Score: <strong>10</strong> | Completion: <strong>Multiple
                  Playthroughs</strong> in <strong>70</strong> hours </h6>
              <h6 class="card-subtitle">Tags: <strong>Role-Playing Game, Turn-based, Linear, Strategy</strong>
              </h6>
              <p>Review: The game is incredible. I enjoy turn-based combat, and have played a variety of classic
                RPGs, and it is clear that the developers did as well. The combat flows so smoothly, and their
                big change-up in adding a parry mechanic makes it constantly engaging and rewarding. I also love
                that this mechanic doesn't detract from the strategic elements. For most of the game, every move
                requires at least some thought. One thing I cannot talk enough about is the story! It's one of
                those stories that leaves me thinking about it for months after. I played through as much as I
                could my first time, and I still couldn't get enough, so I played through it a second time just
                to play the story again. If you're not sure if you want to play it, just try the first hour of
                the game, and I promise you'll be hooked!
              </p>
            </div>
          </div>
          <div class="card text-bg-secondary mb-3">
            <div class="card-body">
              <h5 class="card-title"><img src="pfp_default.jpg" alt="Default Profile Picture" width="20" height="20" />
                Username | Clair Obscur: Expedition 33</h5>
              <h6 class="card-subtitle">Score: <strong>10</strong> | Completion: <strong>Multiple
                  Playthroughs</strong> in <strong>70</strong> hours </h6>
              <h6 class="card-subtitle">Tags: <strong>Role-Playing Game, Turn-based, Linear, Strategy</strong>
              </h6>
              <p>Review: The game is incredible. I enjoy turn-based combat, and have played a variety of classic
                RPGs, and it is clear that the developers did as well. The combat flows so smoothly, and their
                big change-up in adding a parry mechanic makes it constantly engaging and rewarding. I also love
                that this mechanic doesn't detract from the strategic elements. For most of the game, every move
                requires at least some thought. One thing I cannot talk enough about is the story! It's one of
                those stories that leaves me thinking about it for months after. I played through as much as I
                could my first time, and I still couldn't get enough, so I played through it a second time just
                to play the story again. If you're not sure if you want to play it, just try the first hour of
                the game, and I promise you'll be hooked!
              </p>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div class="card-pair">
          <div class="card text-bg-secondary mb-3">
            <div class="card-body">
              <h5 class="card-title"><img src="pfp_default.jpg" alt="Default Profile Picture" width="20" height="20" />
                Username | Clair Obscur: Expedition 33</h5>
              <h6 class="card-subtitle">Score: <strong>10</strong> | Completion: <strong>Multiple
                  Playthroughs</strong> in <strong>70</strong> hours </h6>
              <h6 class="card-subtitle">Tags: <strong>Role-Playing Game, Turn-based, Linear, Strategy</strong>
              </h6>
              <p>Review: The game is incredible. I enjoy turn-based combat, and have played a variety of classic
                RPGs, and it is clear that the developers did as well. The combat flows so smoothly, and their
                big change-up in adding a parry mechanic makes it constantly engaging and rewarding. I also love
                that this mechanic doesn't detract from the strategic elements. For most of the game, every move
                requires at least some thought. One thing I cannot talk enough about is the story! It's one of
                those stories that leaves me thinking about it for months after. I played through as much as I
                could my first time, and I still couldn't get enough, so I played through it a second time just
                to play the story again. If you're not sure if you want to play it, just try the first hour of
                the game, and I promise you'll be hooked!
              </p>
            </div>
          </div>
          <div class="card text-bg-secondary mb-3">
            <div class="card-body">
              <h5 class="card-title"><img src="pfp_default.jpg" alt="Default Profile Picture" width="20" height="20" />
                Username | Clair Obscur: Expedition 33</h5>
              <h6 class="card-subtitle">Score: <strong>10</strong> | Completion: <strong>Multiple
                  Playthroughs</strong> in <strong>70</strong> hours </h6>
              <h6 class="card-subtitle">Tags: <strong>Role-Playing Game, Turn-based, Linear, Strategy</strong>
              </h6>
              <p>Review: The game is incredible. I enjoy turn-based combat, and have played a variety of classic
                RPGs, and it is clear that the developers did as well. The combat flows so smoothly, and their
                big change-up in adding a parry mechanic makes it constantly engaging and rewarding. I also love
                that this mechanic doesn't detract from the strategic elements. For most of the game, every move
                requires at least some thought. One thing I cannot talk enough about is the story! It's one of
                those stories that leaves me thinking about it for months after. I played through as much as I
                could my first time, and I still couldn't get enough, so I played through it a second time just
                to play the story again. If you're not sure if you want to play it, just try the first hour of
                the game, and I promise you'll be hooked!
              </p>
            </div>
          </div>
        </div> */}
      </section>
    </main>
  );
}