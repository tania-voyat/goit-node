const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const router = require("./api/routers/contactsRouters");

app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use("/api/contacts", router);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
