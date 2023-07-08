const mongoose = require("mongoose");

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  // ... other fields
});

const User = mongoose.model("User", userSchema);

module.exports = User;
