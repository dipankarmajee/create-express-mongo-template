const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

// Middleware
app.use(morgan("dev"));
app.use(cors());

// Routes
app.use("/api/users", require("../routes/userRoutes"));

module.exports = app;
