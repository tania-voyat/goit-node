const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const router = require("./api/routers/contactsRouters");

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

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
