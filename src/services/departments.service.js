const { unArchivedConditions } = require("../constants/constants");
const Department = require("../models/departments.model");
const DepartmentUserModel = require("../models/departmentsUsers.model");

const isDepartmentExist = async (value) => {
  const department = await Department.findById(value);
  if (department || !value) {
    return value;
  } else {
    throw new Error("Department not found!");
  }
};

const checkUserBelongToDepartment = async (user, departmentId) => {
  try {
    if (user.role === "ADMIN") {
      return true;
    }
    const data = await DepartmentUserModel.findOne({
      userId: user._id,
      departmentId: departmentId,
    });

    if (data?._id) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

const checkUsersNotInDepartment = async (userIds, departmentOfUsers) => {
  const result = await Promise.all(
    userIds.map((userId) =>
      DepartmentUserModel.findOne({
        userId: userId,
        departmentId: departmentOfUsers._id,
      })
    )
  );
  const resultUserIds = result
    .filter((departmentUser) => (departmentUser ? true : false))
    .map((departmentUser) => departmentUser.userId.toString());
  return userIds.filter((userId) => !resultUserIds.includes(userId));
};

const getUnarchivedDepartments = (condition) => {
  return Department.find({
    ...condition,
    $or: unArchivedConditions,
  });
};
module.exports = {
  checkUsersNotInDepartment,
  isDepartmentExist,
  getUnarchivedDepartments,
  checkUserBelongToDepartment
};
