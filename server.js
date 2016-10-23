var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [
	{
		id: 1,
		description: 'Meet sam for lunch',
		completed: false
	},
	{	id: 2,
		description: 'Go to market',
		completed: false
	},
	{	id: 3,
		description: 'Beat Sahil',
		completed: true
	}
];
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
	var matchedTodo;
	todos.forEach(function (todo){
		if(todo.id === todoId){
			matchedTodo = todo;
		}
	});
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
app.listen(PORT, function(){
	console.log('Express Listening at ' + PORT + '!');
});