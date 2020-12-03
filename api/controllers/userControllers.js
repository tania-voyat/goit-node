const { HttpCode } = require("../helpers/status");
const userModel = require("../model/userModel");
var jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const saltRounds = 5;

async function addUser(req, res, next) {
  try {
    const { email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const existingUser = await userModel.findOne({ email: email }).exec();
    if (existingUser) {
      return res.status(HttpCode.CONFLICT).json({
        message: "Email is already in use",
      });
    }
    const newUser = await userModel.create({ email, password: passwordHash });
    res
      .status(HttpCode.CREATED)
      .json({ _id: newUser.id, email: newUser.email });
  } catch (e) {
    next(e);
  }
}
async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email: email }).exec();
    console.log(user);
    if (!user) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        message: "Email or password is wrong",
      });
    }

    const validatedPassword = await bcrypt.compare(password, user.password);
    if (!validatedPassword) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        message: "Email or password is wrong",
      });
    }

    const token = await jwt.sign({ id: user._id }, process.env.SECRET_KEY);
    await updateToken(user._id, token);
    return res.status(200).json({ token });
  } catch (e) {
    next(e);
  }
}

async function updateToken(id, newToken) {
  return userModel.findByIdAndUpdate(id, { token: newToken });
}

async function logoutUser(req, res, next) {
  try {
    const authorizationHeader = req.get("Authorization");
    const token = authorizationHeader.replace("Bearer ", "");
    const userId = await jwt.verify(token, process.env.SECRET_KEY).id;
    const user = await userModel.findById(userId);
    if (!user || user.token !== token) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        message: "Not authorized",
      });
    } else updateToken(user._id, null);
    return res.status(HttpCode.NO_CONTENT).send("No content");
  } catch (e) {
    next(e);
  }
}
async function authorizeUser(req, res, next) {
  try {
    const authorizationHeader = req.get("Authorization");
    const token = authorizationHeader.replace("Bearer ", "");
    const userId = await jwt.verify(token, process.env.SECRET_KEY).id;
    const user = await userModel.findById(userId);
    if (!user || user.token !== token) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        message: "Not authorized",
      });
    } else return res.status(HttpCode.OK).json({ email: user.email, subscription: user.subscription});
  } catch (e) {
    next(e);
  }
}

module.exports = { addUser, loginUser, authorizeUser, logoutUser };
