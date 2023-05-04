const PORT = 3000;
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose')
const methodOverride = require('method-override');
const date = require('date-and-time');
// const time = require('timeLibrary');

const Fieldnote = require('./models/fieldnote')
const JobInfo = require('./models/jobInfo');

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
	res.render(`commentPage`, { comments, job });
})

app.post('/comments', async (req, res) => {
	const note = req.body.note;
	if (note) {
		const now = new Date();

		const newFieldnote = new Fieldnote({ note: note, date: date.format(now, 'YYYY/MM/DD'), time: date.format(now, 'H:mm A'), location: 'ABC Street' })
		await newFieldnote.save();
		console.log(newFieldnote)
		const comments = await Fieldnote.find({})
		res.render('commentPage', { comments })
	} else {
		const comments = await Fieldnote.find({})
		res.render('commentPage', { comments })
	}
})

app.get('/comments/:id', async (req, res) => {
	const { id } = req.params
	const comment = await Fieldnote.findById(id)
	const job = await JobInfo.findOne({ number: comment.number })
	console.log(job)
	res.render('show', { comment, job })
})

app.get('/jobs/:id/comments/new', (req, res) => {
	res.render('new');
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

app.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
})