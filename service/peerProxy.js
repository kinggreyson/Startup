const { WebSocketServer } = require('ws');
const uuid = require('uuid');

function peerProxy(httpServer) {
  const wss = new WebSocketServer({ noServer: true });

  //Websocket HTTP
  httpServer.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit('connection', ws, request);
    });
  });

  //Track Connections
  let connections = [];

  wss.on('connection', (ws) => {
    const connection = { id: uuid.v4(), alive: true, ws: ws };
    connections.push(connection);

    // Forward messages to other connections
    ws.on('message', function message(data) {
      const msg = JSON.parse(data);
      connections.forEach((c) => {
        if (c.id !== connection.id) {
          c.ws.send(JSON.stringify(msg));
        }
      });
    });

    // Remove connection when closed
    ws.on('close', () => {
      connections = connections.filter((c) => c.id !== connection.id);
    });

    // Respond to pong messages
    ws.on('pong', () => {
      connection.alive = true;
    });
  });
  setInterval(() => {
    connections.forEach((c) => {
      if (!c.alive) {
        c.ws.terminate();
      } else {
        c.alive = false;
        c.ws.ping();
      }
    });
  }, 10000);
}

module.exports = { peerProxy };