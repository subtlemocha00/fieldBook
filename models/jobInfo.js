const mongoose = require('mongoose');

const jobInfoSchema = new mongoose.Schema({
  jobName: String,
  jobNumber: String,
  jobLocation: String,
  contractor: String,
  startDate: String,
  endDate: String
})

const JobInfo = mongoose.model('jobInfo', jobInfoSchema);
module.exports = JobInfo;