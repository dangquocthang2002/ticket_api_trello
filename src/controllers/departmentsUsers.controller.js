const DepartmentUserModel = require("../models/departmentsUsers.model");
const UserModel = require("../models/users.model");
const DepartmentModel = require("../models/departments.model");
const BoardModel = require("../models/boards.model");
const BoardInvitedMemberModel = require("../models/boardsInvitedMembers.model");

const { checkUsersExit } = require("../services/users.service");

const {
  checkUsersNotInDepartment,
} = require("../services/departments.service");
const User = require("../models/users.model");
const departmentsUsersController = {
  addUsersToDepartment: async (req, res) => {
    const handelError = (code, msg) => res.status(code).json({ message: msg });

    try {
      const departmentOfUsers = await DepartmentModel.findById(req.params.id);
      if (!departmentOfUsers) {
        return handelError(404, "Department not found");
      }
      const users = await checkUsersExit(req.body.users);
      if (!(users.length > 0)) {
        return handelError(401, "User invalid");
      }
      const newUsers = await checkUsersNotInDepartment(
        users.map((user) => user._id),
        departmentOfUsers
      );
      if (!(newUsers.length > 0)) {
        return handelError(200, "User exits in this department");
      }
      const newUsersDepartment = [];
      for (let newUser of newUsers) {
        newUsersDepartment.push(
          new DepartmentUserModel({
            userId: newUser,
            departmentId: departmentOfUsers._id,
          })
        );
      }
      const boardsOfDepartment = await BoardModel.find({
        department: req.params.id,
      });
      await Promise.all([
        ...boardsOfDepartment.map((board) =>
          BoardInvitedMemberModel.deleteMany({
            board: board._id,
            user: { $in: newUsers },
          })
        ),
        DepartmentUserModel.insertMany(newUsersDepartment),
      ])
        .then(() => {
          res.status(200).json({ message: "User is added successfully" });
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

  //Delete
  deleteUsersFromDepartment: async (req, res) => {
    try {
      const departmentOfUsers = await DepartmentModel.findById(req.params.id);
      if (departmentOfUsers) {
        await DepartmentUserModel.deleteMany({
          departmentId: req.params.id,
          userId: { $in: req.body.users },
        });
        res.status(200).json({ message: "Delete users successfully" });
      } else {
        res.status(404).json({
          message: "Department not found",
        });
      }
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
  getListUsersOfDepartment: async (req, res) => {
    try {
      const detailDepartment = await DepartmentModel.findById(req.params.id);
      if (!detailDepartment) {
        return res.status(404).json({
          message: "Department not found",
        });
      }
      const usersInDepartment = await DepartmentUserModel.find({
        departmentId: req.params.id,
      })
        .populate({
          path: "userId",
          select: "name email role",
          populate: {
            path: "avatar",
          },
        })
        .select("-_id -departmentId")
        .exec();
      res.status(200).json({
        department: detailDepartment,
        users: usersInDepartment.filter((user) => (user.userId ? true : false)),
      });
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
  getListDepartmentsOfUser: async (req, res) => {
    try {
      const user = await UserModel.findById(req.params.id).select("-password");
      const departmentsOfUser = await DepartmentUserModel.find({
        userId: req.params.id,
      })
        .populate({
          path: "departmentId",
          select: "name description isArchived",
        })
        .select("-_id -userId")

        .exec();
      if (!user) {
        return res.status(404).json({
          message: "user not found",
        });
      }
      res.status(200).json({
        user: user,
        departments: departmentsOfUser.filter(
          (department) =>
            (department.departmentId ? true : false) &&
            !department.departmentId.isArchived
        ),
      });
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
};

module.exports = departmentsUsersController;
