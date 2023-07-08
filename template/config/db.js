require("dotenv").config();
const mongoose = require("mongoose");

const dbURI = process.env.DB_URI; // Accessing DB_URI from environment variables

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  });
