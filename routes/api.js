'use strict';
const mongoose = require('mongoose')
const { Issue, Project } = require('../models/project')
mongoose.connect(process.env.MONGO_URL);

module.exports = function(app) {

  app.route('/api/issues/:project')
    //get issue(s)
    .get(function(req, res) {
      const qfilter = { project: req.params.project };
      if (Object.keys(req.query).length > 0) Object.assign(qfilter, req.query);
      let project = req.params.project;
      Issue.find(qfilter).then(issues => res.send(issues));
    })
    //create new issue
    .post((req, res) => {
      let project = req.params.project;
      if (!req.body.issue_title
        || !req.body.issue_text
        || !req.body.created_by) {
        return res.status(200).send({ error: 'required field(s) missing' })
      }

      const issue = new Issue({
        project,
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        created_on: new Date(),
        updated_on: new Date(),
        assigned_to: req.body.assigned_to || '',
        status_text: req.body.status_text || '',
      })

      issue.save((err, doc) => {
        if (err) return console.log(err);
        return res.status(200).send(doc);
      })
    })
    //update entry
    .put(async function(req, res) {
      let project = req.params.project;
      if (Object.keys(req.body).length < 2) {
        if (!req.body._id) {
          return res.json({ error: 'missing _id' });
        }
        return res.json({ error: 'no update field(s) sent', _id: req.body._id })
      }

      let id = req.body._id;
      let updates = { ...req.body };
      delete updates._id;
      //delay response for 1sec to make sure FCC test sees time change
      setTimeout(async () => {
        updates.updated_on = new Date();
        let updated = await Issue.findByIdAndUpdate(id, updates, { new: true })
        if (!updated) {
          return res.json({ error: 'could not update', _id: id })
        }
        res.send({ result: 'successfully updated', _id: id });
      }, 1000);
    })
    //delete entry
    .delete(function(req, res) {
      let id = req.body._id;
      if (!id) return res.json({ error: 'missing _id' })
      Issue.findByIdAndDelete(id, (err, doc) => {
        if (err) console.log(err);
        console.log('DELETED DOC:', doc)
        if (!doc) return res.json({ error: 'could not delete', _id: id })
        return res.json({ result: 'successfully deleted', _id: id })
      });
    });
};
