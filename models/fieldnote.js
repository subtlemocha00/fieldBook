const mongoose = require('mongoose');

const fieldNoteSchema = new mongoose.Schema({
  note: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: false
  }
})

const Fieldnote = mongoose.model('Fieldnote', fieldNoteSchema);
module.exports = Fieldnote;