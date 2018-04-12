// Options
var optobj = {};
	optobj.l = "bg";
	optobj.r = "none";
	optobj.waittime = 350;

	
// Save settings into local storage
function storeOption() {
	localStorage.setItem("opt_obj", JSON.stringify(optobj));
	chrome.runtime.getBackgroundPage(function(bgpage) {
		bgpage.setOption(optobj);
	});
}


// Set type of event to trigger
function changeLongPressAction(t, idx) {
	var val = t.value;
	optobj[idx] = val;
	storeOption();
}


// Set delay until event is triggered
function changeDetectVal() {
	var val = this.value;
	document.getElementById("detectvallbl").textContent = val;
	optobj.waittime = val;
	storeOption();
}

	
// Set event listeners
document.addEventListener("DOMContentLoaded", function(e) {
	var opt = localStorage.getItem("opt_obj");
	if (opt) {
		optobj = JSON.parse(opt);
	}
	
	document.getElementById("detectval").value = optobj.waittime;
	document.getElementById("detectvallbl").textContent = optobj.waittime;
	document.getElementById("dragactionleft").value = optobj.l;
	document.getElementById("dragactionright").value = optobj.r;
	
	document.getElementById("detectval").addEventListener("change", changeDetectVal, false);
	
	document.getElementById("dragactionleft").addEventListener("change", function(e) {
		changeLongPressAction(e.currentTarget, "l");
	}, false);
	
	document.getElementById("dragactionright").addEventListener("change", function(e) {
		changeLongPressAction(e.currentTarget, "r");
	}, false);
}, false);
