const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');

const app = express();
const port = process.argv.length > 2 ? process.argv[2] : 4000;
const { peerProxy } = require('./peerProxy.js');

const db = require('./database.js');
db.connect();

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

const apiRouter = express.Router();
app.use(`/api`, apiRouter);

// Auth Routes
apiRouter.post('/auth/register', async (req, res) => {
  const { username, password } = req.body;
  if (await db.getUser(username)) return res.status(409).json({ msg: 'User taken' });
  const hashed = await bcrypt.hash(password, 10);
  const token = uuid.v4();
  await db.createUser(username, hashed, token);
  res.cookie('token', token, { sameSite: 'strict', httpOnly: true });
  res.json({ username });
});

apiRouter.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await db.getUser(username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ msg: 'Unauthorized' });
  }
  const token = uuid.v4();
  await db.updateUserToken(username, token);
  res.cookie('token', token, { sameSite: 'strict', httpOnly: true });
  res.json({ username });
});

apiRouter.delete('/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.status(204).end();
});

// Middleware
async function requireAuth(req, res, next) {
  const token = req.cookies.token;
  const user = await db.getUserByToken(token);
  if (!user) return res.status(401).json({ msg: 'Unauthorized' });
  req.user = user;
  next();
}

// Data Routes
apiRouter.post('/tierlists', requireAuth, async (req, res) => {
  const list = { ...req.body, savedBy: req.user.username, id: uuid.v4() };
  const saved = await db.saveTierList(list);
  res.json(saved);
});

apiRouter.get('/tierlists', requireAuth, async (req, res) => {
  const lists = await db.getTierLists(req.user.username);
  res.json(lists);
});

// SPA Support: Serve index.html for all other routes
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

const httpService = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

peerProxy(httpService);