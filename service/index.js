const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');

const app = express();
const port = process.argv.length > 2 ? process.argv[2] : 4000;
const { peerProxy } = require('./peerProxy.js');

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));


const db = require('./database.js');
db.connect();

//Websocket Prep
app.listen(port, () => console.log(`Listening on port ${port}`));

app.use(express.static('public'));
const apiRouter = express.Router();
app.use(`/api`, apiRouter);
const httpService = app.listen(3000, () => {
  console.log('Listening on port 3000');
  });
peerProxy(httpService);
//Home Page

//Registering
app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;
  if (await db.getUser(username)) {
    return res.status(409).json({ msg: 'Username already taken' });
  }
  const hashed = await bcrypt.hash(password, 10);
  const token = uuid.v4();
  const user = await db.createUser(username, hashed, token);
  res.cookie('token', token, { sameSite: 'strict', httpOnly: true });
  res.json({ username });
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await db.getUser(username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ msg: 'Invalid Credentials' });
  }
  const token = uuid.v4();
  await db.updateUserToken(username, token);
  res.cookie('token', token, { sameSite: 'strict', httpOnly: true });
  res.json({ username });
});

// Logout
app.delete('/api/auth/logout', (req, res) => {
    const token = req.cookies.token;
    const user = users.find(u => u.token === token);
    if (user) user.token = null;
    res.clearCookie('token');
    res.status(204).end();
});

//Security
async function requireAuth(req, res, next) {
  const token = req.cookies.token;
  const user = await db.getUserByToken(token);
  if (!user) return res.status(401).json({ msg: 'Unauthorized' });
  req.user = user;
  next();
}

//Save Tier List
app.post('/api/tierlists', requireAuth, async (req, res) => {
  const list = { ...req.body, savedBy: req.user.username, id: uuid.v4() };
  const saved = await db.saveTierList(list);
  res.json(saved);
});

//Get Saved Tier Lists
app.get('/api/tierlists', requireAuth, async (req, res) => {
  const lists = await db.getTierLists(req.user.username);
  res.json(lists);
});

