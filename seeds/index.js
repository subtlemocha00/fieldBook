const mongoose = require('mongoose');
const Fieldnote = require('../models/fieldnote');
const JobInfo = require('../models/jobInfo');
const { notes, jobs } = require('./seeds');

mongoose.connect('mongodb://127.0.0.1:27017/field-book')
  .then(() => {
    console.log('MONGO CONNECTION OPEN!');
  })
  .catch(err => {
    console.log('OH NO! MONGO DID NOT WORK!');
    console.log(err);
  })

const seedDb = async () => {
  await JobInfo.deleteMany({});
  await Fieldnote.deleteMany({});
  for (note of notes) {
    const newNote = new Fieldnote(note);
    await newNote.save();
  }
  for (job of jobs) {
    
  }
}

seedDb().then(() => { mongoose.connection.close() });