const mongoose = require('mongoose');
const { Schema } = mongoose;

const issueSchema = new Schema({
  project: {
    type: String,
  },
  issue_title: {
    type: String,
    required: true
  },
  issue_text: {
    type: String,
    required: true
  },
  created_on: String,
  updated_on: String,
  created_by: {
    type: String,
    required: true
  },
  open: {
    type: Boolean,
    default: true
  },
  assigned_to: String,
  status_text: String
});

const projectSchema = new Schema({
  projectname: {
    type: String, 
    required: true
  },
  created_on: {
    type: Date
  }
});

const Issue = mongoose.model('Issue', issueSchema);
const Project = mongoose.model('Project', projectSchema);

const initialProject = new Project({
  _id:new mongoose.Types.ObjectId(),
  projectname: 'apitest'
});

initialProject.save((err, doc) => {
  if(err) console.log(err);
  console.log('saved doc:', doc);
  return -1;
})

module.exports = {Project, Issue};