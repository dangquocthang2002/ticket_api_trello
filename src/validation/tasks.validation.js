const Joi = require("joi");
const { isTicketExist } = require("../services/tickets.service");

const AddTaskSchema = Joi.object({
  name: Joi.string().required(),
  status: Joi.string().required().valid("active", "failed", "complete"),
  ticket: Joi.string().required().external(isTicketExist),
});

const UpdateTaskSchema = Joi.object({
  name: Joi.string(),
  status: Joi.string().valid("active", "failed", "complete"),
  ticket: Joi.string().external(isTicketExist),
});

module.exports = { AddTaskSchema, UpdateTaskSchema };
