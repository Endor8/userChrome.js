// ==UserScript==
// @include       chrome://mozapps/content/downloads/unknownContentType.xhtml
// @charset       UTF-8
// @sandbox       true
// @version       Fx139+
// ==/UserScript==

(function() {

	const {FileUtils} = ChromeUtils.importESModule('resource://gre/modules/FileUtils.sys.mjs');
	const {setTimeout} = ChromeUtils.importESModule('resource://gre/modules/Timer.sys.mjs');

	const css = `
		hbox.dialog-button-box button.dialog-button menupopup {
			background: #F0F0F0 !important;
			border: 1px solid #CCCCCC !important;
			padding: 2px !important;
		}
		hbox.dialog-button-box button.dialog-button menupopup menuitem.menuitem-iconic:hover {
			background: #91C9F7 !important;
		}
		hbox.dialog-button-box button.dialog-button menupopup menuitem.menuitem-iconic hbox.menu-iconic {
			padding: 3px !important;
		}
		hbox.dialog-button-box button.dialog-button menupopup menuitem.menuitem-iconic label.menu-iconic-text{
			padding: 3px !important;
			padding-left: 5px !important;
			padding-right: 12px !important;
		}`;
	const sss = Cc['@mozilla.org/content/style-sheet-service;1'].getService(Ci.nsIStyleSheetService);
	try {
		const uri = Services.io.newURI('data:text/css,' + encodeURIComponent(css));
		if(!sss.sheetRegistered(uri, sss.AGENT_SHEET))
		sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
	} catch (ex) {}
	
	setTimeout(function() {
		saveTo()
	}, 200);

	function saveTo() {
		// config
		const dirArray = [
			['C:\\', 'System'],
			['D:\\', 'DATA'],
			['D:\\Software', 'Software'],
			['D:\\Downloads', 'herunterladen'],
			['D:\\Video', 'Video'],
			['' + FileUtils.getDir('UChrm', []).path + '', 'chrome'],
			//['' + FileUtils.getDir('UChrm', ['SubScript']).path + '', 'SubScript'],

			['F:\\', 'F:'],
			['G:\\', 'G:'],
			['H:\\', 'H:'],
		];

		const button = document.getElementById('unknownContentType').getButton('cancel');
		const saveTo = button.parentNode.insertBefore(document.createXULElement('button'), button);
		const saveToMenu = saveTo.appendChild(document.createXULElement('menupopup'));
		saveTo.classList.toggle('dialog-button');
		saveTo.label = 'Speichern nach';
		saveTo.type = 'menu';
		dirArray.forEach(function(dir) {
			const name = dir[1];
			dir = dir[0];
			const mi = document.createXULElement('menuitem');
			const item = saveToMenu.appendChild(mi);
			item.setAttribute('label', (name || (dir.match(/[^\\/]+$/) || [dir])[0]));
			item.setAttribute('image', 'moz-icon:file:///' + dir + '\\');
			item.setAttribute('class', 'menuitem-iconic');
			item.addEventListener('click', function() {
				const locationtext = document.getElementById('locationtext');
				const file = new FileUtils.File(dir + '\\' + (locationtext ? locationtext.value : document.getElementById('location').value));
				dialog.mLauncher.saveDestinationAvailable(file);
				dialog.onCancel = function() {};
				close();
			});
		});
	}
}());
