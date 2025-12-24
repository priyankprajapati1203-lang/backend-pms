const express = require('express');
const { createUser, userLogin, getAllUsers, logoutUser, getUserById } = require('../controllers/user.controller');
const { protect } = require('../middleware/protect');
const { authRoles } = require('../middleware/authRoles');

const router = express.Router()

router.post('/register', createUser)
router.post('/login', userLogin)
router.post('/logout', protect, logoutUser)
router.get('/:id', protect, authRoles(['Admin']), getUserById)
router.get('/', protect, authRoles(['Admin', "Team Leader"]), getAllUsers)




module.exports = router