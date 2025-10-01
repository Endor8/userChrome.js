/* UserCSSLoader 2025-09-30
 *
 * original author: Griever -
 * https://github.com/Griever/userChromeJS/tree/master/UserCSSLoader
 *
 * Enhancements and several other changes including German translation
 * and configuration section by users aborix, Endor, bege, Speravir of
 * Camp Firefox forum - https://www.camp-firefox.de/forum/ - latest version:
 * https://www.camp-firefox.de/forum/thema/138814/?postID=1279211#post1279211
 */

/****** Bedienungsanleitung ******

CSS-Ordner im Chrome-Ordner erstellen, CSS-Dateien dort ablegen - speichern.
Diejenigen, deren Dateiname mit "xul-" beginnen, diejenigen, die mit ".as.css"
enden, sind AGENT_SHEET, alle anderen außer USER_SHEET werden gelesen. Da der
Inhalt der Datei nicht überprüft wird, darauf achten, die Angabe von @namespace
nicht zu vergessen!

Schaltfläche oder Menü wird in Navigationsleiste eingefügt (einstellbar, siehe
Variable "position" in unten anschließender Konfiguration).

Dateiordner, Dateimanager und Texteditor können in der unten anschließenden
Konfiguration geändert werden. Die Verwendung des in "view_source.editor.path"
angegebenen Editors ist möglich.

Linksklick auf Stil, zum Aktivieren/Deaktivieren
Mittelklick auf Stil zum Aktivieren/Deaktivieren, ohne Menü zu schließen
Rechtsklick auf Stil zum Öffnen im Editor
Strg+Linksklick zum Anzeigen im Dateimanager

Die Tastenkombinationen können im Menü eingeblendet werden, dazu nach 
"acceltext" suchen und den Zeilenkommentar "//" entfernen.

Ein Symbol für die Schaltfläche muss in der "userChrome.css" festgelegt werden,
Pfad zum Bild (PNG nur als Beispiel):
* relativ zur userChrome.css
    background-image: url("Relativer/Pfad/zum/CSS_Symbol.png");
* eine absolute Pfadangabe zum Symbol muss mit File-Protokoll-Präfix erfolgen:
    background-image: url("file:///Absoluter/Pfad/zum/CSS_Symbol.png");

Absolute Zahlenwerte müssen eventuell etwas an die eigenen Gegebenheiten
angepasst werden (größeres Symbol, anderer Rand); der Zahlenwert für Höhe
und Breite des Menütextes ("CSS") sollte nicht größer sein als für das
Symbol (hier 16px).

#usercssloader-menu-item {
	background-image: url("Relativer/Pfad/zum/CSS_Symbol.png");
	background-position: center;
	background-repeat: no-repeat;
	background-size: 16px;
	border-radius: var(--toolbarbutton-border-radius);
	margin-block: 3px;

	&:hover {
		background-color: var(--toolbarbutton-hover-background);
	}

	& #usercssloader-menu > .menu-text[value="CSS"] {
		opacity: 0;
		width: calc(2 * var(--toolbarbutton-inner-padding) + 16px);
		height: calc(2 * var(--toolbarbutton-inner-padding) + 16px);
	}
}

**** Ende der Anleitung ****/

(function(){

/***** Konfiguration *****/
/* Position: als frei verschiebbare-Schaltfläche = 0, als Menü anzeigen = 1 */
let position = 0;//1
/* Dateimanager festlegen, Beispiele:
 *    let fileManager = "C:\\Programme\\FreeCommanderXE\\FreeCommander.exe";
 *    let fileManager = "C:\\Programme\\totalcmd\\TOTALCMD.EXE";
 * auch möglich (Achtung, nur mit fileManagerParam = "/select,"!):
 *    let fileManager = "C:\\Windows\\explorer.exe";
 * Bleibt Parameter leer, wird Standardmanager des Systems ohne Parameter
 * verwendet mit leicht eingeschränkter Funktionalität. */
let fileManager = "";
/* eventuelle Parameter für den Dateimanager, Beispiele:
 *    let fileManagerParam = "/T";//FreeCommander oder Totalcommander
 *    let fileManagerParam = "/select,";//Windows Explorer, mit Komma korrekt!
 */
let fileManagerParam = "";
/* manche Manager benötigen den Parameter nach der Pfadangabe,
   dann "fileManagerParamPost" auf true setzen */
let fileManagerParamPost = false;
/* eigener Texteditor mit Pfad - Standard leer, dann wird Wert aus
 * Einstellung "view_source.editor.path" verwendet mit Warnmeldung,
 * wenn auch dieser leer ist, Beispiel:
 *    let customEditor = "C:\\Windows\\System32\\notepad.exe"; */
let customEditor = "";
/* Unterordner für die CSS-Dateien */
let cssFolder = "CSS";
/* Menüeintrag zum Bearbeiten der userChrome.css anzeigen (true)
   oder verstecken (false) */
let showUserChromeCSS = true;
/* Menüeintrag zum Bearbeiten der userContent.css anzeigen (true)
   oder verstecken (false) */
let showUserContentCSS = true;
/* zusätzlich Chrome-Ordner im Untermenü anzeigen (true)
   oder verstecken (false) */
let showChrome = true;
/***** Ende der Konfiguration *****/

// Wenn beim Start ein weiteres Fenster (zweites Fenster) vorhanden ist, beenden
let list = Services.wm.getEnumerator("navigator:browser");
while(list.hasMoreElements()){ if(list.getNext() != window) return; }

if (window.UCL) {
	window.UCL.destroy();
	delete window.UCL;
}

let menutooltip = "Linksklick: an/aus, Menü schließt\nMittelklick: an/aus, Menü bleibt offen\nRechtsklick: bearbeiten";
if (fileManager !== "") {
		menutooltip = menutooltip + "\nStrg+Rechtsklick: im Dateimanager anzeigen";
}

window.UCL = {
	AGENT_SHEET : Ci.nsIStyleSheetService.AGENT_SHEET,
	USER_SHEET  : Ci.nsIStyleSheetService.USER_SHEET,
	AUTHOR_SHEET: Ci.nsIStyleSheetService.AUTHOR_SHEET,
	readCSS: {},
	get disabled_list() {
		let obj = [];
		try {
			obj = decodeURIComponent(this.prefs.getCharPref("disabled_list")).split("|");
		} catch(e) {}
		delete this.disabled_list;
		return this.disabled_list = obj;
	},
	get prefs() {
		delete this.prefs;
		return this.prefs = Services.prefs.getBranch("UserCSSLoader.");
	},
	get styleSheetServices() {
		delete this.styleSheetServices;
		return this.styleSheetServices = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService);
	},
	get FOLDER() {
		let aFolder;
		try {
			// UserCSSLoader.FOLDER verwenden
			let folderPath = this.prefs.getCharPref("FOLDER");
			aFolder = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsIFile);
			aFolder.initWithPath(folderPath);
		} catch (e) {
			aFolder = Services.dirsvc.get("UChrm", Ci.nsIFile);
			aFolder.appendRelativePath(cssFolder);
		}
		if (!aFolder.exists() || !aFolder.isDirectory()) {
			aFolder.create(Ci.nsIFile.DIRECTORY_TYPE, 0o664);
		}
		delete this.FOLDER;
		return this.FOLDER = aFolder;
	},
	get CHRMFOLDER() {
			let cFolder;
			try {
					// UserCSSLoader.CHRMFOLDER verwenden
					let CHRMfolderPath = this.prefs.getCharPref("CHRMFOLDER");
					cFolder = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsIFile);
					cFolder.initWithPath(CHRMfolderPath);
			} catch (e) {
					cFolder = Services.dirsvc.get("UChrm", Ci.nsIFile);
			}
			if (!cFolder.exists() || !cFolder.isDirectory()) {
					cFolder.create(Ci.nsIFile.DIRECTORY_TYPE, 0o664);
			}
			delete this.CHRMFOLDER;
			return this.CHRMFOLDER = cFolder;
	},

	init: function() {
		const cssmenu = $C("menu", {
			id: "usercssloader-menu",
			label: "CSS",
			tooltiptext: "UserCSSLoader\n\nLinksklick: Stylesheets anzeigen\nMittelklick: Styles importieren",
			accesskey: "Y"
		});
		cssmenu.addEventListener("click", (event) => { if (event.button === 1) UCL.rebuild(); });
		const menupopup = $C("menupopup", {
			id: "usercssloader-menupopup"
		});
		cssmenu.appendChild(menupopup);

		let menu = $C("menu", {
			label: "Style-Loader-Menü",
			id: "style-loader-menu",
			accesskey: "S",
			//acceltext: "S"
		});
		menupopup.appendChild(menu);
		menupopup.appendChild($C("menuseparator"));

		let mp = $C("menupopup", { id: "usercssloader-submenupopup" });
		menu.appendChild(mp);
		let rebuildItem = $C("menuitem", {
			label: "Styles importieren",
			accesskey: "I",
			//acceltext: "I"
		});
		rebuildItem.addEventListener("command", () => UCL.rebuild());
		mp.appendChild(rebuildItem);
		mp.appendChild($C("menuseparator"));
		//
		let createCSS = $C("menuitem", {
			label: "CSS-Datei erstellen",
			accesskey: "D",
			//acceltext: "D"
		});
		createCSS.addEventListener("command", () => UCL.create());
		mp.appendChild(createCSS);
		let openFolder = $C("menuitem", {
			label: "CSS-Ordner öffnen",
			accesskey: "O",
			//acceltext: "O"
		});
		openFolder.addEventListener("command", () => UCL.openCSSFolder());
		mp.appendChild(openFolder);
		if (showChrome) {
				let openChromeFolder = $C("menuitem", {
					label: "Chrome-Ordner öffnen",
					accesskey: "X",
					//acceltext: "X"
				});
				openChromeFolder.addEventListener("command", () => UCL.openCHRMFolder());
				mp.appendChild(openChromeFolder);
		}
		if (showUserChromeCSS || showUserContentCSS)// wenigstens eine der beiden Variablen muss …
				mp.appendChild($C('menuseparator'));// … true sein, damit Trennlinie angezeigt wird
		if (showUserChromeCSS) {
				let editChromeItem = $C("menuitem", {
					label: "userChrome.css bearbeiten"
				});
				editChromeItem.addEventListener("command", () => UCL.editUserCSS("userChrome.css"));
				mp.appendChild(editChromeItem);
		}
		if (showUserContentCSS) {
				let editContentItem = $C("menuitem", {
					label: "userContent.css bearbeiten"
				});
				editContentItem.addEventListener("command", () => UCL.editUserCSS("userContent.css"));
				mp.appendChild(editContentItem);
		}

		CustomizableUI.createWidget({
			id: 'usercssloader-menu-item',
			type: 'custom',
			defaultArea: CustomizableUI.AREA_NAVBAR,
			onBuild: function(aDocument) {
				let toolbaritem = aDocument.createXULElement('toolbaritem');
				toolbaritem.id = 'usercssloader-menu-item';
				toolbaritem.className = 'chromeclass-toolbar-additional';
				return toolbaritem;
			}
		});
		$('usercssloader-menu-item').appendChild(cssmenu);

		if (position === 1) {
				let refNode = $('helpMenu');
				refNode.parentNode.insertBefore(cssmenu, refNode.nextSibling);
		}

		// Stile neu laden, ohne Menü zu öffnen
		let key = $C("key", {
			id: "usercssloader-rebuild-key",
			key: "R",
			modifiers: "alt",
		});
		key.addEventListener("command", () => UCL.rebuild());
		$("mainKeyset").appendChild(key);

		this.rebuild();
		this.initialized = true;
		window.addEventListener("unload", this, false);
	},
	uninit: function() {
		const dis = [];
		for (let x of Object.keys(this.readCSS)) {
			if (!this.readCSS[x].enabled)
				dis.push(x);
		}
		this.prefs.setCharPref("disabled_list", encodeURIComponent(dis.join("|")));
		window.removeEventListener("unload", this, false);
	},
	destroy: function() {
		var i = document.getElementById("usercssloader-menu");
		if (i) i.parentNode.removeChild(i);
		var i = document.getElementById("usercssloader-rebuild-key");
		if (i) i.parentNode.removeChild(i);
		this.uninit();
	},
	handleEvent: function(event) {
		switch(event.type){
			case "unload": this.uninit(); break;
		}
	},
	rebuild: function() {
		let ext = /\.css$/i;
		let not = /\.uc\.css/i;
		let files = this.FOLDER.directoryEntries.QueryInterface(Ci.nsISimpleEnumerator);

		while (files.hasMoreElements()) {
			let file = files.getNext().QueryInterface(Ci.nsIFile);
			if (!ext.test(file.leafName) || not.test(file.leafName)) continue;
			let CSS = this.loadCSS(file);
			CSS.flag = true;
		}
		for (let leafName of Object.keys(this.readCSS)) {
			const CSS = this.readCSS[leafName];
			if (!CSS.flag) {
				CSS.enabled = false;
				delete this.readCSS[leafName];
			}
			delete CSS.flag;
			this.rebuildMenu(leafName);
		}
		if (this.initialized) {
			if (typeof(StatusPanel) !== "undefined")
				StatusPanel._label = "Styles importiert";
			else
				XULBrowserWindow.statusTextField.label = "Styles importiert";
		}
	},
	loadCSS: function(aFile) {
		let CSS = this.readCSS[aFile.leafName];
		if (!CSS) {
			CSS = this.readCSS[aFile.leafName] = new CSSEntry(aFile);
			if (this.disabled_list.indexOf(CSS.leafName) === -1) {
				CSS.enabled = true;
			}
		} else if (CSS.enabled) {
			CSS.enabled = true;
		}
		return CSS;
	},
	rebuildMenu: function(aLeafName) {
		let CSS = this.readCSS[aLeafName];
		let menuitem = document.getElementById("usercssloader-" + aLeafName);
		if (!CSS) {
			if (menuitem)
				menuitem.parentNode.removeChild(menuitem);
			return;
		}

		if (!menuitem) {
			menuitem = $C("menuitem", {
				label: aLeafName,
				id: "usercssloader-" + aLeafName,
				class: "usercssloader-item " + (CSS.SHEET == this.AGENT_SHEET? "AGENT_SHEET" : CSS.SHEET == this.AUTHOR_SHEET? "AUTHOR_SHEET": "USER_SHEET"),
				type: "checkbox",
				autocheck: "false",
				tooltiptext: menutooltip
			});
			menuitem.addEventListener("command", () => UCL.toggle(aLeafName));
			menuitem.addEventListener("click", (event) => UCL.itemClick(event));
			menuitem.addEventListener("mouseup", (event) => { if (event.button === 1) event.preventDefault(); });
			document.getElementById("usercssloader-menupopup").appendChild(menuitem);
		}
		menuitem.setAttribute("checked", CSS.enabled);
	},
	toggle: function(aLeafName) {
		let CSS = this.readCSS[aLeafName];
		if (!CSS || event.ctrlKey) return;
		CSS.enabled = !CSS.enabled;
		this.rebuildMenu(aLeafName);
	},
	itemClick: function(event) {
		let label = event.currentTarget.getAttribute("label");
		event.preventDefault();
		event.stopPropagation();
		if (event.button === 0) {
				return;
		} else if (event.button === 1) {
				this.toggle(label);
		} else if (event.button === 2) {
				if (event.ctrlKey && fileManager  !== "") {
						UCL.showFile(label);
				} else {
				closeMenus(event.target);
				this.edit(this.getFileFromLeafName(label));
				}
		}
	},
	getFileFromLeafName: function(aLeafName) {
		let f = this.FOLDER.clone();
		f.QueryInterface(Ci.nsIFile); // use appendRelativePath
		f.appendRelativePath(aLeafName);
		return f;
	},
	showFile: function(fname) {
				const PathSep = AppConstants.platform === "win" ? "\\" : "/";
				let target= this.FOLDER.path + PathSep + fname;
				let file = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsIFile);
				let process = Cc['@mozilla.org/process/util;1'].createInstance(Ci.nsIProcess);
				let args = (!fileManagerParamPost) ? [fileManagerParam,target] :
				           [target,fileManagerParam];
				file.initWithPath(fileManager);
				process.init(file);
				// Verzeichnis mit anderem Dateimanager öffnen
				process.run(false, args, args.length);
	},
	openCSSFolder:function(){
		if (fileManager !== "" && fileManagerParam !== "/select,") {
				let target = this.FOLDER.path;
				let file = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsIFile);
				let process = Cc['@mozilla.org/process/util;1'].createInstance(Ci.nsIProcess);
				let args = (!fileManagerParamPost) ? [fileManagerParam,target] :
				           [target,fileManagerParam];
				file.initWithPath(fileManager);
				process.init(file);
				// Verzeichnis mit anderem Dateimanager öffnen
				process.run(false, args, args.length);
		} else {
				// Verzeichnis mit Dateimanager des Systems öffnen
				this.FOLDER.launch();
		}
	},
	openCHRMFolder:function(){
		if (fileManager !== "" && fileManagerParam !== "/select,") {
				let target = this.CHRMFOLDER.path;
				let file = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsIFile);
				let process = Cc['@mozilla.org/process/util;1'].createInstance(Ci.nsIProcess);
				let args = (!fileManagerParamPost) ? [fileManagerParam,target] :
				           [target,fileManagerParam];
				file.initWithPath(fileManager);
				process.init(file);
				// Verzeichnis mit anderem Dateimanager öffnen
				process.run(false, args, args.length);
		} else {
				// Verzeichnis mit Dateimanager des Systems öffnen
				this.CHRMFOLDER.launch();
		}
	},
	editUserCSS: function(aLeafName) {
		let file = Services.dirsvc.get("UChrm", Ci.nsIFile);
		file.appendRelativePath(aLeafName);
		this.edit(file);
	},
	edit: function(aFile) {
		let editor = (customEditor !== "") ? customEditor : Services.prefs.getCharPref("view_source.editor.path");
		if (!editor) return alert('In der Konfiguration einen Texteditor festlegen ("customEditor") oder\n unter about:config im vorhandenen Schalter "view_source.editor.path"\n den vollständigen Editorpfad eintragen.');
		try {
			let UI = Cc["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Ci.nsIScriptableUnicodeConverter);
			UI.charset = window.navigator.platform.toLowerCase().indexOf("win") >= 0? "Shift_JIS": "UTF-8";
			let path = UI.ConvertFromUnicode(aFile.path);
			let app = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsIFile);
			app.initWithPath(editor);
			let process = Cc["@mozilla.org/process/util;1"].createInstance(Ci.nsIProcess);
			process.init(app);
			process.run(false, [path], 1);
		} catch (e) {}
	},
	create: function(aLeafName) {
		if (!aLeafName) aLeafName = prompt("Name des Styles", dateFormat(new Date(), "%Y_%m%d_%H%M%S"));
		if (aLeafName) aLeafName = aLeafName.replace(/\s+/g, " ").replace(/[\\/:*?\"<>|]/g, "");
		if (!aLeafName || !/\S/.test(aLeafName)) return;
		if (!/\.css$/.test(aLeafName)) aLeafName += ".css";
		let file = this.getFileFromLeafName(aLeafName);
		this.edit(file);
	},
	UCrebuild: function() {
		let re = /^file:.*\.uc\.css(?:\?\d+)?$/i;
		let query = "?" + new Date().getTime();
		Array.slice(document.styleSheets).forEach(function(css){
			if (!re.test(css.href)) return;
			if (css.ownerNode) {
				css.ownerNode.parentNode.removeChild(css.ownerNode);
			}
			let pi = document.createProcessingInstruction('xml-stylesheet','type="text/css" href="'+ css.href.replace(/\?.*/, '') + query +'"');
			document.insertBefore(pi, document.documentElement);
		});
		UCL.UCcreateMenuitem();
	},
	UCcreateMenuitem: function() {
		let sep = $("usercssloader-ucseparator");
		let popup = sep.parentNode;
		if (sep.nextSibling) {
			let range = document.createRange();
			range.setStartAfter(sep);
			range.setEndAfter(popup.lastChild);
			range.deleteContents();
			range.detach();
		}

		let re = /^file:.*\.uc\.css(?:\?\d+)?$/i;
		Array.slice(document.styleSheets).forEach(function(css) {
			if (!re.test(css.href)) return;
			let fileURL = decodeURIComponent(css.href).split("?")[0];
			let aLeafName = fileURL.split("/").pop();
			let m = $C("menuitem", {
				label: aLeafName,
				tooltiptext: fileURL,
				id: "usercssloader-" + aLeafName,
				type: "checkbox",
				autocheck: "false",
				checked: "true",
			});
			m.css = css;
			m.addEventListener("command", function() {
				if (!event.ctrlKey) {this.setAttribute("checked", !(this.css.disabled = !this.css.disabled));}
			});
			m.addEventListener("mouseup", function(event) {
				if (event.button === 1) event.preventDefault();
			});
			m.addEventListener("click", function(event) {
				UCL.UCItemClick(event);
			});
			popup.appendChild(m);
		});
	},
	UCItemClick: function(event) {
		if (event.button === 0) return;
		event.preventDefault();
		event.stopPropagation();

		if (event.button === 1) {
			event.target.doCommand();
		}
		else if (event.button === 2) {
			closeMenus(event.target);
			let fileURL = event.currentTarget.getAttribute("tooltiptext");
			let file = Services.io.getProtocolHandler("file").QueryInterface(Ci.nsIFileProtocolHandler).getFileFromURLSpec(fileURL);
			this.edit(file);
		}
	},
};

function CSSEntry(aFile) {
	this.path = aFile.path;
	this.leafName = aFile.leafName;
	this.lastModifiedTime = 1;
	this.SHEET = /^xul-|\.as\.css$/i.test(this.leafName) ?
		Ci.nsIStyleSheetService.AGENT_SHEET:
		/\.author\.css$/i.test(this.leafName)?
			Ci.nsIStyleSheetService.AUTHOR_SHEET:
			Ci.nsIStyleSheetService.USER_SHEET;
}
CSSEntry.prototype = {
	sss: Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService),
	_enabled: false,
	get enabled() {
		return this._enabled;
	},
	set enabled(isEnable) {
		let aFile = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsIFile)
		aFile.initWithPath(this.path);

		let isExists = aFile.exists(); // true, wenn die Datei bereits existiert
		let lastModifiedTime = isExists ? aFile.lastModifiedTime : 0;
		let isForced = this.lastModifiedTime != lastModifiedTime; //true, wenn es eine Änderung in der Datei gibt

		let fileURL = Services.io.getProtocolHandler("file").QueryInterface(Ci.nsIFileProtocolHandler).getURLSpecFromActualFile(aFile);
		let uri = Services.io.newURI(fileURL, null, null);

		if (this.sss.sheetRegistered(uri, this.SHEET)) {
			// Wenn diese Datei bereits gelesen wurde
			if (!isEnable || !isExists) {
				this.sss.unregisterSheet(uri, this.SHEET);
			}
			else if (isForced) {
				// Nach Stornierung erneut einlesen
				this.sss.unregisterSheet(uri, this.SHEET);
				this.sss.loadAndRegisterSheet(uri, this.SHEET);
			}
		} else {
			// Datei wurde nicht gelesen
			if (isEnable && isExists) {
				this.sss.loadAndRegisterSheet(uri, this.SHEET);
			}
		}
		if (this.lastModifiedTime !== 1 && isEnable && isForced) {
			log(this.leafName + " wurde aktualisiert");
		}
		this.lastModifiedTime = lastModifiedTime;
		return this._enabled = isEnable;
	},
};

UCL.init();

function $(id) { return document.getElementById(id); }
function $A(arr) { return Array.slice(arr); }
function $C(name, attr) {
	const el = document.createXULElement(name);
	if (attr) Object.keys(attr).forEach(function(n) { el.setAttribute(n, attr[n]) });
	return el;
}
function dateFormat(date, format) {
	format = format.replace("%Y", ("000" + date.getFullYear()).substr(-4));
	format = format.replace("%m", ("0" + (date.getMonth()+1)).substr(-2));
	format = format.replace("%d", ("0" + date.getDate()).substr(-2));
	format = format.replace("%H", ("0" + date.getHours()).substr(-2));
	format = format.replace("%M", ("0" + date.getMinutes()).substr(-2));
	format = format.replace("%S", ("0" + date.getSeconds()).substr(-2));
	return format;
}

function log(mes) { console.log(mes); }
})();
