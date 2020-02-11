class Model {
	constructor(state = []) {
		this.state = state;
		this.db = null;
	}

	getTaskList(id) {
		// return new Promise((resolve, reject) => {
		// 	const tx = this.db.transaction("daily1", "readwrite");
		// 	const store = tx.objectStore("daily1");
		// 	let obj;

		// 	var getValue = store.get(id);
			
			
		// 	getValue.onsuccess = (e) => {
		// 		let result = e.target.result;

		// 		console.log(result, result['task'][0]['item']);
		// 		resolve(result)				
		// 	}
		// })
		
		this.state.forEach( function(element, index) {
			console.log(element, id, element.id == id.toString())
		});

		return this.state.find(item => item.id == id)
	}



	addTaskList(taskList, index) {
		// return this.getTaskList(taskList.id)
		// .then((result) => {
		// 	console.log((result.id).toString(), result);
		// 	const tx = this.db.transaction("daily1", "readwrite");
		// 	const store = tx.objectStore('daily1');
		// 	e.target.result['task'][0]['item'] = '123213';
			
		// 	var req = store.put({
		// 		"id": (result.id).toString(),
		// 		"task": [{'item':}]
		// 	});
		// }).catch(() => {
		//   console.log('Transaction failed')
		// })

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


	

	openDBNow() {
		document.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
		if (!window.indexedDB) {
			window.alert('Ваш браузер не поддерживает indexedDB. Обновите браузер или используйте другой.');
		}

		const BDname = "testDB1";
		const request = indexedDB.open(BDname, 1);

		request.onerror = (event) => {
			window.alert('Что-то пошло не так. Не могу создать базу данных!')
		};

		request.onsuccess = (event) => {
			this.db = event.target.result;
			console.log(this.db);

			this.db.onversionchange = () => {
				this.db.close;
				alert("База данных устарела, пожалуста, перезагрузите страницу.");
			}
		};

		request.onerror = (event) => {
			//выводим ошибку
			window.alert('Database error' + event.target.errorCode);
		}

		request.onupgradeneeded = (event) => {
			this.db = event.target.result;

			if (!this.db.objectStoreNames.contains('daily1')) { // if there's no "books" store
			    this.db.createObjectStore('daily1', {keyPath: "id"}); // create it
			}

			// // Создаем хранилище объектов для этой базы данных
			// var objectStore = db.createObjectStore(BDname, { keyPath: "myKey" });
		}

		request.onblocked = function() {
		  // есть другое соединение к той же базе
		  // и оно не было закрыто после срабатывания на нём db.onversionchange
		};

		let btn = document.getElementById('push');
		btn.addEventListener("click", addNote.bind(this));
		let self = this;

		function addNote() {
			const tx = this.db.transaction("daily1", "readwrite");
			const store = tx.objectStore("daily1");
			var value;

			var res = store.get("18.01.2020");
			


			res.onsuccess = (e) => {
				let result = e.target.result;
				if(!result) {
					show(result);
					return;
				}
				show(result);
				
			}

			const show = (value) => {console.log(value)}

		};
	};
}

const data = [
				{
					id: "08.12.2019", 
					tasks: [
								{item: "1", completed: false},
								{item: "2", completed: false},
								{item: "3", completed: false},
								{item: "4", completed: false}
							]	
			 	},

			 	{
					id: "01.02.2020", 
					tasks: [
								{item: "1", completed: false},
								{item: "2", completed: false},
								{item: "3", completed: false},
								{item: "4", completed: false}
							]	
			 	},

			 	{
					id: "06.02.2020", 
					tasks: [
								{item: "1", completed: false},
								{item: "2", completed: false},
								{item: "3", completed: false},
								{item: "4", completed: false}
							]	
			 	}
			 ]




export default Model;