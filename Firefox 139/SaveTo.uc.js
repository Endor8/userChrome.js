// ==UserScript==
// @include       chrome://mozapps/content/downloads/unknownContentType.xhtml
// @charset       UTF-8
// @sandbox       true
// @version       20250615 Fx139+
// ==/UserScript==

(function() {

	const { FileUtils } = ChromeUtils.importESModule('resource://gre/modules/FileUtils.sys.mjs');
	if (location.href !== 'chrome://mozapps/content/downloads/unknownContentType.xhtml') return;

	setTimeout(function() {
		saveTo()
	}, 100);

	function saveTo() {
	// config
	const dirArray = [
		['C:\\', 'System'],
        	['D:\\', 'DATA'],
        	['D:\\Software', 'Software'],
        	['D:\\Downloads', 'herunterladen'],
        	['D:\\Video', 'Video'],
		['' + FileUtils.getDir('UChrm', []).path + '', 'chrome'],
      		//["" + FileUtils.getDir('UChrm', ['SubScript']).path + "", "SubScript"],
		['E:\\', 'E:'],
		['F:\\', 'F:'],
		['G:\\', 'G:'],
		['H:\\', 'H:'],
		['I:\\', 'I:'],
		['S:\\', 'S:'],
		];

		let saveTo = createEl(document, 'button', {
			id: 'saveto',
			class: 'dialog-button',
			size: 'small',
			label: 'Speichern nach',
			type: 'menu',
		});

		let saveToMenu = createEl(document, 'menupopup');
		saveToMenu.appendChild(createEl(document, "html:link", {
			rel: "stylesheet",
			href: "chrome://global/skin/global.css"
		}));
		saveToMenu.appendChild(createEl(document, "html:link", {
			rel: "stylesheet",
			href: "chrome://global/content/elements/menupopup.css"
		}));
		
		saveTo.appendChild(saveToMenu);
		
		dirArray.forEach(item => {
			let [name, dir] = [item[1], item[0]];
			saveToMenu.appendChild(createEl(document, "menuitem", {
				label: name || (dir.match(/[^\\/]+$/) || [dir])[0],
				dir: dir,
				image: "moz-icon:file:///" + dir + "\\",
				class: "menuitem-iconic",
				onclick: function() {
					let dir = this.getAttribute('dir');
					let locationtext = document.getElementById('locationtext');
					let file = new FileUtils.File(dir + '\\' + (locationtext ? locationtext.value : document.getElementById('location').value));
					dialog.mLauncher.saveDestinationAvailable(file);
					dialog.onCancel = function() {};
					close();
				}
			}));
		})
		dialog.dialogElement('unknownContentType').getButton('cancel').before(saveTo);
	}
	
	
	function createEl (doc, type, attrs = {}) {
		let el = type.startsWith('html:') ? doc.createElementNS('http://www.w3.org/1999/xhtml', type) : doc.createXULElement(type);
		for (let key of Object.keys(attrs)) {
			if (key === 'innerHTML') {
				el.innerHTML = attrs[key];
			} else if (key.startsWith('on')) {
				el.addEventListener(key.slice(2).toLocaleLowerCase(), attrs[key]);
			} else {
				 el.setAttribute(key, attrs[key]);
			}
		}
		return el;
	}

}());
