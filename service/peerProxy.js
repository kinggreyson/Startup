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

  wss.on('connection', (ws) => {
    const connection = { id: uuid.v4(), alive: true, ws: ws };
    connections.push(connection);

    ws.on('message', function message(data) {
      // Broadcast to EVERYONE except the person who sent it
      connections.forEach((c) => {
        if (c.id !== connection.id) {
          c.ws.send(data);
        }
      });
    });

    ws.on('close', () => {
      connections = connections.filter((c) => c.id !== connection.id);
    });
  });
}

module.exports = { peerProxy };