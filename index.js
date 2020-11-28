const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { HttpCode } = require("./api/helpers/status");
const app = express();
const router = require("./api/routers/contactsRouters");
const mongoose = require("mongoose");
require("dotenv").config();

async function main() {
  try {
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
    await mongoose.connect(process.env.MONGO_DB_URL);
    app.listen(process.env.PORT, () => {
      console.log("Database connection successful");
    });
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

main();
