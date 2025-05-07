// ContextTranslate_Google.uc.js

// https://github.com/ardiman/userChrome.js/tree/master/contexttranslate
// ex ContextTranslate.uc.js///
// modifiziert by universum 123, Umlaute geändert by 2002Andreas
// https://www.camp-firefox.de/forum/thema/126100/?postID=1107070#post1107070

(function () {
	if (location != 'chrome://browser/content/browser.xhtml')
		return;
	let translate = function () {
		let browserMM = gBrowser.selectedBrowser.messageManager;
		browserMM.addMessageListener('getSelection', function listener(message) {
			let t = (message.data !== '');
			let e = (document.charset || document.characterSet);
			if (t) {
                openWebLinkIn('https://translate.google.com/?sl=en&tl=de&text=' + encodeURIComponent(message.data), 'tab');
			} else {
				openWebLinkIn('https://translate.google.com/translate?u=' + encodeURIComponent(gBrowser.currentURI.spec) + '&hl=de-DE&ie=' + e + '&sl=auto&tl=de-DE', 'tab');
			};
			browserMM.removeMessageListener('getSelection', listener, true);
		});
		browserMM.loadFrameScript('data:,sendAsyncMessage("getSelection", content.document.getSelection().toString())', true);
	}
	let menuitem = document.createXULElement('menuitem');
	menuitem.id = 'context-googletranslate';
	menuitem.setAttribute('label', '\u00dcbersetzen (Google)');
	menuitem.classList.add('menuitem-iconic');

	let ProfilePath = Services.dirsvc.get("ProfD", Ci.nsIFile).path.replace(/\\/g, "/");
	let ButtonIcon = "Google.svg";
	menuitem.style.listStyleImage = 'url("' + ("file:" + ProfilePath + "/chrome/icons/" + ButtonIcon) + '")';

	menuitem.addEventListener('command', translate);

    let refItem = document.getElementById('context-inspect');
	refItem.parentNode.insertBefore(menuitem, refItem);
})();
