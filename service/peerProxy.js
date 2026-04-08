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
  let sessions = {}; 

  wss.on('connection', (ws) => {
    const connection = { id: uuid.v4(), ws: ws, joinCode: null };
    connections.push(connection);

    ws.on('message', function message(data) {
      const msg = JSON.parse(data);
      const targetCode = msg.joinCode || connection.joinCode;

      if (msg.type === 'session_created') {
        connection.joinCode = msg.joinCode;
        sessions[msg.joinCode] = { 
          tierList: msg.tierList, 
          votes: {} 
        };
        updateUserCount(msg.joinCode);
      }

     
      if (msg.type === 'join_request') {
        const session = sessions[msg.joinCode];
        if (session) {
          connection.joinCode = msg.joinCode;
          
          ws.send(JSON.stringify({
            type: 'session_created',
            joinCode: msg.joinCode,
            tierList: session.tierList
          }));
          updateUserCount(msg.joinCode);
        }
      }


      if (msg.type === 'vote' && connection.joinCode) {
        handleVote(msg, connection);
      } 

      if (msg.type === 'chat' && targetCode) {
  
        broadcastToRoom(msg, connection.id, targetCode);
  }
    });

    ws.on('close', () => {
      const oldCode = connection.joinCode;
      connections = connections.filter((c) => c.id !== connection.id);
      if (oldCode) updateUserCount(oldCode);
    });



function handleVote(msg, sender) {
  const code = sender.joinCode;
  if (!sessions[code]) return;
  if (!sessions[code].votes[msg.item]) sessions[code].votes[msg.item] = {};
  sessions[code].votes[msg.item][msg.user] = msg.tier;
  broadcastToRoom(msg, sender.id, code);
  const usersInRoom = connections.filter(c => c.joinCode === code);
  const votesReceived = Object.keys(sessions[code].votes[msg.item]).length;


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
 
  const targetCode = joinCode ? joinCode.toString().toUpperCase().trim() : null;



  connections.forEach((c) => {
    const connectionCode = c.joinCode ? c.joinCode.toString().toUpperCase().trim() : null;

   
    if (connectionCode === targetCode && c.id !== senderId) {
      if (c.ws.readyState === 1) { //1 websocket open
        c.ws.send(JSON.stringify(msg));

      }
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