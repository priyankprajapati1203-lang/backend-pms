const MileStoneModel = require("../models/milestone.model")
const ProjectModel = require("../models/project.model")
const TaskModel = require("../models/task.model")
const UserModel = require("../models/user.model")

module.exports.createTask = async (req, res) => {
  try {
    const { name, description } = req.body
    const mileId = req.params.id
    console.log(mileId);

    if (!name || !description) {
      return res.status(400).json({ message: "All fields must require" })
    }
    const newTask = await TaskModel.create({
      name, description, mileStone: mileId, createdBy: req.user.id
    })
    const mileStone = await MileStoneModel.findById(mileId)
    mileStone.task.push(newTask)

    await mileStone.save()
    res.status(200).json({ message: "New task has created", newTask })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message })
  }
}

module.exports.getTasks = async (req, res) => {
  try {
    const tasks = await TaskModel.find().populate('comment').populate('mileStone').populate('assignTo')
    res.status(200).json({ message: "All tasks", tasks })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message })
  }
}
module.exports.getTaskById = async (req, res) => {
  try {
    const id = req.params.id
    const task = await TaskModel.findById(id).populate({
      path: "comment",
      populate: {
        path: "user",
        select: "username email"
      }
    })
      .populate({
        path: "assignTo",
        select: "username email"
      })
      .populate("mileStone")
      .populate('createdBy')
    res.status(200).json({ message: "All tasks", task })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message })
  }

}

module.exports.assignTask = async (req, res) => {
  try {
    console.log("hy");
    const { userId } = req.body
    const { id } = req.params
    console.log(id);
    console.log(userId);


    if (!userId) {
      return res.status(404).json({ message: "There is no user " })
    }
    const user = await UserModel.findById(userId)
    console.log(user);


    const task = await TaskModel.findById(id)
    if (!task) {
      return res.status(400).json({ message: "There is no tak available" })
    }

    task.assignTo = user.id
    await task.save()

    res.status(200).json({ message: `Task assign to this emplyee ${user.id}` })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong ", error: error.message })
  }

}


// module.exports.updateStatus = async (req, res) => {
//   try {
//     const { mileId, taskId } = req.params
//     // console.log(mileId);
//     console.log(taskId);


//     const { status } = req.body



//     const taskStatus = await TaskModel.findById(taskId).populate("assignTo")
//     // console.log("assign", taskStatus.assignTo.id);
//     // console.log(req.user.id);


//     if (!taskStatus) {
//       return res.status(404).json({ message: "Task not found" })
//     }

//     if (taskStatus.assignTo.role !== "Employee" || taskStatus.assignTo.id !== req.user.id) {
//       return res.status(404).json({ message: "Only employees can update status" })
//     }

//     taskStatus.status = status

//     await taskStatus.save()
//     const mileStone = await MileStoneModel.findById(mileId).populate('project').populate('task')
//     if (mileStone.task.every(t => t.status === "Completed")) {
//       mileStone.status = "Completed";
//       console.log(mileStone.status);

//     } else if (mileStone.task.some(t => t.status === "In-progress")) {
//       mileStone.status = "In-progress";
//     } else {
//       mileStone.status = "Not started";
//     }

//     await mileStone.save();



//     if (!mileStone) {
//       return res.status(404).json({ message: "Not found" })
//     }

//     // console.log(mileStone.project);

//     const project = await ProjectModel.findById(mileStone.project)
//     // console.log(project);

//     if (status === "In-progress" && !project.startDate) {

//       project.startDate = new Date()

//       const end = new Date()
//       end.setDate(end.getDate() + 25)
//       project.endDate = end
//     }
//     project.status = status
//     await project.save()




//     // console.log("status", milestoneTasks);
//     console.log("milestone", mileStone);
//     console.log("milestoneTask", mileStone.task);

//     // const hey = milestoneTasks.every(t => t.status === "Completed")
//     // console.log(hey);




//     // console.log("Tasks found for milestone:", milestoneTasks.length);

//     // await mileStone.save()
//     res.status(200).json({
//       message: "Task status updated and project start date handled", taskStatus

//     });
//   } catch (error) {
//     res.status(500).json({ message: "Something went wrong", error: error.message })
//   }
// }

module.exports.updateStatus = async (req, res) => {
  try {
    const { mileId, taskId } = req.params;
    const { status } = req.body;



    const task = await TaskModel.findById(taskId).populate("assignTo");
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }


    if (
      !task.assignTo ||
      task.assignTo.role !== "Employee" ||
      task.assignTo._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Only assigned employee can update status" });
    }


    task.status = status;
    await task.save();


    const milestone = await MileStoneModel.findById(mileId)
      .populate({
        path: 'task',
        populate: { path: 'assignTo' }
      })
      .populate('project');

    if (!milestone) {
      return res.status(404).json({ message: "Milestone not found" });
    }

    // const allCompleted = milestone.task.every(t => t.status === "Completed");
    // const anyInProgress = milestone.task.some(t => t.status === "In-progress");

    // if (allCompleted) {
    //   milestone.status = "Completed";
    //   if (!milestone.endDate) {
    //     milestone.endDate = new Date()
    //   }
    // }
    // milestone.status = "Completed";
    // else if (anyInProgress) milestone.status = "In-progress";
    // else milestone.status = "Not started";

    await milestone.save();

    const project = await ProjectModel.findById(milestone.project._id)
      .populate({
        path: 'mileStone',
        populate: {
          path: 'task'
        }
      });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const allProjectTasks = project.mileStone.flatMap(m => m.task);
    const allProjCompleted = allProjectTasks.every(t => t.status === "Completed");
    const anyProjInProgress = allProjectTasks.some(t => t.status === "In-progress");

    if (allProjCompleted) {
      project.status = "Completed";

      if (!project.endDate) {
        project.endDate = new Date()
      }
    }
    else if (anyProjInProgress) project.status = "In-progress";
    else project.status = "In-progress";


    if (!project.startDate && anyProjInProgress) {
      project.startDate = new Date();

    }

    await project.save();

    return res.status(200).json({
      message: "Status updated successfully",
      task: { id: task._id, status: task.status },
      milestone: { id: milestone._id, status: milestone.status },
      project: { id: project._id, status: project.status, startDate: project.startDate }
    });

  } catch (error) {
    console.error("Update status error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
module.exports.getTasksOlyAssignUser = async (req, res) => {
  try {
    const userId = req.user.id

    const tasks = await TaskModel.find({ assignTo: userId }).populate('assignTo')
    console.log(tasks);
    res.status(200).json({ tasks })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message })

  }


}

module.exports.deleteTask = async (req, res) => {

  try {
    const { id } = req.params
    const deleteTask = await TaskModel.findOne({
      _id: id,
      isDeleted: false
    }).populate('createdBy')
    if (!deleteTask) {
      return res.status(404).json({
        message: "Task not found for this project or already deleted"
      });
    }

    console.log(deleteTask);

    if (req.user.id !== deleteTask.createdBy._id.toString()) {
      return res.status(404).json({ message: "You Are not Allow to delete this task because you have not created this" })
    }

    deleteTask.isDeleted = true,
      deleteTask.deleteAt = Date.now()
    await deleteTask.save()
    res.status(200).json({ message: "Task is deleted Successfully", deleteTask })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message })

  }
}