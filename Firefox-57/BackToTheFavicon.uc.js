(function() {
	if (location != "chrome://browser/content/browser.xul") return;
	var iconId = (typeof gProxyFavIcon == 'undefined') ? 'identity-icon' : 'page-proxy-favicon';
	gBrowser.tabContainer.addEventListener("TabAttrModified", function() {
		var icon = document.getElementById(iconId);
		if (gBrowser.mCurrentTab.image === icon.src) return;
		(!!gBrowser.mCurrentTab.image) ? icon.src = gBrowser.mCurrentTab.image : icon.removeAttribute("src");
	}, false);
})();
