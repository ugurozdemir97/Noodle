const { RateLimiterMemory } = require("rate-limiter-flexible");  // A library to rate-limit users
const updateLastSeen = require("./lastSeen");
const saveMessages = require("./saveMessages");
const friendship = require("./friendShip");

// Initialize RateLimiterMemory. A user will be able to send maximum 3 requests per second.
const rateLimiter = new RateLimiterMemory({
    points: 3, // 3 points
    duration: 1, // per second
});

// We send io onject to this function and require it, so this function will work as long as the server is running
exports = module.exports = (io) => {

    // Keep online users
    var onlineUsers = {};

    // Socket.io on connection - Assign random sockets to the users who visited the webpage
    // This is the server side, when client detect any connection, this function will work
    io.on("connection", (socket) => {

        let user;  // To use in disconnection, because client can't send the userId when the user is disconnected
        socket.on("connectedUser", (data) => {
            // The data is something like this: {userId: '55353535656',socketId: '8xw7-NsAAAF'}
            // Now create a key value pair like this: {55353535656: 8xw7-NsAAAF}
            // And push it to the online users. So when we call onlineUsers[userId] it will give us the user's socket Id
            user = data.userId;
            onlineUsers[user] = data.socketId;
        })

        // When a user disconnects, delete it from the online users array
        socket.on("disconnect", () => {
            if (user != undefined) {updateLastSeen(user)} // Update the user's last seen date
            delete onlineUsers[user]  // Delete the user from online users
        })

        // Friends array will be sent from the client side, filter them
        socket.on("onlineFriends", (friends) => {
            var onlineFriends = friends.filter((friend) => onlineUsers[friend])  // If friend is online push it in onlineFriends
            socket.emit("onlineFriends", onlineFriends)  // Sent the filtered array back to the client
        })

        // Get the message from client and send it back to the user
        socket.on("sendMessage", async (message) => {
            try {  // rateLimiter works with try catch. If someone sends more than 3 message per second the message will be sent
                await rateLimiter.consume(socket.handshake.address);

                let newMessage = {
                    from: message.from, 
                    message: message.message,
                    date: message.date
                }
    
                // Control if the messages are valid and if they are, save the messages and send them back to the receiver client
                if (await saveMessages(message, user) == true) {
                    socket.to(onlineUsers[message.to]).emit("sendMessage", newMessage)  // Sent the message to the user
                }

            } catch (rejRes) {  // If user tries a for loop in the console and send a lot of messages, send them a warning
                socket.emit('blocked', {message: `Too many request! Wait for ${rejRes.msBeforeNext} ms`});
            } 
        })

        // Get friend request and send it back to the user
        socket.on("sendFriendRequest", async (request) => {
            try {  // rateLimiter works with try catch. If someone sends more than 3 message per second the message will be sent
                await rateLimiter.consume(socket.handshake.address);

                let friendshipData = await friendship.addFriend(request, user)
                if (friendshipData) {
                    socket.to(onlineUsers[request.to]).emit("sendFriendRequest", friendshipData)  // Sent the request to the user
                }

            } catch (rejRes) {
                socket.emit('blocked', {message: `Too many request! Wait for ${rejRes.msBeforeNext} ms`});
            }            
        })

        // Get cancel or deny friend request and send it back to the user
        socket.on("cancelFriendRequest", async (request) => {

            try {
                await rateLimiter.consume(socket.handshake.address);
                // If request canceller is valid
                let friendshipData = await friendship.deleteFriend(request, user, "Cancel")
                if (friendshipData) {
                    socket.to(onlineUsers[request.to]).emit("cancelFriendRequest", friendshipData)  // Sent the request to the user
                }

            } catch (rejRes) {
                socket.emit('blocked', {message: `Too many request! Wait for ${rejRes.msBeforeNext} ms`}); 
            }
        })

        // Get cancel or deny friend request and send it back to the user
        socket.on("denyFriendRequest", async (request) => {

            try {  // rateLimiter works with try catch. If someone sends more than 3 message per second the message will be sent
                await rateLimiter.consume(socket.handshake.address);

                // If request canceller is valid
                let friendshipData = await friendship.deleteFriend(request, user, "Deny")
                if (friendshipData) {
                    socket.to(onlineUsers[request.to]).emit("cancelFriendRequest", friendshipData)  // Sent the request to the user
                }

            } catch (rejRes) {
                socket.emit('blocked', {message: `Too many request! Wait for ${rejRes.msBeforeNext} ms`});
            }
        })

        // Get accept friend request and send it back to the user
        socket.on("acceptFriendRequest", async (request) => {

            try {  // rateLimiter works with try catch. If someone sends more than 3 message per second the message will be sent
                await rateLimiter.consume(socket.handshake.address);

                let friendshipData = await friendship.acceptFriend(request, user)
                if (friendshipData) {
                    socket.to(onlineUsers[request.to]).emit("acceptFriendRequest", friendshipData)  // Sent the request to the user
                }

            } catch (rejRes) {
                socket.emit('blocked', {message: `Too many request! Wait for ${rejRes.msBeforeNext} ms`});
            }
        })

    })
}
