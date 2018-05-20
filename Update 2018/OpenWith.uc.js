// ==UserScript==
// @name		OpenWith
// @description		Fügt dem Kontextmenü ein Menü hinzu, zum Öffnen der aktuelle Seite und eines ausgewählten Links in einem anderen Browser.
// @description		und eines ausgewählten Links in einem anderen Browser.
// @version		1.2.0
// @author		y2k
// @include		main
// @charset		UTF-8
// @namespace		http://tabunfirefox.web.fc2.com/
// @note		Anwendungssymbol anzeigen
// @note		als .uc.js Script umgeschrieben
// ==/UserScript==
(function() {
"use strict";
/*
	Vor Verwendung, Pfad auf eigene Umgebung ändern(\ wird durch \ \ ersetzt)
	Zum Übergeben von Argumenten, wie folgt vorgehen:
	C:\\Program Files\\Internet Explorer\\iexplore.exe<>$1 Argument Argument
	※ $1 wird in URL umgewandelt
*/
const BrowserPath = {
	"Mozilla Firefox":	"C:\\Program Files\\Mozilla Firefox\\firefox.exe",
	"Google Chrome":	"C:\Program Files\\Google\\Chrome\\Application\\chrome.exe",
	"Internet Explorer":	"C:\\Program Files\\Internet Explorer\\iexplore.exe",
	"Opera":	"C:\\Program Files\\Opera\\Launcher.exe",
};

const FlatMenu = false;

const OpenWith = {
	start: function() {
		const cm = document.getElementById("contentAreaContextMenu");
		cm.addEventListener("popupshowing", function(e) {
			if (e.target == this) { OpenWith.onpopup(e); }
		}, false);
	},

	createMenu: function() {
		if (this.pageItem || this.linkItem) {
			return;
		}

		const contextMenu = document.getElementById("contentAreaContextMenu");
		const pageMenu = this.$C("menu", { id: "context-open-with-page", label: "Seite öffnen..." });
		contextMenu.insertBefore(pageMenu, contextMenu.querySelector(":scope > #context-bookmarkpage, :scope > #context-savepage"));

		const linkMenu = this.$C("menu", { id: "context-open-with-link", label: "Link öffnen..." });
		contextMenu.insertBefore(linkMenu, contextMenu.querySelector(":scope > #context-sep-open"));

		this.pageItem = this.createMenuItem(pageMenu, "openPage", FlatMenu? "Seite öffnen mit $1 ":" Öffnen mit $1");
		this.linkItem = this.createMenuItem(linkMenu, "openLink", FlatMenu? "Link öffnen mit $1 ":" Öffnen mit $1");
	},
	
	createMenuItem: function(menu, method, format) {
		const frag = document.createDocumentFragment();
		
		let menuitem = [];
		for (let i of Object.keys(BrowserPath)) {
			const item = this.$C("menuitem", {
				label:	format.replace("$1", i),
				class:	"menuitem-iconic",
				image:	"moz-icon:file:///" + BrowserPath[i].split("<>")[0] + "?size=16",
				value:	JSON.stringify([ method, i ]),
			});
			item.addEventListener("command", this, false);

			frag.appendChild(item);
			menuitem[menuitem.length] = item;
		}
		
		if (!FlatMenu) {
			const menupopup = this.$C("menupopup");
			menupopup.appendChild(frag);
			menu.appendChild(menupopup);
			menuitem = [ menu ];
		}
		else {
			const parent = menu.parentNode;
			parent.insertBefore(frag, menu);
			parent.removeChild(menu);
		}
		
		return menuitem;
	},

	$C: function(tag, attrs) {
		const elem = document.createElement(tag);
		if (attrs) {
			for (let key of Object.keys(attrs))
				elem.setAttribute(key, attrs[key]);
		}
		return elem;
	},

	onpopup: function(e) {
		this.createMenu();
		
		const isHtml = /^(https?|file):/.test(gBrowser.currentURI.spec);
		const pageItemHidden = !isHtml || gContextMenu.onLink || gContextMenu.onImage || gContextMenu.onTextInput;
		const linkItemHidden = !isHtml || !gContextMenu.onLink || gContextMenu.onImage || gContextMenu.onTextInput;
		
		const pageItem = this.pageItem;
		for (let i = 0, l = pageItem.length; i < l; i++) {
			pageItem[i].hidden = pageItemHidden;
		}
		const linkItem = this.linkItem;
		for (let i = 0, l = linkItem.length; i < l; i++) {
			linkItem[i].hidden = linkItemHidden;
		}
	},

	handleEvent: function(event) {
		if (event.type === "command") {
			const [ method, key ] = JSON.parse(event.originalTarget.getAttribute("value"));
			const url = method === "openPage"? gBrowser.currentURI.spec: gContextMenu.linkURL;
			this.launch(BrowserPath[key], url);
		}
	},
	
	launch: function(browserPath, openURL) {
		let [ path, args ] = browserPath.split("<>");
		if (args) {
			args = args.split(" ").map(a => a.replace("$1", openURL));
		}
		else {
			args = [ openURL ];
		}
		
		const file = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsIFile);
		file.initWithPath(path);
		
		const process = Cc['@mozilla.org/process/util;1'].createInstance(Ci.nsIProcess);
		process.init(file);
		process.run(false, args, args.length, {});
	},
};

OpenWith.start();

})();
