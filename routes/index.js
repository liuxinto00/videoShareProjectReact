var express = require("express");
var router = express.Router();

const myDB = require("../db/myMongoDB.js");
/* GET home page. */
router.get("/posts", async (req, res, next) => {
  const posts = await myDB.getPosts();
  res.json(posts);
});

router.get("/initialize", async (req, res) => {
  await myDB.initialize();
  res.redirect("/");
});

router.post("/posts/create", async (req, res) => {
  const post = req.body;
  await myDB.createPost(post);
  res.redirect("/");
});

module.exports = router;

// const { MongoClient } = require("mongodb");

// // Replace the uri string with your MongoDB deployment's connection string.
// const uri =
//   "mongodb+srv://<user>:<password>@<cluster-url>?retryWrites=true&w=majority";

// const client = new MongoClient(uri);

// async function run() {
//   try {
//     await client.connect();

//     const database = client.db('sample_mflix');
//     const collection = database.collection('movies');

//     // Query for a movie that has the title 'Back to the Future'
//     const query = { title: 'Back to the Future' };
//     const movie = await collection.findOne(query);

//     console.log(movie);
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);
