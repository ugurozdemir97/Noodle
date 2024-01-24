const Friends = require("../models/friends");  // Friends Schema

exports = module.exports = async (data, user) => {
    
    let messages = await Friends.findOne({_id: data.friendship}, {messages: 1, unseenMessageCount: 1, requester: 1, receiver: 1})
    let index = messages.messages.length; // To add custom index field

    let newMessage = {
        from: data.from,
        to: data.to,
        message: data.message,
        index: index
    }

    // If req.body.from is not the same person with post requester (Someone can still type their own id and break the server)
    // And if it's not someone in this friendship
    // And if it's not someone sendin a message to themselves
    if (
        (data.from).toString() != (user).toString() || 
        ((messages.requester).toString() != (data.from).toString() && (messages.receiver).toString() != (data.from).toString()) ||
        data.from == data.to) {
            return false // Nice try! || Nope! Don't even try!
    } else {
        messages.messages.push(newMessage);
        messages.unseenMessageCount.count++; 
        messages.unseenMessageCount.for = data.to;
        messages.save();
    
        return true
    }
}