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
