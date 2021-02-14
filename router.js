const express = require("express");
const router = express.Router();
const { getUser, getUserByName, getUserAvailable } = require("./users.js");

router.get("/", (req, res) => {
  res.send("Server is up and running");
});

router.get("/getusernameavailable", (req, res) => {
  const name = req.query.name;
  const room = req.query.room;
  if (!name) {
    return res.status(403).send({ message: "Nope" });
  }
  const user = getUserAvailable(
    name.trim().toLowerCase(),
    room.trim().toLowerCase()
  );
  if (user) return res.status(403).send({ message: "Nope" });

  return res.status(200).send({ message: "Success" });
});

module.exports = router;
