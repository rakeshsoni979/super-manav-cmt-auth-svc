const { auth } = require("../models/auth");
const express = require("express");
const { validateCognitoIdToken } = require("../services/auth");
const router = express.Router();

router.use((req, res, next) => {
  // interceptor for token validation
  console.log("req.headers.idToken:", req.headers.idtoken);
  if (!req.headers.idtoken) {
    console.log("🚀 ~ file: auth.js ~ router.use ~ no idtoken ̥");
    return res.status(400).json({ error: "no token" });
  }
  validateCognitoIdToken(req.headers.idtoken, (tokenPayload) => {
    console.log("🚀 ~ file: auth.js ~ line 11 ~ router.use ~ ̥", tokenPayload);
    if (tokenPayload) {
      // valid token and payload
      console.log("valid token");
      req.headers.__tokenPayload = tokenPayload;
      next();
    } else {
      return res.status(400).json({ error: "invalid token" });
    }
  });
});

router.get("/", async (req, res) => {
  console.log("req.headers.__tokenPayload", req.headers.__tokenPayload);
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
