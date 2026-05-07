const db = require('../config/db');
const addStockIn = (data, callback) => {

    const sql = `
        INSERT INTO Stock_In 
        (SparePartId, StockInQuantity, StockInDate) 
        VALUES (?, ?, ?)
    `;

    
    db.query(
        sql,
        [
            data.SparePartId,      
            data.StockInQuantity,  
            data.StockInDate       
        ],
        (err, result) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, result);
        }
    );
};



const getAllStockIn = (callback) => {

    const sql = `
        SELECT 
            si.StockInId,
            sp.Name        AS PartName,
            sp.Category,
            si.StockInQuantity,
            si.StockInDate
        FROM Stock_In si
        JOIN Spare_Part sp 
            ON si.SparePartId = sp.SparePartId
        ORDER BY si.StockInDate DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            return callback(err, null);
        }
    
        callback(null, results);
    });
};


const addStockOut = (data, callback) => {

    const totalPrice = 
        data.StockOutQuantity * data.StockOutUnitPrice;

    const sql = `
        INSERT INTO Stock_Out 
        (
            SparePartId, 
            UserId,
            StockOutQuantity, 
            StockOutUnitPrice,
            StockOutTotalPrice,
            StockOutDate
        ) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            data.SparePartId,       
            data.UserId,            
            data.StockOutQuantity, 
            data.StockOutUnitPrice, 
            totalPrice,            
            data.StockOutDate       
        ],
        (err, result) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, result);
        }
    );
};


const getAllStockOut = (callback) => {

    const sql = `
        SELECT 
            so.StockOutId,
            sp.Name            AS PartName,
            sp.Category,
            u.Username         AS TakenBy,
            so.StockOutQuantity,
            so.StockOutUnitPrice,
            so.StockOutTotalPrice,
            so.StockOutDate
        FROM Stock_Out so
        JOIN Spare_Part sp 
            ON so.SparePartId = sp.SparePartId
        JOIN Users u 
            ON so.UserId = u.UserId
        ORDER BY so.StockOutDate DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
};

const getStockOutById = (stockOutId, callback) => {

    const sql = `
        SELECT 
            so.StockOutId,
            so.SparePartId,
            sp.Name            AS PartName,
            so.UserId,
            u.Username         AS TakenBy,
            so.StockOutQuantity,
            so.StockOutUnitPrice,
            so.StockOutTotalPrice,
            so.StockOutDate
        FROM Stock_Out so
        JOIN Spare_Part sp 
            ON so.SparePartId = sp.SparePartId
        JOIN Users u 
            ON so.UserId = u.UserId
        WHERE so.StockOutId = ?
    `;

    db.query(sql, [stockOutId], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        
        callback(null, results[0]);
    });
};


const updateStockOut = (stockOutId, data, callback) => {

    const totalPrice = 
        data.StockOutQuantity * data.StockOutUnitPrice;

    const sql = `
        UPDATE Stock_Out 
        SET 
            SparePartId        = ?,
            UserId             = ?,
            StockOutQuantity   = ?,
            StockOutUnitPrice  = ?,
            StockOutTotalPrice = ?,
            StockOutDate       = ?
        WHERE StockOutId = ?
    `;

    db.query(
        sql,
        [
            data.SparePartId,
            data.UserId,
            data.StockOutQuantity,
            data.StockOutUnitPrice,
            totalPrice,
            data.StockOutDate,
            stockOutId          
        ],
        (err, result) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, result);
        }
    );
};


const deleteStockOut = (stockOutId, callback) => {

    const sql = `
        DELETE FROM Stock_Out 
        WHERE StockOutId = ?
    `;

    db.query(sql, [stockOutId], (err, result) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
};


const getDailyStockOutReport = (callback) => {

    const sql = `
        SELECT 
            so.StockOutId,
            sp.Name            AS PartName,
            sp.Category,
            u.Username         AS TakenBy,
            so.StockOutQuantity,
            so.StockOutUnitPrice,
            so.StockOutTotalPrice,
            so.StockOutDate
        FROM Stock_Out so
        JOIN Spare_Part sp 
            ON so.SparePartId = sp.SparePartId
        JOIN Users u 
            ON so.UserId = u.UserId
        WHERE so.StockOutDate = CURDATE()
        ORDER BY so.StockOutDate DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
};


const getDailyStockStatus = (callback) => {

    const sql = `
        SELECT 
            sp.SparePartId,
            sp.Name                         AS PartName,
            sp.Category,
            sp.Quantity                     AS StoredQuantity,
            COALESCE(
                SUM(so.StockOutQuantity), 0
            )                               AS TotalStockOut,
            (
                sp.Quantity - COALESCE(
                    SUM(so.StockOutQuantity), 0
                )
            )                               AS RemainingQuantity
        FROM Spare_Part sp
        LEFT JOIN Stock_Out so 
            ON sp.SparePartId = so.SparePartId
        GROUP BY 
            sp.SparePartId,
            sp.Name,
            sp.Category,
            sp.Quantity
        ORDER BY sp.Name ASC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
};


module.exports = {
    addStockIn,
    getAllStockIn,
    addStockOut,
    getAllStockOut,
    getStockOutById,
    updateStockOut,
    deleteStockOut,
    getDailyStockOutReport,
    getDailyStockStatus
};