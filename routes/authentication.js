const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt");  // Module for handling passwords
const User = require("../models/users");  // Users Schema

// Login page
router.post("/login", async (req, res) => {  // Login page

    const user = await User.findOne({mail: req.body.email})

    if (!user) {res.send({message: "User doesn't exist"})} 
    else {

        // Check if the user credentials are correct
        let valid = await bcrypt.compare(req.body.password, user.password); 

        if (valid) {

            req.session.loggedIn = true;
            req.session.user = user;
            res.send({message: "Success"});

        } else {

            res.send({message: "Wrong credentials!"});

        }
    }
})

// Sign up
router.post("/new-user", async (req, res) => {

    const user = await User.findOne({mail: req.body.email});

    if (user) {res.send("User already exist!")} 
    else {

        // Create new user
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            mail: req.body.email,
            password: await bcrypt.hash(req.body.password, 10), // Hash the password with bcrypt. (password, salting)
            picture: "profilePic.jpg",
            lastSeen: new Date(),
            createdAt: new Date(),
        })
    
        newUser.save();
        req.session.loggedIn = true;
        req.session.user = newUser;
        
        res.send({message: "Success"});
    }
})

// Logout
router.post("/logout", async (req, res) => {

    // Clear session cookie
    res.status(200).clearCookie('connect.sid', {path: '/'});

    // Destroy session
    req.session.destroy((e) => {
        res.redirect('/');
    });
})

module.exports = router;