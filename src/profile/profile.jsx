import React from 'react';
import './profile.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';

export function Profile() {

  const navigate = useNavigate();
  const { setSignedIn } = useAuth();
  const [userInfo, setUserInfo] = React.useState({ username: '', posts: [], steamID: '', avatar: '' });
  const [steamIDInput, setSteamIDInput] = React.useState('');

  React.useEffect(() => {
    (async () => {
      try {
        //verifies user has a token
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        //retrieves user info from backend
        const res = await fetch('http://localhost:4000/api/user/me', {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setUserInfo(data);
        } 
        
        //failure and error cases
        else {
          return (
            <p>user info not found</p>
          )
        }
      } catch (err) {
        console.error('Profile fetch error:', err);
      }
    })();
  }, []);

  async function handleLogout() {
    try {
      await fetch('http://localhost:4000/api/auth', { method: 'DELETE', credentials: 'include' });
    } catch (err) {
      console.error('Logout error:', err);
    }
    localStorage.removeItem('token');
    setSignedIn(false);
    navigate('/login');
  }

  function showSteamID(id) {
    // show input when no steamID, otherwise show the linked id with remove option
    if (!id) {
      return (
        <p>Add a Steam ID: 
          <input id="enterID" name="SteamIDInput" placeholder="..." value={steamIDInput} onChange={(e) => setSteamIDInput(e.target.value)} />
          <button type="button" onClick={addSteamID}>Link</button>
        </p>
      );
    }

    return (
      <p>Steam ID: {id}
        <button type="button" onClick={removeSteamID}>Remove</button>
      </p>
    );
  }

  async function addSteamID() {
    try {
      //send add request to backend
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:4000/api/user/me/steam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        body: JSON.stringify({ steamID: steamIDInput }),
      });
      if (res.ok) {
        //update local state, notify user
        setUserInfo((prev) => ({ ...prev, steamID: steamIDInput }));
        setSteamIDInput('');
        alert('Steam ID added successfully!');
      } 
      
      //failure and error cases
      else {
        console.error('Failed to add Steam ID');
        alert('Failed to add Steam ID');
      }
    } catch (err) {
      console.error('Add Steam ID error:', err);
    }
  }

  async function removeSteamID() {
    try {
      //send remove request to backend
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:4000/api/user/me/steam', {
        method: 'DELETE',
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      if (res.ok) {
        //update local state, notify user
        setUserInfo((prev) => ({ ...prev, steamID: '' }));
        alert('Steam ID removed successfully!');
      } 
      
      //failure and error cases
      else {
        console.error('Failed to remove Steam ID');
        alert('Failed to remove Steam ID');
      }
    } catch (err) {
      console.error('Remove Steam ID error:', err);
    }
  }

  function showUserPosts(posts) {
    if (!posts || posts.length === 0) {
      return <p>No posts yet.</p>
    }

    //format posts display based on number of posts, up to 2
    else if (posts.length === 1) {
      const post = posts[0];
      return (
        <div className="card text-bg-secondary mb-3">
          <div className="card-body">
            <h5 className="card-title">{post.title}</h5>
            <h6 className="card-subtitle">Score: <strong>{post.score}</strong> | Completion:
              <strong>{post.completion}</strong> in <strong>{post.hours}</strong> hours </h6>
            <h6 className="card-subtitle">Tags: <strong>{post.tags}</strong>
            </h6>
            <p>{post.review}</p>
          </div>
        </div>
      );
    }
    else {
      const post = posts[posts.length - 1];
      const post1 = posts[posts.length - 2];

      return (
        <div className="card-pair">
          <div className="card text-bg-secondary mb-3">
            <div className="card-body">
              <h5 className="card-title">{post.title}</h5>
              <h6 className="card-subtitle">Score: <strong>{post.score}</strong> | Completion:
                <strong>{post.completion}</strong> in <strong>{post.hours}</strong> hours </h6>
              <h6 className="card-subtitle">Tags: <strong>{post.tags}</strong>
              </h6>
              <p>{post.review}</p>
            </div>
          </div>
          <div className="card text-bg-secondary mb-3">
            <div className="card-body">
              <h5 className="card-title">{post1.title}</h5>
              <h6 className="card-subtitle">Score: <strong>{post1.score}</strong> | Completion:
                <strong>{post1.completion}</strong> in <strong>{post1.hours}</strong> hours </h6>
              <h6 className="card-subtitle">Tags: <strong>{post1.tags}</strong>
              </h6>
              <p>{post1.review}</p>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <main className="container-fluid bg-secondary text-center">
      <section>
        <h2>Your Profile</h2>
      </section>
      <section>
        <h2 style={{ fontSize: "40px" }}> <img src={userInfo.avatar} alt="Default Profile Picture" width="40" height="40" />
          {userInfo.username} </h2>
        <button type="submit" onClick={handleLogout}>Logout</button>
        <div id="steam-id-section">
          {showSteamID(userInfo.steamID)}
        </div>
      </section>
      <h3 style={{ marginLeft: "20px" }}> Recent Posts: </h3>
      <section>
        {showUserPosts(userInfo.posts)}
      </section>
    </main>
  );
}