const MileStoneModel = require("../models/milestone.model")
const ProjectModel = require("../models/project.model")


module.exports.createMileStone = async (req, res) => {
  try {
    // console.log("hy");
    console.log('hy');
    const { name, description } = req.body
    const projectId = req.params.id

    if (!projectId) {
      return res.status(400).json({ message: "There is no project Id" })
    }

    const newMilestone = await MileStoneModel.create({
      name, description, project: projectId, createdBy: req.user.id
    })
    const project = await ProjectModel.findById(projectId).populate('assignTo')
    project.mileStone.push(newMilestone)
    console.log(project.assignTo);
    if (!project.assignTo) {
      return res.status(400).json({ message: "This project is not assigned by admin" });
    }





    await project.save()
    res.status(200).json({ message: "MileStone is created", newMilestone })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong ", error: error.message })
  }

}

module.exports.getMileStoneById = async (req, res) => {
  try {
    const id = req.params.id
    console.log(id);

    const milestone = await MileStoneModel.findById(id).populate({ path: 'project' }).populate({
      path: 'task',
      populate: ({ path: 'createdBy' })
    })
    console.log(milestone);

    res.status(200).json({ message: "Show milestone", milestone })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong ", error: error.message })
  }
}


module.exports.getMileStone = async (req, res) => {
  try {
    const getMilestone = await MileStoneModel.find()
      .populate({ path: 'project' })



    res.status(200).json({ message: "Show milestone", getMilestone })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong ", error: error.message })
  }
}

module.exports.deleteMileStone = async (req, res) => {
  console.log("hy");

  try {

    const { mileId } = req.params
    console.log(mileId);

    const userId = req.user.id
    console.log(userId);

    const milestone = await MileStoneModel.findOne({
      _id: mileId,

      isDeleted: false
    }).populate('createdBy')
    console.log(milestone);
    if (!milestone) {
      return res.status(404).json({
        message: "Milestone not found for this project or already deleted"
      });
    }
    if (userId !== milestone.createdBy._id.toString()) {

      return res.status(404).json({ message: "You Are not Allow to delete this milestone because you have not created this" })
    }



    milestone.isDeleted = true;
    milestone.deleteAt = Date.now();
    await milestone.save();
    res.status(200).json({ message: "Deleted successfully", milestone })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong ", error: error.message })
  }
}