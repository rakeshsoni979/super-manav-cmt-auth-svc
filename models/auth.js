const Joi = require("joi");
const mongoose = require("mongoose");
const { APP_ACCESS, USER_TYPE, REGIONS } = require("../constants");

const AppAccess = new mongoose.Schema({
  appId: {
    type: String,
    required: true
  },
  env: {
    type: String,
    required: true
  },
  access: {
    type: String,
    required: true,
    enum: Object.values(APP_ACCESS),
    default: APP_ACCESS.read
  }
});
const auth = mongoose.model(
  "auth",
  new mongoose.Schema(
    {
      userId: {
        type: String,
        required: true
      },
      userType: {
        type: String,
        required: true,
        enum: Object.values(USER_TYPE),
        default: USER_TYPE.basicUser
      },
      email: {
        type: String
      },
      regionAccessList: [
        {
          type: String,
          required: false,
          // enum: Object.keys(REGIONS),
          default: "ap-south-1"
        }
      ],
      accessList: [AppAccess]
    },
    { timestamps: true }
  )
);

exports.auth = auth;
