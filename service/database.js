const bcrypt = require('bcryptjs');

//----------------Connect to Database--------------------//


const { MongoClient, ObjectId } = require('mongodb');
const config = require('./dbConfig.json');
const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;

// Connect to the database clusters
const client = new MongoClient(url);
const db = client.db('Game-Shelf');
const userCollection = db.collection('users');
const postCollection = db.collection('posts');


//------------------Exported functions------------------//


async function createUser(username, password) {
  //encrypts password
  const passwordHash = await bcrypt.hash(password, 10);

  //creates user object
  const user = {
    username: username,
    password: passwordHash,
    posts: [],
    steamID: '',
    avatar: 'pfp_default.jpg',
    likedPosts: [],
  };

  //adds user to database
  await userCollection.insertOne(user);

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
    await postCollection.insertOne({ username: user.username, steamID: user.steamID, avatar: user.avatar, likes: 0, ...postContent });

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
        //updates local data with Steam ID & avatar
        if (steamData.data.player.avatar) {
          user.avatar = steamData.data.player.avatar;
        }
        user.steamID = steamID;

        //update database
        await userCollection.updateOne({ username: user.username }, { $set: { steamID: user.steamID, avatar: user.avatar } });

        return true;
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

async function findUserByToken(token) {
    const user = await userCollection.findOne({ token: token });
    return user;
}

async function findUserByUsername(username) {
    const user = await userCollection.findOne({ username: username });
    return user;
}

async function updateUserToken(username, token) {
    await userCollection.updateOne({ username: username }, { $set: { token: token } });
}

async function viewPosts() {
    const cursor = postCollection.find({}).sort({ _id: -1 }).limit(50);
    const allPosts = await cursor.toArray();
    return allPosts;
}

async function getLikedPosts(userToken) {
    const user = await userCollection.findOne({ token: userToken });
    return user.likedPosts || [];
}

async function likePost(userToken, postID) {
    const oid = new ObjectId(postID);
    const post = await postCollection.findOne({ "_id": oid });
    if (!post) {
        console.warn('likePost: post not found', postID);
        return 0;
    }
    if (post.likes === undefined) {
        post.likes = 0;
        await postCollection.updateOne({ "_id": oid }, { $set: { likes: 0 } });
    }
    if (userToken) {
        await postCollection.updateOne({ "_id": oid }, { $inc: { likes: 1 } });
        const user = await userCollection.findOne({ token: userToken });
        if (!user.likedPosts) {
            userCollection.updateOne({ token: userToken }, { $set: { likedPosts: [] } });
        }
        await userCollection.updateOne({ token: userToken }, { $addToSet: { likedPosts: postID } });
        return post.likes + 1;
    }
    return post.likes + 1;
}

async function unlikePost(userToken, postID) {
    const oid = new ObjectId(postID);
    const post = await postCollection.findOne({ "_id": oid });
    if (!post) {
        console.warn('unlikePost: post not found', postID);
        return 0;
    }
    if (userToken) {
        if (!post.likes || post.likes <= 0) {
            post.likes = 0;
            await postCollection.updateOne({ "_id": oid }, { $set: { likes: 0 } });
            await userCollection.updateOne({ token: userToken }, { $pull: { likedPosts: postID } });
            return 0;
        }
        await postCollection.updateOne({ "_id": oid }, { $inc: { likes: -1 } });
        await userCollection.updateOne({ token: userToken }, { $pull: { likedPosts: postID } });
    }
    return post.likes - 1;
}

module.exports = {
  createUser,
  addPost,
  addSteamID,
  removeSteamID,
  likePost,
  unlikePost,
  findUserByToken,
  findUserByUsername,
  viewPosts,
  updateUserToken,
  getLikedPosts,
};