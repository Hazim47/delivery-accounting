const User = require("../models/User");
const bcrypt = require("bcryptjs");

const createUser = async (req, res) => {
  try {
    const {
      fullName,
      username,
      password,
      role
    } = req.body;

    const allowedRoles = [
      "ACCOUNTANT_1",
      "ACCOUNTANT_2",
      "EMPLOYEE"
    ];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role"
      });
    }

    const existingUser = await User.findOne({
      where: { username }
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Username already exists"
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      username,
      password: hashedPassword,
      role
    });

    res.status(201).json({
      message: "User created",
      user
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ["password"]
      }
    });

    res.json(users);

  } catch (error) {
    res.status(500).json({
      message: "Server Error"
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(
      req.params.id
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role === "ADMIN") {
      return res.status(400).json({
        message: "Cannot delete admin",
      });
    }

    await user.destroy();

    res.json({
      message: "User deleted",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
const resetUserPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    await User.update(
      {
        password: hashedPassword,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    res.json({
      message:
        "Password updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};
module.exports = {
  createUser,
  getUsers,
  deleteUser,
  resetUserPassword,
};