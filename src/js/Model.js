class Model {
	constructor(state = []) {
		this.state = state;
		this.db = null;
	}

	getTaskList(id) {		
		this.state.forEach( function(element, index) {
			console.log(element, id, element.id == id.toString())
		});

		return this.state.find(item => item.id == id)
	}



	addTaskList(taskList, index) {
		let isObj = this.getTaskList(taskList.id);
		if (isObj === undefined) {
			this.state.push(taskList);
			return taskList;
		} else {
			isObj.tasks.push(taskList.tasks[0]);
		}

		console.log(this.state, 'add');
		return taskList
	}

	updateItem(item) {
		let isObj = this.getTaskList(item.id);
		isObj.tasks[item.index]['item'] = item.task;
		console.log(isObj.tasks[item.index]['item']);
		console.log(this.state,'upd');

		return this.state
	}

	updateComp(item) {
		let isObj = this.getTaskList(item.id);
		let isObjComplete = isObj.tasks[item.index];
		isObjComplete['completed'] = item.completed;
		console.log(isObjComplete);
		console.log(this.state,'updComp');
		return this.state
	}

	deleteItem(item) {
		let isObj = this.getTaskList(item.id);
		isObj.tasks.splice(item.index, 1);
		console.log(this.state, 'rem');
		return this.state;
	}

	datesFromState() {
		let dates = Array.from(this.state, ({id}) => id);
		return dates;
	}

}

export default Model;