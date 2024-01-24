const Friends = require("../models/friends");  // Friends Schema
const User = require("../models/users");  // Users Schema

// Update user's last seen date when they disconnects
module.exports = {

    addFriend: async (data, user) => {
        // Check if there is already a friendship between them just in case
        const friends = await Friends.findOne({$or: [
            {requester: user, receiver: data.to},
            {requester: data.to, receiver: user}
        ]})

        // If there is a friendship or requester and reciever are the same, return
        if (friends || (user).toString() == (data.to).toString()) {return false} // "Already friends!"
        else {

            // Create friendship
            const friendship = new Friends ({
                requester: user,
                receiver: data.to,
                status: 0,
            })

            friendship.save();

            // Find both receiver and requester and push the new friendship into their friends array
            const requester = await User.findOne({_id: user}).populate("username firstName lastName picture")
            const receiver = await User.findOne({_id: data.to})

            requester.friends.push(friendship);
            receiver.friends.push(friendship);

            requester.save();
            receiver.save();

            let newFriend = {
                from: user,
                friendship: friendship._id,
                picture: "/images/" + requester.picture,
                username: requester.username ? requester.username : requester.firstName + " " + requester.lastName
            }

            return newFriend;
        }

    },
    
    acceptFriend: async (data, user) => {

        // Update the friendship status
        const friendship = await Friends.findOne({_id: data.friendship}).populate('receiver', "username firstName lastName picture");

        // People can send data through postman or ajax requests. So check if the post request is valid. 
        // If friend is accepted by really the user or not?
        if (!friendship || 
            friendship && ((friendship.receiver._id).toString() != (user).toString())) {
                return false // "Nope! Don't even try!
        } else {

            friendship.status = 1;
            friendship.save()
        
            let newFriend = {
                from: friendship.receiver._id,
                friendship: friendship._id,
                picture: "/images/" + friendship.receiver.picture,
                username: friendship.receiver.username ? friendship.receiver.username : friendship.receiver.firstName + " " + friendship.receiver.lastName
            }

            return newFriend;
        }

    },

    deleteFriend: async (data, user, type) => {

        let to;
        let from;

        if (type == "Cancel") {
            to = data.to;
            from = user;
        } else {
            to = user;
            from = data.to;
        }

        // Find friendship data
        const friendship = await Friends.findOne({requester: from, receiver: to})

        // Check if you are already friends just in case
        if (!friendship) {return false} // "There is no friendship!"
        else if (friendship.status == 1) {return false} // "Already friends!"
        else {

            // Find both users and pull the friendship from their friends array
            const requester = await User.findOne({_id: from})
            const receiver = await User.findOne({_id: to})

            requester.friends.pull(friendship);
            receiver.friends.pull(friendship);

            requester.save();
            receiver.save();

            // Delete the friendship
            await Friends.deleteOne({_id: friendship});
            
            return user

        }

    },

}
