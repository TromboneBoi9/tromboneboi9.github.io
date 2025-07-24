var nanpa = 0;
var color = "black";
var timerOn = false;
var infoOn = false;
const dispOne = document.getElementById("disp1");
const dispTwo = document.getElementById("disp2");

// toki pona number conversion
function ttp(n) {
	if (n < 0) {return "weka " + ttp(0-n);};
	if (n != Math.round(n)) {return ttp(Math.floor(n)) + "en ijo-lili";};
	if (n == 0) {return "ala";}
	//if (n > 5000) {return "nanpa suli";}
	
	var tout = "";
	while (n/100 >= 1) {tout += "ale "; n = n-100};
	while (n/20 >= 1) {tout += "mute "; n = n-20};
	while (n/5 >= 1) {tout += "luka "; n = n-5};
	while (n/2 >= 1) {tout += "tu "; n = n-2};
	while (n/1 >= 1) {tout += "wan "; n = n-1};
	return tout;
}

function update() {
	dispOne.innerHTML = ttp(nanpa);
	dispTwo.innerHTML = String(nanpa);
	document.getElementById("disp").style = "color:" + color + ";";
}

// arithmetic
function add(x) {nanpa += x;update();}
function set(x) {nanpa = x;update();}
function inv() {nanpa = 0-nanpa;update();}
function mult(x) {nanpa = nanpa*x;update();}

// timer
function timerStart() {
	if (timerOn == true) {alert("tenpo li awen open!"); return 0;}
	if (Math.floor(nanpa) <= 0) {alert("mi ken ala! tawa pona la, nanpa li suli tan ala."); return 0;}
	timerOn = true;
	color = "red";update();
	a = setInterval(timerTick,1000);
}
function timerStop() {
	if (timerOn == false) {alert("tenpo li open ala!");return 0;}
	clearInterval(a);timerOn = false;
	nanpa = 0;color = "black";update();
}
function timerTick() {
	nanpa = Math.floor(nanpa - 1);update();
	if (nanpa <= 0) {
		timerStop();
		color = "black";update();
		alert("mu! mu! tenpo li pini!");
		timerOn = false;
		return 0;
	}
}

// info page status

function infoShow() {document.getElementById("info").hidden = !(document.getElementById("info").hidden);}

const infoLangs = ["tp","en","eo"];
function infoLang() {
	for (var i = 0; i < infoLangs.length; i++) {
		document.getElementById("info-" + infoLangs[i]).hidden = !(infoLangs[i] == document.getElementById("info-select").value)
	}
}

function emBreak(x) {clearInterval(x);}

// change view

function changeView() {dispOne.hidden=!dispOne.hidden;dispTwo.hidden=!dispTwo.hidden;};

// save/load numbers

var saved = 0;
function saveNumber() {saved=nanpa;}