const Joi = require("joi");
const { isBoardExist } = require("../services/boards.service");

const AddEpicSchema = Joi.object({
  name: Joi.string().required(),
  color: Joi.string().allow("", null),
  description: Joi.string(),
  status: Joi.string().valid("todo", "doing", "done", "archived"),
  startedDate: Joi.date(),
  endedDate: Joi.date(),

  board: Joi.string().required().external(isBoardExist),
});

const UpdateEpicSchema = Joi.object({
  name: Joi.string(),
  color: Joi.string().allow("", null),
  description: Joi.string(),
  status: Joi.string().valid("todo", "doing", "done", "archived"),
  startedDate: Joi.date(),
  endedDate: Joi.date(),
  board: Joi.string().external(isBoardExist),
});

module.exports = { AddEpicSchema, UpdateEpicSchema };
