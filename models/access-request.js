const Joi = require("joi");
const mongoose = require("mongoose");
const { APP_ACCESS, USER_TYPE, REGIONS } = require("../constants");

const accessRequest = mongoose.model(
  "accessRequest",
  new mongoose.Schema(
    {
      userId: {
        type: String,
        required: true
      },
      forRegion: {
        type: String,
        required: true,
        enum: Object.keys(REGIONS)
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
