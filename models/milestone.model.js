const { default: mongoose } = require("mongoose");
const ProjectModel = require("./project.model");

const mileStoneSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProjectModel"
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  dueDate: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel"
  },

  task: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "TaskModel"
  }],
  isDeleted: { type: Boolean, default: false },
  deleteAt: { type: Date }
}, { timestamps: true })


mileStoneSchema.pre("save", async function (next) {
  if (!this.dueDate) {
    const project = await ProjectModel.findById(this.project)

    if (project && project.startDate) {
      const due = new Date(project.startDate)
      due.setDate(due.getDate() + 10)
      this.dueDate = due
    }
  }
  next()
})


const MileStoneModel = mongoose.model("MileStoneModel", mileStoneSchema)

module.exports = MileStoneModel