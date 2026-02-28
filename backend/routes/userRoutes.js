const express = require('express');
const {
  getProfile,
  updateProfile,
  getMyTransactions,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getDashboardStats
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.route('/profile') // User Profile Routes (Regular Users)
  .get(protect, getProfile)
  .put(protect, updateProfile);

router.get('/transactions', protect, getMyTransactions); // transactions for the logged-in user

router.get('/stats', protect, admin, getDashboardStats); // Dashboard Stats Routes (Admin Only)

router.get('/dashboard/stats', protect, admin, getDashboardStats); // Dashboard Stats Routes (Admin Only)

router.route('/') // Get All Users (Admin Only)
  .get(protect, admin, getUsers);

router.route('/:id')  // Get/Update/Delete Specific User (Admin Only)
  .get(protect, admin, getUser)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

module.exports = router; 