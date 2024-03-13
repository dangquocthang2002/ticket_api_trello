const Joi = require("joi");
const { isBoardExist } = require("../services/boards.service");

const AddLabelSchema = Joi.object({
  name: Joi.string().required(),
  color: Joi.string().required(),
  board: Joi.string().required().external(isBoardExist),
});

const UpdateLabelSchema = Joi.object({
  name: Joi.string(),
  color: Joi.string(),
  board: Joi.string().external(isBoardExist),
});

module.exports = { AddLabelSchema, UpdateLabelSchema };
