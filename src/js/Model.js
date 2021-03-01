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



	async addTaskList(taskList) { 						// необходимо увязать с gettasklist
		if(taskList._id === null) {
			var response = await this.addList(taskList);
			return response;
		}


		// let isObj = this.getList(_id);
		
		if (isObj === undefined) {
			this.state.push(taskList);
			// return taskList;
		} else {
			isObj.tasks.push(taskList.tasks[0]);
		}

		console.log(this.state, 'add123123');
		return taskList
	}

	// updateItem(item) {
	// 	let isObj = this.getTaskList(item.id, item.name, 0);
	// 	console.log(isObj, 'isObj upd');
	// 	isObj.tasks[item.index]['item'] = item.task;
		
	// 	return this.state
	// }

	updateComp(item) {
		console.log(item, 'update Compstate');
		let isObj = this.getTaskList(item.id, item.name, 0);
		let isObjComplete = isObj.tasks[item.index];
		isObjComplete['completed'] = item.completed;
		console.log(isObjComplete);
		console.log(this.state,'updComp');
		return this.state
	}

	// deleteItem(item) {
	// 	let isObj = this.getTaskList(item.id, item.name, 0);
	// 	isObj.tasks.splice(item.index, 1);
	// 	console.log(this.state, 'rem');
	// 	return this.state;
	// }

	

	datesFromState() {
		let dates = Array.from(this.state, ({id}) => id);
		return dates;
	}

	

	async getAllData() {
		const request = await axios.get('/lists/all_lists')
		.then((respone) => respone.data);
		return request
	}

	async getList(list) {
		const request = await axios.get(`/lists/list?id=${list._id}`)
		.then((respone) => respone.data)
		return request
	}

	async addList(taskList) {
		const request = await axios.post('/lists/list', taskList)
		.then((respone) => respone.data);
		return request
	}

	async deleteList(list) {
		const request = await axios.delete(`/lists/list?id=${list._id}`);
		return request
	}

	async addTask(taskList) {
		const request = await axios.post('/lists//list/add_task', taskList)
		.then((respone) => respone.data);
		return request
	}

	async updateItem(taskList) {
		const request = await axios.patch('/lists/list/update_item', taskList)
		.then((respone) => respone.data);
		return request
	}

	async deleteItem(item) {
		const request = await axios.patch('/lists/list/del_task', item)
		.then((respone) => respone.data);
		return request

		// let isObj = this.getTaskList(item.id, item.name, 0);
		// isObj.tasks.splice(item.index, 1);
		// console.log(this.state, 'rem');
		// return this.state;
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