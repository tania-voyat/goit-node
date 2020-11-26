const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const router = require("./api/routers/contactsRouters");
const mongoose = require("mongoose");

async function main() {
  await mongoose.connect(
    "mongodb+srv://Admin:Iwoastfwya123@cluster0.9uvyy.mongodb.net/db-contacts?retryWrites=true&w=majority"
  );
}
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use("/api/contacts", router);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
