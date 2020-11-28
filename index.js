const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { HttpCode } = require("./api/helpers/status");
const app = express();
const router = require("./api/routers/contactsRouters");
const mongoose = require("mongoose");
require("dotenv").config();
const PORT = 3000;

async function main() {
  app.use(cors());
  app.use(morgan("combined"));
  app.use(express.json());
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
  await mongoose.connect(
    "mongodb+srv://Admin:Iwoastfwya123@cluster0.9uvyy.mongodb.net/db-contacts?retryWrites=true&w=majority"
  );
  app.listen(PORT, () => {
    console.log("Database connection successful");
  });
}

main();
