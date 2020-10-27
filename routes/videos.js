const express = require("express");
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const bodyParser = require("body-parser");

// Connection URL
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

router.get("/getComments", function (request, response) {
  const tableName = "comments";
  const videoId = request.query.videoId;
  const cursor = db
    .collection(tableName)
    .find({ videoId: videoId }, { limit: 10 });
  cursor
    .sort({ time: -1 })
    .map((e) => {
      return {
        id: e._id,
        username: e.username,
        comment: e.comment,
        time: e.time,
      };
    })
    .toArray(function (error, result) {
      response.send(result);
    });
});

// router.get("/getComments", urlencodedParser, function (request, response) {
//   const data = request.query;
//   db.collection("comments")
//     .find({ videoId: data.videoId })
//     .toArray(function (error, result) {
//       if (error) {
//         throw error;
//       }
//       console.log("got comments");
//       response.send(result);
//     });
// });

router.post("/addComments", function (request, response) {
  const tableName = "comments";
  const data = request.body.data;
  db.collection(tableName).insertOne(
    {
      videoId: data.videoId,
      username: data.username,
      comment: data.comment,
      time: new Date(),
    },
    function (error, result) {
      if (error !== undefined && error !== null) {
        response.status(500);
        response.send(
          "Since server encounters error, add new comment failed. details: " +
            error.message
        );
      } else if (result == null) {
        response.status(400);
        response.send("Cannot find add comment for video " + data.videoId);
      } else {
        response.status(200).end();
      }
    }
  );
});

// router.post("/addComments", urlencodedParser, function (request, response) {
//   const data = request.body.data;
//   db.collection("comments").insertOne({
//     videoId: data.videoId,
//     username: data.username,
//     comment: data.comment,
//     time: new Date(),
//   }),
//     function (error) {
//       if (error) {
//         throw error;
//       }
//       response.send("comment saved");
//     };
// });

// router.get("/getComments", function (request, response) {
//   mongoClient.connect(url, function (error, client) {
//     assert.equal(error, null);
//     const db = client.db(dbName);
//     const tableName = "comments";
//     const articleId = request.query.articleId;
//     const cursor = db
//       .collection(tableName)
//       .find({ articleId: articleId }, { limit: 100 });
//     cursor
//       .sort({ time: -1 })
//       .map((e) => {
//         return {
//           id: e._id,
//           username: e.username,
//           comment: e.comment,
//         };
//       })
//       .toArray(function (error, result) {
//         client.close();
//         response.send(result);
//       });
//   });
// });

module.exports = router;
