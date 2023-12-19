const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const multer = require("multer");
const cors = require("cors");

const productRouter = require("./routes/products");

const PORT = 4000;

app.use(cors());
// Use the cors middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api", productRouter);

app.listen(PORT, () => {
  console.log("Backend Server Running");
});
