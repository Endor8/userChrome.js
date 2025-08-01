//ScrollTopAndBottom.uc.js


(function() {

	let menuitem = document.createXULElement('menuitem');
	menuitem.id = 'context-to-top';
	menuitem.classList.add('menuitem-iconic');
	menuitem.setAttribute('tooltiptext' , '');
	menuitem.style.setProperty('--menuitem-icon', 'url("chrome://browser/skin/back.svg")');
	//menuitem.style.listStyleImage='url("chrome://browser/skin/back.svg")';
	let refItem = document.getElementById('context-reload');
	refItem.parentNode.insertBefore(menuitem, refItem);
	//click
	menuitem.addEventListener('click', () => {
		if (event.button == 0) {
			ownerGlobal.gBrowser.selectedBrowser.messageManager.loadFrameScript(' data: , content.scrollTo(0,0) ' , false);
		}
	}); 

})();

(function() {

	let menuitem = document.createXULElement('menuitem');
	menuitem.id = 'context-to-bottom';
	menuitem.classList.add('menuitem-iconic');
	menuitem.setAttribute('tooltiptext' , '');
	menuitem.style.setProperty('--menuitem-icon', 'url("chrome://browser/skin/forward.svg")');
	//menuitem.style.listStyleImage='url("chrome://browser/skin/forward.svg")';
	let refItem = document.getElementById('context-reload');
	refItem.parentNode.insertBefore(menuitem, refItem);
	//click
	menuitem.addEventListener('click', () => {
		if (event.button == 0) {
			ownerGlobal.gBrowser.selectedBrowser.messageManager.loadFrameScript(' data: , content.scrollTo(0,100000) ' , false);
		}
	});
	
	var css = '\
	@-moz-document url("chrome://browser/content/browser.xhtml") { \
	#context-to-top { \
	--menuitem-icon: url("chrome://browser/skin/back.svg");\
	transform:rotate(90deg)!important;\
	color:#00cd00!important;\
	}\
	#context-to-top:hover { \
	--menuitem-icon: url("chrome://browser/skin/back.svg");\
	transform:rotate(90deg)!important;\
	color:#008b00!important;\
	}\
	\
	#context-to-bottom{\
	--menuitem-icon: url("chrome://browser/skin/forward.svg");\
	transform:rotate(90deg)!important;\
	color:#00cd00!important;\
	}\
	#context-to-bottom:hover{\
	--menuitem-icon: url("chrome://browser/skin/forward.svg");\
	transform:rotate(90deg)!important;\
	color:#008b00!important;\
	}';
	var cssUri = Services.io.newURI('data:text/css,' + encodeURIComponent(css), null, null);
	var SSS = Cc['@mozilla.org/content/style-sheet-service;1'].getService(Ci.nsIStyleSheetService);
	SSS.loadAndRegisterSheet(cssUri, SSS.AGENT_SHEET);
})();
