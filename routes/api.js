"use strict";
const mongoose = require("mongoose");
const userSchema = require("../issueSchema");

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(async function (req, res) {
      try {
        let project = req.params.project;
        if (!project) {
          return res.json([]);
        }
        const Issue = mongoose.model(project, userSchema);

        const issue = await Issue.find({});
        res.json(issue || []);
      } catch (error) {
        console.log("error", error);
        res.json({ error });
      }
    })

    .post(async function (req, res) {
      try {
        let project = req.params.project;
        if (!project) {
          return res.json({ error: "wrong project" });
        }
        const Issue = mongoose.model(project, userSchema);

        const issue = new Issue(req.body);
        await issue.save();
        res.json({ data: issue });
      } catch (error) {
        console.log("error", error);
        res.json({ error });
      }
    })

    .put(async function (req, res) {
      try {
        let project = req.params.project;
        const body = req.body;
        const { _id, ...rest } = body;

        const Issue = mongoose.model(project, userSchema);

        const updatedIssue = await Issue.findByIdAndUpdate(_id, rest, {
          new: true,
        });
        if (updatedIssue) {
          res.json({ data: updatedIssue });
        } else {
          res.json({ error: `Issue of ${project} project not found` });
        }
      } catch (error) {
        console.log("error", error);
        res.json({ error });
      }
    })

    .delete(function (req, res) {
      let project = req.params.project;
    });
};
