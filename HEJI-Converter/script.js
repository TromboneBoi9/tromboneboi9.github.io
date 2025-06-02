//primes
const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];

//prime factorization
function pfact(i) {
	var fact = [];
	var t = i;
	for (x = 0; x < primes.length; x++) {
		fact[x] = 0;
		while (t % primes[x] == 0) {
			t = t / primes[x];
			fact[x]++;
		}
	}
	if (t != 1) {return 0;} else {return fact;}
}

//prime anti-factorization
function pmul(p) {
	var out = 1;
	for (x=0; x < p.length; x++) {
		out += Math.pow(primes[x], p[x]);
	}
	return out;
}

//fraction simplifier function (taken from the web, L bozo)
function simplify(str) {
		var result = '', data = str.split('/'),
				numOne = Number(data[0]),
				numTwo = Number(data[1]);
		for (var i = Math.max(numOne, numTwo); i > 1; i--) {
		if ((numOne % i == 0) && (numTwo % i == 0)) {
				numOne /= i;
				numTwo /= i;
		}
		}
		result = numOne.toString() + '/' + numTwo.toString()
		return result
}

//subtract two arrays
function subArray(arr1, arr2) {
	var result = [];
	for (var i = 0; i < arr1.length; i++) {
		result.push(arr1[i] - arr2[i]);
	}
	return result;
}

//ratio to cents
function ratioInCents(r) {return 1200*Math.log2(r);};

//notes
const notes = ["A","A&sharp;/B&flat;","B","C","C&sharp;/D&flat;","D","D&sharp;/E&flat;","E","F","F&sharp;/G&flat;","G","G&sharp;/A&flat;"];

//fifths
const fifths = [
	["F","E"],["C","E"],["G","E"],["D","E"],["A","E"],["E","E"],["B","E"],
	["F","e"],["C","e"],["G","e"],["D","e"],["A","e"],["E","e"],["B","e"],
	["F","n"],["C","n"],["G","n"],["D","n"],["A","n"],["E","n"],["B","n"],
	["F","v"],["C","v"],["G","v"],["D","v"],["A","v"],["E","v"],["B","v"],
	["F","V"],["C","V"],["G","V"],["D","V"],["A","V"],["E","V"],["B","V"]
]

const symConv = [
	["I","B","C","D","E","F","G","H","J"],
	["K","b","c","d","e","f","g","h","T"],
	["M","k","l","m","n","o","p","q","N"],
	["O","s","t","u","v","w","x","y","P"],
	["R","S","T","U","V","W","X","Y","Q"]
]

const symConvJ = [
	0x0026,0x0024,0x0022,0x0027,0x0021,0x0023,0x0025
]

//error display
function error() {
	console.log("ERROR");
	document.getElementById("name").innerHTML = "&#9785;";
	document.getElementById("acc").innerHTML = "";
}

//convert
function conv() {

	//everything that isn't actual HEJI
	var n = document.getElementById("num").value * document.getElementById("numt").value;
	var d = document.getElementById("den").value * document.getElementById("dent").value;
	if (n == 0 || d == 0) {alert("Division by zero!");return 0;}
	var ra = simplify(n + '/' + d);
	document.getElementById("oratio").innerHTML = ra;
	var v = (1200 * Math.log2(n / d)).toFixed(2);
	document.getElementById("value").innerHTML = v;
	var ov = (1200 * ((v / 1200) - Math.floor(v / 1200))).toFixed(2);
	document.getElementById("ovalue").innerHTML = ov;
	var nf = pfact(n);
	var df = pfact(d);
	var cf = subArray(nf, df);
	var cfString = "";
	for (i=0; i<primes.length; i++) {
		if (cf[i] != 0) {
			if (cfString != "") {cfString += "&times;";};
			cfString += String(primes[i]) + "<sup>" + String(cf[i]) + "</sup>";
		};
	};
	if (cf == 0) {cfString = "?";};
	if (cfString == "") {cfString = "1";};
	document.getElementById("primes").innerHTML = cfString;
	// document.getElementById("tuner").innerHTML = notes[Math.round(ov / 100)] + " detuned " + (100 * ((ov / 100) - Math.round(ov / 100))).toFixed(2) + "&cent;";
	h = document.getElementById("refhz").value * (n / d);
	document.getElementById("hertz").innerHTML = h.toFixed(8);
	var refcent = ((ratioInCents(h / 440) % 1200) + 1200) % 1200;
	var refstep = Math.round(refcent/100);
	if (Math.abs((refcent - (refstep * 100))) == (refcent - (refstep * 100))) {
		document.getElementById("tuner").innerHTML = notes[refstep] + " +" + (refcent - (refstep * 100)).toFixed(2) + "&cent;";
	} else {
		document.getElementById("tuner").innerHTML = notes[refstep] + " " + (refcent - (refstep * 100)).toFixed(2) + "&cent;";
	};
	if (nf===0 || df===0) {alert("Your ratio uses factors larger than HEJI currently supports\nProper notation will not be displayed.");return 0;}

	//ACTUAL HEJI
	var tarr = cf;
	var f = 0;
	
	//three
	if (tarr[1] < 0) {
		while (tarr[1] != 0) {tarr[1]++;f--;}
	} else if (tarr[1] > 0) {
		while (tarr[1] != 0) {tarr[1]--;f++;}
	} else {f = f;}
	
	//five
	var c5 = 0;
	if (tarr[2] < 0) {
		while (tarr[2] != 0) {tarr[2]++;f-=4;c5++;}
	} else if (tarr[2] > 0) {
		while (tarr[2] != 0) {tarr[2]--;f+=4;c5--;}
	} else {f = f;}

	//seven
	var c7 = 0;
	if (tarr[3] < 0) {
		while (tarr[3] != 0) {tarr[3]++;f+=2;c7++;}
	} else if (tarr[3] > 0) {
		while (tarr[3] != 0) {tarr[3]--;f-=2;c7--;}
	} else {f = f;}

	//eleven
	var c11 = 0;
	if (tarr[4] < 0) {
		while (tarr[4] != 0) {tarr[4]++;f+=1;c11--;}
	} else if (tarr[4] > 0) {
		while (tarr[4] != 0) {tarr[4]--;f-=1;c11++;}
	} else {f = f;}
	
	//thirteen
	var c13 = 0;
	if (tarr[5] < 0) {
		while (tarr[5] != 0) {tarr[5]++;f-=3;c13++;}
	} else if (tarr[5] > 0) {
		while (tarr[5] != 0) {tarr[5]--;f+=3;c13--;}
	} else {f = f;}

	//seventeen
	var c17 = 0;
	if (tarr[6] < 0) {
		while (tarr[6] != 0) {tarr[6]++;f-=7;c17++;}
	} else if (tarr[6] > 0) {
		while (tarr[6] != 0) {tarr[6]--;f+=7;c17--;}
	} else {f = f;}

	//nineteen
	var c19 = 0;
	if (tarr[7] < 0) {
		while (tarr[7] != 0) {tarr[7]++;f+=3;c19--;}
	} else if (tarr[7] > 0) {
		while (tarr[7] != 0) {tarr[7]--;f-=3;c19++;}
	}

	//twenty three
	var c23 = 0;
	if (tarr[8] < 0) {
		while (tarr[8] != 0) {tarr[8]++;f-=6;c23--;}
	} else if (tarr[8] > 0) {
		while (tarr[8] != 0) {tarr[8]--;f+=6;c23++;}
	}

	//twenty nine
	var c29 = 0;
	if (tarr[9] < 0) {
		while (tarr[9] != 0) {tarr[9]++;f+=2;c29--;}
	} else if (tarr[9] > 0) {
		while (tarr[9] != 0) {tarr[9]--;f-=2;c29++;}
	}

	//thirty one
	var c31 = 0;
	if (tarr[10] < 0) {
		while (tarr[10] != 0) {tarr[10]++;c31++;}
	} else if (tarr[10] > 0) {
		while (tarr[10] != 0) {tarr[10]--;c31--;}
	}

	//thirty seven
	var c37 = 0;
	if (tarr[11] < 0) {
		while (tarr[11] != 0) {tarr[11]++;f-=2;c37--;}
	} else if (tarr[11] > 0) {
		while (tarr[11] != 0) {tarr[11]--;f+=2;c37++;}
	}

	//forty one
	var c41 = 0;
	if (tarr[12] < 0) {
		while (tarr[12] != 0) {tarr[12]++;f-=4;c41--;}
	} else if (tarr[12] > 0) {
		while (tarr[12] != 0) {tarr[12]--;f+=4;c41++;}
	}

	//forty three
	var c43 = 0;
	if (tarr[13] < 0) {
		while (tarr[13] != 0) {tarr[13]++;f+=1;c43--;}
	} else if (tarr[13] > 0) {
		while (tarr[13] != 0) {tarr[13]--;f-=1;c43++;}
	}

	//forty seven
	var c47 = 0;
	if (tarr[14] < 0) {
		while (tarr[14] != 0) {tarr[14]++;f-=6;c47--;}
	} else if (tarr[14] > 0) {
		while (tarr[14] != 0) {tarr[14]--;f+=6;c47++;}
	}
	
	//fifth offset, needed later
	var fo = Number(document.getElementById("ref").value);

	//error check
	if (f+fo>23 || f+fo<-18) {alert("This tool can only display notes up to double sharp and double flat\nProper notation will not be displayed.");return 0;}
	if (c5>4 || c5<-4) {alert("Your ratio has too many syntonic commas\nProper notation will not be displayed.");return 0;}
	if (c7>2 || c7<-2) {alert("Your ratio has too many septimal commas\nProper notation will not be displayed.");return 0;}
	
	//displaying
	document.getElementById("name").innerHTML = fifths[f+fo+18][0];
	var accSym = "";
	if (fifths[f+fo+18][1] == "E") {accSym = symConv[0][c5+4];}
	else if (fifths[f+fo+18][1] == "e") {accSym = symConv[1][c5+4];}
	else if (fifths[f+fo+18][1] == "n") {accSym = symConv[2][c5+4];}
	else if (fifths[f+fo+18][1] == "v") {accSym = symConv[3][c5+4];}
	else if (fifths[f+fo+18][1] == "V") {accSym = symConv[4][c5+4];}
	else {}; //bruh really what happened??
	if (c7 == -2) {accSym = "," + accSym;} //7
	else if (c7 == -1) {accSym = "&lt;" + accSym;}
	else if (c7 == 1) {accSym = "&gt;" + accSym;}
	else if (c7 == 2) {accSym = "." + accSym;}
	else {};
	if (c11 > 0) { //11
		for (k = 0; k < c11; k++) {accSym = "4" + accSym;};//up
	} else if (c11 < 0) {
		for (k = 0; k > c11; k--) {accSym = "5" + accSym;};//down
	} else {};
	if (c13 > 0) { //13
		for (k = 0; k < c13; k++) {accSym = "9" + accSym;};
	} else if (c13 < 0) {
		for (k = 0; k > c13; k--) {accSym = "0" + accSym;};
	} else {};
	if (c17 > 0) { //17
		for (k = 0; k < c17; k++) {accSym = ";" + accSym;};
	} else if (c17 < 0) {
		for (k = 0; k > c17; k--) {accSym = ":" + accSym;};
	} else {};
	if (c19 > 0) { //19
		for (k = 0; k < c19; k++) {accSym = "/" + accSym;};
	} else if (c19 < 0) {
		for (k = 0; k > c19; k--) {accSym = "*" + accSym;};
	} else {};
	if (c23 > 0) { //23
		for (k = 0; k < c23; k++) {accSym = "3" + accSym;};
	} else if (c23 < 0) {
		for (k = 0; k > c23; k--) {accSym = "6" + accSym;};
	} else {};
	if (c29 > 0) { //29
		for (k = 0; k < c29; k++) {accSym = "2" + accSym;};
	} else if (c29 < 0) {
		for (k = 0; k > c29; k--) {accSym = "7" + accSym;};
	} else {};
	if (c31 > 0) { //31
		for (k = 0; k < c31; k++) {accSym = "8" + accSym;};
	} else if (c31 < 0) {
		for (k = 0; k > c31; k--) {accSym = "1" + accSym;};
	} else {};
	if (c37 > 0) { //37
		for (k = 0; k < c37; k++) {accSym = "&aacute;" + accSym;};
	} else if (c37 < 0) {
		for (k = 0; k > c37; k--) {accSym = "&agrave;" + accSym;};
	} else {};
	if (c41 > 0) { //41
		for (k = 0; k < c41; k++) {accSym = "+" + accSym;};
	} else if (c41 < 0) {
		for (k = 0; k > c41; k--) {accSym = "-" + accSym;};
	} else {};
	if (c43 > 0) { //43
		for (k = 0; k < c43; k++) {accSym = "&eacute;" + accSym;};
	} else if (c43 < 0) {
		for (k = 0; k > c43; k--) {accSym = "&egrave;" + accSym;};
	} else {};
	if (c47 > 0) { //47
		for (k = 0; k < c47; k++) {accSym = "&iacute;" + accSym;};
	} else if (c47 < 0) {
		for (k = 0; k > c47; k--) {accSym = "&igrave;" + accSym;};
	} else {};
	if ((accSym.charAt(accSym.length - 1) == "n") && (accSym.length != 1)) {
		accSym = accSym.split("n")[0];
	};
	document.getElementById("acc").innerHTML = accSym;

	//success :D
	return 1;
};

function m(i) {
	var n = document.getElementById("num").value;
	var d = document.getElementById("den").value;
	document.getElementById("num").value = Math.pow(n,i);
	document.getElementById("den").value = Math.pow(d,i);
}

function flip() {
	var t = document.getElementById("num").value;
	document.getElementById("num").value = document.getElementById("den").value;
	document.getElementById("den").value = t;
}

function comb() {
	var n = document.getElementById("num").value * document.getElementById("numt").value;
	var d = document.getElementById("den").value * document.getElementById("dent").value;
	var sf = simplify(n + "/" + d);
	document.getElementById("numt").value = sf.split("/")[0];
	document.getElementById("dent").value = sf.split("/")[1];
}

function r() {
	document.getElementById("num").value = 1;
	document.getElementById("den").value = 1;
	document.getElementById("numt").value = 1;
	document.getElementById("dent").value = 1;
}

function set(x,y) {
	document.getElementById("num").value = x;
	document.getElementById("den").value = y;
}

function setadd(x,y) {
	x *= document.getElementById("num").value;
	y *= document.getElementById("den").value;
	sf = simplify(x + "/" + y);
	document.getElementById("num").value = sf.split("/")[0];
	document.getElementById("den").value = sf.split("/")[1];
}