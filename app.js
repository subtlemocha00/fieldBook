const PORT = 3000;
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose')
const methodOverride = require('method-override');
const date = require('date-and-time');
// const time = require('timeLibrary');

const Fieldnote = require('./models/fieldnote')

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

app.get('/comments', async (req, res) => {
	const comments = await Fieldnote.find({})
	res.render('commentPage', { comments })
})

app.post('/comments', async (req, res) => {
	const note = req.body.note;
	if (note) {
		// work out adding timestamps and dates later
		const now = new Date();

		const newFieldnote = new Fieldnote({ note: note, date: date.format(now, 'YYYY/MM/DD'), time: date.format(now, 'HH:mm:ss'), location: 'ABC Street' })
		await newFieldnote.save();
		console.log(newFieldnote)
		const comments = await Fieldnote.find({})
		res.render('commentPage', { comments })
	} else {
		const comments = await Fieldnote.find({})
		res.render('commentPage', { comments })
	}
})

app.get('/comment/jobs', (req, res) => {
	res.render('jobs')
})

app.get('/comments/new', (req, res) => {
	res.render('new');
})

app.get('/comments/:id', async (req, res) => {
	const { id } = req.params;
	const comment = await Fieldnote.findById(id);
	res.render(`show`, { comment });
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