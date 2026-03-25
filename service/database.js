const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.username}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db(config.database);

const userCollection = db.collection('users');
const tierListCollection = db.collection('tierlists');

async function connect() {
  await client.connect();
  console.log('Connected to MongoDB');
}

async function getUser(username) {
  return userCollection.findOne({ username });
}

async function createUser(username, hashedPassword, token) {
  const user = { username, password: hashedPassword, token };
  await userCollection.insertOne(user);
  return user;
}

async function updateUserToken(username, token) {
  await userCollection.updateOne({ username }, { $set: { token } });
}

async function getUserByToken(token) {
  return userCollection.findOne({ token });
}

async function saveTierList(list) {
  await tierListCollection.insertOne(list);
  return list;
}

async function getTierLists(username) {
  return tierListCollection.find({ savedBy: username }).toArray();
}

module.exports = { connect, getUser, createUser, updateUserToken, getUserByToken, saveTierList, getTierLists };