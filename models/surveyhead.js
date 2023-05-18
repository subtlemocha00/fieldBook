const mongoose = require('mongoose');

const surveyHeaderSchema = new mongoose.Schema({
  number: String,
  benchmark: { type: String, default: 'BM' },
  bs: { type: Number, default: 0 },
  fs: { type: Number, default: 0 },
  hi: { type: Number, default: 0 },
  elevation: { type: Number, default: 0 },
  date: { type: String, default: 'Today' },
})

const Surveyheader = mongoose.model('surveyheader', surveyHeaderSchema);
module.exports = Surveyheader;