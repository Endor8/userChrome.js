// ==UserScript==
// @name           middle-click "Undo Close Tab"
// @description    Kürzlich geschlossenen Tab mit Mittelklick wieder öffnen
// @version        1.1
// @include        main
// @compatibility  Firefox ESR31.3, 34.0.5, 56.*
// @author         oflow
// @namespace      https://oflow.me/archives/265
// @note           Firefox 31.3, 34.0.5 neuere nicht getestet
// @note           remove arguments.callee
// @note           mTabContainer -> tabContainer
// ==/UserScript==

(function() {
    var ucjsUndoCloseTab = function(e) {
        // Nur mit Mittelkick
        if (e.button != 1) {
            return;
        }
        // Klick auf Tab-Leiste und die Neuer Tab Schaltflächen
        if (e.target.localName != 'tabs' && e.target.localName != 'toolbarbutton') {
            return;
        }
        undoCloseTab(0);
        e.preventDefault();
        e.stopPropagation();
    }
    // Schaltfläche Neuer Tab
    document.getElementById('new-tab-button').onclick = ucjsUndoCloseTab;
    // Tab-Leiste
    gBrowser.tabContainer.addEventListener('click', ucjsUndoCloseTab, true);
    window.addEventListener('unload', function uninit() {
        gBrowser.tabContainer.removeEventListener('click', ucjsUndoCloseTab, true);
        window.removeEventListener('unload', uninit, false);
    }, false);
})();
