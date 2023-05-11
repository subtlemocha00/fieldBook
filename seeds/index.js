const mongoose = require('mongoose');
const Fieldnote = require('../models/fieldnote');
const JobInfo = require('../models/jobInfo');
const notes = require('./fieldNoteSeeds');
const jobs = require('./jobInfoSeeds');
const surveyEntries = require('./surveySeeds');
const Surveynote = require('../models/surveynote');

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
  await Surveynote.deleteMany({});
  for (note of notes) {
    const newNote = new Fieldnote(note);
    await newNote.save();
  }
  for (job of jobs) {
    const newJob = new JobInfo(job)
    await newJob.save();
  }
  for (entry of surveyEntries) {
    const newEntry = new Surveynote(entry);
    await newEntry.save();
  }
}

seedDb().then(() => { mongoose.connection.close() });