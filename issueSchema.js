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
    created_by: String,
    assigned_to: String,
    open: { type: Boolean, default: true },
    status_text: String,
    created_on: { type: Date, default: Date.now() },
  },
  { timestamps: { createdAt: "created_on", updatedAt: "updated_on" } }
);

// const User = mongoose.model('User', userSchema);

module.exports = issueSchema;
