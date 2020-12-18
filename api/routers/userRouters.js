const express = require("express");
const userRouter = express.Router();
require("dotenv").config();
const path = require("path");
const multer = require("multer");
const uploadDir = path.join(process.cwd(), "tmp");

const userControllers = require("../controllers/userControllers");
const {
  validateCreateUser,
  validateLoginUser,
} = require("../validation/validation");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

userRouter
  .post("/auth/register", validateCreateUser, userControllers.addUser)
  .post("/auth/login", validateLoginUser, userControllers.loginUser)
  .post("/auth/logout", userControllers.logoutUser)
  .get("/auth/verify/:verificationToken", userControllers.verifyEmail)
  .get("/users/current", userControllers.authorizeUser)
  .patch(
    "/users/avatars",
    upload.single("avatar"),
    userControllers.updateAvatar
  );

module.exports = userRouter;
