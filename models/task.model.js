const { default: mongoose } = require("mongoose");

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  assignTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel"
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel"
  },

  status: {
    type: String,
    enum: ['Not started', 'In-progress', 'Completed'],
    default: "Not started",
    required: true
  },
  comment: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "CommentModel"
  }],
  mileStone: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MileStoneModel'
  },
  startDate: { type: Date },
  endDate: { type: Date },
  isDeleted: { type: Boolean, default: false },
  deleteAt: { type: Date }
}, { timestamps: true })

taskSchema.pre('save', async function (next) {
  if (this.status === "In-progress" && !this.startDate) {
    this.startDate = new Date()
    const end = new Date(this.startDate)
    end.setDate(end.getDate() + 15)
    this.endDate = end
  }
  next()

})

const TaskModel = mongoose.model("TaskModel", taskSchema)


module.exports = TaskModel