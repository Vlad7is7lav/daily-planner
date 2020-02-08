// import controller from './Controller.js';
import { makeMonth, createElement, EventEmitter } from './addition.js';


class View extends EventEmitter {
	constructor() {
		super();
		
		this.selectYear = document.querySelector(".selectYear");
		this.selectMonth = document.querySelector(".selectMonth");
		this.calendarBlock = document.querySelector(".calendarBlock");
		this.flag = 0;
		this.months = ['January', 'Febriary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		this.tabs = 0;
		this.varsObject = {}; //look in onload() function
		this.id = '';
		this.eventListeners = null;
		this.editFlag = false;

		this.initilise();
	}

	initilise() {
		this.onload();
		this.addEventListeners();
	}

	onload() {
		this.varsObject.calendarDate_year = document.querySelector(".calendarDate_year");
		this.varsObject.calendarDate_month = document.querySelector(".calendarDate_month");

		window.onload = () => {
			let currentDate = new Date();
			this.changeDate(currentDate.getFullYear(), currentDate.getMonth());
			this.emit('openBD');
		}
	}

	addEventListeners() {
		const tabs = document.querySelector('.tabs');
		tabs.addEventListener('click', this.changeTab.bind(this)); // watch when click active on 'tab' for choice
		this.varsObject.calendarDate_year.addEventListener('click', this.openSelectYear.bind(this)); // watch when click active on 'year' for choice
		this.varsObject.calendarDate_month.addEventListener('click', this.openSelectMonth.bind(this)); // watch when click active on 'month' for choice

		let currentElem = null;
		// let calendarBlock = document.querySelector(".calendarBlock");
		const table = document.querySelector("table");
		const tdCells = document.getElementsByTagName('td');

		document.addEventListener('click', this.closeSelected.bind(this));

		table.addEventListener('mouseover', (event) => {
			if (currentElem) return 

			const target = event.target.closest('td');

			if (!target) return;

			currentElem = target;

			if(target.textContent == '') return;

			this.showPlus(event);
		})

		table.addEventListener('mouseout', (event) => {
			if(!currentElem) return;
			let relatedTarget = event.relatedTarget;

			if(event.target.tagName == 'TD' && event.target.textContent == '') return;

			while (relatedTarget) {
				if (relatedTarget == currentElem) return;

				relatedTarget = relatedTarget.parentNode;
			}
			this.hidePlus(event);
			currentElem = null;				
		});
	}

	showPlus({ target }) {
		let elem = document.createElement("I");
		elem.className = "fas fa-plus-circle showPlus";
		target.appendChild(elem);
		elem.onclick = (event) => {this.hCreateTab(event)} //watching when user click 'plus' on the top-right corner of the date-cell
	}

	hidePlus(e) {
		if (e.target.tagName == "I") {

			e.target.remove();
			return;
		};
		if(e.target.firstElementChild.tagName == "I") {
			
			e.target.firstElementChild.remove();
		}
		return;
	}

	openSelectYear(event) {
		// event.preventDefault();
		this.selectYear.classList.toggle('beVisible');
		this.selectMonth.classList.remove('beVisible');
		this.flag = 1;
	}

	openSelectMonth(event) {
		// event.preventDefault();
		this.selectMonth.classList.toggle('beVisible');
		this.selectYear.classList.remove('beVisible');
		this.flag = 1;	
	}

	closeSelected(event) {
		// event.preventDefault();
		let target = event.target;
		let year = this.varsObject.calendarDate_year;
		let month = this.varsObject.calendarDate_month;
		let month_number;

		if (this.flag != 1) return;

		if (target.className == 'cells') {
			this.selectYear.classList.remove('beVisible');
			year.innerText = target.innerText;
			month_number = month.getAttribute("data-month");

			this.changeDate(year.innerText, month_number);
			this.flag = 0;

		} else if (target.className == 'cellsM') {
			this.selectMonth.classList.remove('beVisible');
			month_number = target.getAttribute("data-month");
			month.innerText = this.months[month_number];

			this.changeDate(year.innerText, month_number);
			this.flag = 0;

		} else if (target.className != year.className && target.className != month.className) {
			this.selectYear.classList.remove('beVisible');
			this.selectMonth.classList.remove('beVisible');

			this.flag = 0;
		}
	}

	changeDate(year, month) {
		let daysBlock = document.getElementById("days");
		const text = makeMonth(year, month); 						// external funciton makeMonth() from file 'addition.js'
		this.varsObject.calendarDate_month.setAttribute("data-month", month);
		this.varsObject.calendarDate_month.innerText = this.months[month];
		this.varsObject.calendarDate_year.innerText = year;
		daysBlock.innerHTML = text;
		let tdCollection = [...document.querySelectorAll('tbody td')];

		for(let x of tdCollection) {
			if (x.innerText != '') {
				x.addEventListener('click', this.checkDayTask.bind(this));
			}
		}

		this.emit('getDates', month, year);
	}

	checkDayTask(event) {
		const year = this.varsObject.calendarDate_year.innerText;
		let month = 1 + +(this.varsObject.calendarDate_month.getAttribute("data-month"));
		if (month < 10) month = '0' + month;
		let day = event.target.innerText;
		if (day.length < 2) day = '0' + day;
		const id = `${day}.${month}.${year}`;
		this.emit('checkData', id);
		console.log(id);
	}

	

	hCreateTab(event, data) {
		if (data) {

		}
		//скорее всего вызов будет такой hCreatetab(event, data, id) если есть id 
		// то вместо кода ниже просто создать таб с id так как id это дата 
		// и после этого createSection а затем createItem(task) через цикл for of для каждого item из {tasks}
	  // Check date in this.state
	  // const check = this.controller.checkDate() // Check if date has already created and located on the server

	  // Creating Tabs
		const sections = document.querySelectorAll('.tabs_content > section');
		const tab = document.querySelectorAll('.tabs > .tab');
		let day = event.target.parentElement.textContent;
		let year = document.querySelector(".calendarDate_year").textContent;
		let month = +(document.querySelector(".calendarDate_month").getAttribute("data-month")) + 1;
		let tabsArray = Array.prototype.slice.call(tab);

		const inputUnacted = document.getElementById('unacted');
		const inputCompleted = document.getElementById('completed');
		completed(inputCompleted, false);
		unacted(inputUnacted, true);

		

	  // Add '0' before number of month or day
		if (month < 10) {month = '0' + month};
		if (day < 10) {day = '0' + day};
	  //

	  // Check if this day already open in tabs
		for (let i = 0; i < tabsArray.length; i++) {
			if (tabsArray[i].textContent == `${day}.${month}.${year}`) {
				tabsArray[i].classList.add("active");
				this.changeTab(null, tabsArray[i]);
				return
			}
			tabsArray[i].classList.remove("active");
		}

		this.id = `${day}.${month}.${year}`;

		//if getid true
		// то автоматически через контроллер вызывается createItem для каждой задачи этого дня

		if (sections != null) {
			Array.prototype.slice.call(sections).forEach( function(element, index) {
				element.classList.remove("active");
			});
		};
		
		if (this.tabs == 3) {
			document.querySelectorAll('.tab')[this.tabs-1].remove(); // delete last 'tab' element
			document.querySelector('.tabs_content').lastElementChild.remove(); // delete content block 
			this.tabs = 2;
		}

		let tabs = document.querySelector(".tabs");

	//Creating tab with date for tasks
		if (tab != null) {
			tabsArray.forEach( function(element, index) {
				element.classList.remove("active");
			})
		};
		let elemTab = createElement("div", {className: `tab active`}, this.id);
		tabs.insertBefore(elemTab, tabs.firstElementChild);

		this.tabs++;

	//Call f createSection for creating List(Section)
		this.createSection();
	//Call f createItem for creating task item
		this.createItem();	
	}

	//Creating section for tasks
	createSection() {
		let elemSection = createElement("section", {className : 'tab_content active'});
		let elemUL = createElement("ul", {className : 'tabs_content_list'});
		const tabs_content = document.querySelector(".tabs_content");
		elemSection.appendChild(elemUL);
		tabs_content.insertBefore(elemSection, tabs_content.firstElementChild);

		// add EventListener to add item in section
		if (this.eventListeners == null) {
			const addButton = document.querySelector(".no-filter.addItem");
			addButton.addEventListener('click', this.hAddItem.bind(this));
			this.eventListeners = 'ACTIVATED'
		}		
	}

	// Creating ToDo Elements
	createItem() { // createItem(data) если есть data = tasks from DB or state
		//всё указанное ниже + label.innerText = task
		const currentULSection = document.querySelector('section.active > .tabs_content_list');

		if(currentULSection.querySelectorAll('input').length > 18) return alert('Free version allows you create only 18 tasks');

		currentULSection.querySelectorAll('input').length;
		let elemLI = createElement("li", {className : 'tabs_content_list_item'});
		let elemLILabel = createElement("label", {className : 'label_Hide'});
		let elemLIinput = createElement('input', {type : 'text', className : 'textfield'});
		elemLI.innerHTML = "<div class=\"item_delete\"><i class=\"fas fa-times\"></i></div></li>";

		elemLI.appendChild(elemLILabel);
		elemLI.appendChild(elemLIinput);
		currentULSection.appendChild(elemLI);

		const inputs = currentULSection.querySelectorAll('input'); // Find all input in section
		inputs[inputs.length-1].focus(); 						// Add the last input focus()

		return this.todoEventListeners(elemLI);
	}

	todoEventListeners(item) {
		const i = item.querySelector('div > i.fas');
		const input = item.querySelector('input');
		const label = item.querySelector('label');

		item.addEventListener('click', this.editItem.bind(this, input, label)); 			// if click -> edit task
		i.addEventListener('click', this.hdeleteItem.bind(this)); 				// if click -> add new 'li' (check if old 'li' empty)
		input.addEventListener('keydown', this.hAddItem.bind(this)); 			// if input in focus and push 'enter' -> add new 'li' (check if old 'li' empty)
		input.addEventListener('focusout', this.catch_focusOut.bind(this));
		// li.addEventListener('click', this.hEditItem.bind(this)); // if click == ctrl+click -> cross out the word,  
																// else track keyup click without moving and go inside to edit item
		return item;
	}

	hdeleteItem(e) {
		const id = this.id;
		const labelsCollection = [...document.querySelectorAll('section.active .item_delete i')];
		let indexItem = labelsCollection.indexOf(e.target); // get index of removing element
		this.emit('deleteItem', {'id': id, 'index': indexItem}, e);
		this.isTask(labelsCollection, true);
	}

	hupdateItem(e) {
		const id = this.id;
		const inputCollection = [...document.querySelectorAll('section.active input')];
		let indexItem = inputCollection.indexOf(e.target);
		this.emit('updateItem', {'id': id, 'index': indexItem, 'task': e.target.value}, e);
	}

	hupdateCompState(e, complete) {
		const id = this.id;
		const labelsCollection = [...document.querySelectorAll('section.active label')];
		let indexItem = labelsCollection.indexOf(e.target);
		this.emit('updateCompState', {'id': id, 'index': indexItem, 'complete': complete}, e);
	}

	hAddToDo(e) {
		// event.preventDefault() //stop sending data
		const id = this.id;
		const tasks = [];
		const labelsCollection = [...document.querySelectorAll('section.active > .tabs_content_list input')];
		let indexItem = labelsCollection.indexOf(e.target);
		console.log(indexItem);	
		const element = labelsCollection[indexItem].value;	
		this.emit('addToDo', {'id': id, 'index': indexItem, 'item': element, 'completed': false}, e);
		this.isTask(labelsCollection);

	}

	catch_focusOut(e) {
		if(e.type == 'focusout') { // && e.relatedTarget == null 
			if (e.target.value == '') {
				e.target.parentNode.remove();
				return;
			} 

			let input = e.target;
			input.value = input.value.trim()  // Clear empty space before and after
			let value = input.value;
			let label = input.previousElementSibling;

			let prevLabelText = label.innerText;
			const itemAmount = e.target.closest('ul').querySelectorAll('input').length;
			input.classList.add('input_hide');
			label.innerText = value;
			label.classList.remove('label_Hide');

			if (this.editFlag === true && e.target.value != prevLabelText) {
				this.editFlag = false;
				this.hupdateItem(e);
				return;
			}

			this.editFlag = false;

			if ((itemAmount <= 1) && e.target.value === '' || e.target.value === prevLabelText) return;
				// this combination of comparisons allows stop function if first item is emptied or e.target.value === text in label 
				// or if we use (e.ctrlKey & e.keyCode) because in this case e.target.value and prevLabelText are equal.
			
			this.hAddToDo(e);
		}
	}

	addItem(event) {
		event.target.classList.add('input_hide'); //перенес в addItem
		event.target.previousElementSibling.classList.remove('label_Hide');
		
	}

	deleteItem(event) {
		let target = event.target;
		while (target.tagName != 'LI') {
			target = target.parentNode;
		}
		target.remove();
	}

	updateItem(e) {
		let input = e.target;
		input.value = input.value.trim();
		let value = input.value;
		let label = input.previousElementSibling;
		input.classList.add('input_hide');
		label.innerText = value;
		label.classList.remove('label_Hide');
	}

	isTask(labelsCollection, del) {
		let tdCollection = [...document.querySelectorAll('tbody td')];
		
		const nDay = this.id.split('', 2).join('');
		if (labelsCollection.length <= 1 & !del) {
			console.log(labelsCollection.length);
			for (let x of tdCollection) {
				if (x.innerText === nDay) {
					x.classList.add('circleOn');
				}
			}
		} else if (labelsCollection.length === 1 & del) {
			for (let x of tdCollection) {
				if (x.innerText === nDay) {
					x.classList.remove('circleOn');
				}
			}
		}
	}

	hAddItem(event) {
		let e = event;
		let flag = 0;
		let input = e.target;
		let value = input.value;
		let label = input.previousElementSibling;

		if (e.keyCode == 27) {
			event.preventDefault();
			if (value == '') {
				e.target.blur();
				return;
			}
			input.value = label.innerText;
			input.classList.add('input_hide');
			label.classList.remove('label_Hide');
			return;
		}
	
		else if (e.keyCode != 13 & e.type != 'focusout' & e.target.tagName != 'I') {
			return 
		}

		else if (e.ctrlKey & e.keyCode == 13) {	
			// проверка флага на edit а не на добавление
			if (!e.target.value) return console.log('Введите задачу');

			if (this.editFlag === true) {
				this.hupdateItem(e);
				return;
			}

			if (value != label.innerText) {	// check if text didn't change
				let trimValue = event.target.value.trim();
				event.target.value = event.target.value.trim();
				label.innerText = trimValue;
				this.hAddToDo(e);
			} else {
				e.target.classList.add('input_hide');
				e.target.previousElementSibling.classList.remove('label_Hide');
			}			
			return;
		}

		else if (e.type == 'click') {

			if (e.target.classList == "far fa-plus-square") {
				let inputs = document.querySelectorAll('section.active > .tabs_content_list input');

				for (let element of inputs) {
					if(!this.itemIsEmpty(element)) {						
						element.classList.remove('input_hide');
						element.previousSibling.classList.add('label_Hide');
						element.focus();
						return;
					}
				}
				this.createItem();
				return;
			}

			if (this.itemIsEmpty()) {
				this.createItem();
				this.itemOut(2);
				return;
			}
			return
		}

		else if (e.keyCode == 13) {
			event.preventDefault();
			if (!e.target.value) return console.log('Введите задачу');
			// !!! описать анимацию появления сообщения "Введите задачу"

			const inputs = document.querySelectorAll('section.active > .tabs_content_list input');

			// Clear empty space before and after
			let trimValue = event.target.value.trim();
			event.target.value = trimValue;
			 
			for (let element of inputs) {
				if(!this.itemIsEmpty(element)) {						
					element.classList.remove('input_hide');
					element.previousSibling.classList.add('label_Hide');
					element.focus();
					return;
				}
			}
			
			this.createItem();
			this.itemOut(2, event);
			flag = 1;
			return;
		} 		
	}

	// Funciton itemOut(k). When we leave input or move to another input. Parameter k - indicates which input (last or before last) we need.
	itemOut(k, event) {
		const inputs = document.querySelectorAll('section.active > .tabs_content_list input');
		const lastLI = inputs[inputs.length-k].previousElementSibling;
		const lastInputs = inputs[inputs.length-k]
		lastInputs.classList.add('input_hide');
		lastLI.classList.remove('label_Hide');
		lastLI.innerText = inputs[inputs.length-k].value;
		lastInputs.blur();
		const lastPlus = lastLI.previousElementSibling;

		if (k === 2) {
			let lastPlus = lastLI.previousElementSibling;
		}
	}

	editItem(input_, label_, event) {
		if (event.target.tagName === 'I') return
		else if (event.ctrlKey & event.type == 'click') {
			
			if (label_.style.textDecoration == 'line-through') {
				label_.style.textDecoration = 'none';
				label_.setAttribute('data-complete', 'false');	
			} else {
				label_.style.textDecoration = 'line-through';
				label_.setAttribute('data-complete', 'true');
			}
			// const e = event.target.nextElementSibling;
			let complete = label_.getAttribute('data-complete');
			this.hupdateCompState(event, complete);
			return;
		
		} else {
			this.editFlag = true;
			input_.classList.remove('input_hide');
			label_.classList.add('label_Hide');
			input_.focus();
		}
	}

	itemIsEmpty(elem) {
		let field = elem.value;
		if (field.trim() == '') return false
		elem.blur();
		return true;
	}

	// function for change active tab on click
	changeTab(event, cTab) {

		// check if click on active tab
		if (event != null) {
			if(event.target.classList == 'tab active') return;
		}
		

		let k = 0;
		let target = cTab || event.target;
		if (cTab) target.classList.remove("active");
		
		const tab = document.querySelectorAll('.tabs > .tab');
		const content = document.querySelectorAll('.tabs_content > .tab_content');

		if(target.className == 'tab') {
		  // Remove class active from tab
			Array.prototype.slice.call(tab).forEach( function(element, index) {
				element.classList.remove("active");
			})
		  // Add class '.active'  for tab 
			target.classList.add('active');
			this.id = target.innerText;

		  // Remove class active from content
			Array.prototype.slice.call(content).forEach( function(element, index) {
				element.classList.remove("active");
			})

		  // Searching the number of the active tab to choose the right content and add class '.active' 

			for (let i = 0; i < tab.length; i++) {
				if (target == tab[i]) {
					content[i].classList.add('active');

				}
			}
		}
	}

	test() {
		console.log("test done well");
	}

};


const view = new View();

export default view;

