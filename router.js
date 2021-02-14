const express = require("express");
const router = express.Router();
const { getUser, getUserByName } = require("./users.js");

router.get("/", (req, res) => {
  res.send("Server is up and running");
});

router.get("/getusernameavailable", (req, res) => {
  const name = req.query.name;
  if (!name) {
    return res.status(403).send({ message: "Nope" });
  }
  const user = getUserByName(name.trim().toLowerCase());
  if (user) return res.status(403).send({ message: "Nope" });

  return res.status(200).send({ message: "Success" });
});

module.exports = router;
