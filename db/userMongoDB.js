const { MongoClient } = require("mongodb");

function UserDB() {
  const userDB = {};
  const uri = process.env.MONGO_URL || "mongodb://localhost:27017";

  userDB.createUser = async (data) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();
    const db = client.db("posts");
    console.log("connected to db posts");
    const users = db.collection("users");
    console.log("connected to users");
    return await users.insertOne(data);
  };

  userDB.loginUser = async (data) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();
    const db = client.db("posts");
    console.log("connected to db posts");
    const users = db.collection("users");
    console.log("connected to users");
    return users.findOne({ username: data.username });
  };

  return userDB;
}

module.exports = UserDB();
