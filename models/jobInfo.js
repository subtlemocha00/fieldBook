const mongoose = require('mongoose');

const jobInfoSchema = new mongoose.Schema({
  name: String,
  number: String,
  location: String,
  contractor: String,
  startDate: String,
  endDate: String
})

const JobInfo = mongoose.model('jobInfo', jobInfoSchema);
module.exports = JobInfo;