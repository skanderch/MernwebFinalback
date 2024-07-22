const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    sdk: {
      type: String,
      required: true,
    },
    unityversion: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
      required: true,
    },
    pc: {
      type: Boolean,
      default: false,
      required: true,
    },
    quest: {
      type: Boolean,
      default: false,
      required: true,
    },
    nsfw: {
      type: Boolean,
      default: false,
      required: true,
    },
    fullbody: {
      type: Boolean,
      default: false,
      required: true,
    },
    dps: {
      type: Boolean,
      default: false,
      required: true,
    },
    showBidsOnProductPage: {
      type: Boolean,
      default: false,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    status: {
      type: String,
      default: "pending",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("products", productSchema);
