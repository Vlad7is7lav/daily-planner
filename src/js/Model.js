class Model {
	constructor(state = []) {
		this.state = state;
	}

	getTaskList(id) {
		return this.state.find(item => item.id == id)
	}

	addTaskList(taskList) {
		if (this.getTaskList(taskList.id) === undefined) {
			this.state.push(taskList);
		}
		this.updateTaskList(taskList)		
		
		// let js = JSON.stringify(this.state);
		// let jsparsed = JSON.parse(js);


		return taskList; //  в taskList попадает объект
	}

	updateTaskList(taskList) {
		const isObj = this.getTaskList(taskList.id);
		isObj.tasks = taskList.tasks;
		console.log(this.state);

		return taskList

		// isObjTasks.forEach((element, index) => element == data.tasks[prop]);
	}
}

const model = new Model();

export default model;