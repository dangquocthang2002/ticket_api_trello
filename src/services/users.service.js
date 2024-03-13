const UserModel = require("../models/users.model");

const checkUsersExit = async (userIds) => {
  const result = await Promise.all(
    userIds.map((userId) => UserModel.findById(userId))
  );
  return result
    .filter((user) => (user ? true : false))
    .map((user) => ({
      ...user._doc,
      _id: user._id.toString(),
      password: null,
    }));
};

module.exports = {
  checkUsersExit,
};
