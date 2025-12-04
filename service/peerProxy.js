const { WebSocketServer } = require('ws');
const DB = require('./database.js');

function peerProxy(httpServer) {
  const socketServer = new WebSocketServer({ server: httpServer });
  console.log('WebSocket server started');

  socketServer.on('connection', (socket) => {
    socket.isAlive = true;
    console.log('WebSocket client connected');

    // Forward messages to everyone except the sender
    socket.on('message', async function updateLike(data) {
      try {
        const like = await JSON.parse(data);
        let likeCount = 0;
        if (like.type === 'like') {
          likeCount = await DB.likePost(like.user, like.postId);
        } else if (like.type === 'unlike') {
          likeCount = await DB.unlikePost(like.user, like.postId);
        }

        likeCount = Number(likeCount) || 0;
        const message = JSON.stringify({ type: 'likeUpdate', postId: like.postId, likes: likeCount });
        socketServer.clients.forEach((client) => {
          if (client !== socket && client.readyState === 1) {
            client.send(message);
          }
        });
      } catch (err) {
        console.error('WS message error:', err);
      }
    });

    // Respond to pong messages by marking the connection alive
    socket.on('pong', () => {
      socket.isAlive = true;
    });
  });

  // Periodically send out a ping message to make sure clients are alive
  setInterval(() => {
    socketServer.clients.forEach(function each(client) {
      if (client.isAlive === false) return client.terminate();

      client.isAlive = false;
      client.ping();
    });
  }, 10000);
}

module.exports = { peerProxy };