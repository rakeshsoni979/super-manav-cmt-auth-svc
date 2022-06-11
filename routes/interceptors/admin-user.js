const { USER_TYPE } = require("../../constants");
const { auth } = require("../../models/auth");
const { validateCognitoIdToken } = require("../../services/auth");
const { basicCognitoUser } = require("./basic-cognito-user");

const adminUser = async (req, res, next) => {
  // interceptor for token validation
  const response = await auth.findOne({ userId: req.headers.__userId });
  if (response.userType === USER_TYPE.admin) {
    console.log("user is admin");
    next();
  } else {
    return res.status(401).json({ error: "invalid access" });
  }
};

exports.adminUser = adminUser;
