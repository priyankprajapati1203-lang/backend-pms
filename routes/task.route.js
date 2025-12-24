
const express = require('express');
const { createTask, getTasks, assignTask, updateStatus, deleteTask, getTaskById, getTasksOlyAssignUser } = require('../controllers/task.controller');
const { protect } = require('../middleware/protect');
const { authRoles } = require('../middleware/authRoles');

const router = express.Router()


router.post('/create-task/:id', protect, authRoles(["Project Manager"]), createTask)
router.get('/mytasks', protect, authRoles(["Employee"]), getTasksOlyAssignUser)
router.get('/', getTasks)
router.get('/:id', protect, authRoles(['Team Leader', "Project Manager", "Employee"]), getTaskById)

router.post('/:id/assign-task', protect, authRoles(['Team Leader']), assignTask)
router.post('/:mileId/update-status/:taskId', protect, authRoles(['Employee']), updateStatus)
router.delete('/:id', protect, authRoles(["Project Manager"]), deleteTask)
module.exports = router