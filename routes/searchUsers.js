const express = require("express");
const router = express.Router();
const User = require("../models/users");
const Friends = require("../models/friends");

// Searching users
router.post("/searchUsers", async (req, res) => {

    // To make search case insensitive make regex option "i"
    // Instead of using the raw data use {$regex: req.body.username, $options: 'i'} to search letter by letter
    const users = await User.find({username: {$regex: req.body.username, $options: 'i'}}).select("username picture")
    res.send(users);

})

module.exports = router;