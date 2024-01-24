const User = require("../models/users");  // Users Schema

// Update user's last seen date when they disconnects
exports = module.exports = async (userId) => {

    // Find the user with the same id and update the last seen date
    const user = await User.findOne({_id: userId});
    user.lastSeen = new Date();
    user.save();

}