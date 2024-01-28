const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please give the name"],
  },
  email: {
    type: String,
    required: [true, "Please give the email"],
    unique: true,
    trim: true,
    // match: /^\S+@\S+\.\S+$/, // Regex for a simple email validation
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});
module.exports = User = mongoose.model("user", UserSchema);
