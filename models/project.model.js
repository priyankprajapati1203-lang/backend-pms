const { default: mongoose } = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Not started', 'In-progress', 'Completed'],
    default: "Not started",
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel"
  },
  assignTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel"
  },
  mileStone: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "MileStoneModel"
  }],
  isDeleted: { type: Boolean, default: false },
  deleteAt: { type: Date }
}, { timestamps: true })


const ProjectModel = mongoose.model("ProjectModel", projectSchema)

module.exports = ProjectModel