const mongoose = require("mongoose");  // DataBase

const usersSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    mail: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    picture: String,
    createdAt: Date,
    lastSeen: Date,
    username: {type: String, unique: true, sparse: true},  // sparse allows null, which will later be filled with unique data
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Friends'}]
})

module.exports = mongoose.model("Users", usersSchema);
