const express = require("express");
const router = express.Router();
const Notification = require("../models/notificationModel");
const authMiddleware = require("../middlewares/authMiddleware");

// add notification
router.post("/notify", authMiddleware, async (req, res) => {
  try {
    const newNotification = new Notification({
      title: req.body.title,
      message: req.body.message,
      onClick: req.body.onClick,
      user: req.body.user,
      read: req.body.read || false, // Ensure default value if not provided
    });
    await newNotification.save();
    res.send({
      success: true,
      message: "Notification created successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// get all notifications
router.get("/get-all-notifications", authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.body.userId,
    }).sort({ createdAt: -1 });
    res.send({
      success: true,
      data: notifications,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// delete a notification
router.delete("/delete-notification/:id", authMiddleware, async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.send({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// read all notifications by user
router.put("/read-all-notifications", authMiddleware, async (req, res) => {
  try {
    const filter = { user: req.body.userId, read: false };
    const update = { read: true };
    const options = { multi: true }; // Update multiple documents

    const result = await Notification.updateMany(filter, update, options);
    
    if (result.nModified > 0) {
      res.send({
        success: true,
        message: "All notifications marked as read",
      });
    } else {
      res.send({
        success: false,
        message: "No notifications found to mark as read",
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
