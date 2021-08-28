location == AppConstants.BROWSER_CHROME_URL && (function () {
    var placesContext = document.getElementById("placesContext");
    var separator = document.getElementById("placesContext_openSeparator");
    var repBM = document.createXULElement('menuitem');
    placesContext.insertBefore(repBM, separator);
    repBM.id = "placesContext_replaceURL";
    repBM.setAttribute("label", "Mit aktueller URL ersetzen");
    repBM.setAttribute("accesskey", "U");
    repBM.addEventListener("command", () => {
        var itemGuid = placesContext.triggerNode._placesNode.bookmarkGuid;
        PlacesUtils.bookmarks.update({
            guid: itemGuid,
            url: gBrowser.currentURI,
            title: gBrowser.contentTitle
        });
    });
    var openBM = document.getElementById("placesContext_open:newtab");
    placesContext.addEventListener("popupshowing", () => {
        if (openBM.getAttribute("hidden") == "true") {
            repBM.setAttribute("hidden", "true");
        } else {
            repBM.removeAttribute("hidden");
        }
    });
})();
