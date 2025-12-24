const MileStoneModel = require("../models/milestone.model")
const ProjectModel = require("../models/project.model")
const UserModel = require("../models/user.model")


module.exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body

    if (!name || !description) {
      return res.status(400).json({ message: "All field must be required" })
    }

    const newProject = await ProjectModel.create({
      name, description, createdBy: req.user.id
    })
    res.status(200).json({ message: "Project created", newProject })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong ", error: error.message })
  }
}

module.exports.getProject = async (req, res) => {
  const projects = await ProjectModel.find()
  res.status(200).json({ message: "All Projects", projects })
}

module.exports.getAllProjectProgress = async (req, res) => {
  const projects = await ProjectModel.find()
  const users = await UserModel.find()
  const totalUser = users.filter((u) => u.role !== 'Admin').length
  const totalProjects = projects.length
  const inProgress = projects.filter((u) => u.status === "In-progress").length
  const completed = projects.filter((u) => u.status === "Completed").length
  const pending = projects.filter((u) => u.status === "Not started").length
  console.log(pending);

  res.status(200).json({ message: "All Projects", inProgress, pending, completed, totalUser, totalProjects })
}


module.exports.assignProject = async (req, res) => {


  try {
    const id = req.params.id
    const { userId } = req.body
    console.log(userId);
    console.log(id);


    if (!userId) {
      return res.status(404).json({ message: "User no found" })
    }
    const user = await UserModel.findById(userId)
    console.log(user.role);

    if (user.role !== "Project Manager") {
      return res.status(400).json({ message: "Sorry you are not Projcet Manager" })
    }
    const project = await ProjectModel.findById(id).populate('createdBy')



    project.assignTo = user.id

    await project.save()

    res.status(200).json({ message: `Project is assign to this user:${user.id}` })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message })
  }
}

module.exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params
    console.log(id);

    const userId = req.user.id

    console.log("User", userId);


    if (!id) {
      return res.status(404).json({ message: "Not id found" })
    }

    const project = await ProjectModel.findOne({
      _id: id,
      isDeleted: false
    }).populate("createdBy");

    console.log(project.createdBy);


    if (userId !== project.createdBy._id.toString()) {
      return res.status(404).json({ message: "You Are not Allow to delete this project because you have not created this" })

    }

    if (!project) {
      return res.status(404).json({
        message: "Project not found for this project or already deleted"
      });
    }

    project.isDeleted = true;
    project.deleteAt = Date.now();
    await project.save();


    res.status(200).json({ message: "Project is deleted Successfully", project })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message })
  }

}

module.exports.progressById = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await ProjectModel.findById(id)
      .populate({
        path: 'mileStone',
        populate: {
          path: 'task',
          select: 'name status'
        }
      })
      .populate('createdBy')
      .populate('assignTo',);

    if (!project) return res.status(404).json({ error: "Project not found" });

    let totalTasks = 0;
    let completedTasks = 0;
    let inProgress = 0
    project.mileStone.map(ms => {
      if (ms.task && ms.task.length > 0) {
        totalTasks += ms.task.length;
        completedTasks += ms.task.filter(t => t.status === 'Completed').length;
        inProgress += ms.task.filter((t) => t.status === "In-progress").length
      }
    });

    let progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const report = {
      _id: project._id,
      projectName: project.name,
      description: project.description,
      status: project.status,
      startDate: project.startDate,
      endDate: project.endDate,
      createdBy: project.createdBy,
      assignedTo: project.assignTo,
      totalTasks,
      completedTasks,
      inProgress,
      progressPercent,
      milestones: project.mileStone
    };

    res.status(200).json({ message: "Progress Report", report });

  } catch (error) {

    res.status(500).json({ error: "Something went wrong" });
  }
}