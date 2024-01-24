const express = require("express")
const router = express.Router()
const Friends = require("../models/friends");  // Friends Schema

// Find all messages between users and send them
router.post("/loadMessages", async (req, res) => {

    let index = -100  // Start from the last 100 messages
    let limit = 100  // Bring only 100 message

    // If user is scrolled to the top, take the first message's index and bring 100 more old message
    if (req.body.messageIndex) {
        index = (Number(req.body.messageIndex) - 100)

        // But if there is no more 100 messages, then only bring what is left
        if (index < 0) {
            index = 0;
            limit = Number(req.body.messageIndex)
        }
    }

    // Bring the last 100 messages, if user scroll to the top and there are more than 100 messages than bring the older messages
    const messages = await Friends.findOne({_id: req.body.friendshipId}, {receiver:1, requester: 1, messages: {$slice: [index, limit]}}).populate({ 
        path: 'messages',
        populate: {
            path: 'from to',
            model: 'Users',
            select: 'username firstName lastName'
        } 
    })

    if (  // If the person who wants to see the messages is not in the chat, return
        (messages.requester).toString() != (req.session.user._id).toString() && 
        (messages.receiver).toString() != (req.session.user._id).toString()) {
            res.send("Nope! Don't even try!")
    } else {res.send(messages)}
    
})

// Update last seen message
router.post("/lastSeenMessage", async (req, res) => {
    
    let lastSeen = await Friends.findOne({_id: req.body.friendshipId}, {lastSeenMessage: 1, messages: 1, unseenMessageCount: 1})
    
    // If I am not the one who recieved the messages just in case someone tries to make you see messages
    if ((lastSeen.messages.slice(-1)[0].to).toString() != (req.session.user._id).toString()) {res.send("Nope! Don't even try!")}
    else {

        if (req.body.message) { // Last seen message is sent - Sent from index.js > showChat()
            lastSeen.lastSeenMessage = req.body.message;
        } else { // The user is already looking at the chat so the last seen message is the last one - Sent from socket.js > placeMessages()
            lastSeen.lastSeenMessage = lastSeen.messages.slice(-1)[0]._id
        }
        
        lastSeen.unseenMessageCount.count = 0; // All messages are seen
        lastSeen.save();
    
        res.send({message: lastSeen.lastSeenMessage});

    }

})

module.exports = router;
