// ==UserScript==
// @name           addBookmarkInLastUsedFolder.uc.js
// @namespace      addBookmarkInLastUsedFolder@ithinc.cn
// @description    Hinzufuegen eines Lesezeichens im zuletzt benutzten Ordner
// @author         ithinc
// @version        1.0.0.1a
// @updateURL      https://j.mozest.com/ucscript/script/27.meta.js
// ==/UserScript==

(function addBookmarkInLastUsedFolder() {
  PlacesUtils.__defineGetter__("lastUsedFolderId", function() {
    var annosvc = this.annotations;
    return annosvc.getItemsWithAnnotation(LAST_USED_ANNO)
                  .map(function(aId) [aId, annosvc.getItemAnnotation(aId, LAST_USED_ANNO)])
                  .reduce(function(aFolder, bFolder) aFolder[1] > bFolder[1] ? aFolder : bFolder, [0, 0])[0];
  });
  // Zeile 18 bis Zeile 85 sind aus dem Originalcode von Firefox uebernommen mit kleiner Anpassung in Zeile 48
  PlacesCommandHook.bookmarkPage = Task.async(function* (aBrowser, aParent, aShowEditUI) {
    if (PlacesUIUtils.useAsyncTransactions)
      return (yield this._bookmarkPagePT(aBrowser, aParent, aShowEditUI));

    var uri = aBrowser.currentURI;
    var itemId = PlacesUtils.getMostRecentBookmarkForURI(uri);
    if (itemId == -1) {
      // Bug 1148838 - Make this code work for full page plugins.
      var title;
      var description;
      var charset;
      try {
        let isErrorPage = /^about:(neterror|certerror|blocked)/
                          .test(aBrowser.contentDocumentAsCPOW.documentURI);
        title = isErrorPage ? PlacesUtils.history.getPageTitle(uri)
                            : aBrowser.contentTitle;
        title = title || uri.spec;
        description = PlacesUIUtils.getDescriptionFromDocument(aBrowser.contentDocumentAsCPOW);
        charset = aBrowser.characterSet;
      }
      catch (e) { }

      if (aShowEditUI) {
        // If we bookmark the page here (i.e. page was not "starred" already)
        // but open right into the "edit" state, start batching here, so
        // "Cancel" in that state removes the bookmark.
        StarUI.beginBatch();
      }

      var parent = aParent !== undefined ?
                   aParent : (PlacesUtils.lastUsedFolderId || PlacesUtils.unfiledBookmarksFolderId);
      var descAnno = { name: PlacesUIUtils.DESCRIPTION_ANNO, value: description };
      var txn = new PlacesCreateBookmarkTransaction(uri, parent,
                                                    PlacesUtils.bookmarks.DEFAULT_INDEX,
                                                    title, null, [descAnno]);
      PlacesUtils.transactionManager.doTransaction(txn);
      itemId = txn.item.id;
      // Set the character-set.
      if (charset && !PrivateBrowsingUtils.isBrowserPrivate(aBrowser))
        PlacesUtils.setCharsetForURI(uri, charset);
    }

    // Revert the contents of the location bar
    if (gURLBar)
      gURLBar.handleRevert();

    // If it was not requested to open directly in "edit" mode, we are done.
    if (!aShowEditUI)
      return;

    // Try to dock the panel to:
    // 1. the bookmarks menu button
    // 2. the page-proxy-favicon
    // 3. the content area
    if (BookmarkingUI.anchor) {
      StarUI.showEditBookmarkPopup(itemId, BookmarkingUI.anchor,
                                   "bottomcenter topright");
      return;
    }

    let pageProxyFavicon = document.getElementById("page-proxy-favicon");
    if (isElementVisible(pageProxyFavicon)) {
      StarUI.showEditBookmarkPopup(itemId, pageProxyFavicon,
                                   "bottomcenter topright");
    } else {
      StarUI.showEditBookmarkPopup(itemId, aBrowser, "overlap");
    }
  });

  let cmdAddBookmarkAs = document.getElementById("Browser:AddBookmarkAs");
  cmdAddBookmarkAs.setAttribute("oncommand", cmdAddBookmarkAs.getAttribute("oncommand")
    .replace("PlacesUtils.bookmarksMenuFolderId", "PlacesUtils.lastUsedFolderId || $&")
  );
})();
