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

		if (text) {
			if(elem == 'input') {
				element.value = text;
			} else {
				element.textContent = text
			}
		};

		// if (text) element.textContent = text;
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

	emit(type, ...args) {
		if (this.events[type]) {
			this.events[type].forEach(callback => callback(args[0], args[1]));
		}
	}
}


let canvas = document.getElementById('canvas');
let circle = document.getElementById('circle');
canvas.width = 270;
canvas.height = 270;
[circle.width, circle.height] = [270, 270];

var ctx = canvas.getContext('2d');
var ctr = circle.getContext('2d');
ctx.strokeStyle = ctr.strokeStyle = '#5f8087';
ctx.lineCap = 'round';
ctx.shadowBlur = ctr.shadowBlur = 6;
ctx.shadowColor = ctr.shadowColor = '#d2f4fb'
var baseX = 135;
var baseY = 135;
var r1 = 110;
var r2 = 85;
var r3 = 60;
// curAngle += 0.010472;

function degToRad(degr) {
	let factor = Math.PI/180;
	return degr*factor;
}

function renderCircle() {
	let now = new Date();
	let time = now.toString().slice(0, 3);
	let day = now.getDate();

	ctr.lineWidth = 2;
	//start draw circles
	ctr.beginPath();
	ctr.setLineDash([9, 15]);
	// draw "circle"
	ctr.arc(baseX,baseY,r1,0, 360);
	// go to the minutes "circle"
	ctr.moveTo(baseX+r2,baseX);
	ctr.arc(baseX,baseY,r2,0, 360);
	// go to the hours "circle"
	ctr.moveTo(baseX+r3,baseX);
	ctr.arc(baseX,baseY,r3,0, 360);
	ctr.stroke();

	ctr.fillStyle = '#1d71c5';
	ctr.font="21px Segoe Print"
	ctr.fillText(time + '/' + day,90, 159);
}

function renderTime() {
	let now = new Date();
	let year = now.getFullYear();
	let day = now.getDate();
	let hours = now.getHours();
	let hoursFull = now.getHours();
	let minutes = now.getMinutes();
	let seconds = now.getSeconds();
	let milliseconds = now.getMilliseconds();
	let newSeconds = (seconds + (milliseconds/1000)).toFixed(1);
	let rad = (degToRad((newSeconds*0.6/0.1) - 90)).toFixed(6);
	let radMinutes = (degToRad((minutes*6) - 90));
	let radHours = (degToRad((hours*6) + 90));

	// getting coordinates
	let vx = r1*Math.cos(rad);
	let vy = r1*Math.sin(rad);
	let vx1 = r2*Math.cos(radMinutes);
	let vy1 = r2*Math.sin(radMinutes);
	let vx2 = r3*Math.cos(radHours);
	let vy2 = r3*Math.sin(radHours);
	
	// clear canvas 
	ctx.clearRect(0,0, canvas.width, canvas.width);
	ctr.setLineDash([0, 0]);
	ctx.lineWidth = 6;

	// Seconds
	ctx.beginPath();
	ctx.fillStyle = '#5f8087'
	ctx.arc(baseX + vx,baseY + vy,4, 0, 360);
	ctx.closePath();
	ctx.stroke();
	ctx.fill();

	// Minutes
	ctx.beginPath();
	ctx.arc(baseX + vx1,baseY + vy1,7, 0, 360);
	ctx.stroke();	
	ctx.fill();

	// Hours
	ctx.beginPath();
	ctx.arc(baseX + vx2,baseY + vy2,9, 0, 360);
	ctx.stroke();	
	ctx.fill();

	//Center
	ctx.beginPath();
	ctx.arc(baseX,baseX,1,0, 360);
	ctx.stroke();

	//Time and Date
	ctx.fillStyle = '#1d71c5'
	ctx.font="21px Segoe Print"
	if(minutes < 10) minutes = '0'+minutes;
	if(hoursFull < 10) hoursFull = '0'+minutes;
	ctx.fillText(hoursFull + ':' + minutes,101, 123);
	

		window.requestAnimationFrame(renderTime)
}

renderCircle();
renderTime();

// setInterval(renderTime, 100);


export { makeMonth, createElement, EventEmitter };