import view from './View.js';
import model from './Model.js';

class Controller {
	constructor(model, view) {
		this.model = model;
		this.view = view;

		this.view.on('addToDo', this.addTodo.bind(this));
		this.view.on('updateItem', this.updateItem.bind(this));
		this.view.on('deleteItem', this.deleteItem.bind(this));
		this.view.on('updateCompState', this.updateCompState.bind(this));
		this.view.on('getDates', this.getDates.bind(this));
		this.view.on('checkDataM', this.checkDataM.bind(this));
		this.view.on('getNeededData', this.getNeededData.bind(this));
		this.view.on('checkDataToOpen', this.checkDataToOpen.bind(this));
		this.view.on('deleteList', this.deleteList.bind(this));
	}

	openBD() {
		const db = this.model.openDBNow();
	}

	checkDataToOpen(id, event) {
		const data = this.model.getTaskList(id);
		console.log(data, 'checkDataToOpen');
		if (data) this.view.hSelectList(event, data)
	}



	checkDataM(id, name, event) {
		console.log(id, name, 'checkDataM1');
		const newData = this.model.getTaskList(id, name, 1);

		if(newData) this.view.hCreateTab(event, name, newData);

		// if (data && data.length < 2) this.view.hCreateTab(event, data[0]) // вызываем функцию
			// которая показывает список листов во view. И уже по щелчку во View достаем 
			//соответствующие данные, по имени списка.
		// if(data) this.view.hCreateTab(event, data);
	}

	getNeededData(id) {
		const data = this.model.getTaskList(id);
		console.log(data, 'checkNeededs');
		this.view.getArray(data);
	}

	addTodo(taskList, event) {
		const section = this.model.addTaskList({ // after execution we get tasklist
			id: taskList.id,
			name: taskList.name,
			tasks: [{ 					// <- внутри tasks должен быть массив объектов с task и completed равным true или false)
					'item': taskList.item,
					'completed': taskList.completed
					}]
		}, taskList.index);

		this.view.addItem(event);
	}

	updateItem(item, e) {
		if (this.model.getTaskList(item.id, item.name)) {
			
			const updatedItem = this.model.updateItem({ // after execution we get tasklist
				id: item.id,
				name: item.name,
				index: item.index, // <- внутри tasks должен быть массив объектов с task и completed равным true или false)
				task: item['task']
				// completed: item.completed
			});			
		}

		this.view.updateItem(e);
	}

	updateCompState(item, e) {
		if (this.model.getTaskList(item.id, item.name)) {

			const updatedItem = this.model.updateComp({ // after execution we get tasklist
				id: item.id,
				name: item.name,
				index: item.index, // <- внутри tasks должен быть массив объектов с task и completed равным true или false)
				completed: item.complete
			});			
		}

		// this.view.updateCompState(e);
	}

	deleteItem(item, e) {
		if (this.model.getTaskList(item.id, item.name)) {
			const removeItem = this.model.deleteItem({
				id: item.id,
				name: item.name,
				index: item.index
			})
		}

		this.view.deleteItem(e);
	}
	
	deleteList(item, e) {
		if (this.model.getTaskList(item.id, item.name)) {
			const removeItem = this.model.deleteList({
				id: item.id,
				name: item.name,
			})
		}
		
		
		const x = this.model.getTaskList(item.id);
		console.log(this.model.getTaskList(item.id), 'nday')
		if (x.length === 0) {
			let nDay = item.id.slice(0, 2);
			if(nDay < 10) {nDay = item.id.slice(1, 2)};
			console.log(nDay)
			let tdCollection = [...document.querySelectorAll('tbody td')];
			for (let x of tdCollection) {
				if (x.innerText === nDay) {
					x.classList.remove('circleOn');
				}
			}
			return;
		}
		
	}

	

	getDates(month, year) {

		// month = 1 + (+month);		
		// if (month < 10) month = `0${month}`;
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

export default Controller;