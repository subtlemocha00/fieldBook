const mongoose = require('mongoose');

const surveyNoteSchema = new mongoose.Schema({
  number: String,
  point: String,
  bs: Number,
  fs: Number,
  hi: Number,
  elevation: Number,
  date: String
})

const Surveynote = mongoose.model('surveynote', surveyNoteSchema);
module.exports = Surveynote;