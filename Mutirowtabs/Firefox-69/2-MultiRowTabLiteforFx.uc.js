// ==UserScript==
// @name           zzzz-MultiRowTab_LiteforFx48.uc.js
// @namespace      http://space.geocities.yahoo.co.jp/gl/alice0775
// @description    Experimentelle CSS Version für Mehrzeilige Tableiste
// @include        main
// @compatibility  Firefox 67
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
    /* Mehrzeilige Tableiste */
    tabs>arrowscrollbox{display:block;}
    tabs arrowscrollbox>scrollbox {
        display:flex;flex-wrap:wrap;
        max-height: calc(var(--tab-min-height) * 5); /* Anzahl der Tabzeilen */
        overflow-x:hidden;overflow-y:auto;
    }
    [tabsintitlebar="true"] tabs scrollbar{-moz-window-dragging:no-drag;} 
	/* Bei Überschreitung der angegebenen Zeilenanzahl, mit der Maus, 
	   über die dann eingeblendetet Scrolleiste zu Zeile wechseln */
    tabs tab[fadein]:not([pinned]){flex-grow:1;}
    tabs tab,.tab-background {
        height: var(--tab-min-height);
        overflow: hidden;
        z-index: 1 !important;
    }
    tab>.tab-stack{width:100%;}
    [sizemode="fullscreen"] #TabsToolbar>#window-controls,
    .titlebar-buttonbox-container>.titlebar-buttonbox{display:block;}
    /* Drag-Bereich auf der linken und rechten Seite der
       Tab-Leiste auslenden - verstecken
       Links und rechts → hbox.titlebar-spacer 
       links → hbox.titlebar-spacer[type="pre-tabs"] 
       rechts → hbox.titlebar-spacer[type="post-tabs"] */
    hbox.titlebar-spacer,
    /* Ausblenden - Verstecken */
    #alltabs-button,tabs [class^="scrollbutton"],tabs spacer,[autohide="true"][inactive="true"] .titlebar-buttonbox { display: none; }
    `;
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
        var tabs = this.children;
        for (let i = tabs.length - 1; i >= 0; i--){
            if (!tabs[i].hasAttribute("hidden"))
                return i;
        }
        return -1;
    };
    gBrowser.tabContainer.clearDropIndicator = function() {
        var tabs = this.children;
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
        if (newIndex < this.children.length) {
            this.children[newIndex].style.setProperty("border-left-color","red","important");
        } else {
            newIndex = gBrowser.tabContainer.lastVisibleTab();
            if (newIndex >= 0)
                this.children[newIndex].style.setProperty("border-right-color","red","important");
        }
    };
    gBrowser.tabContainer.addEventListener("dragover", gBrowser.tabContainer._onDragOver, false);
    gBrowser.tabContainer._getDropIndex = function(event, isLink) {
        var tabs = this.children;
        var tab = this._getDragTargetTab(event, isLink);
        if (!RTL_UI) {
            for (let i = tab ? tab._tPos : 0; i < tabs.length; i++)
                if (event.screenX < tabs[i].screenX + tabs[i].getBoundingClientRect().width / 2
                 && event.screenY < tabs[i].screenY + tabs[i].getBoundingClientRect().height) // multirow fix
                    return i;
        } else {
            for (let i = tab ? tab._tPos : 0; i < tabs.length; i++)
                if (event.screenX > tabs[i].screenX + tabs[i].getBoundingClientRect().width / 2
                 && event.screenY > tabs[i].screenY + tabs[i].getBoundingClientRect().height) // multirow fix
                    return i;
        }
        return tabs.length;
    }
    gBrowser.tabContainer.onDrop = function(event) {
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
            let newIndex = this._getDropIndex(event, false);
            if (newIndex > draggedTab._tPos)
                newIndex--;
            gBrowser.moveTabTo(draggedTab, newIndex);
        }
    };
    gBrowser.tabContainer.addEventListener("drop",gBrowser.tabContainer.onDrop, false);
}
