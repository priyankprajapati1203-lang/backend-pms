
const { configDotenv } = require("dotenv");
const express = require("express");
const cors = require('cors');
const { default: mongoose } = require("mongoose");
const app = express()
const userRoutes = require('./routes/user.route')
const profileRoutes = require('./routes/profile.route');
const projectRoutes = require('./routes/project.route')
const mileStoneRoutes = require('./routes/mileStone.route')
const taskRoutes = require('./routes/task.route')
const commentRoutes = require('./routes/comment.route');
const cookieParser = require("cookie-parser");
configDotenv()


mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("Database has connectd successfully"))
  .catch((err) => console.log("something went wrong", err))


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


const corUrl = {
  origin: 'https://frontend-pms-indol.vercel.app/',
  credentials: true
}
app.use(cors(corUrl))

app.use('/users', userRoutes)
app.use('/profile', profileRoutes)
app.use('/project', projectRoutes)
app.use('/milestone', mileStoneRoutes)
app.use('/task', taskRoutes)
app.use('/comment', commentRoutes)

app.listen(process.env.PORT, () => {
  console.log("I am listening");

})