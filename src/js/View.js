import { makeMonth, createElement, EventEmitter, completed, showActive } from './addition.js';

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
		this.date = '';
		this.eventListeners = null;
		this.editFlag = false;
		this.currentElem = null;
		this.initilise();
		this.tempData;
		this.currentName;
		this.popupModal = {
			overlay:  document.querySelector('.overlay'),
			goButton: document.getElementById('go'),
			cancelButton: document.getElementById('cancel'),
			popupInput: document.getElementById('popupInput')
		}

	}

	initilise() {
		this.onload();
		this.addEventListeners();
	}

	

	onload() {
		this.varsObject.calendarDate_year = document.querySelector(".calendarDate_year");
		this.varsObject.calendarDate_month = document.querySelector(".calendarDate_month");

		window.onload = () => {
			// let currentDate = new Date();	
			// this.changeDate(currentDate.getFullYear(), currentDate.getMonth());
			this.emit('auth');

		}
	}

	addEventListeners() {
		document.addEventListener('click', this.closeSelected.bind(this));

		

		const closeLoginForm = document.querySelector('.closeForm');
		closeLoginForm.addEventListener('click', this.closeLoginForm.bind(this));

		const formSignIn = document.getElementById('form-sign-in');
		// formSignIn.addEventListener('submit', this.loginUser.bind(this));
		formSignIn.addEventListener('submit', (event) => this.loginUser(event, formSignIn.lastElementChild));

		const formSignUp = document.getElementById('form-sign-up');
		// formSignUp.addEventListener('submit', this.registerUser.bind(this));
		formSignUp.addEventListener('submit', (event) => this.registerUser(event, formSignUp.lastElementChild));

		const openLoginForm = document.querySelector('.login');
		openLoginForm.addEventListener('click', this.openLoginForm.bind(this, formSignIn.lastElementChild, formSignUp.lastElementChild));

		const tabs = document.querySelector('.tabs');
		tabs.addEventListener('click', this.changeTab.bind(this)); // listen when click active on 'tab' for choice
		
		let buttonComplete = document.getElementById("completed");
		let buttonActive = document.getElementById("active");
		buttonActive.addEventListener('change', () => showActive(buttonActive)); 	// button to select active tasks
		buttonComplete.addEventListener('change', () => completed(buttonComplete));	// button to select complete tasks
		
		this.varsObject.calendarDate_year.addEventListener('click', this.openSelectYear.bind(this)); // watch when click active on 'year' for choice
		this.varsObject.calendarDate_month.addEventListener('click', this.openSelectMonth.bind(this)); // watch when click active on 'month' for choice

		const table = document.querySelector("table");
		
		table.addEventListener('mouseover', this.tableMouseOver.bind(this));
		table.addEventListener('mouseout', this.tableMouseOut.bind(this));
	}

	openLoginForm(buttonSighIn, buttonSignUp) {
		buttonSighIn.disabled = false;
		buttonSignUp.disabled = false;
		const loginForm = document.querySelector('.logreg');
		const buttonSignInForm = document.querySelector('.button1');
		const buttonSignUpForm = document.querySelector('.button2');
		const backToMain = document.querySelectorAll('.back');
		const wrapper = document.querySelector('.wrapper');
		buttonSignInForm.addEventListener('click', this.openSignInForm.bind(this, wrapper));
		buttonSignUpForm.addEventListener('click', this.openSignUpForm.bind(this, wrapper))
		Array.prototype.slice.call(backToMain).forEach((elem) => {
			elem.addEventListener('click', this.backToMain.bind(this, wrapper))
		})
		if(loginForm.classList.contains('showLoginForm')) return this.closeLoginForm()
		loginForm.classList.add('showLoginForm')
	}

	closeLoginForm() {
		const loginForm = document.querySelector('.logreg')
		loginForm.classList.remove('showLoginForm')
	}

	openSignInForm(wrapper) {
		wrapper.style.marginLeft = "0px";
	}

	openSignUpForm(wrapper) {
		wrapper.style.marginLeft = "-1000px"
	}

	backToMain(wrapper) {
		wrapper.style.marginLeft = "-500px"
	}

	registerUser(event, formSignUp) {
		event.preventDefault();
		const email = document.querySelector('#email-up');
		const password = document.querySelector('#password-up');
		if(!email.value || !password.value || (password.value.length < 8)) return alert('Заполните все поля');
		formSignUp.disabled = true;
		console.log(1)
		this.emit('registerUser', email.value, password.value);
	}

	showRegisterMessage(data) {
		switch (data) {
			case 1:
				let wrapper_up = document.querySelector('.wrapper-sign_up');
				let elem = document.createElement('div');
				elem.classList.add('registerFalse');
				elem.innerHTML = 'Sorry, this login email already exists';
				wrapper_up.append(elem);
				console.log(wrapper_up.firstElementChild);
				setTimeout(()=> {
					wrapper_up.lastElementChild.remove();
				}, 1500)

				break;
			case 0: 
				let wrapper_up_2 = document.querySelector('.wrapper-sign_up');
				let elem_2 = document.createElement('div');
				elem_2.classList.add('registerTrue');
				elem_2.innerHTML = 'Congratulation! </br> Use your login and pass to sign in!';
				wrapper_up_2.append(elem_2);
				const wrapper = document.querySelector('.wrapper');
				setTimeout(()=>{
					wrapper_up_2.lastElementChild.remove();
					this.openSignInForm(wrapper)
				}, 1500)
				break;
		
			default:
				break;
		}
	}

	showLoginMessage(data, login, logout) {
		switch (data) {
			case 1:
				let wrapper_in = document.querySelector('.wrapper-sign_in');
				let elem = document.createElement('div');
				elem.classList.add('loginFalse');
				elem.innerHTML = 'You have entered an invalid email or password';
				wrapper_in.append(elem);
				console.log(wrapper_in.firstElementChild);
				setTimeout(()=> {
					// wrapper_in.lastElementChild.remove();
				}, 2000)
				break;
			case 0: 
				let wrapper_in_2 = document.querySelector('.wrapper-sign_in');
				let elem_2 = document.createElement('div');
				elem_2.classList.add('loginTrue');
				elem_2.innerHTML = 'You are logged in.';
				wrapper_in_2.append(elem_2);
				const wrapper = document.querySelector('.wrapper');
				let currentDate = new Date();
				setTimeout(()=>{
					wrapper_in_2.lastElementChild.remove();
					this.closeLoginForm();
					this.openExitForm();
					this.changeDate(currentDate.getFullYear(), currentDate.getMonth());
				}, 1000)
				break;
			case 2: 
				logout.replaceWith(login);
				break;
		
			default:
				break;
		}
	}

	openExitForm() {
		const login = document.querySelector('.login');
		let logout = document.createElement('div');
		logout.classList.add('login');
		logout.innerHTML = '<i class="fas fa-sign-out-alt" style="margin-right: 5px;"></i> Выход';
		logout.addEventListener('click', this.logoutUser.bind(this, login, logout));
		login.replaceWith(logout);
	}

	loginUser(e, formSignIn) {
		e.preventDefault();
		const email = document.querySelector('#email-in');
		const password = document.querySelector('#password-in');
		if(!email.value || !password.value || (password.value.length < 8)) return alert('Заполните все поля');
		formSignIn.disabled = true;
		this.emit('loginUser', email.value, password.value);
	}

	logoutUser(login, logout) {
		this.emit('logoutUser', login, logout);
		//clear data;

	}

	reRender()  {
		let currentDate = new Date();
		this.changeDate(currentDate.getFullYear(), currentDate.getMonth());
		let node = document.querySelector('.tabs');
		node.innerHTML = '';					// remove tabs 
		node.nextElementSibling.innerHTML = ''; // remove tabs content
		
	}

	tableMouseOver(event) {
		if (this.currentElem) return 
		const target = event.target.closest('td');

		if (!target) return;
		this.currentElem = target;

		if(target.textContent == '') return;
		this.showPlus(event);
	}

	tableMouseOut(event) {
		if(!this.currentElem) return;
		let relatedTarget = event.relatedTarget;

		if(event.target.tagName == 'TD' && event.target.textContent == '') return;

		while (relatedTarget) {
			if (relatedTarget == this.currentElem) return;
			relatedTarget = relatedTarget.parentNode;
		}
		this.hidePlus(event);
		this.currentElem = null;
	}

	showPlus(event) {
		let elem = document.createElement("I");
		elem.className = "fas fa-plus-circle showPlus";
		event.target.appendChild(elem);
		let listener = elem.addEventListener('click', this.addNameForTab.bind(this, event));
		elem.removeEventListener('click', listener);
	}

	addNameForTab(t) {
		let day = t.target.innerText;
		let fullDate = this.date;
		if (day < 10) {day = '0' + day};
		if(this.date.length > 7) {fullDate = this.date.slice(3)};
		fullDate = `${day}-${fullDate}`;
		this.emit('getNeededData', fullDate);
	}

	getArray(data, fullDate) {
		console.log(fullDate)
		this.tempData = data;
		if (data.length < 3) {
			let {overlay, goButton, cancelButton, popupInput} = this.popupModal;
				overlay.classList.add('showModal');
				goButton.onclick = () => {
					if (this.checkName(popupInput.value, data)) {
						overlay.classList.remove('showModal');
						this.date = fullDate;
						this.hCreateTab(this.date, popupInput.value);
						this.currentName = popupInput.value;
						setTimeout(() => {popupInput.value = ""; popupInput.placeholder = 'Enter the list name'}, 1000)
					} else {
						popupInput.placeholder = `${popupInput.value} is already use`
						popupInput.value = '';
						return
					}
				}
				cancelButton.onclick = () => {
					overlay.classList.remove('showModal');
				}
		} else {
			return console.log('Max tasks for day is 3')
		}
	}

	checkName(listName, data) {
		if (!listName) return false;
		let x = data.every((x) => {return x.name != listName});
		console.log(x, 'listName');
		return x;
	}

	hidePlus(e) {
		if (e.target.tagName == "I") {
			e.target.remove();
			return;
		};
		if (e.target.firstElementChild == null) return;
		if(e.target.firstElementChild.tagName == "I") {
			e.target.firstElementChild.remove();
		}
		return;
	}

	openSelectYear(event) {
		this.selectYear.classList.toggle('beVisible');
		this.selectMonth.classList.remove('beVisible');
		this.flag = 1;
	}

	openSelectMonth(event) {
		this.selectMonth.classList.toggle('beVisible');
		this.selectYear.classList.remove('beVisible');
		this.flag = 1;	
	}

	closeSelected(event) {
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
		const text = makeMonth(year, month);						// external funciton makeMonth() from file 'addition.js'
		daysBlock.innerHTML = text;
		this.varsObject.calendarDate_month.setAttribute("data-month", month);
		this.varsObject.calendarDate_month.innerText = this.months[month];
		this.varsObject.calendarDate_year.innerText = year;
		
		let tdCollection = [...document.querySelectorAll('tbody td')];
		month < 10 ? month = '0' + (+month + 1) : month = +month + 1;
		for(let x of tdCollection) {
			if (x.getAttribute('data-cell')) {
				x.addEventListener('click', this.checkDayTask.bind(this, year, month));
			}
		}
		
		this.emit('getAllData', month, year);
		this.date = `${month}-${year}`;
		let selectList = document.querySelector('.lists');
		while (selectList.firstChild) {
			selectList.removeChild(selectList.firstChild);
		}
	}

	checkDayTask(year, month, event) {
		console.log(event.target, 'target');
		if (event.target.tagName === 'I') return;
		let day = event.target.getAttribute('data-cell');
		console.log( this.date)
		this.date = `${day}-${month}-${year}`;
		this.emit('checkDataToOpen', this.date, event);
	}

	hSelectList(event, data) {
		let dateYear = document.querySelector('.calendarDate_year').innerText;
		let dateMonth = 1+ +document.querySelector('.calendarDate_month').getAttribute('data-month');
		let dateDay = event.target.getAttribute('data-cell')
		dateMonth < 10 ? dateMonth = '0' + dateMonth : dateMonth;
		const fullDate = `${dateDay}-${dateMonth}-${dateYear}`;

		const selectList = document.querySelector('.selectList');
		selectList.innerText = '';
		let lists = createElement("div", {className: `lists`});

		data.forEach((elem, i) => {
			let list = createElement("div", {className: `list list_${i}`});
			let span = createElement("span", {}, elem['listName']);
			let deleteList = createElement("i", {className: `fas fa-times`});
			list.setAttribute('fullDate',fullDate);
			list.setAttribute('data-id',elem['_id'])
			list.appendChild(span);
			list.appendChild(deleteList);
			lists.appendChild(list);
			
			deleteList.addEventListener('click', this.deleteList.bind(this, elem))
			list.addEventListener('click', this.showList.bind(this, elem))
		})
		selectList.appendChild(lists);
		setTimeout(() => {lists.classList.add('show')}, 0);
	}

	showList(elem, event) {
		if(event.target.tagName === 'I') return
		// this.emit("checkDataM", data['item'], data['name']);
		this.hCreateTab(event, elem.listName, elem);
	}

	deleteList(data, event) {
		this.emit("deleteList", {'_id': data['_id']}, event);
		let tab = document.querySelectorAll('.tab');
		let tabArray = Array.prototype.slice.call(tab);
		tabArray.forEach((elem, i) => {
			if(elem.getAttribute('data-id') === data['_id']) {
				this.closeList(null, elem.lastElementChild);
				return
			}
		})
		if(!event) {
			let list = document.querySelector(`div.list[data-id="${data['_id']}"]`);
			console.log(list);
			list.remove();
			return
		}
		event.target.closest('.list').remove();
	}

	removeCircle(date) {
		let nDay;
		(date[0] == "0") ? nDay = date.slice(1, 2) : nDay = date.slice(0, 2);
		console.log(nDay)
		let tdCollection = [...document.querySelectorAll('tbody td')];
			for (let x of tdCollection) {
				if (x.innerText === nDay) {
					x.classList.remove('circleOn');
					console.log(x.innerText)
				}
			}
			return;
	}

	hCreateTab(id, listName, data) {
		const sections = document.querySelectorAll('.tabs_content > section');
		const tab = document.querySelectorAll('.tabs > .tab');		
		let tabsArray = Array.from(tab);
		const inputActive = document.getElementById('active');
		const inputCompleted = document.getElementById('completed');
		completed(inputCompleted, true);
		showActive(inputActive, true);

		//   Check if this day already open in tabs
		if(tabsArray.length > 0) {
			let tmp = 0;
			for (let i = 0; i < tabsArray.length; i++) {
				if (tmp == 0  && tabsArray[i].firstChild.textContent == this.date && tabsArray[i].firstElementChild.textContent == listName) {
					tabsArray[i].classList.add("active");
					tmp = 1;
					this.changeTab(null, i);
				} else {
					tabsArray[i].classList.remove("active");
				}
			}
			if (tmp === 1) return
		}

		if (sections != null) {
			Array.from(sections).forEach( function(element) {
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

		let elemTab = createElement("div", {className: `tab active`}, this.date);
		let elemName = createElement("div", {className: `tabName`}, listName);
		let elemCloseList = createElement("div", {className: `list_delete`});
		elemCloseList.innerHTML = "<i class=\"fas fa-times\"></i>";
		elemCloseList.addEventListener('click', this.closeList.bind(this));
		elemTab.append(elemName);
		elemTab.append(elemCloseList);
		// elemCloseList.innerHTML = "<i class=\"fas fa-times\"></i>";
		tabs.insertBefore(elemTab, tabs.firstElementChild);
		// elemCloseList.addEventListener('click', this.closeList.bind(this));

		this.tabs++;

	  //Call f createSection for creating List(Section)
		this.createSection();

	  //Call f createItem for creating task item
	  	const activeTab = document.querySelector('div.tabs > div.active');
		if (data) {
			activeTab.setAttribute('data-id', data._id)
			for(let task of data.todos) {
				this.createItem(task);
			}
		} else {
			activeTab.setAttribute('data-id', "null")
			this.createItem();	
		}	
	}
		

	//Creating section for tasks
	createSection() {
		const tabs_content = document.querySelector(".tabs_content");
		let elemSection = createElement("section", {className : 'tab_content active'});
		let elemUL = createElement("ul", {className : 'tabs_content_list'});
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
	createItem(task) { // createItem(data) если есть data = tasks from DB or state
		let className;
		const currentULSection = document.querySelector('section.active > .tabs_content_list');
		// переделать проверку количества строк в отдельную функцию
		if(currentULSection.querySelectorAll('input[type=text]').length > 18) return alert('Free version allows you create only 18 tasks');
		if (task != undefined) {
			className = {
				'li': 'tabs_content_list_item',
				'label': 'label',
				'input': 'textfield input_hide'
			}
		}
		else {
			className = {
			'li': 'tabs_content_list_item',
			'label': 'label label_Hide',
			'input': 'textfield'
			}
			task = {item: '', complete: false};
		}

		console.log(task.complete)

		let randomID = this.getRandomID(5000);
		let elemLI = createElement("li", {'className' : className['li']});

		let markerBlock = createElement("label", {'className': 'marker'});
		let elemCheckBox = createElement("input", {'id' : randomID, 'type': 'checkbox', 'className': 'checkbox', 'name' : 'check', 'checked': task.complete});
		let markerDIV = createElement("div", {'className' : 'itemCheck'});

		let elemLILabel = createElement("label", {'className' : className['label'] || 'label'}, task.item);
		let elemLIinput = createElement("input", {type : 'text', 'className' : className['input']}, task.item);

		elemLI.innerHTML = "<div class=\"item_delete\"><i class=\"fas fa-times\"></i></div></li>";
		console.log(task.complete);

		if (task.complete === true) {
			elemLILabel.style.textDecoration = 'line-through';
			elemLILabel.setAttribute('data-complete', true);
		};

		markerBlock.appendChild(elemCheckBox);
		markerBlock.appendChild(markerDIV);
		elemLI.appendChild(markerBlock);
		elemLI.appendChild(elemLILabel);
		elemLI.appendChild(elemLIinput);

		currentULSection.appendChild(elemLI);
		
		const inputs = currentULSection.querySelectorAll('input[type=text]'); // Find all input in section
		inputs[inputs.length-1].focus(); 						// Add the last input focus()

		// return this.todoEventListeners(elemLI);
		this.todoEventListeners(elemLI);
	}

	getRandomID(b) {
		return Math.floor(Math.random()*Math.floor(b));
	}

	todoEventListeners(item) {
		const i = item.querySelector('div > i.fas');
		const input = item.querySelector('input[type=text]');
		const label = item.querySelector('label.label');
		const checkbox = item.querySelector('input[type=checkbox]');

		item.addEventListener('click', this.editItem.bind(this, input, label)); // if click -> edit task
		i.addEventListener('click', this.hdeleteItem.bind(this)); 				// if click -> add new 'li' (check if old 'li' empty)
		input.addEventListener('keydown', this.hAddItem.bind(this)); 			// if input in focus and push 'enter' -> add new 'li' (check if old 'li' empty)
		input.addEventListener('focusout', this.catch_focusOut.bind(this));
		checkbox.addEventListener('click', this.crossItem.bind(this));

		return item;
	}

	hdeleteItem(e) {
		e.preventDefault();
		const tabID = document.querySelector('div.tabs > div.active').getAttribute('data-id');
		const labelsCollection = [...document.querySelectorAll('section.active .item_delete i')];
		let indexItem = labelsCollection.indexOf(e.target); // get index of removing element
		console.log({'_id': tabID, 'index': indexItem});
		this.emit('deleteItem', {'_id': tabID, 'index': indexItem, 'date': this.date}, e);
		this.isTask(labelsCollection, true);
	}

	hupdateItem(e) {
		e.preventDefault();
		const task = e.target.value;
		const date = this.date;
		const tabID = document.querySelector('div.tabs > div.active').getAttribute('data-id');
		const inputCollection = [...document.querySelectorAll('section.active input[type=text]')];
		let indexItem = inputCollection.indexOf(e.target);
		console.log({'_id': tabID,'date': date, 'name': this.currentName, 'item': task, 'complete': false, 'index': indexItem})
		this.emit('updateItem', {'_id': tabID, 'date': date, 'name': this.currentName, 'item': task, 'complete': false, 'index': indexItem}, e);
	}

	hupdateCompState(label_, complete) {
		const date = this.date;
		const tabID = document.querySelector('div.tabs > div.active').getAttribute('data-id');
		const labelsCollection = [...document.querySelectorAll('section.active label.label')];
		let indexItem = labelsCollection.indexOf(label_);
		console.log({'_id': tabID,'date': date, 'name': this.currentName, 'item': label_.innerText, 'complete': complete, 'index': indexItem})
		this.emit('updateItem', {'_id': tabID, 'date': date, 'name': this.currentName, 'item': label_.innerText, 'complete': complete, 'index': indexItem});
		// this.emit('updateCompState', {'id': this.date, 'name': this.currentName, 'index': indexItem, 'complete': complete}, e);
	}

	hAddToDo(e) {
		e.preventDefault();
		const date = this.date;
		const tabID = document.querySelector('div.tabs > div.active').getAttribute('data-id');
		const task = e.target.value;
		console.log({'_id': tabID,'date': date, 'name': this.currentName, 'item': task, complete: 'false'})
		this.emit('addToDo', {'_id': tabID, 'date': date, 'name': this.currentName, 'item': task, 'complete': false}, e);
		this.isTask();
		this.addItem(e);
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
				console.log('catch', e)
				this.hupdateItem(e);
				return;
			}

			this.editFlag = false;

			if ((itemAmount <= 1) && e.target.value === '' || e.target.value === prevLabelText) return;
				// this combination of comparisons allows stop function if first item is emptied or e.target.value === text in label 
				// or if we use (e.ctrlKey & e.keyCode) because in this case e.target.value and prevLabelText are equal.
			console.log(e.target.value)
			this.hAddToDo(e);
		}
	}

	closeList(event, s) {
		if(s != undefined) {
			console.log(s.closest('.tab'));
			target = s.closest('.tab')
		} else {var target = event.target}
		const tab = target.closest('.tab');
		console.log(tab);
		const tabsCollection = [...document.querySelectorAll('.tab')];
		const sectionContents = [...document.querySelectorAll('.tab_content')];
		const index = tabsCollection.indexOf(tab); // get index of removing element

		if (tab.classList.contains('active') && tabsCollection.length > 1) {		
			if(index === tabsCollection.length-1) {
				tab.previousElementSibling.classList.add('active')
				sectionContents[index-1].classList.add('active')
			} else {
				tab.nextElementSibling.classList.add('active')
				sectionContents[index+1].classList.add('active')
			} 
		}
		tab.remove();
		sectionContents[index].remove();
		this.tabs--;
	} 

	addItem(event, id = null) {
		event.target.classList.add('input_hide'); //перенес в addItem
		event.target.previousElementSibling.classList.remove('label_Hide');	
	}

	setID(id) {
			const activeTab = document.querySelector('div.tabs > div.active');
			activeTab.setAttribute('data-id', id)
	}

	deleteItem(event) {
		let target = event.target;
		while (target.tagName != 'LI') {
			target = target.parentNode;
		}

		target.classList.add('none');
		setTimeout(() => {target.remove()}, 1000)
		// target.remove();
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

	isTask(labelsCollection, del, day) {
		const labelsCollection1 = [...document.querySelectorAll('section.active > .tabs_content_list input[type=text]')];
		let tdCollection = [...document.querySelectorAll('tbody td')];
		let nDay = this.date.slice(0, 2);
		if (labelsCollection1.length >= 1 && !del) {
			for (let x of tdCollection) {
				if (x.dataset.cell === nDay) {
					x.classList.add('circleOn');
				}
			}
		} else if (labelsCollection1.length <= 1) {
			for (let x of tdCollection) {
				if (x.dataset.cell === nDay) {
					x.classList.remove('circleOn');
				}
			}
		}
		return
	}

	hAddItem(event) {
		let e = event;
		let flag = 0;
		let input = e.target;
		let value = input.value;
		let label = input.previousElementSibling;
		

		if (e.keyCode == 27) {
			input.value = label.innerText;
			input.classList.add('input_hide');
			label.classList.remove('label_Hide');
			return;
		}

		if (e.keyCode != 13 & e.type != 'focusout' & e.target.tagName != 'I') return

		else if (e.ctrlKey & e.keyCode == 13) {	
			// check value
			if (!e.target.value) return;	
			// check editflag
			if (this.editFlag === true) {
				console.log('edti', e)
				this.hupdateItem(e);
				return;
			}

			if (value != label.innerText) {	// check if text didn't change
				label.innerText = value.trim();
				this.hAddToDo(e);
			} else {
				input.classList.add('input_hide');
				input.previousElementSibling.classList.remove('label_Hide');
			}			
			return;
		}

		else if (e.type == 'click') {
			if (e.target.classList == "far fa-plus-square") {
				let inputs = document.querySelectorAll('section.active > .tabs_content_list input[type=text]');
				if(inputs === null) return;
				for (let element of inputs) {
					if(!this.itemIsEmpty(element)) {						
						element.classList.remove('input_hide');
						element.previousSibling.classList.add('label_Hide');
						element.focus();
						return;
					}
				}
				if(!document.querySelector('section.active')) return
				this.createItem();
				return;
			}

			if (this.itemIsEmpty()) {
				// this.createItem();
				// this.itemOut(1); Не понянтно зачем????
				return;
			}
			return
		}

		else if (e.keyCode == 13) {
			e.preventDefault();
			if (!e.target.value) return;

			const inputs = document.querySelectorAll('section.active > .tabs_content_list input[type=text]');

			// Clear empty space before and after
			let trimValue = event.target.value.trim();
			e.target.value = trimValue;
			 
			for (let element of inputs) {
				if(!this.itemIsEmpty(element)) {						
					element.classList.remove('input_hide');
					element.previousSibling.classList.add('label_Hide');
					element.focus();
					return;
				}
			}
			this.itemOut(1);
			this.createItem();
			// this.itemOut(2);
			// this.itemOut(2, event);
			flag = 1;
			return;
		} 		
	}

	// Funciton itemOut(k). When we leave input or move to another input. Parameter k - indicates which input (last or before last) we need.
	itemOut(k, event) {
		const inputs = document.querySelectorAll('section.active > .tabs_content_list input[type=text]');
		const lastLI = inputs[inputs.length-k].previousElementSibling;
		const lastInputs = inputs[inputs.length-k]
		lastInputs.classList.add('input_hide');
		lastLI.classList.remove('label_Hide');
		lastLI.innerText = inputs[inputs.length-k].value;
		lastInputs.blur();
		// const lastPlus = lastLI.previousElementSibling;
	}

	crossItem(event) {
		const label_ = event.target.closest('li').querySelector('label.label');
		let complete;
		if (label_.style.textDecoration == 'line-through') {
				label_.style.textDecoration = 'none';
				// label_.setAttribute('data-complete', 'false');	
				label_.removeAttribute('data-complete');	
				complete = false;
			} else {
				label_.style.textDecoration = 'line-through';
				label_.setAttribute('data-complete', 'true');
				complete = true
			}
		// let complete = label_.getAttribute('data-complete');
		this.hupdateCompState(label_, complete);
		return;
	}

	editItem(input_, label_, event) {
		if (event.target.className == 'label')  {	
			this.editFlag = true;
			input_.value = label_.innerText;
			input_.classList.remove('input_hide');
			label_.classList.add('label_Hide');
			input_.focus()
		}		
			return
	}

	itemIsEmpty(elem) {
		let value = elem.value;
		if (value.trim() == '') return false
		elem.blur();
		return true;
	}

	// function for change active tab on click
	changeTab(event, cTab) {
		let target;
		const tab = document.querySelectorAll('.tabs > .tab');
		const content = document.querySelectorAll('.tabs_content > .tab_content');
		

		// check if click on active tab
		if (event == null) {
			Array.prototype.slice.call(content).forEach( function(element, index) {
				element.classList.remove("active");
			})
			content[cTab].classList.add('active');
			return;
		}
		
		if (event.target.classList == 'tab active' || event.target.parentNode.classList == 'tab active') return;

		if (event.target.parentNode.classList.contains('tab')) {
			console.log(event.target.parentNode)
			target = event.target.parentNode;
		} else {
			target = cTab || event.target;
			console.log(target)
		}

		let k = 0;
		if (cTab) target.classList.remove("active");

		if(target.className == 'tab') {
		  // Remove class active from tab
			Array.prototype.slice.call(tab).forEach( function(element, index) {
				element.classList.remove("active");
			})
		  // Add class '.active'  for tab 
			target.classList.add('active');
			this.currentName = target.querySelector('.tabName').innerText;

		  // Change date
			let regex = new RegExp("^[0-9]{2}\.[0-9]{2}\.[1-2][0-9]{3}");
			this.date = regex.exec(target.innerText)[0];

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
};

export default View;

