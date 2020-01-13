function makeMonth(year, month) {
		let choosenDate = new Date(year, month, 32);
		let startDayWeek = (new Date(year, month)).getDay(); //get number of week's day
		let endDayNumber = 32 - choosenDate.getDate(); // get the last number of the month, for instance, in september -> 30 days

		let prevDate = new Date(year, month, 32);
		let endDayPrevMonth = 32 - prevDate.getDate();
		let count = endDayPrevMonth-startDayWeek;

		let text= "<tr>";
		let dayWeek = 1;

		for(let i = 1; i <= startDayWeek; i++) {
			text = text + `<td></td>`;
			endDayPrevMonth--;
			dayWeek++;
		}

		for(let n = 1; n <= endDayNumber; n++) {		

				if (dayWeek > 7 ) {
					text = text + "</tr><tr>";
					dayWeek = 1;
				}

				text = text + "<td>" + n + "</td>";
				dayWeek++;
		}

		for(let i = dayWeek; i <= 7; i++) {
			text = text + "<td></td>";
			dayWeek++;
		}

		text = text + "</tr>"

		return text;
}

//creating html element
function createElement(elem, options, text) {
		let element = document.createElement(elem);
		for (let prop in options) {
			element[prop] = options[prop];
		}

		if (text) element.textContent = text;
		return element
	}



class EventEmitter {
	constructor() {
		this.events = {}
	}

	on(type, callback) {
		this.events[type] = this.events[type] || [];
		this.events[type].push(callback);
	}

	emit(type, arg) {
		if (this.events[type]) {
			this.events[type].forEach(callback => callback(arg));
		}
	}
}


export { makeMonth, createElement, EventEmitter };