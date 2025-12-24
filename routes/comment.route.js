const express = require('express');
const { createComment, deleteComment, getCommentById, getAllComment } = require('../controllers/comment.controller');
const { protect } = require('../middleware/protect');
const { authRoles } = require('../middleware/authRoles');
const router = express.Router()


router.post('/create-comment/:id', protect, authRoles(['Employee']), createComment)
router.get('/', protect, getAllComment)
router.get('/:id', protect, getCommentById)
router.delete('/:id', protect, authRoles(['Employee']), deleteComment)


module.exports = router
