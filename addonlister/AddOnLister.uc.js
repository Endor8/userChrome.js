// ==UserScript==
// @name           AddOnLister.uc.js
// @compatibility  Firefox 36.*, 37.*, 60.* ,63.*, 115.*
// @include        main
// @version        1.0.20230519
// @Note           Aktualisiert von milupo - camp-firefox.de
// ==/UserScript==

var ADONLI = {

// ----- Start Konfiguration
	// folgende Add-ons nicht auflisten Beispiel: ["InfoLister","AddOnLister.uc.js"]
	BLACKLIST:			[],
	// einige Tests der Konfiguration durchführen (true oder false)?
	CHECKCONFIG:		true,
	// ans eigene System anpassen - Pfad mit Verzeichnistrenner abschliessen. Unter Windows den \ bitte verdoppeln
	EXPORTPATH:			"C:\\Users\\XXXX\\Documents\\Firefox\\",
	//Dateinamen ohne(!) Erweiterung eingeben - diese wird weiter unten im Wert "fileext" pro Ausgabeformat definiert
	EXPORTFILE:			"addonlister",
	// Ausgabeformat bbcode, html oder custom
	FORMAT:				"bbcode",
	// Erstellungsdatum anzeigen (true oder false)
	SHOWDATE:			true,
	// Useragent anzeigen (true oder false)
	SHOWUSERAGENT:		true,
	// Versuche folgende userChromeJS-Skripte *nicht* mit GitHub zu verlinken, weil nicht gewünscht oder möglich. ["*"] für gar keine Verlinkung
	GITHUBBLACKLIST:	[],
	// In der folgenden Zeile  den Pfad zum Texteditor eintragen (unter Ubuntu 10.04 z.B.: '/usr/bin/gedit'). Bei Fehleintrag wird view_source.editor.path ausgelesen:
	TEXTOPENEXE :		'C:\\Program Files (x86)\\Notepad++\\notepad++.exe',
	// Aufzulistende Add-On-Typen festlegen - möglich sind: ["extension","theme","plugin","dictionary","service","userstyle","greasemonkey-user-script","userchromejs"]
	WHICHTYPES:			["extension","theme","plugin","dictionary","userchromejs"],
// ----- Ende Konfiguration

// ----- Start Expertenkonfiguration
	ICON_URL:	"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAACGUlEQVR42mL8//8/AzJYtWy+G5ByB2IrINaECl8H4mNAvDMsKnEXsnqAAGIEGXDv1nmGM2cuKAD5OUCcAcTcDNjBVyCeAcRTTEwMHiipGTIABBALSBSquRmIY5iZmT8ICvI/FxQU4OHm5mID6/r67df79x++vH//kfPv37/FQCFxoJ5aoAEPAAKIBWoyyOYYdnb2Z9LSkqxCQgKSyNby8/OxAzEvH9+H10+fPn/28+fPGKDwSyAuAQggZi01eZCfu4E2f5OVlWYAahaFaTx95jyDnaM3Ax8fL4OhgS4DJycHNysr649Pnz7/Bnrd/OrlC2cAAogJGmDcQGd/Q9YMAv8YORmSkpIY+Hh54GIgNSC10HByBwggFmhoMwD9LIgeYrKSAgz+Ps4MOtqaKOIgtW/evAMxrQACiAkWVcAAY0JWBHQmg7d/ONgb6ABJrSZAADHhiC6G3Xv2gw1xdXFgwAcAAogJmkhAUfUPWeL+w8cMamoqDDLSUgxMbKi+Q1J7HSCAmKApjAEYz++RFV2/fouBg52dYeXqDQzHj+xGMQBJ7TGAAAIZsBNkKDCRcL179+E1TJGXpysDCysbw4dPPxjMzUzgmkFqQGqhqXInQACBkzIw/fcAOcVICUkUm39BmoEJ6TcwIUkBub3AfFECEECwlDgFlDxBKezhw8cfPn36hC8pgwxfAtXDABBAFGcmgABipDQ7AwQYAOqo3UvZE3l2AAAAAElFTkSuQmCC",
	MYTPLS:{
		'html':	//für Darstellung als vollständiges html5-Dokument
			{
			'fileext':'html',
			'opendatauri': false,
			'intro':'<!DOCTYPE html>\n<html>\n<head>\n<meta charset="UTF-8">\n'
				+'<title>Meine Firefox-Informationen</title>\n</head>\n<body>\n<h1>Meine Firefox-Informationen</h1>\n',
			'tpllastupd':'<div>\nLetzte Aktualisierung: %%lastupd%%\n</div>',
			'tpluseragent':'<div>\nUser Agent: %%useragent%%\n</div>',
			'tpladdongrp_title':{
								'extension':'<div id="extensions">\n<h2>Erweiterungen <small>(aktiviert: %%countactive%%, deaktiviert: %%countinactive%%, gesamt: %%count%%)</small></h2>',
								'theme':'<div id="themes">\n<h2>Themes <small>(%%count%%)</small></h2>',
								'plugin':'<div id="plugins">\n<h2>Plugins <small>(%%count%%)</small></h2>',
								'dictionary':'<div id="dictionaries">\n<h2>Wörterbücher <small>(%%count%%)</small></h2>',
								'service':'<div id="services">\n<h2>Dienste <small>(%%count%%)</small></h2>',
								'userstyle':'<div id="userstyles">\n<h2>Userstyles <small>(%%count%%)</small></h2>',
								'greasemonkey-user-script':'<div id="gmscripts">\n<h2>Greasemonkey <small>(aktiviert: %%countactive%%, deaktiviert: %%countinactive%%, gesamt: %%count%%)</small></h2>',
								'userchromejs':'<div id="userchromejs">\n<h2>userChromeJS <small>(%%count%%)</small></h2>'
								},
			'tpladdongrp_intro':{
								'default':'',
								'greasemonkey-user-script':'<p>Greasemonkey-Skripte können Webseiten um diverse Funktionen erweitern.</p>',
								'userchromejs':'<p>Durch die Erweiterung <a href="http://userchromejs.mozdev.org/">userChromeJS</a> eingebundene Skripte ergänzen den Firefox um diverse Funktionen.</p>'
								},
			'tpladdongrp_list_intro':{
								'default':'<ul>'
								},
			'tpladdon':'<li class="%%class%%"><a href="%%homepageURL%%">%%name%%</a> %%version%%: %%description%%%%disabled%%</li>\n',
			'tpladdon_without_url':'<li class="%%class%%">%%name%% %%version%%: %%description%%%%disabled%%</li>\n',
			'activeclass':'addonactive',
			'inactiveclass':'addoninactive',
			'disabledtext':'<small><span style="color:#ff0000;">[deaktiviert]</span></small>',
			'tpladdongrp_list_outro':'</ul>\n',
			'tpladdongrp_outro':'</div>\n\n',
			'outro':'</body>\n</html>'
			},
		'bbcode':	//für Postings in Foren, die bbcode unterstützen
			{
			'fileext':'txt',
			'opendatauri': true,
			'intro':'Meine Firefox-Informationen\n\n',
			'tpllastupd':'Letzte Aktualisierung: %%lastupd%%',
			'tpluseragent':'User Agent: %%useragent%%\n',
			'tpladdongrp_title':{
								'extension':'[b]Erweiterungen[/b] (aktiviert: %%countactive%%, deaktiviert: %%countinactive%%, gesamt: %%count%%)',
								'theme':'[b]Themes[/b] (%%count%%)',
								'plugin':'[b]Plugins[/b] (%%count%%)',
								'dictionary':'[b]Wörterbücher[/b] (%%count%%)',
								'service':'[b]Dienste[/b] (%%count%%)',
								'userstyle':'[b]Userstyles[/b] (%%count%%)',
								'greasemonkey-user-script':'[b]Greasemonkey[/b] (aktiviert: %%countactive%%, deaktiviert: %%countinactive%%, gesamt: %%count%%)',
								'userchromejs':'[b]userChromeJS[/b] (%%count%%)'
								},
			'tpladdongrp_intro':{
								'default':'',
								'greasemonkey-user-script':'Greasemonkey-Skripte können Webseiten um diverse Funktionen erweitern.',
								'userchromejs':'Durch die Erweiterung [url=http://userchromejs.mozdev.org/]userChromeJS[/url] eingebundene Skripte ergänzen den Firefox um diverse Funktionen.'
								},
			'tpladdongrp_list_intro':{
								'default':'[list]'
								},
			'tpladdon':'[*][url=%%homepageURL%%]%%name%%[/url] %%version%%: %%description%%%%disabled%%\n',
			'tpladdon_without_url':'[*]%%name%% %%version%%: %%description%%%%disabled%%\n',
			'activeclass':'addonactive',
			'inactiveclass':'addoninactive',
			'disabledtext':' [color=red][deaktiviert][/color]',
			'tpladdongrp_list_outro':'[/list]\n',
			'tpladdongrp_outro':'\n',
			'outro':''
			},
		'custom':	//Beispiel - für Darstellung als "include" in einem anderen (x)html-Dokument
			{
			'fileext':'txt',
			'opendatauri': true,
			'intro':'<p id="bsbuttons">\n'
				+'<a class="tab active" href="http://www.ardiman.de/sonstiges/fxconfig.html?mode=windows">Windows 7</a>\n'
				+'<a class="tab" href="http://www.ardiman.de/sonstiges/fxconfig.html?mode=ubuntu">XUbuntu</a>\n'
				+'</p>\n'
				+'<div id="buttons">\n'
				+'<a class="tab" href="http://www.ardiman.de/sonstiges/fxconfig.html#extensions">Erweiterungen</a>\n'
				+'<a class="tab" href="http://www.ardiman.de/sonstiges/fxconfig.html#themes">Themes</a>\n'
				+'<a class="tab" href="http://www.ardiman.de/sonstiges/fxconfig.html#plugins">Plugins</a>\n'
				//+'<a class="tab" href="http://www.ardiman.de/sonstiges/fxconfig.html#dictionaries">Wörterbücher</a>\n'
				//+'<a class="tab" href="http://www.ardiman.de/sonstiges/fxconfig.html#services">Dienste</a>\n'
				//+'<a class="tab" href="http://www.ardiman.de/sonstiges/fxconfig.html#userstyles">Userstyles</a>\n'
				+'<a class="tab" href="http://www.ardiman.de/sonstiges/fxconfig.html#gmscripts">Greasemonkey</a>\n'
				+'<a class="tab" href="http://www.ardiman.de/sonstiges/fxconfig.html#userchromejs">userChromeJS</a>\n'
				+'<br/></div>\n',
			'tpllastupd':'<div class="lastupd">\nLetzte Aktualisierung: %%lastupd%%\n</div>',
			'tpluseragent':'<div class="useragent">\nUser Agent: %%useragent%%\n</div>',
			'tpladdongrp_title':{
								'extension':'<div id="extensions" class="tab-element">\n<h2><img alt="" style="float: right; margin: 0.5ex 1ex 0 0;" width="16" height="16" src="/assets/images/fx_extensions.png" />Erweiterungen <small>(aktiviert: %%countactive%%, deaktiviert: %%countinactive%%, gesamt: %%count%%)</small></h2>',
								'theme':'<div id="themes" class="tab-element">\n<h2><img alt="" style="float: right; margin: 0.5ex 1ex 0 0;" width="16" height="16" src="/assets/images/fx_themes.png" />Themes <small>(%%count%%)</small></h2>',
								'plugin':'<div id="plugins" class="tab-element">\n<h2><img alt="" style="float: right; margin: 0.5ex 1ex 0 0;" width="16" height="16" src="/assets/images/fx_plugins.gif" />Plugins <small>(%%count%%)</small></h2>',
								'dictionary':'<div id="dictionaries" class="tab-element">\n<h2><img alt="" style="float: right; margin: 0.5ex 1ex 0 0;" width="16" height="16" src="/assets/images/fx_dictionaries.png" />Wörterbücher <small>(%%count%%)</small></h2>',
								'service':'<div id="services" class="tab-element">\n<h2><img alt="" style="float: right; margin: 0.5ex 1ex 0 0;" width="16" height="16" src="/assets/images/fx_services.png" />Dienste <small>(%%count%%)</small></h2>',
								'userstyle':'<div id="userstyles" class="tab-element">\n<h2><img alt="" style="float: right; margin: 0.5ex 1ex 0 0;" width="16" height="16" src="/assets/images/fx_styles.png" />Userstyles <small>(%%count%%)</small></h2>',
								'greasemonkey-user-script':'<div id="gmscripts" class="tab-element">\n<h2><img alt="" style="float: right; margin: 0.5ex 1ex 0 0;" width="16" height="16" src="/assets/images/fx_monkey.png" />Greasemonkey <small>(aktiviert: %%countactive%%, deaktiviert: %%countinactive%%, gesamt: %%count%%)</small></h2>',
								'userchromejs':'<div id="userchromejs" class="tab-element">\n<h2><img alt="" style="float: right; margin: 0.5ex 1ex 0 0;" width="16" height="16" src="/assets/images/fx_javascript.gif" />userChromeJS <small>(%%count%%)</small></h2>'
								},
			'tpladdongrp_intro':{
								'default':'',
								'greasemonkey-user-script':'<p>Einige Skripte stammen direkt von mir (s. auch <a href="http://www.ardiman.de/sonstiges/fxconfig/gmskripte.html">Greasemonkey-Skripte</a> bzw. <a class="extlink" href="https://openuserjs.org/users/ardiman/scripts" rel="nofollow">https://openuserjs.org/users/ardiman/scripts</a>), andere wurden nur geringf&uuml;gig angepasst.</p>',
								'userchromejs':'<p id="fxcuclisteintro">Durch die Erweiterung userChromeJS eingebundene Skripte erg&auml;nzen den Firefox um diverse Funktionen.</p>'
								},
			'tpladdongrp_list_intro':{
								'default':'<ul>',
								'userchromejs':'<ul id="fxcucliste">'
								},
			'tpladdon':'<li class="%%class%%"><a href="%%homepageURL%%" rel="nofollow" class="extlink">%%name%%</a> %%version%%: %%description%%%%disabled%%</li>\n',
			'tpladdon_without_url':'<li class="%%class%%">%%name%% %%version%%: %%description%%%%disabled%%</li>\n',
			'activeclass':'addonactive',
			'inactiveclass':'addoninactive',
			'disabledtext':' <small>[deaktiviert]</small>',
			'tpladdongrp_list_outro':'</ul>\n',
			'tpladdongrp_outro':'</div>\n\n',
			'outro':''
			}
	},
// ----- Ende Expertenkonfiguration

	MYSTOR: {},
	FILEUTILS: ChromeUtils.importESModule('resource://gre/modules/FileUtils.sys.mjs').FileUtils,

	init: function() {
		// legt verschiebbaren Button und Menü unter Extras an
		// Button
		if (location != "chrome://browser/content/browser.xhtml") return;
		try {
			CustomizableUI.createWidget({
				id: 'adonli-button',
				type: 'custom',
				// defaultArea: CustomizableUI.AREA_NAVBAR,
				onBuild: function(aDocument) {
					var toolbaritem = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
					var attributes = {
						id: 'adonli-button',
						class: 'toolbarbutton-1 chromeclass-toolbar-additional',
						removable: 'true',
						label: 'AddonLister',
						tooltiptext: 'AddOnLister starten (Erstellung im Format »'+ADONLI.FORMAT+'«):\nLinksklick öffnet Ergebnis im Editor\nMittelklick öffnet Ergebnis als Tab im Browser\nRechtsklick exportiert die Liste ohne Anzeige im Editor oder Browser',
						style: 'list-style-image: url(' + ADONLI.ICON_URL + ')',
						onclick: 'event.preventDefault(); return ADONLI.launch(event.button, \"' + ADONLI.FORMAT +'\");'
					};
				for (var a in attributes)
					toolbaritem.setAttribute(a, attributes[a]);
					return toolbaritem;
				}
			});
		} catch(e) { };
		// Menü
		function addNode(parentId, type, attributes) {
			let node = document.createXULElement(type);
			for (let a in attributes) {
				node.setAttribute(a, attributes[a]);
			};
			document.getElementById(parentId).appendChild(node);
		};
		addNode("menu_ToolsPopup", "menu", {
			id: "menu_ucjsAddonLister",
			accesskey: "L",
			label: "AddonLister",
			class: "menu-iconic",
			style: "list-style-image: url(" + ADONLI.ICON_URL + ")"
		});
		document.getElementById("menu_ToolsPopup")
			.insertBefore(document.getElementById("menu_ucjsAddonLister"),
			              document.getElementById("menu_openAddons").nextSibling);
		addNode("menu_ucjsAddonLister", "menupopup", {
			id: "menu_ucjsAddonLister-popup"
		});
		addNode("menu_ucjsAddonLister-popup", "menu", {
			id: "menu_ucjsAddonLister-bbcode",
			accesskey: "B",
			label: "BBCODE",
			class: "menu-iconic"
		});
		addNode("menu_ucjsAddonLister-bbcode", "menupopup", {
			id: "menu_ucjsAddonLister-popup-bbcode"
		});
		addNode("menu_ucjsAddonLister-popup-bbcode", "menuitem", {
			id: "menu_ucjsAddonLister_editor-bbcode",
			class: "menAddonLister_item",
			oncommand: "ADONLI.launch(0,\'bbcode\')",
			accesskey: "E",
			label: "Liste erstellen und im Editor anzeigen"
		});
		addNode("menu_ucjsAddonLister-popup-bbcode", "menuitem", {
			id: "menu_ucjsAddonLister_browser-bbcode",
			class: "menAddonLister_item",
			oncommand: "ADONLI.launch(1,\'bbcode\')",
			accesskey: "A",
			label: "Liste erstellen und im Browser anzeigen"
		});
		addNode("menu_ucjsAddonLister-popup-bbcode", "menuitem", {
			id: "menu_ucjsAddonLister_write-bbcode",
			class: "menAddonLister_item",
			oncommand: "ADONLI.launch(2,\'bbcode\')",
			accesskey: "o",
			label: "Liste erstellen ohne Anzeige"
		});
		addNode("menu_ucjsAddonLister-popup", "menu", {
			id: "menu_ucjsAddonLister-html",
			accesskey: "H",
			label: "HTML",
			class: "menu-iconic"
		});
		addNode("menu_ucjsAddonLister-html", "menupopup", {
			id: "menu_ucjsAddonLister-popup-html"
		});
		addNode("menu_ucjsAddonLister-popup-html", "menuitem", {
			id: "menu_ucjsAddonLister_editor-html",
			class: "menAddonLister_item",
			oncommand: "ADONLI.launch(0,\'html\')",
			accesskey: "E",
			label: "Liste erstellen und im Editor anzeigen"
		});
		addNode("menu_ucjsAddonLister-popup-html", "menuitem", {
			id: "menu_ucjsAddonLister_browser-html",
			class: "menAddonLister_item",
			oncommand: "ADONLI.launch(1,\'html\')",
			accesskey: "A",
			label: "Liste erstellen und im Browser anzeigen"
		});
		addNode("menu_ucjsAddonLister-popup-html", "menuitem", {
			id: "menu_ucjsAddonLister_write-html",
			class: "menAddonLister_item",
			oncommand: "ADONLI.launch(2,\'html\')",
			accesskey: "o",
			label: "Liste erstellen ohne Anzeige"
		});
		addNode("menu_ucjsAddonLister-popup", "menu", {
			id: "menu_ucjsAddonLister-custom",
			accesskey: "C",
			label: "Custom",
			class: "menu-iconic"
		});
		addNode("menu_ucjsAddonLister-custom", "menupopup", {
			id: "menu_ucjsAddonLister-popup-custom"
		});
		addNode("menu_ucjsAddonLister-popup-custom", "menuitem", {
			id: "menu_ucjsAddonLister_editor-custom",
			class: "menAddonLister_item",
			oncommand: "ADONLI.launch(0,\'custom\')",
			accesskey: "E",
			label: "Liste erstellen und im Editor anzeigen"
		});
		addNode("menu_ucjsAddonLister-popup-custom", "menuitem", {
			id: "menu_ucjsAddonLister_browser-custom",
			class: "menAddonLister_item",
			oncommand: "ADONLI.launch(1,\'custom\')",
			accesskey: "A",
			label: "Liste erstellen und im Browser anzeigen"
		});
		addNode("menu_ucjsAddonLister-popup-custom", "menuitem", {
			id: "menu_ucjsAddonLister_write-custom",
			class: "menAddonLister_item",
			oncommand: "ADONLI.launch(2,\'custom\')",
			accesskey: "o",
			label: "Liste erstellen ohne Anzeige"
		});
		addNode("menu_ucjsAddonLister-popup", "menuitem", {
			tooltiptext: "Erstellung im Format »" + ADONLI.FORMAT + "«",
			id: "menu_ucjsAddonLister_editor",
			class: "menAddonLister_item",
			oncommand: "ADONLI.launch(0,\'" + ADONLI.FORMAT + "\')",
			accesskey: "E",
			label: "Liste erstellen und im Editor anzeigen"
		});
		addNode("menu_ucjsAddonLister-popup", "menuitem", {
			tooltiptext: "Erstellung im Format »" + ADONLI.FORMAT + "«",
			id: "menu_ucjsAddonLister_browser",
			class: "menAddonLister_item",
			oncommand: "ADONLI.launch(1,\'" + ADONLI.FORMAT + "\')",
			accesskey: "A",
			label: "Liste erstellen und im Browser anzeigen"
		});
		addNode("menu_ucjsAddonLister-popup", "menuitem", {
			tooltiptext: "Erstellung im Format »" + ADONLI.FORMAT + "«",
			id: "menu_ucjsAddonLister_write",
			class: "menAddonLister_item",
			oncommand: "ADONLI.launch(2,\'" + ADONLI.FORMAT + "\')",
			accesskey: "o",
			label: "Liste erstellen ohne Anzeige"
		});
	},

	launch: function(e,format) {
		// ruft alle noetigen Funktionen nach Klick auf Toolbarbutton auf
		var ctrlConf = "";
		if (this.CHECKCONFIG) ctrlConf = this.configCheck();
		if (ctrlConf === "") {
			var expfile =  this.EXPORTPATH + this.EXPORTFILE + "." + this.MYTPLS[format].fileext;
			this.getOtherValues();
			this.resetStor();
			this.getAddons();
			if (this.WHICHTYPES.indexOf('userchromejs') !== -1) this.getScripts();
			var result = this.writeAddons(expfile,format);
			this.showAddons(e,this.TEXTOPENEXE,expfile,format,result);
		} else {
			alert ("Lt. Konfigurationstest des AddonListers muss folgendes kontrolliert werden:\n" + ctrlConf);
		}
	},

	configCheck: function() {
		var fehler = "";
		// Kontrolle des Pfades
		if (this.EXPORTPATH.substr(-1) !== "\\" && this.EXPORTPATH.substr(-1) !== "/") fehler += "\n - Der Pfad in EXPORTPATH endet nicht mit einem Verzeichnistrenner.";
		if (!this.fileExists(this.EXPORTPATH)) fehler += "\n - Der Pfad »" + this.EXPORTPATH + "« in EXPORTPATH existiert nicht.";
		// Kontrolle des Dateinamens
		if (this.EXPORTFILE.indexOf(".") !== -1) fehler += "\n - Der Dateiname in EXPORTFILE sollte keinen Punkt enthalten (ohne Erweiterung sein).";
		if (this.EXPORTFILE.length === 0) fehler += "\n - Es wurde kein Dateiname in EXPORTFILE hinterlegt.";
		// Kontrolle des Formates
		var formate = ["bbcode", "custom", "html"];
		if (formate.indexOf(this.FORMAT) === -1) fehler += "\n - Ungültiges FORMAT »" + this.FORMAT + "«.";
		// Kontrolle des Editors
		if (!this.fileExists(this.TEXTOPENEXE)) {
			var pref = Cc["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
			if (!this.fileExists(pref.getCharPref("view_source.editor.path"))) {
				fehler += "\n - Der in TEXTOPENEXE und about:config [view_source.editor.path] hinterlegte Editor kann nicht gefunden werden.";
			}
		}
		// Kontrolle der gewünschten Addon-Typen, folgende sind momentan gültig:
		var addontypes = ["extension","theme","plugin","dictionary","service","userstyle","greasemonkey-user-script","userchromejs"];
		var w;
		for (w = 0; w < this.WHICHTYPES.length; w++) {
			if (addontypes.indexOf(this.WHICHTYPES[w]) === -1) {
				fehler += "\n - In WHICHTYPES wurden ein oder mehrere unbekannte Add-on-Typen (z.B. »" + this.WHICHTYPES[w] + "«) gewählt.";
				break;
			}
		}
		return fehler;
	},

	fileExists: function(mypath) {
		// kontrolliert, ob Pfad oder Datei gültig/vorhanden ist
		var file = new this.FILEUTILS.File(mypath);
		return file.exists();
	},

	resetStor: function() {
		// setzt das JSON-Object (bzw. die "Listen" darin) zurueck
		var h;
		for (h = 0; h < this.WHICHTYPES.length; h++) {
			this.MYSTOR[this.WHICHTYPES[h]] = [];
		}
	},

	getOtherValues: function() {
		// speichert momentan Auswertungsdatum und useragent im JSON-Object
		var options;
		options = {weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric", hour12: false};
		if (this.SHOWDATE) this.MYSTOR["lastupd"] = new Date().toLocaleDateString("de-DE", options);
		if (this.SHOWUSERAGENT) this.MYSTOR["useragent"] = window.navigator.userAgent;
	},

	getAddons: function() {
		// speichert die gewaehlten Addons (s. WHICHTYPES) im JSON-Object
		var i, x, j, iAo, Addons, added, storedItems;
		AddonManager.getAddonsByTypes(this.WHICHTYPES).then(function(addonlist) {
			Addons = addonlist;
		});
		var thread = Cc['@mozilla.org/thread-manager;1'].getService().mainThread;
		while (Addons === void(0)) {
			thread.processNextEvent(true);
		}
		// Schleife ueber Addons
		for (i = 0; i < Addons.length; i++) {
			iAo = Addons[i];
			added = false;
			storedItems = this.MYSTOR[iAo.type].length;
			// nächste Aktionen nur, wenn Addon *nicht* in BLACKLIST steht
			if (this.BLACKLIST.indexOf(iAo.name) === -1) {
				// Ablage gleich sortiert vornehmen
				for (j = 0; j < storedItems; j++) {
					if (iAo.name.toLowerCase() < this.MYSTOR[iAo.type][j].name.toLowerCase()) {
						this.MYSTOR[iAo.type].splice(j,0,{ 'name': iAo.name, 'version': iAo.version, 'active': iAo.isActive, 'homepage': iAo.homepageURL});
						added = true;
						break;
					}
				}
				if (!added) this.MYSTOR[iAo.type].push({ 'name': iAo.name, 'version': iAo.version, 'active': iAo.isActive, 'homepage': iAo.homepageURL});
			}
		}
	},

	getScripts: function() {
		// speichert ggf. im Chrome-Ordner vorhandene uc.js und uc.xul-Dateien im JSON-Object
		var hp, j, storedItems, added;
		// Suchmuster, also die Dateierweiterungen uc.js und uc.xul
		let extjs = /\.uc\.js$/i;
		let extxul = /\.uc\.xul$/i;
		let aFolder = Cc["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("UChrm", Components.interfaces.nsIFile);
		// files mit Eintraegen im Chrome-Ordner befuellen
		let files = aFolder.directoryEntries.QueryInterface(Ci.nsISimpleEnumerator);
		// Ordner bzw. Dateien durchlaufen und kontrollieren, ob gesuchte Dateien dabei sind
		while (files.hasMoreElements()) {
			let file = files.getNext().QueryInterface(Ci.nsIFile);
			// keine gewuenschte Datei, deshalb continue
			if ((!extjs.test(file.leafName) && !extxul.test(file.leafName)) || this.BLACKLIST.indexOf(file.leafName) !== -1) continue;
			// uc.js bzw. uc.xul gefunden, die nicht in der Blacklist stehen -> Ablage sortiert (unter Linux erforderlich) im JSON vornehmen
			hp = this.githubLink(file.leafName);
			added = false;
			storedItems = this.MYSTOR.userchromejs.length;
			for (j = 0; j < storedItems; j++) {
				if (file.leafName.toLowerCase() < this.MYSTOR.userchromejs[j].name.toLowerCase()) {
					this.MYSTOR.userchromejs.splice(j,0,{'name': file.leafName, 'version': undefined, 'active': true, 'description': undefined, 'homepage': hp});
					added = true;
					break;
				}
			}
			if (!added) this.MYSTOR.userchromejs.push({'name': file.leafName, 'version': undefined, 'active': true, 'description': undefined, 'homepage': hp});
		}
	},

	githubLink: function(sName) {
		// übergibt für gegebenen Skriptnamen den Link zu github
		// früher Ausstieg, da Skript nicht verlinkt werden soll
		if (this.GITHUBBLACKLIST.indexOf(sName) !== -1 || this.GITHUBBLACKLIST.indexOf("*") !== -1) return null;
		sName = sName.toLowerCase();
		/* Das folgende Array enthaelt regulaere Ausdruecke, um ungueltige Zeichenfolgen entfernen:
		/Datei-Erweiterungen am Ende/, /"ucjs_" am Anfang/, /"_"gefolgtVonZahlUndDanachBeliebigenZeichen/
		/ "_fx"gefolgtVonZahl(en)/, /"-" oder "+" oder "."/, /"_v"gefolgtVonZahlen
		*/
		var regs = [/\.uc\.js$/,/\.uc\.xul$/,/^ucjs_/,/_\d.+/,/_fx\d+/,/[-+\.]/g,/_v\d+/];
		for (var i = 0; i < regs.length; i++) {
			sName = sName.replace(regs[i],"");
		}
		return "https://github.com/endor8/userChrome.js/tree/master/" + sName;
	},

	writeAddons: function(file,format){
		var a, t, c, n, d, atype, aout, thisaddon;
		var output = "";
		var addontpl = "";
		var addontplwithouturl = "";
		//Cu.import("resource://gre/modules/osfile.jsm");

		addontpl = this.MYTPLS[format].tpladdon;
		addontplwithouturl = this.MYTPLS[format].tpladdon_without_url;
		output += this.MYTPLS[format].intro;

		if (this.SHOWDATE) output +=  this.MYTPLS[format].tpllastupd.replace(/%%lastupd%%/g,this.MYSTOR.lastupd)+"\n";
		if (this.SHOWUSERAGENT) output +=  this.MYTPLS[format].tpluseragent.replace(/%%useragent%%/g,this.MYSTOR.useragent)+"\n";

		for (t = 0; t < this.WHICHTYPES.length; t++) {
			atype = this.WHICHTYPES[t];
			c = this.MYSTOR[atype].length;
			n = 0;
			d = 0;
			output += this.MYTPLS[format].tpladdongrp_title[atype].replace(/%%count%%/g,c)+"\n";
			if (this.MYTPLS[format].tpladdongrp_intro[atype] == undefined) {
				output += this.MYTPLS[format].tpladdongrp_intro.default + (this.MYTPLS[format].tpladdongrp_intro.default.length > 0 ? "\n" : "");
			} else {
				output += this.MYTPLS[format].tpladdongrp_intro[atype] + (this.MYTPLS[format].tpladdongrp_intro[atype].length > 0 ? "\n" : "");
			}
			if (this.MYTPLS[format].tpladdongrp_list_intro[atype] == undefined) {
				output += this.MYTPLS[format].tpladdongrp_list_intro.default+"\n";
			} else {
				output += this.MYTPLS[format].tpladdongrp_list_intro[atype]+"\n";
			}
			for (a = 0; a < c; a++) {
				thisaddon =  this.MYSTOR[atype][a];
				// console.log(atype + " " + thisaddon.name + " " + thisaddon.active);
				if (thisaddon.homepage == undefined) {
					aout = addontplwithouturl;
				} else {
					aout = addontpl;
					aout = aout.replace(/%%homepageURL%%/g,thisaddon.homepage.replace(/&(?!amp;)/g,'&amp;'));
				}
				aout = aout.replace(/%%name%%/g,thisaddon.name);
				if (thisaddon.version == undefined) {
					if (thisaddon.description != undefined) {
						aout = aout.replace(/ %%version%%: /g,": ");
					} else {
						aout = aout.replace(/ %%version%%: /g,"");
					}
				}
				aout = aout.replace(/%%version%%/g,thisaddon.version);
				if (thisaddon.description != undefined) {
					aout = aout.replace(/%%description%%/g,thisaddon.description);
				} else {
					aout = aout.replace(/%%description%%/g,"");
				}
				if (thisaddon.active !== true) {
					aout = aout.replace(/%%class%%/g,this.MYTPLS[format].inactiveclass);
					aout = aout.replace(/%%disabled%%/g,this.MYTPLS[format].disabledtext);
					d++;
				} else {
					aout = aout.replace(/%%class%%/g,this.MYTPLS[format].activeclass);
					aout = aout.replace(/%%disabled%%/g,"");
					n++;
				}
				output += aout;
			}
			output = output.replace(/%%countactive%%/g,n).replace(/%%countinactive%%/g,d);
			output += this.MYTPLS[format].tpladdongrp_list_outro;
			output += this.MYTPLS[format].tpladdongrp_outro;
		}
		output += this.MYTPLS[format].outro+"\n";
		let encoder = new TextEncoder();
		let myarray = encoder.encode(output);
		let promise = IOUtils.write(file, myarray);
		return output;
	},

	showAddons: function(e,RanPath,OpenPath,format,myoutput) {
		// zeigt das EXPORTFILE im Editor oder im Browser (Mittelklick) an
		switch (e) {
			case 0:
				var file = new this.FILEUTILS.File(RanPath);
				var proc = Cc["@mozilla.org/process/util;1"].createInstance(Components.interfaces.nsIProcess);
				var args = [OpenPath];
				// falls der im Konfigurationsabschnitt definierte Editor nicht gefunden wird, auf Einstellung in about:config ausweichen:
				if (!this.fileExists(RanPath)) {
					console.log("AddonLister meldet: Editor nicht gefunden, ausweichen auf about:config.");
					var pref = Cc["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
					RanPath = pref.getCharPref("view_source.editor.path");
					file = new this.FILEUTILS.File(RanPath);
				}
				proc.init(file);
				proc.run(false, args, args.length);
				break;
			case 1:
				if (this.MYTPLS[format].opendatauri) {
					var datastring = myoutput.replace(/\n/g,"%0A").replace(/#/g,"%23");
					// getBrowser().selectedTab = getBrowser().addTrustedTab('data:text/plain;charset=utf-8,' + datastring);
					openTrustedLinkIn('data:text/plain;charset=utf-8,' + datastring, "tab");
					XULBrowserWindow.statusTextField.label = "Export nach  »"+ OpenPath + "« ist erfolgt.";
				} else {
					// alert sorgt ein wenig dafür, dem OS Zeit fürs Speichern der Datei zu geben ...
					alert("Export nach »"+ OpenPath + "« ("+ format + "-format) ist erfolgt.");
					openTrustedLinkIn(OpenPath, "tab");
					//getBrowser().selectedTab = getBrowser().addTrustedTab(OpenPath);
				}
				break;
			default:
				XULBrowserWindow.statusTextField.label = "Export nach  »"+ OpenPath + "« ist erfolgt.";
				break;
		}
	}

};

ADONLI.init();
