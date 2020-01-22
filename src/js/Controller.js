import view from './View.js';
import model from './Model.js';

class Controller {
	constructor(model, view) {
		this.model = model;
		this.view = view;
		view.test();

		this.view.on('addToDo', this.addTodo.bind(this));
		this.view.on('updateItem', this.updateItem.bind(this));
		this.view.on('deleteItem', this.deleteItem.bind(this));
	}

	addTodo(taskList, event) {

		const section = this.model.addTaskList({ // after execution we get tasklist
			id: taskList.id,
			tasks: taskList.tasks // <- внутри tasks должен быть массив объектов с task и completed равным true или false)
			// completed: taskList.completed
		});

		this.view.addItem(event);
		// return OK or FALSE (FALSE if data wasn't sent)
		// this.view.addItem(event);
	}

	updateItem(item, e) {
		if (this.model.getTaskList(item.id)) {

			const updatedItem = this.model.updateItem({ // after execution we get tasklist
				id: item.id,
				index: item.index, // <- внутри tasks должен быть массив объектов с task и completed равным true или false)
				task: item.task
				// completed: item.completed
			});			
		}

		this.view.updateItem(e);
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
}

const controller = new Controller(model, view);

export default controller;