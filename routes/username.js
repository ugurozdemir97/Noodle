const express = require("express")
const router = express.Router()
const User = require("../models/users");  // Users Schema

// Change username
router.post("/changeUsername", async (req, res) => {

    // Find if there is a user with the same username
    const user = await User.findOne({username: req.body.username});

    if (user) { // If there is,and if it's the same user's, do nothing. If it's someone else's, then send error
        if (user._id == req.session.user._id) {res.sendStatus(200);} 
        else {
            if (req.session.user.username) {
                res.send({error: "400", username: req.session.user.username});
            } else {
                res.send({error: "400", username: `${req.session.user.firstName} ${req.session.user.lastName}`});
            } 
        }
    } else {  // If there is no problem, change the username
        if ((req.body.username).length > 16 || (req.body.username).indexOf(" ") >= 0) {
            res.send("Nice try :)");     
        } else {
            const changeUsername = await User.findOne({_id: req.session.user._id});
            changeUsername.username = req.body.username;
            changeUsername.save();
            res.sendStatus(200);
        }
    }
})

// Delete username
router.post("/deleteUsername", async (req, res) => {

    const user = await User.findOne({_id: req.session.user._id});
    user.username = undefined;
    user.save();
    res.sendStatus(200);

})

module.exports = router;