"use strict";
const mongoose = require("mongoose");
const userSchema = require("../issueSchema");

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(async function (req, res) {
      let project = req.params.project;
    })

    .post(async function (req, res) {
      try {
        let project = req.params.project;
        if (!project) {
          return res.json({ error: "wrong project" });
        }
        const Issue = mongoose.model("project", userSchema);

        const issue = new Issue(req.body);
        await issue.save();
        res.json({ data: issue });
      } catch (error) {
        console.log("error", error);
        res.json({ error });
      }
    })

    .put(function (req, res) {
      let project = req.params.project;
    })

    .delete(function (req, res) {
      let project = req.params.project;
    });
};
