const express = require('express');
const { createProject, getProject, getAllUsers, assignProject, deleteProject, getAllProjectProgress, progressById } = require('../controllers/project.controller');
const { authRoles } = require('../middleware/authRoles');
const { protect } = require('../middleware/protect');

const router = express.Router()

router.post("/create-project", protect, authRoles(["Admin"]), createProject)
router.get('/', protect, authRoles(["Admin", "Client", "Project Manager"]), getProject)
router.get('/progress', protect, authRoles(["Admin", "Client", "Project Manager"]), getAllProjectProgress)
router.get("/:id", protect, authRoles(["Admin", "Client", "Project Manager"]), progressById)
router.post('/:id/assign', protect, authRoles(["Admin"]), assignProject)
router.delete('/:id', protect, authRoles(["Admin"]), deleteProject)

module.exports = router