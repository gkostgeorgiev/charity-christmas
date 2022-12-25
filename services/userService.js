const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = 'q390vnodzmgszdfgsdz';

async function register(username, email, password) {
    const existingUsername = await User.findOne({ username }).collation({ locale: 'en', strength: 2 });
    const existingEmail = await User.findOne({ email }).collation({ locale: 'en', strength: 2 });

    if (existingUsername) {
        throw new Error('Username is taken');
    }
    if (existingEmail) {
        throw new Error('Email is taken');
    }
    if (password.length < 4) {
        throw new Error('Password must be at least 4 characters long');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        email,
        hashedPassword
    });

    const token = createSession(user);
    return token;
}

async function login(email, password) {
    const user = await User.findOne({ email }).collation({ locale: 'en', strength: 2 });
    if (!user) {
        throw new Error('Incorrect email/password');
    }

    const hasMatch = await bcrypt.compare(password, user.hashedPassword);

    if (hasMatch == false) {
        throw new Error('Incorrect username/password');
    }

    return createSession(user);
}

async function getUserById(id) {
    const user = User.findById(id).lean();
    return user;
}

function createSession({ _id, username }) {
    const payload = {
        _id,
        username,
    };

    const token = jwt.sign(payload, JWT_SECRET);
    return token;
}

function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}

module.exports = {
    register,
    login,
    verifyToken,
    getUserById
};