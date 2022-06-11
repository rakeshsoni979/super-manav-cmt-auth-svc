const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
const AWS = require("aws-sdk");
const request = require("request");
const jwkToPem = require("jwk-to-pem");
const jwt = require("jsonwebtoken");
// global.fetch = require("node-fetch");
const configJson = require("../config/default.json");
const { auth } = require("../models/auth");

const userPool = new AmazonCognitoIdentity.CognitoUserPool({
  UserPoolId: configJson.cognito.userPoolId, // Your user pool id here
  ClientId: configJson.cognito.clientId // Your client id here
});

const validateCognitoIdToken = (token, callback) => {
  request(
    {
      url: `https://cognito-idp.${configJson.cognito.region}.amazonaws.com/${configJson.cognito.userPoolId}/.well-known/jwks.json`,
      json: true
    },
    function (error, response, body) {
      let pems = {};
      if (!error && response.statusCode === 200) {
        let keys = body["keys"];
        for (let i = 0; i < keys.length; i++) {
          //Convert each key to PEM
          let key_id = keys[i].kid;
          let modulus = keys[i].n;
          let exponent = keys[i].e;
          let key_type = keys[i].kty;
          let jwk = { kty: key_type, n: modulus, e: exponent };
          let pem = jwkToPem(jwk);
          pems[key_id] = pem;
        }
        //validate the token
        let decodedJwt = jwt.decode(token, { complete: true });
        if (!decodedJwt) {
          console.log("Not a valid JWT token");
          return;
        }

        let kid = decodedJwt.header.kid;
        let pem = pems[kid];
        if (!pem) {
          console.log("Invalid token");
          return;
        }

        jwt.verify(token, pem, function (err, payload) {
          if (err) {
            console.log("Invalid Token.");
            console.log("In auth");
            callback(false);
          } else {
            console.log("Valid Token.");
            console.log("In auth");
            callback(payload);
          }
        });
      } else {
        console.log("Error! Unable to download JWKs");
      }
    }
  );
};

const doesUserHaveAppAccess = async ({
  appId,
  userId,
  accessToCheck = [],
  env
}) => {
  const user = await auth.findOne({ userId: userId });
  if (user && Array.isArray(user.accessList)) {
    const allAppAccess = user.accessList
      .filter((access) => access.appId === appId && access.env === env)
      .map((access) => access.access);
    return accessToCheck.every((acc) => allAppAccess.includes(acc));
  } else {
    return false;
  }
};

const getAllUserAccess = async ({ userId }) => {
  const user = await auth.findOne({ userId: userId });
  return user;
};

exports.validateCognitoIdToken = validateCognitoIdToken;
exports.doesUserHaveAppAccess = doesUserHaveAppAccess;
exports.getAllUserAccess = getAllUserAccess;
