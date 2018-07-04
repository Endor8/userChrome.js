// ==UserScript==
// @name                toggleFindbar by DoubleClick
// @description         Suchleiste mit Doppelklick in Seitenbereich öffnen / schließen
// @include             main
// ==/UserScript==
(function () {

	var closeOnly = false; // Suchleiste nur schließen = true, auch öffnen = false

	gBrowser.addEventListener('dblclick', function (event) {
	var tagName = event.target.tagName;
	if (tagName !== 'INPUT' && tagName !== 'TEXTAREA' || tagName !== 'A')
		if (event.button !== 0) return;
		toggleFindBar();
	}, false);

	function toggleFindBar() {
		if (!closeOnly && (!gFindBar || gFindBar.hidden)) {
			gLazyFindCommand('onFindCommand');
			setTimeout(function() {
				gFindBar._findField.value = '';
			}, 100);
		} else {
			gFindBar.close();
		}
	}

}());
