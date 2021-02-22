import view from './View.js';
import model from './Model.js';

class Controller {
	constructor(model, view) {
		this.model = model;
		this.view = view;
		this.data = [];

		this.view.on('addToDo', this.addToDo.bind(this));
		this.view.on('updateItem', this.updateItem.bind(this));
		this.view.on('deleteItem', this.deleteItem.bind(this));
		this.view.on('updateCompState', this.updateCompState.bind(this));
		// this.view.on('getDates', this.getDates.bind(this));
		this.view.on('getAllData', this.getAllData.bind(this));
		this.view.on('checkDataM', this.checkDataM.bind(this));
		this.view.on('getNeededData', this.getNeededData.bind(this));
		this.view.on('checkDataToOpen', this.checkDataToOpen.bind(this));
		this.view.on('deleteList', this.deleteList.bind(this));
		this.view.on('loginUser', this.loginUser.bind(this));
		this.view.on('logoutUser', this.logoutUser.bind(this));
		this.view.on('registerUser', this.registerUser.bind(this));
	}
	
	openBD() {
		const db = this.model.openDBNow();
	}

	checkDataM(id, name, event) {
		console.log(id, name, 'checkDataM1');
		const newData = this.model.getTaskList(id, name, 1);

		if(newData) this.view.hCreateTab(event, name, newData);
	}

	getNeededData(id) {
		const data = this.model.getTaskList(id);
		console.log(data, 'checkNeededs');
		this.view.getArray(data, id);
	}

	addToDo(taskList, event) {
		const section = this.model.addTaskList({ // after execution we get tasklist
			date: taskList.date,
			name: taskList.name,
			tasks: [{ 					// <- внутри tasks должен быть массив объектов с task и completed равным true или false)
					'task': taskList.task,
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

	// getDates(month, year) {
	// 	let ym = `${month}.${year}`;
	// 	let newData = this.model.datesFromState();
	// 	let tdCollection = [...document.querySelectorAll('tbody td')];
	// 	tdCollection.forEach(item => {
	// 		let itemDay = item.getAttribute('data-cell');
	// 		if(newData.indexOf(`${itemDay}.${ym}`) >= 0) {
	// 			item.classList.add('circleOn');
	// 			item.setAttribute('data-task', 'true');
	// 		}
	// 	})
	// }

	checkDataToOpen(date, event) {
		const list_of_dates = this.data.filter(item => item.date == date);
		if (list_of_dates) this.view.hSelectList(event, list_of_dates);
		return null
	}

	async getAllData(month, year) {
		let ym = `${month}-${year}`;
		this.data = await this.model.getAllData();
		let dates = Array.from(this.data, ({date}) => date);
		let tdCollection = [...document.querySelectorAll('tbody td')];
		tdCollection.forEach(item => {
			console.log(ym);
			let itemDay = item.getAttribute('data-cell');
			if(dates.indexOf(`${itemDay}-${ym}`) >= 0) {
				item.classList.add('circleOn');
				item.setAttribute('data-task', 'true');
			}
		})
		console.log(dates)
	}

	async registerUser(email, password) {
		console.log('registerUser');
		let data = {'email': email, 'password': password};
		let response = await this.model.registerUser(data);
		console.log(response)
		if(response.message == 'duplicate') return this.view.showRegisterMessage(1);

		this.view.showRegisterMessage(0);

	}

	async loginUser(email, password) {
		
		let data = {'email': email, 'password': password};
		let response = await this.model.loginUser(data);

		if(response.auth == false) return this.view.showLoginMessage(1);
		this.view.showLoginMessage(0);
		// this.view.changeDate()
		return 
	}

	async logoutUser(login, logout) {
		let response = await this.model.logoutUser();
		//clearData

		this.view.showLoginMessage(2, login, logout);
	}
}

export default Controller;