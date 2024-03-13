const Label = require("../models/labels.model");
const TicketLabels = require("../models/ticketLabels.model");

const isLabelExist = async (value) => {
  const label = await Label.findById(value);
  if (label || !value) {
    return value;
  } else {
    throw new Error("Label not found!");
  }
};
const getBoardIdByLabel = async (value) => {
  const board = (await Label.findById(value)).board.toString();
  return board;
};

const checkLabelExistInTicket = async (ticketId, labelId) => {
  try {
    const ticketLabelsExist = await TicketLabels.findOne({
      label: labelId,
      ticket: ticketId,
    });
    if (ticketLabelsExist) {
      return ticketLabelsExist;
    } else {
      return null;
    }
  } catch (error) {
    return null
  }
};
module.exports = { isLabelExist, getBoardIdByLabel, checkLabelExistInTicket };
