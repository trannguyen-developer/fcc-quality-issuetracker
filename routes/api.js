"use strict";
const mongoose = require("mongoose");
const userSchema = require("../issueSchema");

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(async function (req, res) {
      try {
        const query = req.query;

        console.log("query", query);

        let project = req.params.project;
        if (!project) {
          return res.json([]);
        }
        const Issue = mongoose.model(project, userSchema);

        const issue = await Issue.find(query);
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

        const { issue_title, issue_text, created_by } = req.body;

        if (!issue_title || !issue_text || !created_by) {
          return res.json({
            error: "required field(s) missing",
          });
        }

        const Issue = mongoose.model(project, userSchema);

        const issue = new Issue(req.body);
        await issue.save();
        res.json(issue);
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
        if (!_id) {
          return res.json({ error: "missing _id" });
        }

        if (Object.keys(rest).length === 0) {
          return res.json({ error: "no update field(s) sent", _id });
        }

        if (updatedIssue) {
          res.json({ result: "successfully updated", _id });
        } else {
          res.json({ error: "could not update", _id });
        }
      } catch (error) {
        console.log("error", error);
        res.json({ error });
      }
    })

    .delete(async function (req, res) {
      try {
        let project = req.params.project;
        const idIssue = req.body._id;

        const Issue = mongoose.model(project, userSchema);

        const deleteIssue = await Issue.findByIdAndDelete(idIssue);

        if (!idIssue) {
          return res.json({ error: "missing _id" });
        }

        if (deleteIssue) {
          res.json({ result: "successfully deleted", _id: idIssue });
        } else {
          res.json({ error: "could not delete", _id: idIssue });
        }
      } catch (error) {
        console.log("error", error);
        res.json({ error });
      }
    });
};
