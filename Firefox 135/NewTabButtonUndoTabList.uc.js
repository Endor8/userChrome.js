// ==UserScript==
// @name           newTabButtonUndoTabList.uc.js
// @description    Bei Rechtsklick auf die Neuen Tab Schaltfläche, wird im Kontextmenü
// @description    der Eintrag zum Wiederherstellen des zuletzt geschlossenen Tabs angezeigt.
// @description    Von BrokenHeart - camp-firefox.de wieder lauffähig gemacht
// @adresse        https://www.camp-firefox.de/forum/thema/112673-userchrome-js-scripte-f%C3%BCr-den-fuchs-diskussion/?postID=1223749#post1223749
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
		mp.addEventListener('popupshowing', function(event) {
				UCT.onpopupshowing(event);
			}, true);
		
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
			let strCommand = 'undoCloseTab(' + id + ')';
			m.addEventListener('command', function(event) {
				Function("return " + strCommand)();
			}, true);
            popup.appendChild(m);
        });

        popup.appendChild(document.createXULElement("menuseparator"));
        m = document.createXULElement("menuitem");
        m.setAttribute("label", "Chronik in der Sidebar öffnen");
        m.setAttribute("image", "chrome://browser/skin/history.svg");
        m.setAttribute("class", "menuitem-iconic");
		m.addEventListener('command', function(event) {
			SidebarController.toggle('viewHistorySidebar');
		}, true);
		
        popup.appendChild(m);
    },

};

setTimeout(function() {
      UCT.init();
  },250);