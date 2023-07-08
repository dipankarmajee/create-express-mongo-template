const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");

const app = express();

// Middleware
app.use(morgan("dev"));
app.use(cors());
app.use(helmet());

// Routes
app.use("/api/users", require("../routes/userRoutes"));

module.exports = app;
