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

    res.send({ username: user.username });
  }
});

app.put('/api/auth', async (req, res) => {
  const user = await getUser('username', req.body.username);
  if (user && (await bcrypt.compare(req.body.password, user.password))) {
    setAuthCookie(res, user);

    res.send({ username: user.username });
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

app.post('/api/user/me/posts', async (req, res) => {
  const postContent = req.body.postContent;
  await addPost(postContent);

  res.send({});
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
  const token = req.cookies['token'];
  const user = await getUser('token', token);
  if (user) {
    res.send({ username: user.username });
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

const users = [];

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

async function addPost(postContent) {
  try {
    const token = req.cookies['token'];
    const user = await getUser('token', token);

    user.posts.push(postContent);
  } 
  
  catch (err) {
    console.error('Add post error:', err);
  }

  return null;
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
