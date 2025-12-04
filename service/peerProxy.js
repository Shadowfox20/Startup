const { WebSocketServer } = require('ws');
const DB = require('./database.js');

function peerProxy(httpServer) {
  const socketServer = new WebSocketServer({ server: httpServer });
  console.log('WebSocket server started');

  socketServer.on('connection', (socket) => {
    socket.isAlive = true;
    console.log('WebSocket client connected');

    // Forward messages to everyone except the sender
    socket.on('message', function updateLike(data) {
      try {
        const like = JSON.parse(data);
        let likeCount = 0;
        if (like.type === 'like') {
          likeCount = DB.likePost(like.user, like.postId);
        } else if (like.type === 'unlike') {
          likeCount = DB.unlikePost(like.user, like.postId);
        }
        socketServer.clients.forEach((client) => {
          if (client !== socket && client.readyState === 1) {
            client.send(JSON.stringify({ type: 'likeUpdate', postId: like.postId, likes: likeCount }));
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