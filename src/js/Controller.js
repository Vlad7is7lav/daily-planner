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
		this.view.on('updateCompState', this.updateCompState.bind(this));
		this.view.on('openBD', this.openBD.bind(this))
	}

	openBD() {
		const db = this.model.openDBNow();
		console.log(1);

	}

	addTodo(taskList, event) {

		const section = this.model.addTaskList({ // after execution we get tasklist
			id: taskList.id,
			tasks: [{ 					// <- внутри tasks должен быть массив объектов с task и completed равным true или false)
					'item': taskList.item,
					'completed': taskList.completed
					}]
		}, taskList.index);

		this.view.addItem(event);
		// return OK or FALSE (FALSE if data wasn't sent)
		// this.view.addItem(event);
	}

	updateItem(item, e) {
		if (this.model.getTaskList(item.id)) {

			const updatedItem = this.model.updateItem({ // after execution we get tasklist
				id: item.id,
				index: item.index, // <- внутри tasks должен быть массив объектов с task и completed равным true или false)
				task: item['task']
				// completed: item.completed
			});			
		}

		this.view.updateItem(e);
	}

	updateCompState(item, e) {
		if (this.model.getTaskList(item.id)) {

			const updatedItem = this.model.updateComp({ // after execution we get tasklist
				id: item.id,
				index: item.index, // <- внутри tasks должен быть массив объектов с task и completed равным true или false)
				completed: item.complete
			});			
		}

		// this.view.updateCompState(e);
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