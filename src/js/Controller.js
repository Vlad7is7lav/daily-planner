import view from './View.js';
import model from './Model.js';

class Controller {
	constructor(model, view) {
		this.model = model;
		this.view = view;
		view.test();

		this.view.on('addToDo', this.addTodo.bind(this))
	}

	addTodo(taskList) {
		console.log('taskList');
		// if(this.model.getTaskList(taskList.id)) {
		// 	this.model.updateTaskList(taskList);
		// 	return;
		// }

		const item = this.model.addTaskList({
			id: taskList.id,
			tasks: taskList.tasks,
			completed: taskList.completed
		});
	}

	// checkDate(id) {
	// 	const check = this.model.getTaskList(id);
	// 	return check;
	// }
}

view.test();

const controller = new Controller(model, view);

export default controller;