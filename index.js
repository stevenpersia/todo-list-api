/* NPM PACKAGES */
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());
mongoose.connect(
	'mongodb://localhost:27017/todo',
	{ useNewUrlParser: true }
);

/* MODEL */
const Task = mongoose.model('Task', {
	title: String,
	done: Boolean,
	createdAt: { type: Date, default: Date.now }
});

/* TODO LIST */
app.get('/', function(req, res) {
	Task.find().exec(function(err, tasks) {
		if (err) {
			res.status(400).json({ error: 'Something went wrong :(' });
		} else {
			res.status(200).json(tasks);
		}
	});
});

/* CREATE */
app.post('/create', function(req, res) {
	const newTask = new Task(req.body);

	newTask.save(function(err, taskSaved) {
		if (err) {
			res.status(400).json({ error: 'Something went wrong :(' });
		} else {
			res.status(200).json(taskSaved);
		}
	});
});

/* UPDATE */
app.post('/update', function(req, res) {
	Task.findByIdAndUpdate(req.body._id, req.body, { new: true }).exec(function(
		err,
		task
	) {
		if (err) {
			res.status(400).json({ error: 'Something went wrong :(' });
		} else {
			res.status(200).json(task);
		}
	});
});

/* DELETE */
app.post('/delete', function(req, res) {
	Task.findByIdAndRemove(req.body._id).exec(function(err, task) {
		if (err) {
			res.status(400).json({ error: 'Something went wrong :(' });
		} else {
			res
				.status(200)
				.json({ message: 'Task successfully deleted.', id: task._id });
		}
	});
});

/* LAUNCHE SERVER */
app.listen(3000);
