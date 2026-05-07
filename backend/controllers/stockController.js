// ==============================
// WHAT DOES THIS FILE DO?
// ==============================
// This is the MANAGER for Stock
// He handles TWO things:
// 1. Stock In  → parts ARRIVING to store
// 2. Stock Out → parts LEAVING the store
//
// He also generates TWO reports:
// 1. Daily StockOut Report
// 2. Daily Stock Status Report
//
// Remember exam rules:
// StockIn  → INSERT only ✅
// StockOut → INSERT, SELECT, UPDATE, DELETE ✅

// ==============================
// STEP 1: IMPORT THE MODEL
// ==============================
// Call the stock worker
// and tell him to stand by
const stockModel = require('../models/stockModel');

// ============================================
// ============ STOCK IN FUNCTIONS ============
// ============================================

// ==============================
// FUNCTION 1: ADD STOCK IN
// ==============================
// Runs when someone fills the
// StockIn form and clicks SUBMIT
// Like the manager receiving
// a delivery from a truck
// and writing it in the arrivals book

const addStockIn = (req, res) => {

    // ----------------------------
    // STEP A: GET DATA FROM REACT
    // ----------------------------
    // Open the envelope from React
    // Get the spare part ID and
    // how many arrived and when
    const { SparePartId, StockInQuantity, StockInDate } = req.body;

    // ----------------------------
    // STEP B: VALIDATE THE DATA
    // ----------------------------
    // Check all fields are filled
    if (!SparePartId || !StockInQuantity || !StockInDate) {
        return res.status(400).json({
            success: false,
            message: '❌ All fields are required!'
        });
    }

    // ----------------------------
    // STEP C: VALIDATE NUMBERS
    // ----------------------------
    // Quantity must be more than zero
    // You cannot receive -5 brake pads!
    if (StockInQuantity <= 0) {
        return res.status(400).json({
            success: false,
            message: '❌ Quantity must be greater than 0!'
        });
    }

    // ----------------------------
    // STEP D: TELL WORKER TO SAVE
    // ----------------------------
    // Tell stock worker to save
    // this arrival in Stock_In table
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

            // ----------------------------
            // STEP E: SEND SUCCESS BACK
            // ----------------------------
            res.status(201).json({
                success: true,
                message: '✅ Stock In recorded successfully!',
                stockInId: result.insertId
            });
        }
    );
};

// ==============================
// FUNCTION 2: GET ALL STOCK IN
// ==============================
// Runs when React opens the
// StockIn page to show all arrivals
// Like reading the full arrivals book

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

// ============================================
// =========== STOCK OUT FUNCTIONS ============
// ============================================

// ==============================
// FUNCTION 3: ADD STOCK OUT
// ==============================
// Runs when someone fills the
// StockOut form and clicks SUBMIT
// Like writing in the departures book:
// "10 brake pads taken out today"
// We also get the logged in user ID
// from the session name tag

const addStockOut = (req, res) => {

    // ----------------------------
    // STEP A: GET DATA FROM REACT
    // ----------------------------
    const {
        SparePartId,
        StockOutQuantity,
        StockOutUnitPrice,
        StockOutDate
    } = req.body;

    // ----------------------------
    // STEP B: GET USER FROM SESSION
    // ----------------------------
    // Remember the name tag we gave
    // the user when they logged in?
    // req.session.user.userId = their ID
    // This records WHO took the parts out
    const UserId = req.session.user.userId;

    // ----------------------------
    // STEP C: VALIDATE THE DATA
    // ----------------------------
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

    // ----------------------------
    // STEP D: TELL WORKER TO SAVE
    // ----------------------------
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

// ==============================
// FUNCTION 4: GET ALL STOCK OUT
// ==============================
// Runs when React opens the
// StockOut page to show all records
// Like reading the full departures book

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

// ==============================
// FUNCTION 5: GET ONE STOCK OUT
// ==============================
// Runs when React needs to load
// ONE stock out record
// Usually to fill the UPDATE form
// Like finding one page in the
// departures book by its number

const getStockOutById = (req, res) => {

    // Get the ID from the URL
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

        // If nothing found with that ID
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

// ==============================
// FUNCTION 6: UPDATE STOCK OUT
// ==============================
// Runs when someone edits a
// stock out record and saves it
// Like erasing a page in the
// departures book and rewriting it
// ONLY StockOut can be updated
// exam rule ✅

const updateStockOut = (req, res) => {

    // ----------------------------
    // STEP A: GET ID FROM URL
    // ----------------------------
    const stockOutId = req.params.id;

    // ----------------------------
    // STEP B: GET NEW DATA FROM REACT
    // ----------------------------
    const {
        SparePartId,
        StockOutQuantity,
        StockOutUnitPrice,
        StockOutDate
    } = req.body;

    // ----------------------------
    // STEP C: GET USER FROM SESSION
    // ----------------------------
    // Record who made this update
    const UserId = req.session.user.userId;

    // ----------------------------
    // STEP D: VALIDATE DATA
    // ----------------------------
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

    // ----------------------------
    // STEP E: TELL WORKER TO UPDATE
    // ----------------------------
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

            // Check if anything was actually updated
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