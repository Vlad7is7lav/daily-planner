import view from './View.js';
import model from './Model.js';

class Controller {
	constructor(model, view) {
		this.model = model;
		this.view = view;
		this.data = [];
		this.isAuth = false;
		this.pseudoID = 0;
		this.delay = false;

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
		this.view.on('auth', this.auth.bind(this));
	}
	
	async auth() {
		let response = await this.model.userAuth();
		
		this.isAuth = response.auth;
		console.log(this.isAuth);
		if(response.auth) this.view.showLoginMessage(0);
		let currentDate = new Date();	
		this.view.changeDate(currentDate.getFullYear(), currentDate.getMonth());

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

	// async addToDoHelp(taskList) {
	// 	if(taskList._id == "null") {
	// 		if (!this.isAuth) {
	// 			this.data.push({ // after execution we get tasklist
	// 				'_id': ++this.pseudoID,
	// 				date: taskList.date,
	// 				listName: taskList.name,
	// 				todos: [{ 					// <- внутри tasks должен быть массив объектов с task и completed равным true или false)
	// 						'item': taskList.item,
	// 						'complete': taskList.complete
	// 						}]
	// 			});
	// 			this.view.setID(this.pseudoID);
	// 			console.log(this.data)
	// 			return
	// 		}
	// 		this.delay = true;
			

	// 		response = await this.model.addList({ // after execution we get tasklist
	// 			date: taskList.date,
	// 			listName: taskList.name,
	// 			todos: { 					// <- внутри tasks должен быть массив объектов с task и completed равным true или false)
	// 					'item': taskList.item,
	// 					'complete': taskList.complete
	// 					}
	// 		});

	// 		this.data.push(response.data);
	// 		this.view.setID(response.data._id);
	// 	} else {
	// 		console.log(taskList._id, this.data)
	// 		this.data.find((val) => val['_id'] == taskList._id).todos.push(
	// 			{'item': taskList.item,
	// 			'complete': taskList.complete
	// 		});

	// 		if (!this.isAuth) return

	// 		response = await this.model.addTask({ // after execution we get tasklist
	// 			_id: taskList._id,
	// 			date: taskList.date,
	// 			listName: taskList.name,
	// 			todos: { 					// <- внутри tasks должен быть массив объектов с task и completed равным true или false)
	// 					'item': taskList.item,
	// 					'complete': taskList.complete
	// 					}
	// 		});
	// 	}
	// }

	async addToDo(taskList, event) {
		let response;
		// let isList = this.data.find((val) => val['_id'] == taskList._id && val['date'] == taskList.date);

		
		if(taskList._id == "null") {
			if (!this.isAuth) {
				this.data.push({ // after execution we get tasklist
					'_id': ++this.pseudoID,
					date: taskList.date,
					listName: taskList.name,
					todos: [{ 					// <- внутри tasks должен быть массив объектов с task и completed равным true или false)
							'item': taskList.item,
							'complete': taskList.complete
							}]
				});
				this.view.setID(this.pseudoID);
				console.log(this.data)
				return
			}
			

			response = await this.model.addList({ // after execution we get tasklist
				date: taskList.date,
				listName: taskList.name,
				todos: { 					// <- внутри tasks должен быть массив объектов с task и completed равным true или false)
						'item': taskList.item,
						'complete': taskList.complete
						}
			});
			
			this.data.push(response.data);
			this.view.setID(response.data._id);
			this.view.createItem();
		} else {
			console.log(taskList._id, this.data)
			this.data.find((val) => val['_id'] == taskList._id).todos.push(
				{'item': taskList.item,
				'complete': taskList.complete
			});
			
			if (!this.isAuth) return
			
			response = await this.model.addTask({ // after execution we get tasklist
				_id: taskList._id,
				date: taskList.date,
				listName: taskList.name,
				todos: { 					// <- внутри tasks должен быть массив объектов с task и completed равным true или false)
						'item': taskList.item,
						'complete': taskList.complete
						}
			});
			this.view.createItem();
		}
		
		
	}

	async updateItem(taskList, e) {
		const updatedItem = await this.model.updateItem({
			_id: taskList._id,
			todos: { 
					'item': taskList.item,
					'complete': taskList.complete
					},
			index: taskList.index
		});		

		this.data.find((val) => val['_id'] == taskList._id)
		  .todos[taskList.index] = { 
			'item': taskList.item,
			'complete': taskList.complete
			};
		
		console.log(this.data, 'cross')

		if(e === undefined) return;
		this.view.updateItem(e);
	
		return this.data
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
	}

	async deleteItem(taskList, e) {
			const response = await this.model.deleteItem({
				_id: taskList._id,
				index: taskList.index
			})

		this.view.deleteItem(e);
		console.log(response)
		if (response.data.todos.length === 0) {
			this.view.deleteList(taskList)
		}

		this.data.find((val)=>val['_id'] == taskList._id).todos.splice(taskList.index, 1);
		console.log(this.data)
		return
	}
	
	async deleteList(list, e) {
		let isList = await this.model.getList(list);
		
		if (isList['success'] === true) {
			const removeItem = await this.model.deleteList(list);
		}
		
		let pos = this.data.findIndex((val) => val._id === list['_id']);
		if(~pos) this.data.splice(pos, 1);
		console.log(isList.data)
		console.log(this.data)		

		this.view.removeCircle(isList.data.date);
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
		let allData = await this.model.getAllData();
		this.data = allData.data;
		this.isAuth = allData.auth;
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
		console.log(this.data)
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
		//clearData;
		this.data = [];
		this.view.reRender();
		this.view.showLoginMessage(2, login, logout);
	}
}

export default Controller;