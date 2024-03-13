const FileModel = require("../models/files.model");
const Ticket = require("../models/tickets.model");
const TicketFileModel = require("../models/ticketsFiles.model");
const User = require("../models/users.model");
const fs = require("fs");
const sharp = require("sharp");
const sizeOf = require("image-size");

const { checkUserAccessTicket } = require("../services/tickets.service");
const { isImage, isGif, isSvg } = require("../utils/isImage.util");

const { UPLOADS_PATH, UPLOADS_ROOT_PATH } = require("../config/index");
const { eventEmitter } = require("../services/eventEmitter.service");
const { ActivityType } = require("../services/activities/activity.constants");

const fileController = {
  addFiles: async (req, res) => {
    try {
      const ticket = await Ticket.findById(req.ticketId);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      if (!(await checkUserAccessTicket(req.data, ticket))) {
        return res
          .status(403)
          .json({ message: "You are not allowed to access ticket" });
      }
      if (req.files.length === 0) {
        return res.status(404).json({
          message: "no files available",
        });
      }
      const newFiles = [],
        newTicketsFiles = [];
      req.files.forEach((file) => {
        const newFile = new FileModel({
          name: file.filename.substring(file.filename.indexOf("-") + 1),
          path: file.destination,
          size: file.size,
          type: file.mimetype,
          status: "used",
        });
        newFiles.push(newFile);
        newTicketsFiles.push(
          new TicketFileModel({
            ticket: ticket._id,
            file: newFile._id,
            user: req.data._id,
            isCovered: false,
          })
        );
      });
      await Promise.all([
        FileModel.insertMany(newFiles),
        TicketFileModel.insertMany(newTicketsFiles),
      ])
        .then(() => {
          eventEmitter.emit(ActivityType.USER_ADD_FILE_TO_TICKET, {
            boardActive: req.board,
            clientId: req.headers.clientid,
            ticketId: req.ticketId,
            newFiles: {
              message: "files is added successfully",
              files: newFiles,
            },
            ticketActive: ticket,
          });
          res
            .status(200)
            .json({ message: "files is added successfully", files: newFiles });
        })
        .catch((error) => {
          res.status(404).json({ message: error });
        });
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
  removeFileFromTicket: async (req, res) => {
    try {
      const ticket = await Ticket.findById(req.ticketId);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      if (!(await checkUserAccessTicket(req.data, ticket))) {
        return res
          .status(403)
          .json({ message: "You are not allowed to access ticket" });
      }
      const file = await FileModel.findById(req.params.fileId);
      if (!fs.existsSync(`${UPLOADS_PATH}/trash`)) {
        fs.mkdirSync(`${UPLOADS_PATH}/trash`, { recursive: true });
      }
      await Promise.all([
        TicketFileModel.findOneAndDelete({
          ticket: req.ticketId,
          file: req.params.fileId,
        }),
        FileModel.findByIdAndUpdate(
          req.params.fileId,

          {
            status: "unused",
          },
          {
            new: true,
          }
        ),
        () => {
          try {
            fs.renameSync(
              UPLOADS_ROOT_PATH + file.path,
              `${UPLOADS_PATH}/trash/` +
                file.path.substring(file.path.lastIndexOf("/"))
            );
          } catch (err) {
            console.log(err);
            return null;
          }
        },
      ])
        .then(() => {
          eventEmitter.emit(ActivityType.USER_DELETE_FILE_FROM_TICKET, {
            boardActive: req.board,
            clientId: req.headers.clientid,
            ticketId: req.ticketId,
            fileId: req.params.fileId,
            ticketActive: ticket,
          });
          res
            .status(200)
            .json({ message: "files is remove from ticket successfully" });
        })
        .catch((error) => {
          res.status(404).json({ message: error });
        });
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
  updateFile: async (req, res) => {
    try {
      const ticket = await Ticket.findById(req.ticketId);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      if (!(await checkUserAccessTicket(req.data, ticket))) {
        return res
          .status(403)
          .json({ message: "You are not allowed to access ticket" });
      }
      eventEmitter.emit(ActivityType.USER_UPDATE_FILE_IN_TICKET, {
        boardActive: req.board,
        clientId: req.headers.clientid,
        ticketId: req.ticketId,
        fileUpdate: { _id: req.params.fileId, content: req.body },
        ticketActive: ticket,
      });
      if (typeof req.body.isCovered === "boolean") {
        await TicketFileModel.findOneAndUpdate(
          {
            isCovered: true,
            ticket: req.ticketId,
          },
          {
            isCovered: false,
          },
          {
            new: true,
          }
        );
        const filesTickets = await TicketFileModel.findOneAndUpdate(
          {
            ticket: req.ticketId,
            file: req.params.fileId,
          },
          req.body,
          {
            new: true,
          }
        );
        return res.status(200).json(filesTickets);
      }

      const fileUpdate = await FileModel.findByIdAndUpdate(
        req.params.fileId,
        req.body,
        {
          new: true,
        }
      );

      res.status(200).json(fileUpdate);
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
  getFilesByTicket: async (req, res) => {
    try {
      const ticket = await Ticket.findById(req.ticketId);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      if (!(await checkUserAccessTicket(req.data, ticket))) {
        return res
          .status(403)
          .json({ message: "You are not allowed to access ticket" });
      }
      const filesTickets = await TicketFileModel.find({
        ticket: req.ticketId,
      });
      const files = await FileModel.find({
        _id: {
          $in: filesTickets.map((fileTicket) => fileTicket.file),
        },
      });

      res.status(200).json(
        files
          .map((file) => ({
            ...file._doc,
            isCovered: filesTickets.find(
              (ft) => String(ft.file) === String(file._id)
            ).isCovered,
          }))
          .reverse()
      );
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
  previewFile: async (req, res) => {
    const { folder, filename } = req.params;
    const { w, h } = req.query;
    const file = await FileModel.findOne({
      path: `uploads/${folder}/${filename}`,
    });
    file.mimetype = file.type;
    const filePath = `${UPLOADS_PATH}/${folder}/${filename}`;
    if (fs.existsSync(filePath)) {
      if (!isImage(file) || isSvg(file) || isGif(file)) {
        return res.sendfile(filePath);
      }
      const dimensions = sizeOf(filePath);
      return await sharp(filePath)
        .resize(
          w
            ? Math.round(Number(w))
            : h
            ? Math.round((dimensions.width / dimensions.height) * Number(h))
            : dimensions.width,
          h
            ? Math.round(Number(h))
            : w
            ? Math.round((dimensions.height / dimensions.width) * Number(w))
            : dimensions.height
        )
        .pipe(res);
    } else {
      res.status(404).send("Not found");
    }
  },
};
module.exports = fileController;
