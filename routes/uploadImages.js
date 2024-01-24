const express = require("express")
const router = express.Router()
const User = require("../models/users");  // Users Schema
const multer  = require('multer');  // Upload pictures
const fs = require('fs');  // Delete pictures
const path = require('path');  // Get the absolute path

// Multer storage (Handle uploading images)
let storage = multer.diskStorage({
    destination: (req, file, cb) => {cb(null, './public/images')}, // Where the images will be stored
    filename: (req, file, cb) => {cb(null, Date.now() + '_' + file.originalname)} // Add Date.now() to the file name to make all names unique
})

// Multer error handling middleware
const multerErrorHandling = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {res.send(err)} 
  else {next()}
};

// Multer object
const upload = multer({
  storage: storage,
  limits: {
    files: 1, 
    fileSize: 3000000 // bytes
  }  
})

// Change user picture - upload.single('profilePic') comes from the file input name from ejs / html
router.post("/uploadImage", upload.single('profilePic'), multerErrorHandling, async (req, res) => {
    
    const user = await User.findOne({_id: req.session.user._id});

    // Delete old picture from server
    if (user.picture != "profilePic.jpg") {
      fs.unlink(path.resolve(`./public/images/${user.picture}`), (err) => {
        if (err) {console.error(err)}
      })
    }
  
    // Update user picture - (req.file) is the `profilePic` file
    user.picture = req.file.filename;
    user.save();
    
    res.send(`/images/${req.file.filename}`)

})

// Delete user picture
router.post("/deleteImage", async (req, res) => {
    const user = await User.findOne({_id: req.session.user._id});

    // Delete old picture from server
    if (user.picture != "profilePic.jpg") {
      fs.unlink(path.resolve(`./public/images/${user.picture}`), (err) => {
        if (err) {console.error(err)}
      })
    }

    // Update user picture
    user.picture = "profilePic.jpg";
    user.save();
    
    res.send({img: "/images/profilePic.jpg"})

})

module.exports = router;