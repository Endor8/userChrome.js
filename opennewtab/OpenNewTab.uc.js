// ==UserScript==
// @name            openNewTab.uc.js
// @namespace       opennewtab@haoutil.com
// @include         main
// @include         chrome://browser/content/browser.xhtml
// @description     Aus Lesezeichen, Chronik, Adressleiste und Suchleiste in neuem Tab öffnen
// @downloadURL     https://raw.githubusercontent.com/Harv/userChromeJS/master/openNewTab.uc.js
// @version         1.5.1
// ==/UserScript==
location == "chrome://browser/content/browser.xhtml" && (function () {
    Components.utils.import("resource://gre/modules/Services.jsm");

    Services.obs.addObserver(function observer(subject, topic, data) {
        if (data != "init-complete") return;
        Services.obs.removeObserver(observer, topic);
        doReplace();
    }, "browser-search-service");

    function generateReplacement(func, regexp, replacementFunc, appendMatch) {
        var replacementStr = replacementFunc.toString().replace(/^.*{|}$/g, '');
        if (appendMatch) {
            replacementStr = replacementStr + '$&';
        }
        var funcStr = func.toString().replace(regexp, replacementStr);
        if (!funcStr.startsWith("function")) {
            funcStr = "function " + funcStr;
        }
        return funcStr;
    }

    function doReplace() {
        eval('BrowserUtils.whereToOpenLink = ' + generateReplacement(BrowserUtils.whereToOpenLink, /(return "current";)(?![\s\S]*\1)/g, function() {
            if (!e) return 'current';
            if (gBrowser.selectedTab.isEmpty) return 'current';
            var node = e.originalTarget;
            while (node) {
                if(node.className && node.className.indexOf('bookmark-item') != -1
                    && node.outerHTML && node.outerHTML.indexOf('scheme="javascript"') != -1) { // javascript bookmarks
                    return 'current';
                }
                if (node.className && node.className.indexOf('sync-state') != -1) { // sidebar syncedtabs
                    return 'tab';
                }
                switch (node.id) {
                    case 'bookmarksMenuPopup':  // menubar bookmarks
                    case 'BMB_bookmarksPopup':  // navibar bookmarks
                    case 'PanelUI-bookmarks':   // navibar bookmarks
                    case 'bookmarksPanel':      // sidebar bookmarks
                    case 'historyMenuPopup':    // menubar history
                    case 'PanelUI-history':     // navibar history
                    case 'history-panel':       // sidebar history
                    case 'placeContent':        // library bookmarks&history
                    case 'PanelUI-remotetabs':  // navibar syncedtabs
                        return 'tab';
                }
                node = node.parentNode;
            }
            return 'current';
        }));

        // // urlbar
        // eval('gURLBar._whereToOpen = ' + generateReplacement(gURLBar._whereToOpen, /(return where;)(?![\s\S]*\1)/g, function() {
        //     where = gBrowser.selectedTab.isEmpty ? 'current' : 'tab';
        // }, true));

        // searchbar
        var searchbar = document.getElementById('searchbar');
        searchbar && eval('searchbar.handleSearchCommandWhere=' + generateReplacement(searchbar.handleSearchCommandWhere, /this\.doSearch\(textValue, aWhere, aEngine, aParams, isOneOff\);/, function() {
            aWhere = gBrowser.selectedTab.isEmpty ? 'current' : 'tab';
        }, true));
    }
})();
