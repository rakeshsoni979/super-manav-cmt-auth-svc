const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const users = require("./routes/users");
const auth = require("./routes/auth");
const admin = require("./routes/admin");
const configJson = require("./config/default.json");
const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());

mongoose
  .connect(configJson.mongoDBUrl)
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB..."));

app.use(express.json());

app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/admin", admin);

const port = process.env.PORT || 5005;
app.listen(port, () => console.log(`Listening on port ${port}...`));
