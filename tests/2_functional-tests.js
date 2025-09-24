const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  suite("test api POST api/issues", function () {
    test("Create an issue with every field", function (done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/issues/apitest/")
        .send({
          issue_title: "blocking",
          issue_text: "screen payment",
          created_by: "Van Anh",
          assigned_to: "Nguyen Tran",
          status_text: "open",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res._body.issue_title, "blocking");
          assert.equal(res._body.issue_text, "screen payment");
          assert.equal(res._body.created_by, "Van Anh");
          assert.equal(res._body.assigned_to, "Nguyen Tran");
          assert.equal(res._body.status_text, "open");
          assert.equal(res._body.open, true);
          done();
        });
    });

    test("Create an issue with only required fields", function (done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/issues/apitest/")
        .send({
          issue_title: "blocking",
          issue_text: "screen payment",
          created_by: "Van Anh",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res._body.issue_title, "blocking");
          assert.equal(res._body.issue_text, "screen payment");
          assert.equal(res._body.created_by, "Van Anh");
          assert.equal(res._body.assigned_to, "");
          assert.equal(res._body.status_text, "");
          assert.equal(res._body.open, true);
          done();
        });
    });

    test("Create an issue with missing required fields", function (done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/issues/apitest/")
        .send({
          issue_text: "screen payment",
          created_by: "Van Anh",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res._body.error, "required field(s) missing");

          done();
        });
    });
  });

  suite("test api GET api/issues", function () {
    test("Create an issue with missing required fields", function (done) {
      chai
        .request(server)
        .keepOpen()
        .get("/api/issues/apitest/")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          if (res.body.length > 0) {
            const issue = res.body[0];
            assert.property(issue, "_id");
            assert.property(issue, "issue_title");
            assert.property(issue, "issue_text");
            assert.property(issue, "created_by");
            assert.property(issue, "assigned_to");
            assert.property(issue, "open");
            assert.property(issue, "status_text");
            assert.property(issue, "created_on");
            assert.property(issue, "updated_on");
          }

          done();
        });
    });

    test("View issues on a project with one filter", function (done) {
      chai
        .request(server)
        .keepOpen()
        .get("/api/issues/apitest/")
        .query({ open: false })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          if (res.body.length > 0) {
            res.body.forEach((issue) => assert.equal(issue.open, false));
          }
          done();
        });
    });

    test("View issues on a project with multiple filters:", function (done) {
      chai
        .request(server)
        .keepOpen()
        .get("/api/issues/apitest/")
        .query({ open: false, created_by: "Van Anh" })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          if (res.body.length > 0) {
            res.body.forEach((issue) => {
              assert.equal(issue.open, false);
              assert.equal(issue.created_by, "Van Anh");
            });
          }
          done();
        });
    });
  });

  suite("test api UPDATE api/issues", function () {
    test("Update one field on an issue", function (done) {
      const issueId = "68d2db63dbcec390b51ab0ca";

      chai
        .request(server)
        .keepOpen()
        .put("/api/issues/apitest/")
        .send({ _id: issueId, issue_title: "new title" })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          const issueRes = res.body;

          assert.property(issueRes, "result");
          assert.property(issueRes, "_id");

          assert.equal(issueRes.result, "successfully updated");
          assert.equal(issueRes._id, issueId);

          done();
        });
    });

    test("Update multiple fields on an issue", function (done) {
      const issueId = "68d2db63dbcec390b51ab0ca";

      chai
        .request(server)
        .keepOpen()
        .put("/api/issues/apitest/")
        .send({
          _id: issueId,
          issue_title: "new title",
          issue_text: "new text",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          const issueRes = res.body;

          assert.property(issueRes, "result");
          assert.property(issueRes, "_id");

          assert.equal(issueRes.result, "successfully updated");
          assert.equal(issueRes._id, issueId);

          done();
        });
    });

    test("Update an issue with missing _id", function (done) {
      chai
        .request(server)
        .keepOpen()
        .put("/api/issues/apitest/")
        .send({
          issue_title: "new title",
          issue_text: "new text",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          const issueRes = res.body;

          assert.property(issueRes, "error");

          assert.equal(issueRes.error, "missing _id");

          done();
        });
    });

    test("Update an issue with no fields to update", function (done) {
      const issueId = "68d2db63dbcec390b51ab0ca";

      chai
        .request(server)
        .keepOpen()
        .put("/api/issues/apitest/")
        .send({
          _id: issueId,
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          const issueRes = res.body;

          assert.property(issueRes, "error");
          assert.property(issueRes, "_id");

          assert.equal(issueRes.error, "no update field(s) sent");
          assert.equal(issueRes._id, issueId);

          done();
        });
    });

    test("Update an issue with an invalid _id", function (done) {
      const issueId = "68d2dda54a269018d2f0a4dc";

      chai
        .request(server)
        .keepOpen()
        .put("/api/issues/apitest/")
        .send({
          _id: issueId,
          issue_text: "new text",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          const issueRes = res.body;

          assert.property(issueRes, "error");
          assert.property(issueRes, "_id");

          assert.equal(issueRes.error, "could not update");
          assert.equal(issueRes._id, issueId);

          done();
        });
    });
  });

  suite("test api DELETE api/issues", function () {
    test("Delete an issue", function (done) {
      const issueId = "68d4280c5082580a9cdb1c64";

      chai
        .request(server)
        .keepOpen()
        .delete("/api/issues/apitest/")
        .send({ _id: issueId })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          const issueRes = res.body;

          assert.property(issueRes, "result");
          assert.property(issueRes, "_id");

          assert.equal(issueRes.result, "successfully deleted");
          assert.equal(issueRes._id, issueId);

          done();
        });
    });

    test("Delete an issue with an invalid _id", function (done) {
      const issueId = "68d2dda54a269018d2f0a4dc";

      chai
        .request(server)
        .keepOpen()
        .delete("/api/issues/apitest/")
        .send({ _id: issueId })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          const issueRes = res.body;

          assert.property(issueRes, "error");
          assert.property(issueRes, "_id");

          assert.equal(issueRes.error, "could not delete");
          assert.equal(issueRes._id, issueId);

          done();
        });
    });

    test("Delete an issue with missing _id", function (done) {
      chai
        .request(server)
        .keepOpen()
        .delete("/api/issues/apitest/")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          const issueRes = res.body;

          assert.property(issueRes, "error");

          assert.equal(issueRes.error, "missing _id");

          done();
        });
    });
  });
});
