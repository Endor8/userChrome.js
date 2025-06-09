// ==UserScript==
// @include       chrome://mozapps/content/downloads/unknownContentType.xhtml
// @charset       UTF-8
// @sandbox       true
// @version       Fx139+
// ==/UserScript==

(function () {

    const { FileUtils } = ChromeUtils.importESModule('resource://gre/modules/FileUtils.sys.mjs');
    const { setTimeout } = ChromeUtils.importESModule('resource://gre/modules/Timer.sys.mjs');

    setTimeout(function () {
        saveTo()
    }, 200);

    function saveTo () {
        // config
        const dirArray = [
		['C:\\Users\\Paulmichl\\Documents', 'Dokumente'],
		['C:\\Users\\Paulmichl\\Pictures', 'Bilder'],
		['C:\\Users\\Paulmichl\\Music', 'Musik'],
		['C:\\Users\\Paulmichl\\Videos', 'Videos'],
		['C:\\Users\\Paulmichl\\Wetter', 'Wetter'],	
		['F:\\Video', 'Videos'],
		['F:\\Adaten\\Downloads\\Firefox\\Muell', 'Verschiedenes'],
		['' + FileUtils.getDir('UChrm', []).path + '', 'chrome'],
		//["" + FileUtils.getDir('UChrm', ['SubScript']).path + "", "SubScript"],
		['E:\\', 'E:'],
		['F:\\', 'F:'],
		['G:\\', 'G:'],
		['H:\\', 'H:'],
		['I:\\', 'I:'],
		['S:\\', 'S:'],
        ];

        const button = document.getElementById('unknownContentType').getButton('cancel');
        const saveTo = button.parentNode.insertBefore(createEl('button', {
            label: 'Speichern nach',
            class: 'dialog-button',
            type: 'menu'
        }), button);
        const saveToMenu = saveTo.appendChild(createEl('menupopup'));
        saveToMenu.appendChild(createEl("html:link", {
            rel: "stylesheet",
            href: "chrome://global/skin/global.css"
        }));
        saveToMenu.appendChild(createEl("html:link", {
            rel: "stylesheet",
            href: "chrome://global/content/elements/menupopup.css"
        }));
        dirArray.forEach(function (a) {
            const [dir, name] = [a[0], a[1]];
            saveToMenu.appendChild(createEl('menuitem', {
                label: (name || (dir.match(/[^\\/]+$/) || [dir])[0]),
                image: 'moz-icon:file:///' + dir + '\\',
                class: 'menuitem-iconic',
                dir: dir,
                onclick: function () {
                    const locationtext = document.getElementById('locationtext');
                    const file = new FileUtils.File(this.getAttribute('dir') + '\\' + (locationtext ? locationtext.value : document.getElementById('location').value));
                    dialog.mLauncher.saveDestinationAvailable(file);
                    dialog.onCancel = function () { };
                    close();

                }
            }));
        });
    }

    function createEl (type, attrs = {}, doc = document) {
        let el = type.startsWith('html:')
            ? doc.createElementNS('http://www.w3.org/1999/xhtml', type)
            : doc.createXULElement(type);

        for (let key of Object.keys(attrs)) {
            key.startsWith('on')
                ? el.addEventListener(key.slice(2).toLocaleLowerCase(), attrs[key])
                : el.setAttribute(key, attrs[key]);
        }

        return el;
    }
}());