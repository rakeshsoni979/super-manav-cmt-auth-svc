const Joi = require("joi");
const mongoose = require("mongoose");
const { APP_ACCESS, USER_TYPE } = require("../constants");


const accessRequest = mongoose.model(
  "accessRequest",
  new mongoose.Schema(
    {
      userId: {
        type: String,
        required: true
      },
      forBasicAccess: {
        type: Boolean,
        required: false
      },
      forAppId: {
        type: String,
        required: false
      },
      forEnv: {
        type: String,
        required: false
      },
      approved: {
        type: Boolean,
        required: false,
        default: false
      },
      accessList: [
        {
          type: String,
          required: true,
          enum: Object.values(APP_ACCESS),
          default: APP_ACCESS.read
        }
      ]
    },
    { timestamps: true }
  )
);

exports.accessRequest = accessRequest;
