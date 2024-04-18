const UserModel = require("../models/users.model");

const checkUsersExit = async (userIds) => {
  const result = await Promise.all(
    userIds.map((userId) => UserModel.findById(userId)),
  );
  return result
    .filter((user) => (user ? true : false))
    .map((user) => ({
      ...user._doc,
      _id: user._id.toString(),
      password: null,
    }));
};

const isEmailExist = async (value) => {
  const user = await UserModel.findOne({
    email: value,
  });
  if (user) {
    throw new Error("Email already exists!");
  } else {
    return value;
  }
};

const isUserNameExist = async (value) => {
  const user = await UserModel.findOne({
    username: value,
  });
  if (user) {
    throw new Error("UserName already exists!");
  } else {
    return value;
  }
};

module.exports = {
  checkUsersExit,
  isUserNameExist,
  isEmailExist,
};
