//  browsertoolbox.uc.js

(function() {

	if (location != 'chrome://browser/content/browser.xhtml')
		return;

	try {
		CustomizableUI.createWidget({
			id: 'browser-toolbox-button',
			type: 'custom',
			defaultArea: CustomizableUI.AREA_MENUBAR,
			onBuild: function(aDocument) {
				var toolbaritem = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
				var props = {
					id: 'browser-toolbox-button',
					class: 'toolbarbutton-1 chromeclass-toolbar-additional',
					label: 'Browser-Werkzeuge',
					tooltiptext: 'Browser-Werkzeuge',
					style: 'list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAdUlEQVQokZVSwRHAIAgLPYfoXs7RCTpG53Avt7APrhaFU8gLMEEJAkEQgFbc7IxkVjt0r6Sp7VIVITumBpKt00FA2ThmjXzkfMMWO8EZFSj8LrUyjsG9b9DaJXq+qAIVxEUxtLHpaXE95dj1NcK2rmbwaGJ4Af0tIg00j/6iAAAAAElFTkSuQmCC)',
					oncommand: '(' + onCommand.toString() + ')()'
				};
				for (var p in props)
					toolbaritem.setAttribute(p, props[p]);
				return toolbaritem;
			}
		});
	    CustomizableUI.registerToolbarNode(tb);
       } catch(e) { };  

	function onCommand() {
		var document = event.target.ownerDocument;
		if (!document.getElementById('menu_browserToolbox')) {
			let { require } = Cu.import("resource://devtools/shared/loader/Loader.jsm", {});
			require("devtools/client/framework/devtools-browser");
		};
		document.getElementById('menu_browserToolbox').click();
	};

})();
