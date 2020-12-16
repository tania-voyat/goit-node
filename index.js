const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { HttpCode } = require("./api/helpers/status");
const app = express();
const router = require("./api/routers/contactsRouters");
const userRouter = require("./api/routers/userRouters");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const uploadDir = path.join(process.cwd(), "tmp");
const storeImage = path.join(process.cwd(), "public/images");

async function main() {
  try {
    app.use(cors());
    app.use(morgan("combined"));
    app.use(express.json());
    app.use(express.static("public"));
    app.use("/api", userRouter);
    app.use("/api/contacts", router);

    app.use((err, req, res, next) => {
      err.status = err.status ? err.status : HttpCode.INTERNAL_SERVER_ERROR;
      res.status(err.status).json({
        status: err.status === 500 ? "fail" : "error",
        code: err.status,
        message: err.message,
        data: err.status === 500 ? "Internal Server Error" : err.data,
      });
    });
    await mongoose.connect(process.env.MONGO_DB_URL);

    const createFolder = (dirPath) =>
      fs.mkdir(dirPath, { recursive: true }, (err) => {
        if (err) console.log(`Error creating directory: ${err}`);
      });

    app.listen(process.env.PORT, () => {
      createFolder(uploadDir);
      createFolder(storeImage);
      console.log("Database connection successful");
    });
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

main();
