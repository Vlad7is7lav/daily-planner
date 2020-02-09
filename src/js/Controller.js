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
		this.view.on('openBD', this.openBD.bind(this));
		this.view.on('getDates', this.getDates.bind(this));
		this.view.on('checkData', this.checkDataM.bind(this));
	}

	openBD() {
		const db = this.model.openDBNow();
		console.log(1);

	}

	checkDataM(id, event) {
		let data = this.model.getTaskList(id);
		if(data) this.view.hCreateTab(event, data);
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

	getDates(month, year) {

		month = 1 + (+month);		
		if (month < 10) month = `0${month}`;
		let ym = `${month}.${year}`;
		
		let newData = this.model.datesFromState();
		let tdCollection = [...document.querySelectorAll('tbody td')];
		tdCollection.forEach(item => {
			let itemText = item.textContent.toString();
			if (item.textContent.length == 1) itemText = `0${item.textContent}`;
			if(newData.indexOf(`${itemText}.${ym}`) >= 0) {
				item.classList.add('circleOn');
				item.setAttribute('data-task', 'true');
			}
		})
	}
}

const controller = new Controller(model, view);

export default controller;