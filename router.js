const express = require("express");
const router = express.Router();
const { getUser, getUserByName } = require("./users.js");

router.get("/", (req, res) => {
  res.send("Server is up and running");
});

router.get("/getusernameavailable", (req, res) => {
  const name = req.query.name;
  if (!name) {
    res.send("Please send a username first");
  }
  const user = getUserByName(name.trim().toLowerCase());
  if (user) res.status(403).send("username not available");

  res.status(200).send("available");
});

module.exports = router;
