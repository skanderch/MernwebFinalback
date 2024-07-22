const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");

// new user register

router.post('/register', async (req, res) => {
  try {
    // Check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      throw new Error('User already exists');
    }

    // Check if password is empty
    if (!req.body.password) {
      throw new Error('Password cannot be empty');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    // Save user
    const newUser = new User(req.body);
    await newUser.save();
    res.send({
      success: true,
      message: 'User created successfully',
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// user login

router.post('/login', async (req, res) => {
  try {
    // Check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new Error('User does not exist');
    }

    // Check if user is active or blocked
    if (user.status !== 'active') {
      throw new Error('User is blocked, please contact the Admin');
    }

    // Check if password is empty
    if (!req.body.password) {
      throw new Error('Password cannot be empty');
    }

    // Check password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      throw new Error('Invalid password');
    }

    // Create token
    const token = jwt.sign({ userId: user._id }, process.env.jwt_secret, {
      expiresIn: '1d',
    });

    // Send response
    res.send({
      success: true,
      message: 'Login successful',
      data: token,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// get current user

router.get("/get-current-user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    res.send({
      success: true,
      message: "User fetched successfuly",
      data: user,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;

// get all users
router.get("/get-users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find();
    res.send({
      success: true,
      message: "Users fetched successfuly",
      data: users,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// update user status
router.put("/update-user-status/:id", authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, req.body);
    res.send({
      success: true,
      message: "User status updated successfuly",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});
