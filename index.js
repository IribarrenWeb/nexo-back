require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();
const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL || "localhost:27017/clipperapp";

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/messages", messageRoutes);

mongoose
  .connect(DB_URL)
  .then(() => console.log("conectado a la db"))
  .catch((error) => console.log("error al conectar a la db:", error));

app.listen(PORT, () => {
  console.log(`conectado al puerto: ${PORT}`);
});
