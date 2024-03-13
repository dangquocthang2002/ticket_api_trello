const Joi = require("joi");
const { isBoardExist } = require("../services/boards.service");

const AddStateSchema = Joi.object({
  name: Joi.string().required(),
  positionIndex: Joi.number().required(),
  isArchived: Joi.boolean(),
  board: Joi.string().required().external(isBoardExist),
  isDone: Joi.boolean().optional()
});

const UpdateStateSchema = Joi.object({
  name: Joi.string(),
  positionIndex: Joi.number(),
  isArchived: Joi.boolean(),
  board: Joi.string().external(isBoardExist),
  isDone: Joi.boolean(),
});

module.exports = { AddStateSchema, UpdateStateSchema };
