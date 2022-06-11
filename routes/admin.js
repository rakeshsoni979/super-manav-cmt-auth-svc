const { auth } = require("../models/auth");
const express = require("express");
const { accessRequest } = require("../models/access-request");
const { adminUser } = require("./interceptors/admin-user");
const { basicCognitoUser } = require("./interceptors/basic-cognito-user");
const router = express.Router();

router.use(basicCognitoUser);
router.use(adminUser);

// get all pending access
router.get("/pending-access-request", async (req, res) => {
  const response = await accessRequest.find({});
  console.log("response is ", response);
  res.send(response);
});

// router.post("/approve-access-request", async (req, res) => {
//   const response = await accessRequest.find({});
//   console.log("response is ", response);
//   res.send(response);
// });



module.exports = router;
