import view from './View.js';
import model from './Model.js';

class Controller {
	constructor(model, view) {
		this.model = model;
		this.view = view;
		view.test();

		this.view.on('addToDo', this.addTodo.bind(this));
		this.view.on('updateTodo', this.updateTodo.bind(this));
		this.view.on('deleteItem', this.deleteItem.bind(this));
	}

	addTodo(taskList, event) {

		const section = this.model.addTaskList({ // after execution we get tasklist
			id: taskList.id,
			tasks: taskList.tasks, // <- внутри tasks должен быть массив объектов с task и completed равным true или false)
			// completed: taskList.completed
		});

		if (section == 'EDIT') return;
		this.view.addItem(event);
		// return OK or FALSE (FALSE if data wasn't sent)
		// this.view.addItem(event);
	}

	updateTodo(taskList, event) {
		if (this.model.getTaskList(taskList.id)) {

			const section = this.model.updateTaskList({ // after execution we get tasklist
				id: taskList.id,
				tasks: taskList.tasks, // <- внутри tasks должен быть массив объектов с task и completed равным true или false)
				// completed: taskList.completed
			});			
		}
		// this.view.deleteItem(event);
	}

	deleteItem(item, e) {
		if (this.model.getTaskList(item.id)) {
			const removeItem = this.model.deleteItem({
				id: item.id,
				index: item.index
			})
		}

		this.view.deleteItem(e);
	}



	// checkDate(id) {
	// 	const check = this.model.getTaskList(id);
	// если нашел по id, то отобразить таб с этой датой, секцию и задачи.
	// 	return check;
	// }
}

const controller = new Controller(model, view);

export default controller;