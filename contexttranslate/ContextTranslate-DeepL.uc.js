////  Translate DeepL ////
///https://github.com/ardiman/userChrome.js/tree/master/contexttranslate///
// ex ContextTranslate.uc.js///
// modifiziert by universum 123///

(function () {
	if (location != 'chrome://browser/content/browser.xul')
		return;
	let translate = function () {
		let browserMM = gBrowser.selectedBrowser.messageManager;
		browserMM.addMessageListener('getSelection', function listener(message) {
			let t = (message.data !== '');
			let e = (document.charset || document.characterSet);
			if (t) {
				openWebLinkIn('https://www.deepl.com/translator#en/de/' + encodeURIComponent(message.data), 'tab');
			} else {
				openWebLinkIn('https://www.deepl.com/translate?u=' + encodeURIComponent(gBrowser.currentURI.spec) + '&hl=de-DE&ie=' + e + '&sl=auto&tl=de-DE', 'tab');
			};
			browserMM.removeMessageListener('getSelection', listener, true);
		});
		browserMM.loadFrameScript('data:,sendAsyncMessage("getSelection", content.document.getSelection().toString())', true);
	}
	let menuitem = document.createElement('menuitem');
	menuitem.id = 'context-googletranslate';
	menuitem.setAttribute('label', 'Übersetzen');
	menuitem.setAttribute('tooltiptext', 'Mit DeeplTranslate übersetzen');
	menuitem.setAttribute('oncommand', '(' + translate.toString() + ')()');
	menuitem.classList.add('menuitem-iconic');
	//Wer kein Icon möchte kann die nächsten beiden Zeilen auskommentieren/löschen
	menuitem.style.listStyleImage = 'url("https://www.deepl.com/favicon.ico")';
	menuitem.style.listStyleImage = ' url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAACNwAAAjcB9wZEwgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAGZSURBVDiNjZKxaxRBFMZ/b2ZHbWITUxkRC4PnBUW0k1gkoFlMYmIR8R+w0UZBFAvtLAMS0ipC0guCd0GOa23EJGTPkBRCSCNHKiEgMzvPwmjCuiv3lft97zff7BuhQraWTouJLwE0mmf518a7spwUPxwZvlmLms8B4wWrLZhHPvuwUg44N9afGPcc4T5gK4pFgSUv/jHrre8HgKHJE4nzHWBgn/sZdBuYqQB1Q+5rbLR2DUBy1J89GIbEmNmQNW8DqxWAgcS5IQBT5vqYP3H1Gw9AHyosAKECVA4QuKfIPMhHVKygV4OVU8ByT4BDsiI6rWpusdbYUdgpBpLSMeGTRLYx2o5q9kT0ja2P3xU401ODQJz1neYdVRkT9C1gyob/Ngg/3VbifJf9TVg1L2Q43UC1eo3eb8KfB7O7uRf7T782Yo8hXBG4DFwvaRgFFoP4GTqt7u/bFuTOp5dU9BUw8u/BOhqy5fZ//4HvNL6ErHlNkSmFb4e9YM1WMV+5xjxrvM+P99VBngI/qnK96UI66OrpEhcnThatXx/tiqJJdDA6AAAAAElFTkSuQmCC")';
	let refItem = document.getElementById('context-inspect');
	refItem.parentNode.insertBefore(menuitem, refItem);
})();