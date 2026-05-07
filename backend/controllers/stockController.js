const stockModel = require('../models/stockModel');

const addStockIn = (req, res) => {

    const { SparePartId, StockInQuantity, StockInDate } = req.body;

    if (!SparePartId || !StockInQuantity || !StockInDate) {
        return res.status(400).json({
            success: false,
            message: '❌ All fields are required!'
        });
    }

    if (StockInQuantity <= 0) {
        return res.status(400).json({
            success: false,
            message: '❌ Quantity must be greater than 0!'
        });
    }

    stockModel.addStockIn(
        { SparePartId, StockInQuantity, StockInDate },
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: '❌ Failed to record stock in!',
                    error: err.message
                });
            }


            res.status(201).json({
                success: true,
                message: '✅ Stock In recorded successfully!',
                stockInId: result.insertId
            });
        }
    );
};


const getAllStockIn = (req, res) => {

    stockModel.getAllStockIn((err, results) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: '❌ Failed to get stock in records!',
                error: err.message
            });
        }

        res.status(200).json({
            success: true,
            message: '✅ Stock In records retrieved!',
            count: results.length,
            data: results
        });
    });
};


const addStockOut = (req, res) => {

    const {
        SparePartId,
        StockOutQuantity,
        StockOutUnitPrice,
        StockOutDate
    } = req.body;


    const UserId = req.session.user.userId;

    if (!SparePartId || !StockOutQuantity ||
        !StockOutUnitPrice || !StockOutDate) {
        return res.status(400).json({
            success: false,
            message: '❌ All fields are required!'
        });
    }

    if (StockOutQuantity <= 0 || StockOutUnitPrice <= 0) {
        return res.status(400).json({
            success: false,
            message: '❌ Quantity and Price must be greater than 0!'
        });
    }

    stockModel.addStockOut(
        {
            SparePartId,
            UserId,
            StockOutQuantity,
            StockOutUnitPrice,
            StockOutDate
        },
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: '❌ Failed to record stock out!',
                    error: err.message
                });
            }

            res.status(201).json({
                success: true,
                message: '✅ Stock Out recorded successfully!',
                stockOutId: result.insertId
            });
        }
    );
};


const getAllStockOut = (req, res) => {

    stockModel.getAllStockOut((err, results) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: '❌ Failed to get stock out records!',
                error: err.message
            });
        }

        res.status(200).json({
            success: true,
            message: '✅ Stock Out records retrieved!',
            count: results.length,
            data: results
        });
    });
};


const getStockOutById = (req, res) => {

    
    const stockOutId = req.params.id;

    if (!stockOutId) {
        return res.status(400).json({
            success: false,
            message: '❌ Stock Out ID is required!'
        });
    }

    stockModel.getStockOutById(stockOutId, (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: '❌ Failed to find stock out record!',
                error: err.message
            });
        }

        if (!result) {
            return res.status(404).json({
                success: false,
                message: '❌ Stock Out record not found!'
            });
        }

        res.status(200).json({
            success: true,
            message: '✅ Stock Out record found!',
            data: result
        });
    });
};


const updateStockOut = (req, res) => {


    const stockOutId = req.params.id;


    const {
        SparePartId,
        StockOutQuantity,
        StockOutUnitPrice,
        StockOutDate
    } = req.body;

    const UserId = req.session.user.userId;

    if (!SparePartId || !StockOutQuantity ||
        !StockOutUnitPrice || !StockOutDate) {
        return res.status(400).json({
            success: false,
            message: '❌ All fields are required!'
        });
    }

    if (StockOutQuantity <= 0 || StockOutUnitPrice <= 0) {
        return res.status(400).json({
            success: false,
            message: '❌ Quantity and Price must be greater than 0!'
        });
    }

    stockModel.updateStockOut(
        stockOutId,
        {
            SparePartId,
            UserId,
            StockOutQuantity,
            StockOutUnitPrice,
            StockOutDate
        },
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: '❌ Failed to update stock out!',
                    error: err.message
                });
            }

            
            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: ' Stock Out record not found!'
                });
            }

            res.status(200).json({
                success: true,
                message: ' Stock Out updated successfully!'
            });
        }
    );
};


const deleteStockOut = (req, res) => {

    
    const stockOutId = req.params.id;

    stockModel.deleteStockOut(stockOutId, (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: ' Failed to delete stock out!',
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: ' Stock Out record not found!'
            });
        }

        res.status(200).json({
            success: true,
            message: ' Stock Out deleted successfully!'
        });
    });
};


const getDailyStockOutReport = (req, res) => {

    stockModel.getDailyStockOutReport((err, results) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: ' Failed to generate daily report!',
                error: err.message
            });
        }

        const today = new Date().toISOString().split('T')[0];

        res.status(200).json({
            success: true,
            message: ` Daily StockOut Report for ${today}`,
            date: today,
            count: results.length,
            data: results
        });
    });
};


const getDailyStockStatus = (req, res) => {

    stockModel.getDailyStockStatus((err, results) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: ' Failed to generate stock status!',
                error: err.message
            });
        }

        const today = new Date().toISOString().split('T')[0];

        res.status(200).json({
            success: true,
            message: ` Daily Stock Status Report for ${today}`,
            date: today,
            count: results.length,
            data: results
        });
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