var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res){
	res.send('TODO Api Root');
});
//getRequest all todos
app.get('/todos', function(req, res){
	res.json(todos);
});

//get todos/:id
app.get('/todos/:id', function(req, res){
	var todoId = parseInt(req.params.id);
	var matchedTodo = _.findWhere(todos, {id: todoId});
	if(matchedTodo){
		res.json(matchedTodo);
	}else{
		res.status(404).send(
			{
				error :{
					status: 404,
					message: 'TODO with this id doesn\'t exist'
				}
			});
	}
});

//posting a new todo item  /todos/todo
app.post('/todos', function(req, res){
	var body = _.pick(req.body, 'description', 'completed');
	if((!_.isBoolean(body.completed)) || (!_.isString(body.description)) || (body.description.trim().length === 0)){
		
	}
	body.description = body.description.trim();
	body.id = todoNextId++;
	var matchedTodo = _.findWhere(todos, {description: body.description});
	if(!matchedTodo){
		todos.push(body);	
		res.json(todos);
	}else{
		return res.status(200).send(
			{
				error :{
					status: 200,
					message: 'Todo already exist with this name.'
				}
			});
	}
});

app.listen(PORT, function(){
	console.log('Express Listening at ' + PORT + '!');
});