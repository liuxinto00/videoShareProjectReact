const express = require("express");
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const bodyParser = require("body-parser");

let url = process.env.MONGODB_URI || "mongodb://localhost:27017";
let db;

const urlencodedParser = bodyParser.urlencoded({ extended: false });

mongoClient.connect(url, { useUnifiedTopology: true }, function (
  error,
  client
) {
  assert.equal(error, null);
  db = client.db("posts");
});

router.post("/register", urlencodedParser, function (request, response) {
  const data = request.body.data;
  db.collection("users").findOne({ username: data.username }, function (
    error,
    result
  ) {
    if (result != null) {
      response.status(409).send("User already exists.");
    } else {
      db.collection("users").insertOne(
        { username: data.username, password: data.password },
        function (error, result) {
          response.send(result);
        }
      );
    }
  });
});

router.post("/login", urlencodedParser, function (request, response) {
  const data = request.body.data;
  db.collection("users").findOne({ username: data.username }, function (
    error,
    result
  ) {
    if (result === null || result.password != data.password) {
      response.status(401).send("Username or Password not correct.");
    } else {
      response.send(result);
    }
  });
});

module.exports = router;
// const express = require("express");
// const router = express.Router();

// const userDB = require("../db/userMongoDB.js");

// router.post("/register", async (req, res) => {
//   const data = req.body;
//   console.log("data is", data);
//   await userDB.createUser(data);
//   res.redirect("/");
// });

// router.post("/login", function (req, res) {
//   const data = req.body;
//   const result = userDB.loginUser(data);
//   print(result);
//   if (result === null || result.password != data.password) {
//     res.status(401).send("Username or Password not correct.");
//   } else {
//     res.send(result);
//   }
// });
// module.exports = router;
