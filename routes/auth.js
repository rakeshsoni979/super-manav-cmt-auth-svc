const { auth } = require("../models/auth");
const express = require("express");
const { accessRequest } = require("../models/access-request");
const { basicCognitoUser } = require("./interceptors/basic-cognito-user");
const {
  doesUserHaveAppAccess,
  getAllUserAccess,
  createAccessRequest
} = require("../services/auth");
const router = express.Router();

router.use(basicCognitoUser);

// request basic access
router.post("/request-access", createAccessRequest);
// check basic access
router.get("/check-basic-access", async (req, res) => {
  const response = await auth.findOne({ userId: req.headers.__userId });
  if (response.basicAccess) {
    res.send({ message: "have basic access" }).end();
  } else {
    return res.status(400).json({ error: "do not have basic access" });
  }
});
// check app access
router.post("/check-app-access", async (req, res) => {
  const access = await doesUserHaveAppAccess({
    userId: req.headers.__userId,
    appId: req.body.appId,
    accessToCheck: req.body.accessToCheck,
    env: req.body.env
  });
  if (access) {
    res.send({ message: "have  access" }).end();
  } else {
    return res.status(400).json({ error: "do not have access" });
  }
});

router.get("/all-my-access", async (req, res) => {
  const response = await getAllUserAccess({ userId: req.headers.__userId });
  res.send(response);
});

// sandbox
router.post("/", async (req, res) => {
  const response = await auth.create(req.body);
  console.log("req is ", req.body);
  res.send(response);
});

module.exports = router;
