const Department = require("../models/departments.model");
const { emit } = require("../models/users.model");
const { getUnarchivedDepartments } = require("../services/departments.service");

const departmentController = {
  //Add
  addDepartment: async (req, res) => {
    try {
      const newDepartment = new Department(req.body);
      const saveDepartment = await newDepartment.save();
      res.status(200).json(saveDepartment);
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
  //Show
  showDepartments: async (req, res) => {
    try {
      const departments = await getUnarchivedDepartments();
      res.status(200).json(departments);
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
  //Get Department By ID
  getDepartmentById: async (req, res) => {
    try {
      const department = await Department.findById(req.params.id);
      if (department) {
        res.status(200).json(department);
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
  //Update
  updateDepartment: async (req, res) => {
    try {
      const department = await Department.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.status(200).json(department);
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
  //Delete
  deleteDepartment: async (req, res) => {
    try {
      const department = await Department.findByIdAndDelete(req.params.id);
      if (department) {
        res.status(200).json({
          message: "Delete Successfully",
        });
      } else {
        res.status(404).json({ message: "Department not found!" });
      }
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
  getArchivedDepartments: async (req, res) => {
    try {
      const departments = await Department.find({ isArchived: true });
      res.status(200).json(departments);
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
};

module.exports = departmentController;
