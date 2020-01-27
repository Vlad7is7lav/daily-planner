class Model {
	constructor(state = []) {
		this.state = state;
	}

	getTaskList(id) {
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

	openDBNow() {
		// window.addEventListener("DOMContentLoaded", () => {
			document.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
			if (!window.indexedDB) {
				window.alert('Ваш браузер не поддерживает indexedDB. Обновите браузер или используйте другой.');
			}

			var db = null;

			const BDname = "testDB1";
			const request = indexedDB.open(BDname, 1);

			request.onerror = (event) => {
				window.alert('Что-то пошло не так. Не могу создать базу данных!')
			};

			request.onsuccess = (event) => {
				db = event.target.result;

				db.onversionchange = () => {
					db.close;
					alert("База данных устарела, пожалуста, перезагрузите страницу.");
				}
			};

			request.onerror = (event) => {
				//выводим ошибку
				window.alert('Database error' + event.target.errorCode);
			}

			request.onupgradeneeded = (event) => {
				db = event.target.result;

				if (!db.objectStoreNames.contains('daily1')) { // if there's no "books" store
				    db.createObjectStore('daily1', {keyPath: "id"}); // create it
				}

				// // Создаем хранилище объектов для этой базы данных
				// var objectStore = db.createObjectStore(BDname, { keyPath: "myKey" });
			}

			request.onblocked = function() {
			  // есть другое соединение к той же базе
			  // и оно не было закрыто после срабатывания на нём db.onversionchange
			};

			let btn = document.getElementById('push');
			btn.addEventListener("click", addNote);

			function addNote() {
				console.log(1)
				console.log(db, IDBDatabase)
				const tx = db.transaction("daily1", "readwrite");
				const store = tx.objectStore('daily1');

				var req = store.add({
				"id": "14.01.2020",
				"task": "Разобраться с БД3"
			});
			}
		// });
	};
}

const model = new Model();

export default model;