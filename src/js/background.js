// Options
var optobj = {};


// Set option
function setOption(opt) {
	optobj = opt
}


// Load options
function loadOption() {
	var lclobj = localStorage.getItem("opt_obj");
	
	if (lclobj) {
		optobj = JSON.parse(lclobj);
	} else {
		optobj.l = "bg";
		optobj.r = "none";
		optobj.waittime = 350;
	}
}


// Init event listener
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.stat == "init"){
		loadOption();
		sendResponse({request: "stat", opt: optobj});
    } else if (request.tab == "url") {
		var url = request.url;
		var tabid = sender.tab.id;
		
		if (url) {
    		chrome.tabs.update(tabid, { url: url });
		}
		
        sendResponse({});
    } else if (request.tab == "new") {
		var url = request.url;
		chrome.windows.create({url: url, incognito: true});
        sendResponse({});
    } else if (request.tab == "newbg") {
		var url = request.url;
		chrome.tabs.create({url: url, active: false});
        sendResponse({});
    }
});
