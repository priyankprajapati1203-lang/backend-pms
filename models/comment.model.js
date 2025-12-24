const { default: mongoose } = require("mongoose");

const commentSchema = new mongoose.Schema({
  user: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel"
  }],
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TaskModel",
  },
  comment: {
    type: String,
    required: true
  },
  isDeleted: { type: Boolean, default: false },
  deleteAt: { type: Date }

}, { timestamps: true })


const CommentModel = mongoose.model("CommentModel", commentSchema)

module.exports = CommentModel