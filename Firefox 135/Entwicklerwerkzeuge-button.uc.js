	/* Entwicklerwerkzeuge-button.uc.js
	*
	* aborix in https://www.camp-firefox.de/forum/thema/124672/?postID=1078103#post1078103
	* Abwandlung eines Skriptes unbekannter Herkunft, vgl. Endor in
	* https://www.camp-firefox.de/forum/thema/124672/?postID=1078019#post1078019
	* diverse Edits: Speravir
	*
	* beachte Milupo in https://www.camp-firefox.de/forum/thema/112673/?postID=1189373#post1189373
	* und https://www.camp-firefox.de/forum/thema/136363/?postID=1227506#post1227506
	*
	* letzte Aktualisierung durch Speravir in https://www.camp-firefox.de/forum/thema/138792/?postID=1264613#post1264613
	* mit vorgeschlagener Änderung von Horstmann in
	* https://www.camp-firefox.de/forum/thema/138792/?postID=1264536#post1264536
	*/
	(function() {
	if (!window.gBrowser) return;
	const
		buttonID = 'entwickler-toolbarbutton',
		labelText = 'Entwicklerwerkzeuge',
		tooltip = labelText + ' öffnen/schließen',
		css =
	`#${buttonID} .toolbarbutton-icon {list-style-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAdUlEQVQokZVSwRHAIAgLPYfoXs7RCTpG53Avt7APrhaFU8gLMEEJAkEQgFbc7IxkVjt0r6Sp7VIVITumBpKt00FA2ThmjXzkfMMWO8EZFSj8LrUyjsG9b9DaJXq+qAIVxEUxtLHpaXE95dj1NcK2rmbwaGJ4Af0tIg00j/6iAAAAAElFTkSuQmCC')}`;
	try {
		CustomizableUI.createWidget({
			id: buttonID,
			type: 'custom',
			defaultArea: CustomizableUI.AREA_NAVBAR,
			onBuild: function(aDocument) {
				let tb_button = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
				let props = {
					id: buttonID,
					class: 'toolbarbutton-1 chromeclass-toolbar-additional',
					label: labelText,
					tooltiptext: tooltip
				};
				for (let p in props) tb_button.setAttribute(p, props[p]);
				return tb_button;
			}
		});
	} catch(e) {};
	document.getElementById(buttonID).addEventListener("click", () => { if(event.button === 0) document.getElementById('menu_devToolbox').click(); });
	let stylesheet = document.createProcessingInstruction('xml-stylesheet', 'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(css) + '"');
	document.insertBefore(stylesheet, document.documentElement);
	setTimeout(function() {
		if (document.getElementById('menuWebDeveloperPopup').childElementCount <= 5) {
			let {require} = ChromeUtils.importESModule("resource://devtools/shared/loader/Loader.sys.mjs", {});
			require("devtools/client/framework/devtools-browser");
		};
	}, 0);
	})();
