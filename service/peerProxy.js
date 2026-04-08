const { WebSocketServer } = require('ws');
const uuid = require('uuid');

function peerProxy(httpService) {
  const wss = new WebSocketServer({ noServer: true });

  httpService.on('upgrade', (request, socket, head) => {
    if (request.url.startsWith('/ws')) {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    }
  });

  let connections = [];
  let sessions = {}; // Stores { [code]: { tierList: {...}, votes: {...} } }

  wss.on('connection', (ws) => {
    const connection = { id: uuid.v4(), ws: ws, joinCode: null };
    connections.push(connection);

    ws.on('message', function message(data) {
      const msg = JSON.parse(data);

      // 1. ACTION: Host creates a session
      if (msg.type === 'session_created') {
        connection.joinCode = msg.joinCode;
        sessions[msg.joinCode] = { 
          tierList: msg.tierList, 
          votes: {} 
        };
        updateUserCount(msg.joinCode);
      }

      // 2. ACTION: Friend tries to join
      if (msg.type === 'join_request') {
        const session = sessions[msg.joinCode];
        if (session) {
          connection.joinCode = msg.joinCode;
          // Send the tier list data BACK to the person who joined
          ws.send(JSON.stringify({
            type: 'session_created',
            joinCode: msg.joinCode,
            tierList: session.tierList
          }));
          updateUserCount(msg.joinCode);
        }
      }

      // 3. ACTION: Voting Logic (Restricted to Room)
      if (msg.type === 'vote' && connection.joinCode) {
        handleVote(msg, connection);
      } 

      // 4. ACTION: Chat (Restricted to Room)
      if (msg.type === 'chat' && connection.joinCode) {
        broadcastToRoom(msg, connection.id, connection.joinCode);
      }
    });

    ws.on('close', () => {
      const oldCode = connection.joinCode;
      connections = connections.filter((c) => c.id !== connection.id);
      if (oldCode) updateUserCount(oldCode);
    });

    // --- Helper Functions ---

function handleVote(msg, sender) {
  const code = sender.joinCode;
  if (!sessions[code]) return;
  if (!sessions[code].votes[msg.item]) sessions[code].votes[msg.item] = {};
  sessions[code].votes[msg.item][msg.user] = msg.tier;
  broadcastToRoom(msg, sender.id, code);
  const usersInRoom = connections.filter(c => c.joinCode === code);
  const votesReceived = Object.keys(sessions[code].votes[msg.item]).length;
  console.log(`Room ${code}: ${votesReceived}/${usersInRoom.length} votes for ${msg.item}`);

  if (votesReceived >= usersInRoom.length) {
    tally(code, msg.item);
  }
}

    function tally(code, item) {
      const votes = Object.values(sessions[code].votes[item]);
      const counts = votes.reduce((acc, t) => { acc[t] = (acc[t] || 0) + 1; return acc; }, {});
      const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

      if (sorted.length > 1 && sorted[0][1] === sorted[1][1]) {
        sessions[code].votes[item] = {}; // Reset for revote
        broadcastToRoom({ type: 'revote', item }, null, code);
      } else {
        broadcastToRoom({ type: 'vote_result', item, tier: sorted[0][0] }, null, code);
      }
    }

    function broadcastToRoom(msg, senderId, joinCode) {
      connections.forEach((c) => {
        // ONLY send to people with the SAME joinCode
        if (c.joinCode === joinCode && c.id !== senderId) {
          c.ws.send(JSON.stringify(msg));
        }
      });
    }

    function updateUserCount(joinCode) {
      const count = connections.filter(c => c.joinCode === joinCode).length;
      broadcastToRoom({ type: 'user_count', count }, null, joinCode);
    }
  });
}

module.exports = { peerProxy };