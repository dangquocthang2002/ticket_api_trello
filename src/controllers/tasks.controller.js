const Task = require("../models/tasks.model");
const Ticket = require("../models/tickets.model");

const { checkUserAccessTicket } = require("../services/tickets.service");
const { ActivityType } = require("../services/activities/activity.constants");

const { eventEmitter } = require("../services/eventEmitter.service");

const tasksController = {
  //Add a new state
  addTask: async (req, res) => {
    try {
      const newTask = new Task(req.body);
      const ticket = await Ticket.findById(req.body.ticket);
      if (!ticket) {
        return handelError(404, "Ticket not found");
      }
      if (!(await checkUserAccessTicket(req.data, ticket))) {
        return res
          .status(403)
          .json({ message: "You are not allowed to access ticket" });
      }
      eventEmitter.emit(ActivityType.USER_ADD_TASK_TO_TICKET, {
        activeUser: { _id: req.data._id, name: req.data.name },
        task: newTask,
        boardActive: req.board,
        clientId: req.headers.clientid,
        ticketId: req.body.ticket,
        ticketActive: ticket,
      });
      const saveTask = await newTask.save();
      res.status(200).json(saveTask);
    } catch (error) {
      res.status(400).json({
        message: error.message || "Something went wrong!",
      });
    }
  },
  //Get state By ID
  getTaskById: async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      const ticket = await Ticket.findById(task.ticket);
      if (!ticket) {
        return handelError(404, "Ticket not found");
      }
      if (!(await checkUserAccessTicket(req.data, ticket))) {
        return res
          .status(403)
          .json({ message: "You are not allowed to access ticket" });
      }
      if (task) {
        res.status(200).json(task);
      } else {
        res.status(404).json({
          message: "Task not found",
        });
      }
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
  //Update
  updateTask: async (req, res) => {
    try {
      const initTask = await Task.findById(req.params.id);
      const ticket = await Ticket.findById(initTask.ticket);
      if (!ticket) {
        return handelError(404, "Ticket not found");
      }
      if (!(await checkUserAccessTicket(req.data, ticket))) {
        return res
          .status(403)
          .json({ message: "You are not allowed to access ticket" });
      }
      eventEmitter.emit(ActivityType.USER_UPDATE_TASK, {
        boardActive: req.board,
        clientId: req.headers.clientid,
        ticketId: String(ticket._id),
        taskUpdate: { ...initTask._doc, ...req.body },
        ticketActive: ticket,
      });
      if (req.body.name && req.body.name !== initTask.name) {
        eventEmitter.emit(ActivityType.USER_CHANGE_TASK_TITLE, {
          activeUser: { _id: req.data._id, name: req.data.name },
          task: initTask,
          change: req.body,
        });
      } else if (
        req.body.status === "complete" &&
        req.body.name === initTask.name
      ) {
        eventEmitter.emit(ActivityType.USER_COMPLETED_TASK, {
          activeUser: { _id: req.data._id, name: req.data.name },
          task: initTask,
          change: req.body,
        });
      } else if (
        req.body.status === "active" &&
        req.body.name === initTask.name
      ) {
        eventEmitter.emit(ActivityType.USER_UN_COMPLETED_TASK, {
          activeUser: { _id: req.data._id, name: req.data.name },
          task: initTask,
          change: req.body,
        });
      }
      const taskUpdate = await Task.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.status(200).json(taskUpdate);
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
  //Delete
  deleteTask: async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      const ticket = await Ticket.findById(task.ticket);
      if (!ticket) {
        return handelError(404, "Ticket not found");
      }
      if (task) {
        if (!(await checkUserAccessTicket(req.data, ticket))) {
          return res
            .status(403)
            .json({ message: "You are not allowed to access ticket" });
        }
        eventEmitter.emit(ActivityType.USER_DELETE_TASK, {
          activeUser: { _id: req.data._id, name: req.data.name },
          task: task,
          boardActive: req.board,
          clientId: req.headers.clientid,
          ticketId: String(ticket._id),
          taskId: req.params.id,
          ticketActive: ticket,
        });
        await Task.findByIdAndDelete(task._id);
        res.status(200).json({
          message: "Delete Successfully",
        });
      } else {
        res.status(404).json({ message: "Task not found!" });
      }
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
};

module.exports = tasksController;
