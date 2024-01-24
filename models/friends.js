const mongoose = require("mongoose");  // DataBase

const friendsSchema = new mongoose.Schema({
    requester: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
    receiver: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
    status: {type: Number, enum: [0, 1]}, // Waiting if 0, 1 if friends
    messages: [{
        from: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
        to: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
        message: {type: String},
        date: {type: Date, default: Date.now},
        index: {type: Number}
    }],
    lastSeenMessage: {type: mongoose.Schema.Types.ObjectId, ref: 'messages'},
    unseenMessageCount: {
        count: {type: Number, default: 0},
        for: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'}
    },
    createdAt: Date
})

module.exports = mongoose.model("Friends", friendsSchema);