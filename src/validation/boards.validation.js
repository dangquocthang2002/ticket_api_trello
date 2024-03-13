const Joi = require("joi");
const { isDepartmentExist } = require("../services/departments.service");

const AddBoardSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
  isArchived: Joi.boolean(),
  viewOnly: Joi.boolean(),
  department: Joi.string().required().external(isDepartmentExist),
  positionIndex: Joi.number(),
});

const UpdateBoardSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
  isArchived: Joi.boolean(),
  viewOnly: Joi.boolean(),
  department: Joi.string().external(isDepartmentExist),
  positionIndex: Joi.number(),
});

module.exports = { AddBoardSchema, UpdateBoardSchema };
