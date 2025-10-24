const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');
const cors = require('cors');

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
    review: "The game is incredible, easily my Game of the Year. I enjoy turn-based combat, and have played a variety of classic RPGs, and it is clear that the developers did as well. The combat flows so smoothly, and their big change-up in adding a parry mechanic makes it constantly engaging and rewarding. I also love that this mechanic doesn't detract from the strategic elements. For most of the game, every move requires at least some thought. One thing I cannot talk enough about is the story! It's one of those stories that leaves me thinking about it for months after. I played through as much as I could my first time, and I still couldn't get enough, so I played through it a second time just to play the story again. If you're not sure if you want to play it, just try the first hour of the game, and I promise you'll be hooked!"
  }]
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

    res.send({ username: user.username, token: user.token });
  }
});

app.put('/api/auth', async (req, res) => {
  const user = await getUser('username', req.body.username);
  if (user && (await bcrypt.compare(req.body.password, user.password))) {
    setAuthCookie(res, user);
    res.send({ username: user.username, token: user.token });
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
    res.send({ username: user.username, posts: user.posts });
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


async function createUser(username, password) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    username: username,
    password: passwordHash,
    posts: [],
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

const port = 3000;
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
