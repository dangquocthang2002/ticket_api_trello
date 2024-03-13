const Activity = require("../models/activities.model");

const activitiesController = {
  showActivitiesByBoard: async (req, res) => {
    try {
      const page =
        parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1 || 1;
      const limit =
        parseInt(req.query.limit) > 0 && parseInt(req.query.limit) <= 50
          ? parseInt(req.query.limit)
          : 20 || 20;
      const activities = await Activity.find({
        board: req.params.id,
        ticket: null,
      })
        .sort({ createdAt: "desc" })
        .limit(limit)
        .skip(limit * (page - 1));
      res.status(200).json(activities);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  showActivitiesByTicket: async (req, res) => {
    try {
      const page =
        parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1 || 1;
      const limit =
        parseInt(req.query.limit) > 0 && parseInt(req.query.limit) <= 50
          ? parseInt(req.query.limit)
          : 20 || 20;
      const activities = await Activity.find({
        ticket: req.params.id,
      })
        .sort({ createdAt: "desc" })
        .limit(limit)
        .skip(limit * (page - 1));
      res.status(200).json(activities);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};
module.exports = activitiesController;
