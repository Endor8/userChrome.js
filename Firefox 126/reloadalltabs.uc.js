// ==UserScript==
// @name            ReloadAllTabs.uc.js
// @description     Fügt dem Tabkontextmenü den Eintrag „Alle Tabs neuladen“ hinzu.
// @license         MIT License
// @compatibility   Firefox 57+
// @version         20240508
// @charset         UTF-8
// @include         chrome://browser/content/browser.xul
// @include         chrome://browser/content/browser.xhtml
// @homepageURL     https://github.com/benzBrake/FirefoxCustomize/tree/master/userChromeJS
// @note            fix for fx 126
// ==/UserScript==
location.href.startsWith('chrome://browser/content/browser.x') && (() => {
    document.getElementById('tabContextMenu').addEventListener('popupshowing', function () {
        const reloadTab = document.getElementById('context_reloadTab');
        if (!reloadTab) return;
        const menuitem = document.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'menuitem');
        menuitem.setAttribute('accesskey', 'A');
        menuitem.setAttribute('label', reloadTab.getAttribute('label')
            .startsWith('Reload') ? 'Reload all Tabs' : 'Alle Tabs neuladen'
        );
        menuitem.addEventListener('command', () => {
            gBrowser.visibleTabs.forEach(tab => {
                try {
                    gBrowser.getBrowserForTab(tab).reload();
                } catch (e) { }
            });
        });
        reloadTab.after(menuitem);
    }, { once: true })
})();
