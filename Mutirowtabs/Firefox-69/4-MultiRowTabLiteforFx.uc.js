// ==UserScript==
// @name           zzzz-MultiRowTab_LiteforFx48.uc.js
// @namespace      http://space.geocities.yahoo.co.jp/gl/alice0775
// @description    Experimentelle CSS Version für Mehrzeilige Tableiste
// @include        main
// @compatibility  Firefox 69
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
    /* Symbolleisten und Menüleiste von der Titelleiste in die Navigator-Toolbox verschieben */
    document.getElementById("navigator-toolbox").appendChild(document.getElementById("toolbar-menubar"));
    var css =` @-moz-document url-prefix("chrome://browser/content/browser.xhtml") {
    /* Symbolleiste Sortieren */
    #toolbar-menubar { -moz-box-ordinal-group: 1 !important; }
    #nav-bar { -moz-box-ordinal-group: 2 !important; }
    #PersonalToolbar { -moz-box-ordinal-group: 3 !important; }
    #titlebar { -moz-box-ordinal-group: 4 !important; }
    /* Windows 10 und Firefox Standardtheme, Fensterausenlinie in weiß. 
       Anpassung für Titelleistenschaltflächen wenn sie in den Hintergrund verschoben sind */
    #main-window:not([lwtheme="true"]) #window-controls toolbarbutton,
    #main-window:not([lwtheme="true"]) .titlebar-buttonbox .titlebar-button {
        color: rgb(24, 25, 26) !important; }
    #main-window:not([lwtheme="true"]) #window-controls toolbarbutton:not([id="close-button"]):hover,
    #main-window:not([lwtheme="true"]) .titlebar-buttonbox .titlebar-button:not([class="titlebar-button titlebar-close"]):hover {
        background-color: var(--lwt-toolbarbutton-hover-background, hsla(0,0%,70%,.4)) !important; }
    /* Tableiste unter Adressleiste verschieben */
    #nav-bar { z-index: 2 !important; }
    [tabsintitlebar="true"][sizemode="maximized"] #navigator-toolbox { padding-top: 8px !important; }
    [tabsintitlebar="true"][sizemode="maximized"] #titlebar { -moz-appearance: none !important; }
    [tabsintitlebar="true"] #toolbar-menubar { height: 32px; }
    /* Anpassung für Titelleistenschaltflächen */
    #navigator-toolbox:not([style^="margin-top:"])[style=""] #window-controls,
    [tabsintitlebar="true"] .titlebar-buttonbox-container { position: fixed; z-index: 3 !important; right:0; }
    [tabsintitlebar="true"][sizemode="normal"] .titlebar-buttonbox-container { top: 1px; }
    [tabsintitlebar="true"][sizemode="maximized"] .titlebar-buttonbox-container { top: 8px; }
    #navigator-toolbox:not([style^="margin-top:"])[style=""] #window-controls { top: 0; }
    /* auf der rechten Seite Platz für die Schaltflächen der Titelleiste einfügen, damit die    
	   Schaltflächen der Titelleiste und der Navigationsleiste nicht verdeckt werden */
    [tabsintitlebar="true"]:not([sizemode="fullscreen"]) #nav-bar { padding-right: 139px !important; }
    [sizemode="fullscreen"] #nav-bar { padding-right: 109px !important; }
    /* Mehrzeilige Tableiste */
    tabs>arrowscrollbox{display:block;}
    tabs arrowscrollbox>scrollbox {
        display:flex;display:-webkit-box;flex-wrap:wrap;
        max-height: calc(var(--tab-min-height) * 5); /* Anzahl der Tabzeilen */
        overflow-x:hidden;overflow-y:auto; }
    [tabsintitlebar="true"] tabs scrollbar{-moz-window-dragging:no-drag;} 
	/* Bei Überschreitung der angegebenen Zeilenanzahl, mit der Maus,    
	   über die dann eingeblendetet Scrolleiste zu Zeile wechseln */
    tabs tab[fadein]:not([pinned]){flex-grow:1;}
    tabs tab,.tab-background {
        height: var(--tab-min-height);
        overflow: hidden;
        z-index: 1 !important; }
    tab>.tab-stack{width:100%;}
    /*Drag-Bereich auf der linken und rechten Seite der
       Tab-Leiste auslenden - verstecken
       Links und rechts → hbox.titlebar-spacer 
       links → hbox.titlebar-spacer[type="pre-tabs"] 
       rechts → hbox.titlebar-spacer[type="post-tabs"] */
    hbox.titlebar-spacer
    /* Ausblenden - Verstecken */
    ,#alltabs-button,tabs [class^="scrollbutton"],tabs spacer,#toolbar-menubar .titlebar-buttonbox { display: none; }
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
    gBrowser.tabContainer._finishAnimateTabMove = function(){}
    gBrowser.tabContainer.lastVisibleTab = function() {
        var tabs = this.allTabs;
        for (let i = tabs.length - 1; i >= 0; i--){
            if (!tabs[i].hasAttribute("hidden"))
                return i;
        }
        return -1;
    }
    gBrowser.tabContainer.clearDropIndicator = function() {
        var tabs = this.allTabs;
        for (let i = 0, len = tabs.length; i < len; i++){
            let tab_s= tabs[i].style;
            tab_s.removeProperty("border-left-color");
            tab_s.removeProperty("border-right-color");
        }
    }
    gBrowser.tabContainer.addEventListener("dragleave",gBrowser.tabContainer.clearDropIndicator, false);
    gBrowser.tabContainer._onDragOver = function(event) {
        event.preventDefault();
        event.stopPropagation();
        this.clearDropIndicator();
        var newIndex = this._getDropIndex(event);
        if (newIndex == null)
            return;
        let children = this.allTabs;
        if (newIndex < children.length) {
            children[newIndex].style.setProperty("border-left-color","red","important");
        } else {
            newIndex = gBrowser.tabContainer.lastVisibleTab();
            if (newIndex >= 0)
                children[newIndex].style.setProperty("border-right-color","red","important");
        }
    }
    gBrowser.tabContainer.addEventListener("dragover", gBrowser.tabContainer._onDragOver, false);
    gBrowser.tabContainer.onDrop = function(event) {
        this.clearDropIndicator();
        var dt = event.dataTransfer;
        var draggedTab;
        if (dt.mozTypesAt(0)[0] == TAB_DROP_TYPE) {
            draggedTab = dt.mozGetDataAt(TAB_DROP_TYPE, 0);
            if (!draggedTab) {
                return;
            }
        }
        this._tabDropIndicator.hidden = true
        event.stopPropagation();
        if (draggedTab && draggedTab.container == this) {
            let newIndex = this._getDropIndex(event, false);
            if (newIndex > draggedTab._tPos)
                newIndex--;
            gBrowser.moveTabTo(draggedTab, newIndex);
        }
    }
    gBrowser.tabContainer.addEventListener("drop",gBrowser.tabContainer.onDrop, false);
    gBrowser.tabContainer._getDragTargetTab = function(event, isLink) {
        let tab = event.target;
        while (tab && tab.localName != "tab") {
            tab = tab.parentNode;
        }
        if (tab && isLink) {
            let { width } = tab.getBoundingClientRect();
            if (
                event.screenX < tab.screenX + width * 0.25 ||
                event.screenX > tab.screenX + width * 0.75
            ) {
                return null;
            }
        }
        return tab;
    }
    gBrowser.tabContainer._getDropIndex = function(event, isLink) {
        var tabs = this.allTabs;
        var tab = this._getDragTargetTab(event, isLink);
        if (!RTL_UI) {
            for (let i = tab ? tab._tPos : 0; i < tabs.length; i++) {
                if (
                    event.screenY <
                    tabs[i].screenY + tabs[i].getBoundingClientRect().height
                ) {
                    if (
                        event.screenX <
                        tabs[i].screenX + tabs[i].getBoundingClientRect().width / 2
                    ) {
                        return i;
                    }
                    if (
                        event.screenX >
                        tabs[i].screenX + tabs[i].getBoundingClientRect().width / 2 &&
                        event.screenX <
                        tabs[i].screenX + tabs[i].getBoundingClientRect().width
                    ) {
                        return i + 1;
                    }
                }
            }
        } else {
            for (let i = tab ? tab._tPos : 0; i < tabs.length; i++) {
                if (
                    event.screenY <
                    tabs[i].screenY + tabs[i].getBoundingClientRect().height
                ) {
                    if (
                        event.screenX <
                        tabs[i].screenX + tabs[i].getBoundingClientRect().width &&
                        event.screenX >
                        tabs[i].screenX + tabs[i].getBoundingClientRect().width / 2
                    ) {
                        return i;
                    }
                    if (
                        event.screenX <
                        tabs[i].screenX + tabs[i].getBoundingClientRect().width / 2
                    ) {
                        return i + 1;
                    }
                }
            }
        }
        return tabs.length;
    }
}
