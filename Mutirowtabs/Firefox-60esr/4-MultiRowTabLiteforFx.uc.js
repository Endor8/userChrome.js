// ==UserScript==
// @name           zzzz-MultiRowTab_LiteforFx48.uc.js
// @namespace      http://space.geocities.yahoo.co.jp/gl/alice0775
// @description    Experimentelle CSS Version für Mehrzeilige Tableiste
// @include        main
// @compatibility  Firefox 60
// @author         Alice0775
// @version        2016/08/05 00:00 Firefox 48
// @version        2016/05/01 00:01 hide favicon if busy
// @version        2016/03/09 00:01 Bug 1222490 - Actually remove panorama for Fx45+
// @version        2016/02/09 00:01 workaround css for lwt
// @version        2016/02/09 00:00
// ==/UserScript==
"user strict";
MultiRowTabLiteforFx();
function MultiRowTabLiteforFx() {
    var css =`
    /* Titelleistenschaltflächen "- □ ×" Anpassung der Breite */
    #titlebar-buttonbox .titlebar-button {
        padding: 7px 17px !important;
    }
    /* Sortierung der Symbolleisten - Reihenfolge */
    #main-window:not([inFullscreen="true"]) #nav-bar {
        padding-right: 139px !important;
    }
    #PersonalToolbar {
        -moz-box-ordinal-group: 2 !important;
        margin-block-start: -1px !important;
    }
    #TabsToolbar {
        -moz-box-ordinal-group: 3 !important;
    }
    /* Fehlerbehebung für die Titelleistenschaltflächen "- □ ×" bei mehreren geöffneten Tabs */
    #main-window:not([lwthemetextcolor="dark"]):not([lwthemetextcolor="bright"]) #titlebar-buttonbox .titlebar-button {
        color: rgb(24, 25, 26) !important;
    }
    #main-window:not([lwthemetextcolor="dark"]):not([lwthemetextcolor="bright"]) #titlebar-buttonbox .titlebar-button:not([id="titlebar-close"]):hover {
        background-color: var(--lwt-toolbarbutton-hover-background, hsla(0,0%,70%,.4)) !important;
    }
    #main-window #titlebar {
        height: var(--tab-min-height) !important;
        margin-bottom: calc(var(--tab-min-height) * -1 + 0px) !important;
    }
    #main-window[sizemode="maximized"] #titlebar {
        margin-bottom: calc(var(--tab-min-height) * -1 + 8px) !important;
    }
    #main-window[uidensity=compact] #titlebar {
        margin-bottom: calc(var(--tab-min-height) * -1 + -2px) !important;
    }
    #main-window[uidensity=compact][sizemode="maximized"] #titlebar {
        margin-bottom: calc(var(--tab-min-height) * -1 + 6px) !important;
    }
    #titlebar-buttonbox {
        height: 28px !important;
    }
    /* Mehrzeilige Tableiste */
    tabs>arrowscrollbox,tabs>arrowscrollbox>scrollbox{display:block;}
    tabs scrollbox>box {
        display:flex;flex-wrap:wrap;
        max-height: calc(var(--tab-min-height) * 5); /* Anzahl der Tabzeilen */
        overflow-x:hidden;overflow-y:auto;
    }
    /* Bei Überschreitung der angegebenen Zeilenanzahl, mit der Maus, über die dann eingeblendetet Scrolleiste zu Zeile wechseln */
    #main-window[tabsintitlebar] tabs box>scrollbar{-moz-window-dragging:no-drag;} 
    tabs tab[fadein]:not([pinned]){flex-grow:1;}
    tabs tab,.tab-background {
        height: var(--tab-min-height);
        overflow: hidden;
        z-index: 1 !important;
    }
    tab>.tab-stack{width:100%;}
    /* -- Ausblenden -- */
    hbox.titlebar-placeholder,#alltabs-button,tabs [anonid^="scrollbutton"],tabs spacer{display:none;}
    /* Breite der Navigationssymbolleiste */
    #urlbar,.searchbar-textbox {
        margin: 0 !important;
        min-height: 26px !important;
    }
    #urlbar-zoom-button,
    #nav-bar toolbarbutton,#nav-bar toolbaritem {
        padding: 0 !important;
        margin: 0 !important;
    }
    /* Breite der Adressleiste und Suchleiste */
    #page-action-buttons,
    .search-go-container,
    .urlbar-history-dropmarker {
        height: 26px !important;
    }
    .urlbar-textbox-container {
        max-height: 26px !important;
    }
    /* Hauptsymbolleisten-Symbolbreite */
    #nav-bar [id="back-button"] .toolbarbutton-icon {
        width: 28px !important;
        height: 28px !important;
        padding: 4px !important;
    }
    #nav-bar [id="forward-button"] .toolbarbutton-icon {
        width: 26px !important;
        height: 26px !important;
        padding: 4px !important;
    }
    #PanelUI-button {
        margin-inline-start: 0px !important;
        border-inline-start: none !important;
    }
    /* Hauptsymbolleiste toolbarbutton-badge */
    #nav-bar .toolbarbutton-badge {
        margin-block-start: 1px !important;
        margin-inline-end: 0px !important;
        min-width: var(--arrowpanel-padding) !important;
        font-size: 8px !important;
    }
    /* Lesezeichen-Symbolleiste toolbarbutton-badge */
    #PersonalToolbar .toolbarbutton-badge {
        margin-block-start: -2px !important;
        margin-inline-end: -3px !important;
        min-width: var(--arrowpanel-padding) !important;
        font-size: 8px !important;
    }
    /* Lesezeichen-Symbolleiste */
    #PersonalToolbar {
        padding: 0px 2px 0px 2px !important;
        visibility: visible !important;
    }
    #PersonalToolbar > #personal-bookmarks {
        height: 20px !important;
    }
    #PersonalToolbar #PlacesToolbarItems {
        max-height: 20px !important;
    }
    #PersonalToolbar #PlacesToolbarItems toolbarbutton.bookmark-item {
        max-height: 20px !important;
        max-width: 160px !important;
        padding: 0px 2px 0px 2px !important;
        margin: 0 !important;
    }
    #PersonalToolbar toolbarbutton.chromeclass-toolbar-additional {
        max-width: 24px !important;
        max-height: 24px !important;
        padding: 0px 3px 0px 3px !important;
        margin: 0 !important;
    }
    /* 000-addToolbarInsideLocationBar.uc.js Symbol */
    #ucjs-Locationbar-toolbar .toolbarbutton-1 .toolbarbutton-icon {
        width: 24px !important;
        height: 24px !important;
        padding: 4px !important;
    }
    #ucjs-Locationbar-toolbar toolbarbutton#downloads-button .toolbarbutton-icon,
    #ucjs-Locationbar-toolbar .webextension-browser-action .toolbarbutton-badge-stack {
        width: 24px !important;
        height: 24px !important;
        padding: 0 !important;
    }
    #ucjs-Locationbar-toolbar toolbarbutton:hover {
        background-color: hsla(0,0%,70%,.3) !important;
    } `;
    var sss = Cc['@mozilla.org/content/style-sheet-service;1'].getService(Ci.nsIStyleSheetService);
    var uri = makeURI('data:text/css;charset=UTF=8,' + encodeURIComponent(css));
    sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
    var style = ' \
    tabs tab:not(stack) { \
        border-left: solid 1px hsla(0,0%,50%,.5) !important; \
        border-right: solid 1px hsla(0,0%,50%,.5) !important; \
    } \
    tabs tab:after,tabs tab:before{display:none!important;} \
    ';
    var sspi = document.createProcessingInstruction('xml-stylesheet',
    'type="text/css" href="data:text/css,' + encodeURIComponent(style) + '"');
    document.insertBefore(sspi, document.documentElement);
    gBrowser.tabContainer._animateTabMove = function(event){}
    gBrowser.tabContainer._finishAnimateTabMove = function(event){}
    gBrowser.tabContainer.lastVisibleTab = function() {
        var tabs = this.childNodes;
        for (let i = tabs.length - 1; i >= 0; i--){
            if (!tabs[i].hasAttribute("hidden"))
                return i;
        }
        return -1;
    };
    gBrowser.tabContainer.clearDropIndicator = function() {
        var tabs = this.childNodes;
        for (let i = 0, len = tabs.length; i < len; i++){
            let tab_s= tabs[i].style;
            tab_s.removeProperty("border-left-color");
            tab_s.removeProperty("border-right-color");
        }
    };
    gBrowser.tabContainer.addEventListener("dragleave",gBrowser.tabContainer.clearDropIndicator, false);
    gBrowser.tabContainer._onDragOver = function(event) {
        event.preventDefault();
        event.stopPropagation();
        this.clearDropIndicator();
        var newIndex = this._getDropIndex(event);
        if (newIndex == null)
            return;
        if (newIndex < this.childNodes.length) {
            this.childNodes[newIndex].style.setProperty("border-left-color","red","important");
        } else {
            newIndex = gBrowser.tabContainer.lastVisibleTab();
            if (newIndex >= 0)
                this.childNodes[newIndex].style.setProperty("border-right-color","red","important");
        }
    };
    gBrowser.tabContainer.addEventListener("dragover", gBrowser.tabContainer._onDragOver, false);
    gBrowser.tabContainer._getDropIndex = function(event, isLink) {
        var tabs = this.children;
        var tab = this._getDragTargetTab(event, isLink);
        if (window.getComputedStyle(this).direction == "ltr") {
            for (let i = tab ? tab._tPos : 0; i < tabs.length; i++)
                if (event.screenX < tabs[i].boxObject.screenX + tabs[i].boxObject.width / 2
                 && event.screenY < tabs[i].boxObject.screenY + tabs[i].boxObject.height) // multirow fix
                
                    return i;
        } else {
            for (let i = tab ? tab._tPos : 0; i < tabs.length; i++)
                if (event.screenX > tabs[i].boxObject.screenX + tabs[i].boxObject.width / 2
                 && event.screenY < tabs[i].boxObject.screenY + tabs[i].boxObject.height) // multirow fix
                    return i;
        }
        return tabs.length;
    };
    gBrowser.tabContainer.onDrop = function(event) {
        var newIndex;
        this.clearDropIndicator();
        var dt = event.dataTransfer;
        var draggedTab;
        if (dt.mozTypesAt(0)[0] == TAB_DROP_TYPE) {
            draggedTab = dt.mozGetDataAt(TAB_DROP_TYPE, 0);
            if (!draggedTab)
                return;
        }
        this._tabDropIndicator.collapsed = true;
        event.stopPropagation();
        if (draggedTab && draggedTab.parentNode == this) {
            newIndex = this._getDropIndex(event, false);
            if (newIndex > draggedTab._tPos)
                newIndex--;
            gBrowser.moveTabTo(draggedTab, newIndex);
        }
    };
    gBrowser.tabContainer.addEventListener("drop",gBrowser.tabContainer.onDrop, false);
}