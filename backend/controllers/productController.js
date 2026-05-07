const productModel = require('../models/productModel');
const addSparePart = (req, res) => {
    const { Name, Category, Quantity, UnitPrice} = req.body;

    if (!Name || ! Category || !Quantity || !UnitPrice) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required!'
        });
    }

    if (Quantity <= 0 || UnitPrice <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Quantity and UnitPrice must be Greater than 0!'
        });
    }

    productModel.addSparePart(
        { Name, Category, Quantity, UnitPrice },
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to add spare part!',
                    error: err.message
                });
            }

            res.status(201).json({
                success: true,
                message:'Spare part added successfully!',
                sparePartId: result.insertId
            });
        }
    );

};
const getAllSpareParts = (req, res) => {
    productModel.getAllSpareParts((err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Failed to get spare parts!',
                error: err.message
            });
        }

        res.status(200).json({
            success: true,
            message: 'Spare parts retrieves successfully!',
            count: results.length,
            data: results
        });
    });
};

const getSparePartById = (req, res) => {
    const sparePartId = req.params.id;

    if (!sparePartId) {
        return res.status(400).json({
            success: false,
            message: 'Spare part Id is required!'
        });
    }

    productModel.getSparePartById(sparePartId, (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Failed to find spare part!',
                error: err.message
            });
        }

        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Spare part not found!'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Spare part found!',
            data: result
        });
    });
};

const updateSparePart = (req, res) => {
    const sparePartId = req.params.id;
    const { Name, Category, Quantity, UnitPrice } = req.body;

    if (!Name || !Category || !Quantity || !UnitPrice) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required!'
        });
    }
    productModel.updateSparePart(
        sparePartId,
        { Name, Category, Quantity, UnitPrice },
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to  update spare part!',
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Spare part not found!'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Spare part updated successfully!'
            });
        }
    );
};

const deleteSparePart = (req, res) => {
    const sparePartId = req.params.id;
    productModel.deleteSparePart(sparePartId, (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Failed to delete spare part!',
                error: err.message
            });
        }
        res.status(200).json({
            success: true,
            message: 'Spare part deleted successfully!'
        });
    });
};

module.exports = {
    addSparePart,
    getAllSpareParts,
    getSparePartById,
    updateSparePart,
    deleteSparePart
};