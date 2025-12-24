const CommentModel = require("../models/comment.model");
const TaskModel = require("../models/task.model");

module.exports.createComment = async (req, res) => {
  try {
    // console.log("hy");
    const { comment } = req.body
    const taskId = req.params.id
    if (!taskId) {
      return res.status(400).json({ message: "This Id is not available" })
    }

    if (!comment) {
      return res.status(400).json({ message: "Comment is required" })
    }

    const newComment = await CommentModel.create({
      user: req.user.id,
      task: taskId,
      comment
    })

    const tasks = await TaskModel.findById(taskId)

    tasks.comment.push(newComment)
    await tasks.save()
    res.status(200).json({ message: "New comment has created ", newComment })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message })
  }
}

module.exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params

    const delComment = await CommentModel.findOne({
      _id: id,
      isDeleted: false
    }).populate('user')
    if (!delComment) {
      return res.status(404).json({
        message: "Project not found for this project or already deleted"
      });
    }
    console.log(req.user.id);


    const userId = delComment.user.some((u) => u.id === req.user.id)
    console.log(userId);


    if (!userId) {
      return res.status(400).json({ message: "You are not allowed to delete this" })
    }
    delComment.isDeleted = true,
      delComment.deleteAt = Date.now()

    await delComment.save()
    res.status(200).json({ message: " Comment has deleted ", delComment })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message })
  }
}


module.exports.getCommentById = async (req, res) => {

  try {
    const commentId = req.params.id

    const comment = await CommentModel.findById(commentId).populate({ path: 'user' }).populate({ path: 'task' })

    res.status(200).json({ message: "Data", comment })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message })
  }


}


module.exports.getAllComment = async (req, res) => {
  const comment = await CommentModel.find()
  res.status(200).json({ message: "Al  comment", comment })

}