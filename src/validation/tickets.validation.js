const Joi = require("joi");
const { isStateExist } = require("../services/states.service");
const { isLabelExist } = require("../services/labels.service");
const { isEpicExist } = require("../services/epics.service");

const AddTicketSchema = Joi.object({
  name: Joi.string().required(),
  private: Joi.bool().default(false),
  description: Joi.any().allow(null, ""),
  startedDate: Joi.date(),
  endedDate: Joi.date(),
  createdBy: Joi.string(),
  isArchived: Joi.boolean(),
  estimatePoints: Joi.number(),
  positionIndex: Joi.number(),
  state: Joi.string().required().external(isStateExist),
  label: Joi.string().external(isLabelExist),
  epic: Joi.string().external(isEpicExist),
});

const UpdateTicketSchema = Joi.object({
  name: Joi.string(),
  private: Joi.bool(),
  description: Joi.any().allow(null, ""),
  startedDate: Joi.date(),
  endedDate: Joi.date(),
  createdBy: Joi.string(),
  isArchived: Joi.boolean(),
  estimatePoints: Joi.number(),
  positionIndex: Joi.number(),
  state: Joi.string().external(isStateExist),
  label: Joi.string().external(isLabelExist),
  epic: Joi.any(),
});

module.exports = { AddTicketSchema, UpdateTicketSchema };
