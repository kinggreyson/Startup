const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.username}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db(config.database);

const userCollection = db.collection('users');
const tierListCollection = db.collection('tierlists');