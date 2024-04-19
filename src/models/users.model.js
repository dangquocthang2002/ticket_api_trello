const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["ADMIN", "LEADER", "USER"],
    default: "USER",
    required: true,
  },
  avatar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "File",
  },
});

userSchema.pre("save", async function (next) {
  try {
    if (String(this.password).trim()) {
      const user = await User.findById(this._id);

      const hasPass = async () => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
      };

      if (!user && this.password) {
        await hasPass();
      } else if (user && String(user.password) !== String(this.password)) {
        await hasPass();
      }
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

let User = mongoose.model("User", userSchema);

module.exports = User;
