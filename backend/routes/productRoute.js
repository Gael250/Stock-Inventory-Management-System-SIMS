const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const isAuthenticated = require('../middleware/authMiddleware');

router.post('/add', isAuthenticated, productController.addSparePart);
router.get('/all', isAuthenticated, productController.getAllSpareParts);
router.get('/find/:id', isAuthenticated, productController.getSparePartById);
router.put('/update/:id', isAuthenticated, productController.updateSparePart);
router.delete('/delete/:id', isAuthenticated, productController.deleteSparePart);

module.exports = router;