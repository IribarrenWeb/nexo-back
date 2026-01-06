require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const messageRoutes = require("./routes/messageRoutes");
const authRoutes = require("./routes/authRoutes");

const PORT = process.env.PORT || 3000;
const cors = require("cors")

const app = express();

app.use(cors());
app.use(express.json());
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/auth", authRoutes)

app.get("/", (req, res) => {
  res.send("NEXO API WORKING");
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`conectado al puerto: ${PORT}`);
  });
}

module.exports = app;