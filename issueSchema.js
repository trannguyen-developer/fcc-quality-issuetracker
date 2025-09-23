const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    age: {
      type: Number,
      default: 18,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = issueSchema;
