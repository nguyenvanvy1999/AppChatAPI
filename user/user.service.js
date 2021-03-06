const User = require('./user.model');
const mongoose = require('mongoose');
const { APIError } = require('../helper/error');

// ________________________________________________
function newUser(user) {
    newUser = {
        _id: mongoose.Types.ObjectId(),
        email: user.email,
        username: user.username,
        password: user.password,
        isActive: false,
    };
    return newUser;
}
async function insert(newUser) {
    try {
        const user = new User(newUser);
        const result = await user.save();
        return result;
    } catch (error) {
        throw new APIError({ message: error.message, errors: error });
    }
}

async function editUser(email, newUsername, newPassword) {
    try {
        const user = await User.findOneAndUpdate({ email: email }, { username: newUsername, password: newPassword }, { new: true });
        return user;
    } catch (error) {
        throw new APIError({ message: error.message, errors: error });
    }
}

async function deleteUserByEmail(email) {
    try {
        const result = await User.findOneAndDelete({ email: email });
        return result;
    } catch (error) {
        throw new APIError({ message: error.message, errors: error });
    }
}

async function activeAccount(email) {
    try {
        const result = await User.findOneAndUpdate({ email: email }, { isActive: true }, { new: true });
        return result;
    } catch (error) {
        throw new APIError({ message: error.message, errors: error });
    }
}
async function searchUser(user) {
    try {
        let result;
        if (user === null) result = await User.find();
        const { email, username, id } = user;
        if (email && username)
            result = await User.findOne({
                $and: [{ email: email }, { username: username }],
            });
        result = await User.find({
            $or: [{ email: email }, { username: username }, { _id: id }],
        });
        if (result.length === 1) return result[0];
        if (result.length === 0) return null;
        return result;
    } catch (error) {
        throw new APIError({ message: error.message, errors: error });
    }
}

module.exports = {
    newUser,
    insert,
    activeAccount,
    deleteUserByEmail,
    editUser,
    searchUser,
};