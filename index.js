require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");

const userRoutes = require("./routes/user-routes");
const postRoutes = require("./routes/post-routes");
const commentRoutes = require("./routes/comment-routes");
const messageRoutes = require("./routes/message-routes");
const authRoutes = require("./routes/auth-routes");

const PORT = process.env.PORT || 3000;
const cors = require("cors");
const { seeder } = require("./utils/seeder");

const app = express();

// funcion seeder
const seedUsers = async () => {
  await connectDB(); // obtenemos la conexion a la db
  seeder();
}

seedUsers(); // ejecutamos el seeder apenas inicia la app

app.use(cors());
app.use(express.json());
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// rutas api
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/auth", authRoutes)

// ruta base
app.get("/", (req, res) => {
  res.send("NEXO API WORKING");
});


// condicional para entorno de desarrollo
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`conectado al puerto: ${PORT}`);
  });
}

module.exports = app; // exportamos app para compatibilidad en vercel