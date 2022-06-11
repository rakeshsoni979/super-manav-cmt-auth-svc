const { validateCognitoIdToken } = require("../../services/auth");

const basicCognitoUser = (req, res, next) => {
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
      req.headers.__userId = tokenPayload.sub;
      req.headers.__email = tokenPayload.email;
      next();
    } else {
      return res.status(400).json({ error: "invalid token" });
    }
  });
};

exports.basicCognitoUser = basicCognitoUser