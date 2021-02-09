import axios from "axios";

class Model {
	constructor(state = []) {
		this.state = state;
		this.db = null;
	}

	getTaskList(id, name, n) {	
		if (n === 0 && !name) return this.state.find(item => item.id == id);
		if (n === 0 && name) {
			let findList = this.state.find(item => item.name == name);
			console.log(findList, 'findlist')
			return findList;
		}

		this.state.forEach( function(element, index) {
			// console.log(element, id, element.id == id.toString())
		});
		let filterArray = [];

		if (n === 1) {
			let newData;
			this.state.forEach((item) => {
				if (item.id == id && item.name == name) {
					newData = {item : item.id, name: item.name, tasks: item.tasks};
				}
			});
			console.log(newData, 'fil tasks');
			return newData;
		}
		
		this.state.forEach((item) => {
			if (item.id == id) {
				filterArray.push({item : item.id, name: item.name});
			}
		});

		console.log(filterArray, 'fil');

		return filterArray;
	}



	addTaskList(taskList, index) { 						// необходимо увязать с gettasklist
		let isObj = this.getTaskList(taskList.id, taskList.name, 0);
		if (isObj === undefined) {
			this.state.push(taskList);
			// return taskList;
		} else {
			isObj.tasks.push(taskList.tasks[0]);
		}

		console.log(this.state, 'add123123');
		return taskList
	}

	updateItem(item) {
		// console.log(item, 'update item');
		let isObj = this.getTaskList(item.id, item.name, 0);
		console.log(isObj, 'isObj upd');
		isObj.tasks[item.index]['item'] = item.task;

		return this.state
	}

	updateComp(item) {
		console.log(item, 'update Compstate');
		let isObj = this.getTaskList(item.id, item.name, 0);
		let isObjComplete = isObj.tasks[item.index];
		isObjComplete['completed'] = item.completed;
		console.log(isObjComplete);
		console.log(this.state,'updComp');
		return this.state
	}

	deleteItem(item) {
		let isObj = this.getTaskList(item.id, item.name, 0);
		isObj.tasks.splice(item.index, 1);
		console.log(this.state, 'rem');
		return this.state;
	}

	deleteList(item) {
		const index = this.state.findIndex((element) => element.id === item.id && element.name == item.name);
		this.state.splice(index, 1);
		return this.state;
	}

	datesFromState() {
		let dates = Array.from(this.state, ({id}) => id);
		return dates;
	}

	async loginUser(data) {
		const request = await axios.post('/user/login', data)
		.then((response) => {return response.data})

		if(!request.auth) return false

		return {auth, user, todos} = request;

		// return {
		// 	auth: request.auth,
		// 	user: request.user,
		// 	todos: request.todos
		// }
	}

	async registerUser(data) {
		const request = await axios.get('/user/register')
		.then((response) => response.data)

		if(request.success === false) return console.log('Email address already registered');

		return response.data
	}

	//check token
	userAuth(inner) {
		const request = axios.get('/user/auth')
		.then(response => response.data)
		if (!request.auth) return console.log('Please, login first');

		inner(request.userData);

	}
}

export default Model;