location == "chrome://browser/content/browser.xul" && (function () {
	var separator = document.getElementById("placesContext_openSeparator");
	var repBM = document.createElement('menuitem');
	separator.parentNode.insertBefore(repBM, separator);
	repBM.id = "placesContext_replaceURL";
	repBM.setAttribute("label", "Mit aktueller URL ersetzen");
	repBM.setAttribute("accesskey", "U");
	repBM.addEventListener("command", function () {
		var itemGuid = document.popupNode._placesNode.bookmarkGuid;
		PlacesUtils.bookmarks.update({
			guid: itemGuid,
			url: gBrowser.currentURI,
			title: gBrowser.contentTitle
		});
	}, false);
	var obs = document.createElement("observes");
	obs.setAttribute("element", "placesContext_open");
	obs.setAttribute("attribute", "hidden");
	repBM.appendChild(obs);
})();
