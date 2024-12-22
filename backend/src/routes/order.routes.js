const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authMiddleware);

// User routes
router.post('/', orderController.createOrder);
router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrder);

// Admin routes
router.put('/:id/status', adminMiddleware, orderController.updateOrderStatus);

module.exports = router;