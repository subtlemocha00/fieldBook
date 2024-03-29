const PORT = 3000;
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose')
const methodOverride = require('method-override');
const date = require('date-and-time');

const Fieldnote = require('./models/fieldnote');
const Surveynote = require('./models/surveynote');
const JobInfo = require('jobInfo');
const Surveyheader = require('./models/surveyhead');

mongoose.connect('mongodb://127.0.0.1:27017/field-book')
	.then(() => {
		console.log('MONGO CONNECTION OPEN!');
	})
	.catch(err => {
		console.log('OH NO! MONGO DID NOT WORK!');
		console.log(err);
	})

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/jobs', async (req, res) => {
	const jobs = await JobInfo.find({})
	res.render('jobs', { jobs })
})

app.get('/jobs/:id/comments', async (req, res) => {
	const { id } = req.params;
	const job = await JobInfo.findById(id);
	const comments = await Fieldnote.find({})
	res.render(`comments`, { comments, job });
})

app.post('/jobs/:id/comments', async (req, res) => {
	const note = req.body.note;
	const { id } = req.params;
	const job = await JobInfo.findById(id);
	if (note) {
		const now = new Date();
		const newFieldnote = new Fieldnote({
			number: job.number, note: note, date: date.format(now, 'YYYY/MM/DD'), time: date.format(now, 'hh:mm A'), location: 'ABC Street'
		})
		await newFieldnote.save();
		console.log(newFieldnote)
		const comments = await Fieldnote.find({})
		res.render('comments', { comments, job })
	} else {
		const comments = await Fieldnote.find({})
		res.render('comments', { comments, job })
	}
})

app.get('/jobs/:id/comments/new', async (req, res) => {
	const { id } = req.params
	const job = await JobInfo.findById(id)
	res.render('new', { job });
})

app.get('/comments/:id', async (req, res) => {
	const { id } = req.params
	const comment = await Fieldnote.findById(id)
	const job = await JobInfo.findOne({ number: comment.number })
	console.log(job)
	res.render('show', { comment, job })
})


app.get('/comments/:id/edit', async (req, res) => {
	const { id } = req.params;
	const comment = await Fieldnote.findById(id);
	res.render('edit', { comment });
})

app.put('/comments/:id', async (req, res) => {
	const { id } = req.params;
	const editedComment = await Fieldnote.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
	res.redirect(`/comments/${id}`);
})

app.delete('/comments/:id', async (req, res) => {
	const { id } = req.params;
	await Fieldnote.findByIdAndDelete(id);
	res.redirect('/comments');
})

app.get('/jobs/:id/survey', async (req, res) => {
	const { id } = req.params;
	const job = await JobInfo.findById(id);
	const surveyHeader = await Surveyheader.findOne({})
	const surveyNotes = await Surveynote.find({})
	res.render('survey', { job, surveyNotes, surveyHeader });
})

async function parseSurveyNote(job, { point, backsight, foresight }) {
	const now = new Date();
	const newSurveyNote = await new Surveynote({
		number: job.number,
		point: point,
		hi: 150,
		bs: +backsight,
		fs: +foresight,
		elevation: foresight >= 0 ? 150 - foresight : 150 - backsight,
		date: date.format(now, 'YYYY/MM/DD')
	})
	await newSurveyNote.save();
}

async function parseSurveySetup(job, { benchmark, backsight, foresight, elevation }) {
	const now = new Date();
	const newSurveySetup = await new Surveyheader({
		number: job.number,
		benchmark: benchmark,
		bs: +backsight,
		fs: +foresight,
		hi: (elevation + foresight),
		elevation: +elevation,
		date: date.format(now, 'YYYY/MM/DD')
	})
	await newSurveySetup.save();
	console.log(newSurveySetup)
}

app.post('/jobs/:id/survey', async (req, res) => {
	const { id } = req.params;
	const job = await JobInfo.findById(id);
	if (req.body.hasOwnProperty('point')) {
		await parseSurveyNote(job, req.body);
		console.log(req.body)
		const surveyNotes = await Surveynote.find({})
		const surveyHeader = await Surveyheader.findOne({})
		// const surveyHeader = { number: job.number, benchmark: N / A, bs: 0, fs: 0, hi: 0, elevation: 0, date: 'Today' }
		res.render('survey', { job, surveyHeader, surveyNotes })
	}
	if (req.body.hasOwnProperty('benchmark')) {
		await parseSurveySetup(job, req.body);
		console.log(req.body)
		const surveyHeader = await Surveyheader.find({})
		console.log(surveyHeader)
		const surveyNotes = await Surveynote.find({})
		res.render('survey', { job, surveyHeader, surveyNotes })
	}
})

app.get('/jobs/:id/surveySetup', async (req, res) => {
	const { id } = req.params;
	const job = await JobInfo.findById(id);
	res.render('surveySetup', { job })
})


app.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
})