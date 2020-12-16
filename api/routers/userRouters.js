const express = require("express");
const userRouter = express.Router();
require("dotenv").config();
const { HttpCode } = require("../helpers/status");
const path = require("path");
const multer = require("multer");
const uploadDir = path.join(process.cwd(), "tmp");
const storeImage = path.join(process.cwd(), "public/images");

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
  .get("/users/current", userControllers.authorizeUser)
  .patch(
    "/users/avatars",
    upload.single("avatar"),
    userControllers.updateAvatar
  );

module.exports = userRouter;
