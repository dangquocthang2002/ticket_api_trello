const mongoose = require("mongoose");
const User = require("../models/users.model");
const dotenv = require("dotenv");

const connectMongoDB = require("./connectMongoDB");
const Notification = require("../models/notification.model");

dotenv.config();

let users = [
  new User({
    name: "user1",
    username: "user1",
    email: "user1@example.com",
    password: "123123",
    role: "USER",
  }),
  new User({
    name: "user2",
    username: "user2",
    email: "user2@example.com",
    password: "123123",
    role: "ADMIN",
  }),
  new User({
    name: "user3",
    username: "user3",
    email: "user3@example.com",
    password: "123123",
    role: "ADMIN",
  }),
  new User({
    name: "user4",
    username: "user4",
    email: "user4@example.com",
    password: "123123",
    role: "USER",
  }),
  new User({
    name: "user5",
    username: "user5",
    email: "user5@example.com",
    password: "123123",
    role: "USER",
  }),
  new User({
    name: "user6",
    username: "user6",
    email: "user6@example.com",
    password: "123123",
    role: "USER",
  }),
  new User({
    name: "user7",
    username: "user7",
    email: "user7@example.com",
    password: "123123",
    role: "USER",
  }),
];

async function saveData() {
  connectMongoDB();
  await User.deleteMany({});
  await Promise.all(users.map(async (user) => await user.save()))
    .then((users) => {
      console.log(users);
    })
    .catch((error) => {
      console.log(error);
    });
  mongoose.disconnect();
}
async function updateNotification() {
  connectMongoDB();
  await Notification.updateMany({}, { isSeen: true });
  mongoose.disconnect();
}
// saveData();
updateNotification();
