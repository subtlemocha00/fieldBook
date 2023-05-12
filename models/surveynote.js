const mongoose = require('mongoose');

const surveyNoteSchema = new mongoose.Schema({
  number: String,
  point: String,
  BS: Number,
  FS: Number,
  HI: Number,
  elevation: Number
})

const Surveynote = mongoose.model('surveynote', surveyNoteSchema);
module.exports = Surveynote;