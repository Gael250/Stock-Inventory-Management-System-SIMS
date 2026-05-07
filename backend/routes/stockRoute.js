const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');
const isAuthenticated = require('../middleware/authMiddleware');

router.post('/in/add', isAuthenticated, stockController.addStockIn);
router.get('/in/all', isAuthenticated, stockController.getAllStockIn);
router.post('/out/add', isAuthenticated, stockController.addStockOut);
router.get('/out/all', isAuthenticated, stockController.getAllStockOut);
router.get('/out/find/:id', isAuthenticated, stockController.getStockOutById);
router.put('/out/update/:id', isAuthenticated, stockController.updateStockOut);
router.delete('/out/delete/:id', isAuthenticated, stockController.deleteStockOut);

router.get('/out/report/daily', isAuthenticated, stockController.getDailyStockOutReport);
router.get('/report/status', isAuthenticated, stockController.getDailyStockStatus);

module.exports = router;