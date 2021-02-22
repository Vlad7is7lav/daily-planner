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
		let isObj = this.getTaskList(taskList.date, taskList.name, 0);
		
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

	async getAllData() {
		const request = await axios.get('/lists/all_lists')
		.then((respone) => respone.data)
		return request
	}

	async registerUser(data) {
		const request = await axios.post('/user/register', data)
		.then((response) => response.data);
		return request
	}

	async loginUser(data) {
		const request = await axios.post('/user/login', data)
		.then((response) =>  response.data) //auth, message, userData
		let {auth, message, userData} = request; 

		return {auth, message, userData}
		// console.log(request)
	}

	async logoutUser() {
		const request = await axios.get('/user/logout')
		.then((respone) => respone.data)
		let {auth, logout} = request; 
		return {auth, logout}
	}

	

	

	//check token
	userAuth(inner) {
		const request = axios.get('/user/auth')
		.then(response => response.data)
		if (!request.auth) return console.log('Please, login first', request.message);

		inner(request.userData);

	}
}

export default Model;