const UserModel = require('../models/userModel');
const bcrypt = require('bcryptjs');

const register = (req, res) => {
    const { Username, Password } = req.body;

    if (!Username || !Password) {
        return res.status(400).json({
            success: false,
            message: 'Username and Password are required'
        });
    }

    if (Password.length < 6) {
        return res.status(400).json({
            success: false,
            message: 'Password must be at least 6 characters!'
        });
    }

UserModel.createUser(Username, Password, (err, result) => {

    if(err) {
        if(err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                message: 'Username already exists! Choose another.'
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: err.message
        });
    }
    return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        userId: result.insertId
    });
});
};

const login = (req, res) => {
    const { Username, Password } = req.body;

    if (!Username || !Password) {
        return res.status(400).json({
            success: false,
            message: 'Username and Password are required!'
        });
    }

    UserModel.findUsernameByUsername(Username, (err, user) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Login failed',
                error: err.message
               
            });
        }

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Username not found!'
            });
        }

        bcrypt.compare(Password, user.Password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Password check failed!'
                });
            }
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Wrong password! Try again.'
                });
            }

            req.session.User = {
                userId: user.UserId,
                username: user.Username
            };
            res.status(200).json({
                success: true,
                message: 'Login successful!',
                user: {
                    userId: user.UserId,
                    username: user.Username
                }
            });
        });
    });
};

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Logout failed',
            });
        }
        res.clearCookie('connect.sid');

        res.status(200).json({
            success: true,
            message: 'Logged out successfully!'
        });
    });
};

const getProfile = (req, res) => {
    const userId = req.session.user.userId;

    UserModel.findUserById(userId, (err, user) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'could not get profile!'
            });
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found!'
            });
        }

        res.status(200).json({
            success: true,
            user: user
        });
    });
};


module.exports = {
    register,
    login,
    logout,
    getProfile
};