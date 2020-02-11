import './js/addition.js';
import './js/common.js';
import './js/View.js';
import './js/Controller.js';
import './assets/css/style.css';
import './assets/scss/main.scss';
// import './assets/scss/actions.scss';
// import './assets/scss/list.scss';
// import './assets/scss/calendar.scss';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import Model from './js/Model.js';
import View from './js/View.js';
import Controller from './js/Controller.js';

const data = [
				{
					id: "08.12.2019", 
					tasks: [
								{item: "1", completed: false},
								{item: "2", completed: false},
								{item: "3", completed: true},
								{item: "4", completed: true}
							]	
			 	},

			 	{
					id: "01.02.2020", 
					tasks: [
								{item: "1", completed: true},
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
								{item: "3", completed: true},
								{item: "4", completed: false}
							]	
			 	}
			 ]

const model = new Model(data);
const view = new View();
const controller = new Controller(model, view) 