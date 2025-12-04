class LikeHandler {
  likedPosts = new Set();
  postLikes = new Map();
  userToken = '';
  socket = null;

  // queue for messages while socket is CONNECTING
  messageQueue = [];

  constructor() {
    // choose backend websocket endpoint:
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const proto = window.location.protocol === 'https:' ? 'wss' : 'ws';
    // dev: frontend on 5173, backend WS on port 4000
    const wsHost = isLocalhost ? `${window.location.hostname}:4000` : window.location.hostname;
    const wsUrl = `${proto}://${wsHost}/ws`;
    console.debug('LikeHandler connecting to WS:', wsUrl);
    this.socket = new WebSocket(wsUrl);
    console.log('WebSocket created:', this.socket);

    this.socket.onopen = () => {
      console.debug('WS open, readyState=', this.socket.readyState);
      while (this.messageQueue.length) { this.socket.send(this.messageQueue.shift()); }
    };
    this.socket.onerror = (err) => console.error('WS client error', err);
    this.socket.onclose = (ev) => console.debug('WS closed', ev);

    this.socket.onmessage = async (msg) => {
      try {
        // handle string or Blob
        let raw = msg.data;
        let parsed;
        if (typeof raw === 'string') {
          parsed = JSON.parse(raw);
        } else if (raw && typeof raw.text === 'function') {
          parsed = JSON.parse(await raw.text());
        } else {
          parsed = JSON.parse(JSON.stringify(raw));
        }
        this.receiveEvent(parsed);
      } catch (err) {
        console.debug('WS onmessage parse error', err);
      }
    };
  }

  // helper to safely send or queue messages
  _sendOrQueue(obj) {
    const msg = JSON.stringify(obj);
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      try {
        this.socket.send(msg);
      } catch (e) {
        console.warn('WS send failed', e);
      }
    } else {
      // queue the message until socket opens
      this.messageQueue.push(msg);
      console.log('queiuing message, socket not open yet');
    }
  }

  async initToken(newToken) {
    this.userToken = newToken;
    console.log('Initializing LikeHandler with token:', newToken);
    if (!newToken) {
      this.likedPosts = new Set();
      return;
    }

    try {
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const API_BASE = isLocalhost ? 'http://localhost:4000' : 'https://startup.robertthompson.click';
      
      const res = await fetch(`${API_BASE}/api/user/me/likes`, {
        headers: { 'Authorization': `Bearer ${this.userToken}` }
      });

      if (!res.ok) {
        console.warn('Failed to fetch likes, status:', res.status);
        this.likedPosts = new Set();
        return;
      }

      let likeData;
      try {
        likeData = await res.json();
      } catch (err) {
        console.warn('Could not parse likes JSON', err);
        likeData = [];
      }

      // accept either an array or { likes: [...] }
      let likesArray = Array.isArray(likeData) ? likeData : (Array.isArray(likeData?.likes) ? likeData.likes : []);
      this.likedPosts = new Set(likesArray);
      console.log('Like data loaded:', likesArray);
    } catch (err) {
      console.error('Error initializing likes:', err);
      this.likedPosts = new Set();
    }
  }

  addLike(postId) {
    console.log('Adding like for postId:', postId);
    if (this.likedPosts.has(postId)) return;
    this.likedPosts.add(postId);
    this._sendOrQueue({ type: 'like', postId: postId, user: this.userToken });
  }

  removeLike(postId) {
    console.log('Removing like for postId:', postId);
    if (!this.likedPosts.has(postId)) return;
    this.likedPosts.delete(postId);
    this._sendOrQueue({ type: 'unlike', postId: postId, user: this.userToken });
  }

  setLikeCount(postId, count) {
    if (!postId) return;
    this.postLikes.set(String(postId), Number(count) || 0);
  }

  receiveEvent(event) {
    if (event && event.type === 'likeUpdate') {
      this.postLikes.set(event.postId, event.likes);
    }
  }

  isLiked(postId) {
    console.log('Checking like for postId:', postId);
    return this.likedPosts.has(postId);
  }

  likeCount(postId) {
    return this.postLikes.get(postId) || 0;
  }

  changeLike(postId) {
    if (this.isLiked(postId)) {
      this.removeLike(postId);
    } else {
      this.addLike(postId);
    }
  }
}

const userLikeHandler = new LikeHandler();
export { userLikeHandler, LikeHandler };