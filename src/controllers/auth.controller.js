const UserModel = require("../models/users.model");
const FileModel = require("../models/files.model");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt.util");

const TeamAPI = require("../services/team-api.service");

const { generateNewFileDocs } = require("../services/uploadFiles.service");

const authController = {
  login: async (req, res) => {
    const sendToken = (user) => {
      const newToken = generateToken({
        _id: user._id,
        username: user.username,
        role: user.role,
        status: user.status,
      });
      res.status(200).json({ data: { token: newToken } });
    };

    // login to TEAM API
    let userInTeam = null;

    userInTeam = await TeamAPI.login(req.body)
      .then((_res) => {
        userInTeam = _res?.data?.user;
        return userInTeam;
      })
      .catch((err) => {
        return null;
      });

    if (!userInTeam) {
      // trying with admin login
      userInTeam = await TeamAPI.loginAdmin(req.body)
        .then((_res) => {
          userInTeam = _res?.data?.user;
          return userInTeam;
        })
        .catch((err) => {
          return null;
        });
    }

    if (userInTeam) {
      try {
        const userInDB = await UserModel.findOne({
          username: userInTeam.username,
        });

        if (!userInDB) {
          // create new one
          const newUser = await UserModel.create({
            username: userInTeam.username,
            email: userInTeam.email,
            name: userInTeam.name,
            role: String(userInTeam.role).toUpperCase(),
            password: String(Date.now()),
          });
          sendToken(newUser);
        } else {
          // update exist user
          await UserModel.findByIdAndUpdate(userInDB._id, {
            name: userInTeam.name,
          });

          sendToken(userInDB);
        }
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    } else {
      try {
        if (!req.body.username) {
          throw new Error("Username is not valid!");
        }

        const user = await UserModel.findOne({
          username: req.body.username,
        });

        if (!user) {
          res
            .status(404)
            .json({ message: "Username or password is not valid" });
        } else {
          const check = await bcrypt.compareSync(
            req.body.password,
            user.password
          );
          if (check) {
            sendToken(user);
          } else {
            res
              .status(404)
              .json({ message: "Username or password is not valid" });
          }
        }
      } catch (error) {
        console.log(error);
        res.status(500).json(error);
      }
    }
  },

  register: async (req, res) => {},

  getMe: async (req, res) => {
    try {
      const user = await UserModel.findById(req.data._id)
        .populate("avatar")
        .select("-password")
        .exec();
      res.status(200).json(user);
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message || "Something went wrong!" });
    }
  },
  updateAva: async (req, res) => {
    try {
      const user = await UserModel.findById(req.data._id);
      if (!user) {
        return res.status(404).json({ message: "user not found" });
      }

      if (req.files.length === 0) {
        throw new Error("Files not found!");
      }

      const newFiles = await generateNewFileDocs(req.files);
      const userUpdate = await UserModel.findByIdAndUpdate(
        user._id,
        { avatar: newFiles[0]._id },
        {
          new: true,
        }
      );
      await userUpdate.save();
      await Promise.all([FileModel.insertMany(newFiles)])
        .then(() => {
          res.status(200).json({
            message: "files is added successfully",
            files: newFiles[0],
          });
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
};

module.exports = authController;
