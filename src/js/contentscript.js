var host = location.protocol + "//" + location.hostname + location.pathname;
var addeventflag = false;
var eventtimerid = null;
var cancelclickflag = false;
var mouseupflag = true;
var optobj = {};


// Executes a click event
function executeClick(elem, no) {
	var ctrl = false,
		alt = false,
		shift = false;
		
	var flg = true;
	
	if (no === "bg") {
		flg = false;
		chrome.runtime.sendMessage({tab: "newbg", url: elem.href});
	} else if (no === "new") {
		flg = false;
		chrome.runtime.sendMessage({tab: "new", url: elem.href});
	} else if (no === "crnt") {
		flg = false;
		chrome.runtime.sendMessage({tab: "url", url: elem.href});
	} else {
		flg = false;
	}
	
	if (flg) {
		var types = ['click'];
		
		for (var i = 0, l = types.length; i < l; i++) {
			var clicker = new MouseEvent(types[i], {
			  'bubbles': true,
			  'cancelable': true,
			  'view': window,
			  'detail': 0,
			  'screenX': 0,
			  'screenY': 0,
			  'clientX': 0,
			  'clientY': 0,
			  'ctrlKey': false,
			  'altKey': false,
			  'shiftKey': false,
			  'metaKey': false,
			  'button': 0,
			  'relatedTarget': null
			});
			
			elem.dispatchEvent(clicker);
		}
	}			
}


// Decides what type of event to emulate
function clickEmulate(elem, button) {
	if (button === 0) {
		executeClick(elem, optobj.l);
	} else if (button === 2) {
		executeClick(elem, optobj.r);
	} else if (button === "bg") {
		chrome.runtime.sendMessage({tab: "newbg", url: elem.href});
	} else if (button === "new") {
		chrome.runtime.sendMessage({tab: "new", url: elem.href});
	} else if (button === "crnt") {
		chrome.runtime.sendMessage({tab: "url", url: elem.href});
	}
}


// Handle clicks
function press(e, elem, button) {
	if (!mouseupflag) {
		clearTimeout(eventtimerid);
		
		// Force immediate private window if target="_incognito" is set.
		if ((optobj.l === 'none' || optobj.l === 'new') && typeof(elem.target) !== 'undefined' && elem.target === '_incognito') {
			clickEmulate(elem, button);
			cancelclickflag = true;
		} else {
			eventtimerid = setTimeout(function() {
				clickEmulate(elem, button);
				cancelclickflag = true;
			}, optobj.waittime);
		}
	}
}


// Prevent duplicate clicks
function clickLink(e) {
	clearTimeout(eventtimerid);
	if (cancelclickflag) {
		e.preventDefault();
		e.stopPropagation();
	}
	cancelclickflag = false;
}


// Checks target attribute of HTML link element and triggers click
function checkA(elem, button, e, mode) {
	if (elem.tagName && elem.tagName === "A") {
		elem.removeEventListener("click", clickLink, true);
		elem.addEventListener("click", clickLink, true);
		
		chrome.runtime.sendMessage({stat: "init", url: host}, function(resp) {
			if (!resp.opt || !resp.opt.l) {
				return;
			}
			
			optobj = resp.opt;

			if (typeof(elem.target) !== 'undefined' && elem.target === '_incognito') {
				if (optobj.l === 'none') {
					optobj.l = 'new';
				}
			}
			
			if (button === 0 && optobj.l !== "none") {
				press(e, elem, button);
			} else if (button === 2 && optobj.r !== "none") {
				press(e, elem, button);
			}
		});
	} else if (elem.parentNode) {
		checkA(elem.parentNode, button, e, mode);
	}
}


// Defines event listeners to intercept clicks
function addTag() {
	if (!addeventflag) {
		addeventflag = true;
		
		window.addEventListener("mousedown", function(e) {
			clearTimeout(eventtimerid);
			cancelclickflag = false;
			mouseupflag = false;
			checkA(e.target, e.button, e)
		}, true);
		
		window.addEventListener("mouseup", function(e) {
			clearTimeout(eventtimerid);
			mouseupflag = true;
		}, true);
	}
}


// Init
addTag();
