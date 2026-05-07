const db = require('../config/db');

const addSparePart = (data, callback) => {
    const totalPrice = data.Quantity * data.UnitPrice;

    const sql = `
        INSERT INTO Spare_Part
        (Name, Category, Quantity, UnitPrice, TotalPrice)
        VALUES (?, ?, ?, ?, ?)`;

    db.query(
        sql,
        [
            data.Name,
            data.Category,
            data.Quantity,
            data.UnitPrice,
            totalPrice
        ],
        (err, result) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, result);
        }
    );
};

constgetAllSpareParts = (callback) => {
    const sql = `
        SELECT * FROM Spare_Part
        ORDER BY Name ASC`;

    db.query(sql, (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
};

const getSparePartById = (sparePartId, callback) => {
    const sql = `
        SELECT * FROM Spare_Part
        WHERE SparePartId = ? `;

    db.query(sql, [sparePartId], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results[0]);
    });
};

const updateSparePart = (sparePartId, data, callback) => {
    const totalPrice = data.Quantity * data.UnitPrice;

    const sql = `
        UPDATE Spare_Part
        SET 
            Name  = ?,
            Category = ?,
            Quantity = ?,
            UnitPrice = ?,
            TotalPrice = ?
            WHERE SparePartId = ?`;

        db.query(
            sql,
            [
                data.Name,
                data.Category,
                data.Quantity,
                data.UnitPrice,
                totalPrice,
                sparePartId
            ],
            (err, result) => {
                if (err) {
                    return callback(err, null);
                }
                callback(null, result);
            }
        );    
};

const deleteSparePart = (sparePartId, callback) => {
    const sql =
        `DELETE FROM Spare_Part
        WHERE SparePartId = ?`;

    db.query(sql, [sparePartId], (err, result) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
};



const getAllSpareParts = (callback) => {

    const sql = `
        SELECT * FROM Spare_Part 
        ORDER BY Name ASC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
};


module.exports = {
    addSparePart,
    getAllSpareParts,
    getSparePartById,
    updateSparePart,
    deleteSparePart
};