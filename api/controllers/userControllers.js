const { HttpCode } = require("../helpers/status");
const userModel = require("../model/userModel");
const generateAvatar = require("../helpers/avatarBuilder");
var jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const saltRounds = 5;
const path = require("path");
const fs = require("fs");
const uuid = require("uuid");
const sgMail = require("@sendgrid/mail");
const storeImage = path.join(process.cwd(), "public/images");

async function sendVerificationEmail(user) {
  const verificationToken = uuid.v4();
  await userModel.findByIdAndUpdate(user.id, {
    verificationToken: verificationToken,
  });
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: user.email,
    from: "tetiana.voyat@gmail.com",
    subject: "Verification email",
    text: "Please verify your email",
    html: `<a href=http://localhost:3000/api/auth/verify/${verificationToken}>Please verify your email</a>`,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
}

async function addUser(req, res, next) {
  try {
    const { email, password } = req.body;

    const existingUser = await userModel.findOne({ email: email }).exec();
    if (existingUser) {
      return res.status(HttpCode.CONFLICT).json({
        message: "Email is already in use",
      });
    }
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const avatar = await generateAvatar();
    const newUser = await userModel.create({
      email,
      password: passwordHash,
      avatarURL: `http://locahost:3000/images/${avatar}`,
    });

    await sendVerificationEmail(newUser);
    res.status(HttpCode.CREATED).json({
      _id: newUser.id,
      email: newUser.email,
      avatarURL: newUser.avatarURL,
    });
  } catch (e) {
    next(e);
  }
}
async function findByVerificationToken(token) {
  return userModel.findOne({ verificationToken: token }).exec();
}
async function verifyUser(id) {
  return userModel.findByIdAndUpdate(id, {
    status: "Verified",
    verificationToken: null,
  });
}
async function verifyEmail(req, res, next) {
  try {
    const { verificationToken } = req.params;
    const userToVerify = await findByVerificationToken(verificationToken);
    if (!userToVerify) {
      res.status(HttpCode.NOT_FOUND).json({ message: "User not found" });
    }
    await verifyUser(userToVerify.id);
    return res.status(HttpCode.OK).send("Your email is succesfully verified");
  } catch (err) {
    next(err);
  }
}
async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email: email }).exec();
    console.log(user);
    if (!user || user.status !== "Verified") {
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
    } else
      return res
        .status(HttpCode.OK)
        .json({ email: user.email, subscription: user.subscription });
  } catch (e) {
    next(e);
  }
}

async function updateAvatar(req, res, next) {
  try {
    const authorizationHeader = req.get("Authorization");
    const token = authorizationHeader.replace("Bearer ", "");
    const userId = await jwt.verify(token, process.env.SECRET_KEY).id;
    const user = await userModel.findById(userId);
    if (!user || user.token !== token) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        message: "Not authorized",
      });
    }
    const { path: temporaryName, originalname } = req.file;
    const fileName = path.join(storeImage, originalname);
    await fs.rename(temporaryName, fileName);
    await fs.unlink(temporaryName);
    return res.status(HttpCode.OK).json({ avatarURL: user.avatarURL });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  addUser,
  loginUser,
  authorizeUser,
  logoutUser,
  updateAvatar,
  verifyEmail,
};
