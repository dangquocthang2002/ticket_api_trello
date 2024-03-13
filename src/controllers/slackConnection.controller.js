const SlackConnection = require("../models/slackConnection.model");

const slackConnectionController = {
  showSlackDataByBoard: async (req, res) => {
    try {
      const slack = await SlackConnection.find({ board: req.boardId });
      if (slack.length !== 0) {
        res.status(200).json(slack);
      } else {
        const newData = new SlackConnection({
          channel: null,
          botToken: null,
          data: {
            create: false,
            update: false,
            delete: false,
            archive: false,
            restore: false,
            modifyUser: false,
            move: {
              status: false,
              moveApplyFor: [],
            },
            assignLabel: false,
          },
          board: req.boardId,
        });
        const saveData = await newData.save();
        await res.status(200).json([saveData]);
      }
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
  updateSlackData: async (req, res) => {
    try {
      const slackUpdate = await SlackConnection.findOneAndUpdate(
        { board: req.boardId },
        req.body,
        { new: true }
      );
      res.status(200).json(slackUpdate);
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
};
module.exports = slackConnectionController;
