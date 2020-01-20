class Model {
	constructor(state = []) {
		this.state = state;
	}

	getTaskList(id) {
		return this.state.find(item => item.id == id)
	}

	addTaskList(taskList) {
		let isObj = this.getTaskList(taskList.id);
		if (isObj === undefined) {
			this.state.push(taskList);
			return taskList;
		} else if (taskList.tasks.length == isObj.tasks.length) {
			this.updateTaskList(taskList);
			return 'EDIT'
		} else {
			isObj.tasks.push(taskList.tasks[taskList.tasks.length-1]);
		}		

		console.log(this.state, 'add');
		return taskList
		
		// let js = JSON.stringify(this.state);
		// let jsparsed = JSON.parse(js);

		 //  в taskList попадает объект
	}

	updateTaskList(taskList) {
		let isObj = this.getTaskList(taskList.id);
		console.log(isObj.tasks, taskList.tasks);
		isObj.tasks = taskList.tasks;
		console.log(this.state,'upd');

		return taskList
	}

	deleteItem(item) {
		let isObj = this.getTaskList(item.id);
		isObj.tasks.splice(item.index, 1);
		console.log(this.state, 'rem');
		return this.state;
	}
}

const model = new Model();

export default model;