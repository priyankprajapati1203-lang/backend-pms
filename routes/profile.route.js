
const express = require('express');
const { createProfile, updateProfile, getProfile } = require('../controllers/profile.controller');
const { protect } = require('../middleware/protect')
const router = express.Router()

router.post('/create-profile', protect, createProfile)
router.patch('/update-profile/:id', protect, updateProfile)
router.get('/', protect, getProfile)



module.exports = router