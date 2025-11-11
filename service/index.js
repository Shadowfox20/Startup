const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');
const cors = require('cors');

app.use(express.static('public'));

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

const users = [{
  username: 'The_Robert_Thompson',
  password: '$2b$10$VZNhODuw.Pq5bkLq5alkteYllNjVD6qjSjJ2MHQ8T/vfYBq9LIURK',
  posts: [{
    title: 'Clair Obscur: Expedition',
    score: '10',
    hours: '70',
    completion: 'Multiple Playthroughs',
    tags: 'Role-Playing Game, Turn-based, Linear, Strategy',
    review: "The game is incredible, easily my Game of the Year. I enjoy turn-based combat, and have played a variety of classic RPGs, and it is clear that the developers did as well. The combat flows so smoothly, and their big change-up in adding a parry mechanic makes it constantly engaging and rewarding. I also love that this mechanic doesn't detract from the strategic elements. For most of the game, every move requires at least some thought. One thing I cannot talk enough about is the story! It's one of those stories that leaves me thinking about it for months after. I played through as much as I could my first time, and I still couldn't get enough, so I played through it a second time just to play the story again. If you're not sure if you want to play it, just try the first hour of the game, and I promise you'll be hooked!",
  }],
  steamID: '76561199810391324',
  avatar: 'pfp_default.jpg'
}];

app.use((req, res, next) => {
  console.log(req.method);
  console.log(req.originalUrl);
  console.log(req.body);
  console.log(users);
  next();
});

app.post('/api/auth', async (req, res) => {
  if (await getUser('username', req.body.username)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await createUser(req.body.username, req.body.password);
    setAuthCookie(res, user);

    res.send({ username: user.username, token: user.token, steamID: user.steamID, avatar: user.avatar });
  }
});

app.put('/api/auth', async (req, res) => {
  const user = await getUser('username', req.body.username);
  if (user && (await bcrypt.compare(req.body.password, user.password))) {
    setAuthCookie(res, user);
    res.send({ username: user.username, token: user.token, steamID: user.steamID, avatar: user.avatar});
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

app.delete('/api/auth', async (req, res) => {
  const token = req.cookies['token'];
  const user = await getUser('token', token);
  if (user) {
    clearAuthCookie(res, user);
  }

  res.send({});
});

app.get('/api/user/me', async (req, res) => {
  const authHeader = req.get('Authorization') || '';
  let token = null;
  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  } else {
    token = req.cookies && req.cookies['token'];
  }
  const user = await getUser('token', token);
  if (user) {
    res.send({ username: user.username, posts: user.posts, steamID: user.steamID, avatar: user.avatar });
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

app.post('/api/user', async (req, res) => {
  console.log('Received post request with body:', req.body);
  const postContent = req.body.postContent;
  const authHeader = req.get('Authorization') || '';

  let token = null;
  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  } else {
    token = req.cookies && req.cookies['token'];
  }

  if (!token) {
    const token = req.body.token;
    if (!token) {
      return res.status(401).send({ msg: 'Unauthorized' });
    }
  }

  const ok = await addPost(token, postContent);
  if (ok) {
    res.send({});
  } else {
    res.status(400).send({ msg: 'Failed to add post' });
  }
});

app.post('/api/user/steam', async (req, res) => {
  const steamID = req.body.steamID;
  const authHeader = req.get('Authorization') || '';

  let token = null;
  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  } else {
    token = req.cookies && req.cookies['token'];
  }

  if (!token) {
    const token = req.body.token;
    if (!token) {
      return res.status(401).send({ msg: 'Unauthorized' });
    }
  }

  const ok = await addSteamID(token, steamID);
  if (ok) {
    res.send({});
  } else {
    res.status(400).send({ msg: 'Failed to add Steam ID' });
  }
});

app.get('/api/posts', (req, res) => {
  try {
    const allPosts = users.flatMap((user) => {
      if (!user.posts) return [];
      return user.posts.map((p) => ({ ...p, username: user.username, steamID: user.steamID, avatar: user.avatar }));
    });
    res.send({ posts: allPosts });
  } catch (err) {
    console.error('GET /api/posts error', err);
    res.status(500).send({ msg: 'Server error' });
  }
});

app.get('/api/user', async (req, res) => {
  const posts = await compilePosts();
  res.send({ posts: posts });
});


async function createUser(username, password) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    username: username,
    password: passwordHash,
    posts: [],
    steamID: '',
    avatar: 'pfp_default.jpg'
  };

  users.push(user);

  return user;
}

async function addPost(token, postContent) {
  try {
    const user = await getUser('token', token);
    if (!user) {
      console.warn('addPost: no user for token', token);
      return false;
    }

    if (!user.posts) user.posts = [];
    user.posts.push(postContent);
    console.log('Post added:', postContent);
    console.log('User posts:', user.posts);
    return true;
  } catch (err) {
    console.error('Add post error:', err);
    return false;
  }
};

async function addSteamID(token, steamID) {
  try {
    const user = await getUser('token', token);
    if (!user) {
      console.warn('addSteamID: user token not authenticated', token);
      return false;
    }

    try {
      const steamDataRes = await fetch(`https://playerdb.co/api/player/steam/${steamID}`);

      if (steamDataRes.ok) {
        const steamData = await steamDataRes.json();
        if (steamData && steamData.success === false) {
          res.status(400).send({ msg: 'Invalid Steam ID' });
          return false;
        }
        else if (steamData && steamData.data && steamData.data.player && steamData.data.player.avatar) {
          user.avatar = steamData.data.player.avatar;
        }
        if (steamData && steamData.success === true) {
          return true;
        } else {
          console.error('Problem fetching from playerdb:', steamData);
        }
      } else {
        console.error('Problem connecting to playerdb');
      }

      user.steamID = steamID;

      console.log('Steam ID added:', steamID);
      return true;
    } catch (err) {
      console.error('Fetch Steam data error:', err);
      return false;
    }
  } catch (err) {
    console.error('Add Steam ID error:', err);
    return false;
  }
};

async function compilePosts() {
  let posts = [];
  for (const user of users) {
    if (user.posts && user.posts.length > 0) {
      for (const post of user.posts) {
        posts.push({ username: user.username, steamID: user.steamID, avatar: user.avatar, ...post });
      }
    }
  }

  console.log('Compiled posts:', posts);
  return posts;
}

function getUser(field, value) {
  if (value) {
    return users.find((user) => user[field] === value);
  }
  return null;
}

function setAuthCookie(res, user) {
  user.token = uuid.v4();

  res.cookie('token', user.token, {
    secure: true,
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
