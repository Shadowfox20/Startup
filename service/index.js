const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');

app.use(express.static('public'));

app.use(express.json());
app.use(cookieParser());


//----------------Connect to Database--------------------//


const client = new MongoClient(url);
const db = client.db('Game-Shelf');
const userCollection = db.collection('users');
const postCollection = db.collection('posts');


//----------------Connect to Frontend--------------------//


app.use(
  cors({
    origin: 'http://localhost:5173',
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
  if (await userCollection.findOne({ username: req.body.username })) {
    res.status(409).send({ msg: 'Existing user' });
  } 
  
  //create user
  else {
    const user = await createUser(req.body.username, req.body.password);
    setAuthCookie(res, user);

    res.send({ username: user.username, token: user.token, steamID: user.steamID, avatar: user.avatar });
  }
});


//Sign in existing user (include username & password in body)
app.put('/api/auth', async (req, res) => {
  const user = await userCollection.findOne({ username: req.body.username });
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
  const user = await userCollection.findOne({ token: token });

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
  const user = await userCollection.findOne({ token: token });
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
  const ok = await addPost(token, postContent);
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
  const ok = await addSteamID(token, steamID);

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
  const ok = await removeSteamID(token);
  if (ok) {
    res.send({});
  } else {
    res.status(400).send({ msg: 'Failed to remove Steam ID' });
  }
});

//Retrieve all posts (no auth required)
app.get('/api/posts', (req, res) => {
  try {
    //calls compilePosts function
    const allPosts = postCollection.find({}, { sort: { _id: -1 }, limit: 50 }).toArray();
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


async function createUser(username, password) {
  //encrypts password
  const passwordHash = await bcrypt.hash(password, 10);

  //creates user object
  const user = {
    username: username,
    password: passwordHash,
    posts: [],
    steamID: '',
    avatar: 'pfp_default.jpg'
  };

  //adds user to database
  userCollection.insertOne(user);

  return user;
}

//postContent structure:
// {
//   title: string,
//   score: string,
//   tags: string,
//   hours: string,
//   review: string,
//   completion: string
// }
async function addPost(token, postContent) {
  try {
    //retrieve user by token
    const user = await userCollection.findOne({ token: token });
    if (!user) {
      console.warn('addPost: no user for token', token);
      return false;
    }

    //add post to user's posts locally
    if (!user.posts) user.posts = [];
    user.posts.push(postContent);
    
    //update database
    await userCollection.updateOne({ username: user.username }, { $set: { posts: user.posts } });
    await postCollection.insertOne({ username: user.username, steamID: user.steamID, avatar: user.avatar, ...postContent });

    return true;
  } catch (err) {
    console.error('Add post error:', err);
    return false;
  }
};

// SteamID should be a string
async function addSteamID(token, steamID) {
  try {
    // retrieve user by token
    const user = await userCollection.findOne({ token: token });
    if (!user) {
      console.warn('addSteamID: user token not authenticated', token);
      return false;
    }

    try {
      //fetches Steam data from playerdb.co API
      const steamDataRes = await fetch(`https://playerdb.co/api/player/steam/${steamID}`);

      if (steamDataRes.ok) {
        const steamData = await steamDataRes.json();

        //validates Steam ID
        if (steamData.success === false) {
          console.error('Invalid Steam ID');
          return false;
        }

        //update user profile in database
        else {
          //updates user profile with Steam data
          if (steamData.data.player.avatar) {
            user.avatar = steamData.data.player.avatar;
          }

          //adds Steam ID
          user.steamID = steamID;
          return true;
        }
      } 
      
      //failure and error cases
      else {
        console.error('Problem connecting to playerdb');
        return false;
      }
    } catch (err) {
      console.error('Fetch Steam data error:', err);
      return false;
    }
  } catch (err) {
    console.error('Add Steam ID error:', err);
    return false;
  }
};

async function removeSteamID(token) {
  try {
    // retrieve user by token
    const user = await userCollection.findOne({ token: token });
    if (!user) {
      console.warn('addSteamID: user token not authenticated', token);
      return false;
    }
    try {
      //removes Steam ID and resets avatar to default in database
      user.steamID = '';
      user.avatar = 'pfp_default.jpg';
      return true;
    } catch (err) {
      console.error('Remove Steam ID error:', err);
      return false;
    }
  } catch (err) {
    console.error('Fetch user error:', err);
    return false;
  }
};

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
