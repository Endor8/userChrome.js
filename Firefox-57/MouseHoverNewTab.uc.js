// Neuen Tab öffnen, bei Hover über Neue Tab Schaltfäche
// open new tab by hovering over tabs-newtab-button

(function(){

let delay = 200;	//Zeitverzögerung in Millisekunden
let multi = true;	//Mehrere Neue Tabs öffnen, true = ja, false = nein.

let tbt = document.getElementById("tabbrowser-tabs");
if(!tbt)return;
let timeoutID;
let done = false;
let hasTabMixPlus = (function() {'undefined'!==typeof Tabmix})();
let newTabURL = function(){
	let prefService = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService);
	return hasTabMixPlus?(function(){
		switch(prefService.getIntPref('extensions.tabmix.loadOnNewTab.type')){
			case 0:
				return 'about:blank';
			case 1:
				return 'about:home';
			case 2://Aktuelle Seite
			case 3://Kopieren einer Seite
				return gBrowser.currentURI.spec;
			case 4://Benutzerdefinierte Webseite
			default:
				return BROWSER_NEW_TAB_URL;
		}
	})():BROWSER_NEW_TAB_URL;
};

let listener = function(){
	if (multi) {
		timeoutID = setInterval(function(){
			BrowserOpenTab();
		}, delay);
	} else {
		if (done) return;
		timeoutID = setTimeout(function(){
			BrowserOpenTab();
			done = true;
			setTimeout(function() {
				done = false;
			}, 100);
		}, delay);
	};
};

let newTabButtons = [
	document.getAnonymousElementByAttribute(tbt, "anonid", "tabs-newtab-button"),
	document.getElementById("new-tab-button")
];

for (let btn of newTabButtons) {
	btn.addEventListener('mouseover', listener, false);
	btn.addEventListener('mouseout', function(){
		if (multi)
			clearInterval(timeoutID)
		else
			clearTimeout(timeoutID);
	}, false);
};

})();
