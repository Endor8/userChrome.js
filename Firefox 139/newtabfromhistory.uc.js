// ==UserScript==
// @name           newtabfromhistory.uc.js
// @namespace      https://www.camp-firefox.de/forum/viewtopic.php?p=1090093#p1090093
// @description    Links aus Chronik in neuem Tab öffnen
// @author         aborix
// @compatibility  139 -
// Zeile 44 + 45 angepasst wegen einer Fehlermeldung in der Konsole
// @version        0.0.4a = 18.06.25
// ==/UserScript==

(function() {

  if (location != 'chrome://browser/content/browser.xhtml')
    return;

  PlacesUIUtils.openNodeWithEvent = function PUIU_openNodeWithEvent(aNode, aEvent) {
    let window = aEvent.target.ownerGlobal;
    let browserWindow = (window && window.document.documentElement.getAttribute('windowtype') == 'navigator:browser') ? window : BrowserWindowTracker.getTopWindow();
    let where = window.BrowserUtils.whereToOpenLink(aEvent, false, true);
    if (this.loadBookmarksInTabs) {
      if (where == 'current' && !aNode.uri.startsWith('javascript:')) {
        where = 'tab';
      }
      if (where == 'tab' && browserWindow.gBrowser.selectedTab.isEmpty) {
        where = 'current';
      }
    }
    this._openNodeIn(aNode, where, window);
  }
  
  let onPopupshowing = function() {
    let historyMenu = document.getElementById('history-menu');
    if (!historyMenu._placesView) {
      new HistoryMenu(event);
      historyMenu._placesView._onCommand = function HM__onCommand(aEvent) {
        let placesNode = aEvent.target._placesNode;
        if (placesNode) {
          PlacesUIUtils.openNodeWithEvent(placesNode, aEvent);
        };
      };
    };
  };

     let historyPopup = document.getElementById('historyMenuPopup');
     historyPopup?.addEventListener('popupshowing', onPopupshowing);

})();
