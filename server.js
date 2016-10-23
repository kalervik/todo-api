var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.send('TODO Api Root');
});
//getRequest all todos
app.get('/todos', function (req, res) {
	var query = req.query;
	var where = {};
	if (query.hasOwnProperty('completed') && query.completed === 'true') {
		where.completed = true;
	} else if (query.hasOwnProperty('completed') && query.completed === 'false') {
		where.completed = false;
	}
	if (query.hasOwnProperty('q') && query.q.length > 0) {
		where.description = {
			$like: '%' + query.q + '%'
		}
	}
	db.todo.findAll({
		where: where
	}).then(function (todos) {
		res.json(todos);
	}, function (e) {
		res.status(400).json(e);
	});
});

//get todos/:id
app.get('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id);
	db.todo.findById(todoId).then(function (todo) {
		if (todo) {
			res.json(todo.toJSON());
		} else {
			res.status(404).send({
				error: {
					status: 404,
					message: 'TODO with id: ' + todoId + ' doesn\'t exist'
				}
			});
		}
	}, function (e) {
		res.status(404).json(e);
	});
});

//posting a new todo item  /todos/todo
app.post('/todos', function (req, res) {
	var body = _.pick(req.body, 'description', 'completed');
	db.todo.create(body).then(function (todo) {
		res.json(todo.toJSON());
	}).catch(function (e) {
		res.status(400).json(e);
	});
});
//delete /todos/:id
app.delete('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id);
	var where = {
		id : todoId
	}
	db.todo.destroy({
		where: {
			id: todoId
		}
	}).then(function (rowsAffected){
		if(rowsAffected === 0){
			res.status(404).json({
				error: 'No todo find with this id'
			});
		}else{
			res.status(204).send();
		}
	},function(e){
		res.status(500).send();
	});
});	
//PUT /todo/:id
app.put('/todos/:id', function (req, res) {
	var body = _.pick(req.body, 'description', 'completed');
	var todoId = parseInt(req.params.id, 10);
	console.log(todoId);
	var todoUpdate = {};
	if (body.hasOwnProperty('completed')) {
		todoUpdate.completed = body.completed;
	}
	if (body.hasOwnProperty('description')) {
		todoUpdate.description = body.description;
	}
	db.todo.findById(todoId).then(function (todo){
		if(todo){
			todo.update(todoUpdate).then(function(todo){
				res.json(todo.toJSON());
			},function(e){
				res.status(400).json(e);
			});
		}else{
			res.status(404).send();
		}
	},function(){
		res.status(500).send();
	});
});
db.sequelize.sync().then(function () {
	app.listen(PORT, function () {
		console.log('Express Listening at ' + PORT + '!');
	});
});
