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
	var queryParams = req.query;
	var filteredTodos = todos;
	//if has property
	if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
		filteredTodos = _.where(filteredTodos, {
			completed: true
		});
	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
		filteredTodos = _.where(filteredTodos, {
			completed: false
		});
	}
	if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
		filteredTodos = _.filter(filteredTodos, function (todo) {
			return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
		});
	}
	res.json(filteredTodos);
});

//get todos/:id
app.get('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id);
	var matchedTodo = _.findWhere(todos, {
		id: todoId
	});
	if (matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send({
			error: {
				status: 404,
				message: 'TODO with this id doesn\'t exist'
			}
		});
	}
});

//posting a new todo item  /todos/todo
app.post('/todos', function (req, res) {
	var body = _.pick(req.body, 'description', 'completed');
	//call create on db.todo
	//respond with 200 and todo
	db.todo.create(body).then(function (todo){
		res.json(todo.toJSON())
	}),function (e){
		res.status(400).json(e);
	};
//	if ((!_.isBoolean(body.completed)) || (!_.isString(body.description)) || (body.description.trim().length === 0)) {
//
//	}
//	body.description = body.description.trim();
//	body.id = todoNextId++;
//	var matchedTodo = _.findWhere(todos, {
//		description: body.description
//	});
//	if (!matchedTodo) {
//		todos.push(body);
//		res.json(todos);
//	} else {
//		return res.status(200).send({
//			error: {
//				status: 200,
//				message: 'Todo already exist with this name.'
//			}
//		});
//	}
});
//delete /todos/:id
app.delete('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id);
	var matchedTodo = _.findWhere(todos, {
		id: todoId
	});
	if (matchedTodo) {
		todos = _.without(todos, matchedTodo)
		res.json({
			message: 'Todo deleted with id: ' + todoId + '.'
		});
	} else {
		res.status(404).send({
			error: {
				status: 404,
				message: 'TODO with this id doesn\'t exist'
			}
		});
	}
});
//PUT /todo/:id
app.put('/todos/:id', function (req, res) {
	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};
	var todoId = parseInt(req.params.id);
	var matchedTodo = _.findWhere(todos, {
		id: todoId
	});
	if (!matchedTodo) {
		return res.status(404).send({
			error: {
				status: 404,
				message: 'TODO with this id doesn\'t exist'
			}
		});
	}
	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		return res.status(404).send({
			error: {
				status: 404,
				message: 'Incorrect data provided.'
			}
		});
	}
	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		return res.status(404).send({
			error: {
				status: 404,
				message: 'Incorrect data provided description.'
			}
		});
	}
	matchedTodo = _.extend(matchedTodo, validAttributes);
	res.json(matchedTodo);
});
db.sequelize.sync().then(function () {
	app.listen(PORT, function () {
		console.log('Express Listening at ' + PORT + '!');
	});
});
