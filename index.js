require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const messageRoutes = require("./routes/messageRoutes");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.send("CLIPPER API WORKING");
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`conectado al puerto: ${PORT}`);
  });
}

module.exports = app;