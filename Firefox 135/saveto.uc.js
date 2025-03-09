// ==UserScript==
// @include       chrome://mozapps/content/downloads/unknownContentType.xhtml
// @charset       UTF-8
// @version       Fx135+
// ==/UserScript==

(function() {

	const {FileUtils} = ChromeUtils.importESModule("resource://gre/modules/FileUtils.sys.mjs");

	var css = `
		hbox.dialog-button-box button.dialog-button menupopup {
			background: #F0F0F0 !important;
			border: 1px solid #CCCCCC !important;
			padding: 2px !important;
		}
		hbox.dialog-button-box button.dialog-button menupopup menuitem.menuitem-iconic:hover {
			background: #91C9F7 !important;
		}
		hbox.dialog-button-box button.dialog-button menupopup menuitem.menuitem-iconic hbox.menu-iconic-left {
			padding: 3px !important;
		}
		hbox.dialog-button-box button.dialog-button menupopup menuitem.menuitem-iconic label.menu-iconic-text{
			padding: 3px !important;
			padding-left: 5px !important;
			padding-right: 12px !important;
		}`;
	var sss = Cc['@mozilla.org/content/style-sheet-service;1'].getService(Ci.nsIStyleSheetService);
	var uri = Services.io.newURI('data:text/css,' + encodeURIComponent(css))
	sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);


	setTimeout(function() {
		saveTo()
	}, 200);

	function saveTo() {
		// config
		var dirArray = [
		['C:\\Users\\xxxx\\Documents', 'Dokumente'],
		['C:\\Users\\xxxx\\Pictures', 'Bilder'],
		['C:\\Users\\xxxx\\Music', 'Musik'],
		['C:\\Users\\xxxx\\Videos', 'Videos'],		
		['F:\\Video', 'Videos'],
		['F:\\Adaten\\Downloads\\Firefox\\Muell', 'Verschiedenes'],
		["" + FileUtils.getDir('UChrm', []).path + "", "chrome"],
		//["" + FileUtils.getDir('UChrm', ['SubScript']).path + "", "SubScript"],
		['E:\\', 'E:'],
		['F:\\', 'F:'],
		['G:\\', 'G:'],
		['H:\\', 'H:'],
		['I:\\', 'I:'],
		['S:\\', 'S:'],
		];

		let button = document.getElementById("unknownContentType").getButton("cancel");
		let saveTo = button.parentNode.insertBefore(document.createXULElement("button"), button);
		var saveToMenu = saveTo.appendChild(document.createXULElement("menupopup"));
		saveTo.classList.toggle("dialog-button");
		saveTo.label = "Save To";
		saveTo.type = "menu";
		dirArray.forEach(function(dir) {
			var [name, dir] = [dir[1], dir[0]];
			var mi = document.createXULElement("menuitem");
			var item = saveToMenu.appendChild(mi);
			item.setAttribute("label", (name || (dir.match(/[^\\/]+$/) || [dir])[0]));
			item.setAttribute("image", "moz-icon:file:///" + dir + "\\");
			item.setAttribute("class", "menuitem-iconic");
			item.addEventListener("command", function() {
				var locationtext = document.getElementById('locationtext');
				var file = new FileUtils.File(dir + '\\' + (locationtext ? locationtext.value : document.getElementById('location').value));
				dialog.mLauncher.saveDestinationAvailable(file);
				dialog.onCancel = function() {};
				close();
			});
		});
	}
}());
