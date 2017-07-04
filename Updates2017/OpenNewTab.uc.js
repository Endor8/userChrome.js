// ==UserScript==
// @name            openNewTab.uc.js
// @namespace       opennewtab@haoutil.com
// @include         main
// @include         chrome://browser/content/places/places.xul
// @description     Lesezeichen, Chronik, Suchleiste, Adressleiste in neuen Tabs öffnen
// @downloadURL     https://raw.githubusercontent.com/xinggsf/uc/master/openNewTab.uc.js
// @version         1.3.1.2
// @Note xinggsf 2017.6.9  修改使之能用于FX53,修正BUG: vertical书签栏不能新开；搜索栏被移除导致脚本出错
// ==/UserScript==
(function() {
    const b_urlbar = true,
    b_searchbar = true,
	// Inline function
	whereToOpenLink_code = `{
		var b_bookmarks = true;
		var b_history = true;

		if (!e) return 'current';
		var win = window.opener || window;
		if (win.isTabEmpty(win.gBrowser.mCurrentTab)) return 'current';
		var node = e.originalTarget;
		if (node.matches('.bookmark-item'))
			return b_bookmarks ? 'tab' : 'current';
		while (node) {
			switch (node.id) {
				case 'bookmarksMenuPopup':  // menubar bookmarks
				case 'BMB_bookmarksPopup':  // navibar bookmarks
				case 'bookmarksPanel':      // sidebar bookmarks
					return b_bookmarks ? 'tab' : 'current';
				case 'goPopup':             // menubar history
				case 'PanelUI-history':     // navibar history
				case 'history-panel':       // sidebar history
					return b_history ? 'tab' : 'current';
				case 'placeContent':        // library bookmarks&history
					var collection = window.document.getElementById('searchFilter').getAttribute('collection');
					var tab = collection === "bookmarks" && b_bookmarks || collection === "history" && b_history;
					return tab ? 'tab' : 'current';
			}
			node = node.parentNode;
		}
		return 'current';
    }`;
    if (location == 'chrome://browser/content/browser.xul') {
        /* :::: Open Bookmarks/History in New Tab :::: */
        eval('whereToOpenLink = ' + whereToOpenLink.toString().replace(/return "current";/g, whereToOpenLink_code));
        window.document.getElementById('sidebar').addEventListener('DOMContentLoaded', function(event) {
            const doc = event.originalTarget;
            const win = doc.defaultView.window;
            if (['chrome://browser/content/bookmarks/bookmarksPanel.xul', 'chrome://browser/content/history/history-panel.xul'].includes(win.location)) {
                eval('win.whereToOpenLink=' + win.whereToOpenLink.toString().replace(/return "current";/g, whereToOpenLink_code));
            } else if (win.location == 'chrome://browser/content/readinglist/sidebar.xhtml') {
                /* :::: Open Sidebar ReadingList in New Tab :::: */
                eval('win.RLSidebar.openURL = ' + win.RLSidebar.openURL.toString().replace(/log\.debug\(.*\);/, '').replace(/mainWindow\.openUILink\(url, event\);/, "var where = isTabEmpty(gBrowser.mCurrentTab) ? 'current' : 'tab';$&"));
            }
        });
        /* :::: Open Url in New Tab :::: */
        if (b_urlbar) {
            eval('gURLBar.handleCommand=' + gURLBar.handleCommand.toString().replace(/let where = openUILinkWhere;/, "let where = isTabEmpty(gBrowser.mCurrentTab) ? 'current' : 'tab';"));
        }
        /* :::: Open Search in New Tab :::: */
        if (b_searchbar && BrowserSearch.searchBar) {
            eval('BrowserSearch.searchBar.handleSearchCommand=' + BrowserSearch.searchBar.handleSearchCommand.toString().replace(/this\.doSearch\(textValue, where(, aEngine)?\);|this\.handleSearchCommandWhere\(aEvent, aEngine, where, params\);/, "where = isTabEmpty(gBrowser.mCurrentTab) ? 'current' : 'tab';$&"));
        }
    } else if (location == 'chrome://browser/content/places/places.xul') {
        /* :::: Open Bookmarks/History in New Tab :::: */
        eval('whereToOpenLink = ' + whereToOpenLink.toString().replace(/return "current";/g, whereToOpenLink_code));
    }
})();