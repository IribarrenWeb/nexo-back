require("dotenv").config();

const mongoose = require("mongoose");
let isConnected = false;

const DB_URL = process.env.DB_URL || "mongodb://localhost:27017/nexodb";

const connectDB = async () => {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(DB_URL);
    isConnected = db.connections[0].readyState;
    console.log("nueva conexion a la db");
  } catch (error) {
    console.log("error conectando", error);
  }
};

module.exports = connectDB;
