const express = require("express");
const userRouter = express.Router();
const userControllers = require("../controllers/userControllers");
const {
  validateCreateUser,
  validateLoginUser,
} = require("../validation/validation");

userRouter
  .post("/auth/register", validateCreateUser, userControllers.addUser)
  .post("/auth/login", validateLoginUser, userControllers.loginUser)
  .post("/auth/logout", userControllers.logoutUser)
  .get("/users/current", userControllers.authorizeUser);

module.exports = userRouter;
