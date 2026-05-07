const db = require('../config/db');
const bcrypt = require('bcryptjs');

const createUser = (username, password, callback) => {
    bcrypt.hash(password, 10, (err, hashedPassword) =>{
        if (err) {
            return callback(err, null);
        }
        const sql = `INSERT INTO Users
                     (Username, Password)
                     VALUES (?, ?)`;

         db.query(sql, [username, hashedPassword], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, result);
         });            
    });
};

const findUserByUsername = (username, callback) => {
    const sql = `
        SELECT * FROM Users
        WHERE Username = ?`;

      db.query(sql, [username], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, result[0]);
      });
};

const findUserById = (userId, callback) => {
    const sql = `
        SELECT UserId, Username
        FROM Users
        WHERE UserId = ?`;
    
    db.query(sql, [UserId], (err, results) => {

        if (err) {
            return callback(err, null);
        }

        callback(null, result[0]);
    });
};

module.exports = {
    createUser,
    findUserByUsername,
    findUserById
};