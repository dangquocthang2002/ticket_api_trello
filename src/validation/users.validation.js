const Joi = require("joi");
const { isEmailExist, isUserNameExist } = require("../services/users.service");

const CreateUserSchema = Joi.object({
  name: Joi.string().required(),
  username: Joi.string().required().external(isUserNameExist),
  email: Joi.string().required().email().external(isEmailExist),
  password: Joi.string().required().min(6),
});

module.exports = { CreateUserSchema };
