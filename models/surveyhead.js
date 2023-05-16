const mongoose = require('mongoose');

const surveyHeaderSchema = new mongoose.Schema({
  number: String,
  benchmark: String,
  BS: Number,
  FS: Number,
  HI: Number,
  elevation: Number,
})

const Surveyheader = mongoose.model('surveyheader', surveyHeaderSchema);
module.exports = Surveyheader;