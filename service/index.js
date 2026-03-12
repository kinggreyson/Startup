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
})