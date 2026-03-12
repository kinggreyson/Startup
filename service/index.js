const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');

const app = express();
const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

// In-memory storage (for now)
const users = [];
const tierLists = [];

app.listen(port, () => console.log(`Listening on port ${port}`));

//Home Page

//Registering
app.post('/api/auth/register', async (req, res) => {
    const { username, password } = req.body;
    if (users.find(u => u.username == username)) { //IF USERNAME IS ALREADY TAKEN
        return res.status(409).json({ msg: 'Username already taken'});
    }
    const hashed = await bcrypt.hash(password, 10); //Password encrypting
    const token = uuid.v4();
    users.push({ username, password: hashed, token });
    res.json({ username }); 
});

// Login
app.post('/api/auth/login', async (req,res) => {
    const {username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (!user || !(await bycrypt.compare(password, user.password))) { //Incorrect Login
        return res.status(401).json({msg: 'Invalid Credentials'});
    }
    user.token = uuid.v4();
    res.cookie('token', user.token, { samesite: 'strict', httpOnly: true});
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

function requireAuth(req, res, next)
{
    const token = req.cookie.token;
    const user = users.find(u => u.token === token);
    if (!user) return res.status(401).json({ msg: 'Unauthorized' });
    req.user = user;
    next();
}