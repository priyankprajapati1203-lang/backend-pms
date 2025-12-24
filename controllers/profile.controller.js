const ProfileModel = require("../models/profile.model");
const UserModel = require("../models/user.model");

module.exports.createProfile = async (req, res) => {
  try {
    // console.log("hy");
    const { fullname, phone, address } = req.body

    if (!fullname || !phone || !address) {
      return res.status(400).json({ message: "All fields are must be filled" })
    }

    if (req.user.profile) {
      return res.status(400).json({ message: "Profile already exists" });
    }

    const newProfile = await ProfileModel.create({
      fullname, phone, address, user: req.user.id
    })
    await UserModel.findByIdAndUpdate(req.user.id, { profile: newProfile.id })
    res.status(200).json({ message: "Profile has been created", newProfile })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message })
  }
}

module.exports.updateProfile = async (req, res) => {
  try {
    const { fullname, phone, address } = req.body
    if (!fullname || !phone || !address) {
      return res.status(400).json({ message: "All fields are must be filled" })
    }
    console.log(req.params.id);
    console.log("Received ID:", req.params.id);
    console.log("Body:", req.body);

    const updateProfile = await ProfileModel.findByIdAndUpdate(req.params.id, { $set: { fullname, phone, address } }, { new: true, runValidators: true })

    if (!updateProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.status(200).json({ message: "Profile has been updated", updateProfile })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message })
  }

}

module.exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);


    const profile = await ProfileModel.findOne({ user: userId }).populate({ path: 'user' });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
        exists: false
      });
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      exists: true,
      profile
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message
    });
  }
};
