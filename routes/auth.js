const { auth } = require("../models/auth");
const express = require("express");
const { accessRequest } = require("../models/access-request");
const { basicCognitoUser } = require("./interceptors/basic-cognito-user");
const router = express.Router();

router.use(basicCognitoUser);

// request basic access
router.post("/request-access", async (req, res) => {
  const response = await accessRequest.create(req.body);
  console.log("response is ", response);
  res.send({ message: "request sent to admin" });
});

// sandbox

router.get("/", async (req, res) => {
  const response = await auth.find({});
  console.log("response is ", response);
  res.send(response);
});

router.post("/", async (req, res) => {
  const response = await auth.create(req.body);
  console.log("req is ", req.body);
  res.send(response);
});

module.exports = router;
