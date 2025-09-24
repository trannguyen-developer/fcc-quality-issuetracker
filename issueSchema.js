const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    issue_title: {
      type: String,
      required: true,
    },
    issue_text: {
      type: String,
      required: true,
    },
    created_by: { type: String, required: true },
    assigned_to: { type: String, default: "" },
    status_text: { type: String, default: "" },
    open: { type: Boolean, default: true },
  },
  {
    timestamps: { createdAt: "created_on", updatedAt: "updated_on" },
    versionKey: false,
  }
);

// const User = mongoose.model('User', userSchema);

module.exports = issueSchema;
