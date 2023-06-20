// ==UserScript==
// @name           newTabButtonUndoTabList.uc.js
// @description    Beim Rechtsklick auf die "Neuer Tab" - Schaltfläche in der Tableiste,
// @description    erscheint mit diesem Skript eine Liste der kürzlich geschlossenen Tabs 
// @description    für deren Wiederherstellung. Dazu gibt es einen zusätzlichen Eintrag, 
// @description    um die Chronik in der Seitenleiste - Sidebar zu öffnen.
// @Versionsinfo   Aktualisierung für Firefox 115+. Nicht kompatibel mit Firefox 114 und älter!
// @Info           Anpassung Firefox 115-Bug 1819675 ⇒ https://bugzilla.mozilla.org/show_bug.cgi?id=1819675
// @include        main
// ==/UserScript==
(function () {

    if (!window.gBrowser){
        return;
    }
    
    gBrowser.tabContainer.addEventListener('click', function (e) {
        if (e.originalTarget.id != 'tabs-newtab-button') return;
        switch (e.button) {
            case 1:
                undoCloseTab(0);
                break;
            case 2:
                UCT.makePopup(e);
                event.preventDefault();
                break;
        }
    }, false);

})();

var UCT = {
    init: function () {
        var mp = document.createXULElement("menupopup");
        mp.id = "undo-close-tab-list";
        mp.setAttribute("onpopupshowing", "UCT.onpopupshowing(event);");
        mp.setAttribute("placespopup", true);
        mp.setAttribute("tooltip", "bhTooltip");
        mp.setAttribute("popupsinherittooltip", true);
        document?.getElementById("mainPopupSet")?.appendChild(mp);
    },

    makePopup: function (e) {
        if (SessionStore.getClosedTabCountForWindow(window) != 0) {
            document.getElementById("undo-close-tab-list").openPopupAtScreen(e.screenX +2, e.screenY +2, false);
        }
        else
        {
            console.log("--- Es gibt keinen Tab, der wiederhergestellt werden kann ---");
        }
    },

    onpopupshowing: function (e) {
        var popup = e.target;

        while (popup.hasChildNodes())
            popup.removeChild(popup.firstChild);

        let undoItems = SessionStore.getClosedTabDataForWindow(window);
        undoItems.map(function (item, id) {
            var m = document.createXULElement('menuitem');
            m.setAttribute('label', item.title);
            m.setAttribute('image', item.image );
            m.setAttribute('class', 'menuitem-iconic bookmark-item');
            m.setAttribute('oncommand', 'undoCloseTab(' + id + ')');
            popup.appendChild(m);
        });

        popup.appendChild(document.createXULElement("menuseparator"));
        m = document.createXULElement("menuitem");
        m.setAttribute("label", "Chronik in der Sidebar öffnen");
        m.setAttribute("image", "chrome://browser/skin/history.svg");
        m.setAttribute("class", "menuitem-iconic");
        m.setAttribute("oncommand", "SidebarUI.toggle('viewHistorySidebar');");
        popup.appendChild(m);
    },

};

setTimeout(function() {
      UCT.init();
  },250);
