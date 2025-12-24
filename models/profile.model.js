const { default: mongoose } = require("mongoose");

const profileSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel"
  }

}, { timestamps: true })

const ProfileModel = mongoose.model("ProfileModel", profileSchema)

module.exports = ProfileModel


