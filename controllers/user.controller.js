const UserModel = require("../models/user.model");
const { generateToken } = require("../utiles/generateToken");


module.exports.createUser = async (req, res) => {
  try {
    const { username, email, password, role, developer } = req.body
    console.log(req.body);

    const emailExists = await UserModel.findOne({ email })

    if (emailExists) {
      return res.status(400).json({ message: "Email is already exists" })
    }

    const newUser = await UserModel.create({
      username, email, password, role, developer
    })
    generateToken(newUser, res)
    res.status(200).json({ message: "User is created successfully", newUser })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message })
  }
}

module.exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body
    console.log("Incoming login:", req.body);


    const userExists = await UserModel.findOne({ email })

    if (!userExists) {
      return res.status(400).json({ message: "No any user exists" })
    }
    const checkPassword = await userExists.isPasswordCheck(password)

    if (!checkPassword) {
      return res.status(400).json({ message: "Invalid password" })
    }
    const token = await generateToken(userExists, res)
    console.log(token);

    res.status(200).json({ message: "Login successfully", token, userExists })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message })
  }
}

module.exports.logoutUser = async (req, res) => {
  try {
    res.cookie('JWT_Token', '', {
      httpOnly: true,
      expires: new Date(0),
    })
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message })
  }

}
module.exports.getAllUsers = async (req, res) => {
  const users = await UserModel.find().populate("profile")
  res.status(200).json({ message: "All Users", users })

}

module.exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id

    const user = await UserModel.findById(userId).populate({ path: 'profile' })

    console.log(user);

    res.status(200).json({ message: "Users", user })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error })
  }


}