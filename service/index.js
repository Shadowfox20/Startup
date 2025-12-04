const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');
const DB = require('./database.js');
const { peerProxy } = require('./peerProxy.js');

app.use(express.static('public'));

app.use(express.json());
app.use(cookieParser());

//----------------Connect to Frontend--------------------//


app.use(
  cors({
    origin: process.env.NODE_ENV === 'production' ? 'https://startup.robertthompson.click' : 'http://localhost:5173',
    credentials: true,
  })
);

app.use((req, res, next) => {
  next();
});


//---------------------API functions---------------------//


//Create new user (include username & password in body)
app.post('/api/auth', async (req, res) => {
  //check if user already exists
  if (await DB.findUserByUsername(username)) {
    res.status(409).send({ msg: 'Existing user' });
  } 
  
  //create user
  else {
    const user = await DB.createUser(req.body.username, req.body.password);
    setAuthCookie(res, user);

    res.send({ username: user.username, token: user.token, steamID: user.steamID, avatar: user.avatar });
  }
});


//Sign in existing user (include username & password in body)
app.put('/api/auth', async (req, res) => {
  const user = await DB.findUserByUsername(username);
  // validate password
  if (user && (await bcrypt.compare(req.body.password, user.password))) {
    //set session cookie
    setAuthCookie(res, user);
    //return user info
    res.send({ username: user.username, token: user.token, steamID: user.steamID, avatar: user.avatar});
  } 
  // invalid credentials
  else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

//Logout user (clears cookie)
app.delete('/api/auth', async (req, res) => {
  //retrieve user by token
  const token = req.cookies['token'];
  const user = await DB.findUserByToken(token);

  //clear session cookie
  if (user) {
    clearAuthCookie(res, user);
  }

  res.send({});
});

//Retrieve user info (must attach token in Authorization header)
app.get('/api/user/me', async (req, res) => {
  //check token
  const authHeader = req.get('Authorization') || '';
  let token = null;
  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  } else {
    token = req.cookies && req.cookies['token'];
  }
  const user = await DB.findUserByToken(token);
  if (user) {
    res.send({ username: user.username, posts: user.posts, steamID: user.steamID, avatar: user.avatar });
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

// Add new post (must attach token in header & post content in body)
app.post('/api/user', async (req, res) => {
  const postContent = req.body.postContent;
  const authHeader = req.get('Authorization') || '';

  //checks header for token, if not found checks cookies
  let token = null;
  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  } else {
    token = req.cookies && req.cookies['token'];
  }
  if (!token) {
    return res.status(401).send({ msg: 'Unauthorized' });
  }

  //calls addPost function
  const ok = await DB.addPost(token, postContent);
  if (ok) {
    res.send({});
  } else {
    res.status(400).send({ msg: 'Failed to add post' });
  }
});

// Add Steam ID to user profile (must attach token in header & steamID in body)
app.post('/api/user/me/steam', async (req, res) => {
  const authHeader = req.get('Authorization') || '';

  //checks header for token, if not found checks cookies
  let token = null;
  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  } else {
    token = req.cookies && req.cookies['token'];
  }
  if (!token) {
    return res.status(401).send({ msg: 'Unauthorized' });
  }

  //calls addSteamID function
  const steamID = req.body.steamID;
  const ok = await DB.addSteamID(token, steamID);

  if (ok) {
    res.send({});
  } else {
    res.status(400).send({ msg: 'Failed to add Steam ID' });
  }
});

// Remove Steam ID from user profile (must attach token in header)
app.delete('/api/user/me/steam', async (req, res) => {
  const authHeader = req.get('Authorization') || '';

  //checks header for token, if not found checks cookies
  let token = null;
  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  } else {
    token = req.cookies && req.cookies['token'];
  }
  if (!token) {
    return res.status(401).send({ msg: 'Unauthorized' });
  }

  //calls removeSteamID function
  const ok = await DB.removeSteamID(token);
  if (ok) {
    res.send({});
  } else {
    res.status(400).send({ msg: 'Failed to remove Steam ID' });
  }
});

//Retrieve all posts (no auth required)
app.get('/api/posts', async (req, res) => {
  try {
    // Return the most recent 50 posts
    const allPosts = await DB.viewPosts();
    res.send({ posts: allPosts });
  } catch (err) {
    console.error('GET /api/posts error', err);
    res.status(500).send({ msg: 'Server error' });
  }
});

//sets routing for frontend
app.use((_req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});


//--------------------Helper Functions--------------------//


function setAuthCookie(res, user) {
  user.token = uuid.v4();
  DB.updateUserToken(user.username, user.token);

  res.cookie('token', user.token, {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
  });
}

function clearAuthCookie(res, user) {
  delete user.token;
  res.clearCookie('token');
}

const port = 4000;
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
