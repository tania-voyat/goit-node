const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatarURL: String,
  subscription: {
    type: String,
    enum: ["free", "pro", "premium"],
    default: "free",
  },
  token: { type: String, required: false },
  verificationToken: { type: String, required: false },
  status: {
    type: String,
    required: true,
    enum: ["Created", "Verified"],
    default: "Created",
  },
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
