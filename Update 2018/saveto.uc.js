// ==UserScript==
// @include       chrome://mozapps/content/downloads/unknownContentType.xul
// @charset       UTF-8
// ==/UserScript==

if (location == "chrome://mozapps/content/downloads/unknownContentType.xul") {
(function () {

	function getQuery(str) {
		return document.querySelector(str);
	}

	function getPrefDirPath(str) {
		Components.utils.import("resource://gre/modules/Services.jsm");
		var prefDir = Services.dirsvc.get(str, Ci.nsIFile).path;
		return prefDir;
	}

	var dir = [
    ["C:\\Dokumente und Einstellungen\\Benutzername\\Desktop", "Desktop"],
		["C:\\Users\\Benutzername\\Documents", "Dokumente"],
		["C:\\Users\\Benutzername\\Pictures", "Bilder"],
		["C:\\Users\\Benutzername\\Music", "Musik"],
		["C:\\Users\\Benutzername\\Video", "Videos"],		
		["" + getPrefDirPath('UChrm') + "", "chrome"],
		["" + getPrefDirPath('UChrm') + "\\" + 'SubScript' + "", "SubScript"],
		["E:\\", "E:"],
		["F:\\", "F:"],
		["G:\\", "G:"],
		["H:\\", "H:"],
		["I:\\", "I:"],
		["S:\\", "S:"]
	];

	var button = document.documentElement.getButton("cancel");
	var saveTo =  button.parentNode.insertBefore(document.createElement("button"), button);
	var saveToMenu = saveTo.appendChild(document.createElement("menupopup"));
	saveTo.className = "dialog-button";
	saveTo.label = "Speichern auf";
	saveTo.type = "menu";
	dir.map(function (dir) {
		var converter = Cc["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Ci.nsIScriptableUnicodeConverter);
		converter.charset = "UTF-8";
		var name = converter.ConvertToUnicode(dir[1]);
		dir = converter.ConvertToUnicode(dir[0]);
		var item = saveToMenu.appendChild(document.createElement("menuitem"));
		item.setAttribute("label", (name||(dir.match(/[^\\/]+$/) || [dir])[0]));
		item.setAttribute("image", "moz-icon:file:///" + dir + "\\");
		item.setAttribute("class", "menuitem-iconic");
		item.setAttribute("oncommand", 'var file = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsIFile); file.initWithPath("' + dir.replace(/\\/g, "\\\\") + "\\\\" + (getQuery("#locationtext") ? getQuery("#locationtext").value : getQuery("#location").value) + '"); dialog.mLauncher.saveToDisk(file,1); dialog.onCancel = function() {}; close();');
	});

})();
}
