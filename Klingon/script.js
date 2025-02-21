//defining equivalent characters, sorted by descending length
const latin = [
"tlh",
"ch","gh","ng",
"a","b","D","e","H","I","j","l","m","n","o","p","q","Q","r","S","t","u","v","w","y","'",
"1","2","3","4","5","6","7","8","9","0","\\.",","]
const piqad = [
"","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""]

function ltq(x) {
	for (i=0;i<latin.length;i++) {
		x = x.replace((RegExp(latin[i],"g")),piqad[i]);
	}
	return x;
}

a = setInterval(function (){
	document.getElementById("piqad").value = ltq(document.getElementById("latin").value);
},10);