const express = require('express');
const { getUsers, updateUserStatus, getAdminMetrics } = require('./user.controller');
const { protect, authorize } = require('../../middlewares/auth.middleware');

const router = express.Router();

// All routes here are for admin only
router.use(protect);
router.use(authorize('admin'));

router.route('/metrics').get(getAdminMetrics);
router.route('/').get(getUsers);
router.route('/:id/status').put(updateUserStatus);

module.exports = router;
