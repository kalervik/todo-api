var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/basic-sqlite-database.sqlite'
});
var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [1, 250]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
})
//sequelize.sync().then(function () {
//	console.log('Everything is synced');
//	Todo.create({
//		description: 'Hello World!'
//	}).then(function (todo) {
//		console.log('finished');
//	}).catch(function(error){
//		console.log(error);
//	})
//});

Todo.findById(1).then(function(todo){
	if(todo){
		console.log(todo.toJSON());
	}else{
		console.log('Todo not found!');
	}
})