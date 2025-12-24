const express = require('express');
const { createMileStone, getMileStone, deleteMileStone, getMileStoneById } = require('../controllers/mileStone.controller');
const { protect } = require('../middleware/protect');
const { authRoles } = require('../middleware/authRoles');
const router = express.Router()


router.post('/create-milestone/:id', protect, authRoles(['Project Manager']), createMileStone)
router.get('/:id', protect, authRoles(['Admin', 'Project Manager', 'Client']), getMileStoneById)
router.get('/', protect, authRoles(['Admin', 'Project Manager', 'Client']), getMileStone)
router.delete('/:mileId', protect, authRoles(["Project Manager"]), deleteMileStone)



module.exports = router

