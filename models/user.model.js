const { default: mongoose } = require("mongoose");
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Admin', 'Project Manager', 'Team Leader', 'Employee', 'Client'],
    default: "Employee",
    required: true
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProfileModel"
  },
  developer: {
    type: String,
    enum: ["Frontend Developer",
      "Backend Developer",
      "Full Stack Developer",
      "UI/UX Designer",
      "QA Engineer",
      "DevOps Engineer",
      "Mobile Developer"]
  }
}, {
  timestamps: true
})

userSchema.pre('save', async function (next) {
  if (!this.isModified()) next()

  this.password = await bcrypt.hash(this.password, 10)
  next()
})
userSchema.methods.isPasswordCheck = async function (password) {
  return await bcrypt.compare(password, this.password)
}

const UserModel = mongoose.model('UserModel', userSchema)

module.exports = UserModel