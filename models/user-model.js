const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A user must have a name'],
    },
    password: {
        type: String,
        required: [true, 'A user must have a password'],
    },
    email: {
        type: String,
        required: [true, 'A user must have a email'],
        unique: true
    },
    role: {
        type: String,
        default: "user"
    }
});

const User = mongoose.model('User', userSchema, 'users');

//Methods here
exports.searchByEmail = function(email) {
    return User.findOne({email:email});
};

exports.addUser = function(newUser) {
    return User.create(newUser);
};

/* exports.editUser = function(name, password) {
    return User.updateOne({name:name}, {password:password});
}

exports.deleteUser = function(email) {
    return User.deleteOne({email:email});
} */
