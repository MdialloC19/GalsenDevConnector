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
  previousPassword: [String],
  avatar: {
    type: String,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

// UserSchema.pre("find", function () {
//   this.where({ isDeleted: false });
// });

// UserSchema.pre("findOne", function () {
//   this.where({ isDeleted: false });
// });

module.exports = User = mongoose.model("user", UserSchema);
