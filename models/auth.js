const Joi = require("joi");
const mongoose = require("mongoose");
const { APP_ACCESS, USER_TYPE } = require("../constants");

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
      basicAccess: {
        type: Boolean,
        required: false
      },
      accessList: [AppAccess]
    },
    { timestamps: true }
  )
);

function validateTemp(auth) {
  let appAccess = Joi.object().keys({
    appId: Joi.string().required(),
    env: Joi.string().required(),
    access: Joi.string()
      .valid(...Object.values(APP_ACCESS))
      .required()
  });

  let accessList = Joi.array().items(appAccess);

  const schema = {
    userId: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(50).required(),
    basicAccess: Joi.boolean(),
    accessList: accessList
  };

  return Joi.validate(auth, schema);
}

exports.auth = auth;
exports.validate = validateTemp;
