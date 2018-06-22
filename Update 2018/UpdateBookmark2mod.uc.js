(function() {

  if (location != "chrome://browser/content/browser.xul")
    return;

  function insertRepBM(aDocument) {

    var separator = aDocument.getElementById("placesContext_openSeparator");
    var repBM = aDocument.createElement("menuitem");
    separator.parentNode.insertBefore(repBM, separator);
    repBM.id = "placesContext_replaceURL";
    repBM.setAttribute("label", "Mit aktueller URL ersetzen");
    repBM.setAttribute("accesskey", "U");

    var obs = aDocument.createElement("observes");
    obs.setAttribute("element", "placesContext_open");
    obs.setAttribute("attribute", "hidden");
    repBM.appendChild(obs);

    if (aDocument.URL == "chrome://browser/content/browser.xul") {

      repBM.addEventListener("command", function() {
        let itemGuid = aDocument.popupNode._placesNode.bookmarkGuid;
        PlacesUtils.bookmarks.update({
          guid: itemGuid,
          url: gBrowser.currentURI,
          title: gBrowser.contentTitle
        });
      });

    } else if (aDocument.URL == "chrome://browser/content/bookmarks/bookmarksPanel.xul") {

      repBM.addEventListener("command", function() {
        let itemGuid = aDocument.activeElement.selectedNode.bookmarkGuid;
        PlacesUtils.bookmarks.update({
          guid: itemGuid,
          url: gBrowser.currentURI,
          title: gBrowser.contentTitle
        });
      });
    };
  };

  insertRepBM(document);

  addEventListener("pageshow", function(event) {
    let doc = event.target;
    if (doc.URL == "chrome://browser/content/bookmarks/bookmarksPanel.xul") {
      insertRepBM(doc);
    };
  });

})();
