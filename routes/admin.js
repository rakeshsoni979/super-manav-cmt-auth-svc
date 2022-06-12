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
  const response = await accessRequest.find({
    approved: false
  });
  res.send(response);
});

router.get("/all-users", async (req, res) => {
  const response = await auth.find({});
  res.send(response);
});

router.post("/approve-access-request", async (req, res) => {
  const { requestId } = req.body;
  // first get access request
  const accReq = await accessRequest.findOne({ _id: requestId });
  if (accReq) {
    try {
      accReq.approved = true;
      await accReq.save();
      const _user = await auth.findOne({
        userId: accReq.userId
      });
      const user = _user ? _user : new auth({ userId: accReq.userId });
      // merge existing app access and new app access
      const existingAccessList = user.accessList || [];
      (accReq.accessList || []).forEach((accReqType) => {
        existingAccessList.push({
          appId: accReq.forAppId,
          env: accReq.forEnv,
          access: accReqType,
          createdBy: req.headers.__userId
        });
      });
      // merge existing region with new one
      user.regionAccessList = [
        ...new Set([...(user.regionAccessList || []), accReq.forRegion])
      ];
      user.accessList = existingAccessList;
      await user.save();
      return res.send(accReq);
    } catch (error) {
      return res.status(500).send({ error: error });
    }
  }
  return res.status(400).send({ error: "request not found " });
});

module.exports = router;
