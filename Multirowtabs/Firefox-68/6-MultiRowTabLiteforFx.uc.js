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
    /* Symbolleisten und Menüleiste von der Titelleiste in die Navigator-Toolbox verschieben */
    document.getElementById("navigator-toolbox").appendChild(document.getElementById("toolbar-menubar"));
    var css =` @-moz-document url-prefix("chrome://browser/content/browser.xul") {
    /* Symbolleisten Sortieren */
    #toolbar-menubar { -moz-box-ordinal-group: 1 !important; }
    #nav-bar { -moz-box-ordinal-group: 2 !important; }
    #PersonalToolbar { -moz-box-ordinal-group: 3 !important; }
    #titlebar { -moz-box-ordinal-group: 4 !important; }
    /* Symbolleisten Anpassungen*/
    [tabsintitlebar="true"][sizemode="maximized"] #navigator-toolbox { padding-top: 8px !important; }
    [tabsintitlebar="true"][sizemode="maximized"] #titlebar { -moz-appearance: none !important; }
    [tabsintitlebar="true"] #toolbar-menubar { height: 32px; }
    /* Titelleistenschaltfläche ausblenden und anzeigen, wenn Sie den Mauszeiger über die */
	/* rechte obere Ecke bewegen Bereich beim Überfahren mit derMaus reagieren lassen */
    /* Titelleistenschaltflächen oben rechts verbergen , um Bereich transparent zu machen */
    #navigator-toolbox:not([style^="margin-top:"])[style=""] #TabsToolbar>#window-controls,
    [tabsintitlebar="true"] #TabsToolbar>.titlebar-buttonbox-container { opacity: 0; right: -80px;
        position: fixed; z-index: 2147483647 !important; background-color: hsla(0, 0%, 60%, 0.5); }
    [tabsintitlebar="true"][sizemode="normal"] #TabsToolbar>.titlebar-buttonbox-container { top: -21px; }
    [tabsintitlebar="true"][sizemode="maximized"] #TabsToolbar>.titlebar-buttonbox-container { top: -14px; }
    #navigator-toolbox:not([style^="margin-top:"])[style=""] #TabsToolbar>#window-controls { top: -18px; }
    /* Anpassung für Titelleistenschaltflächen */
    #navigator-toolbox:not([style^="margin-top:"])[style=""] #TabsToolbar>#window-controls:hover,
    [tabsintitlebar="true"] #TabsToolbar>.titlebar-buttonbox-container:hover { opacity: 1; right:0; }
    [tabsintitlebar="true"][sizemode="normal"] #TabsToolbar>.titlebar-buttonbox-container:hover { top: 1px; }
    [tabsintitlebar="true"][sizemode="maximized"] #TabsToolbar>.titlebar-buttonbox-container:hover { top: 8px; }
    #navigator-toolbox:not([style^="margin-top:"])[style=""] #TabsToolbar>#window-controls:hover { top: 0; }
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
        var tabs = this.children;
        for (let i = tabs.length - 1; i >= 0; i--){
            if (!tabs[i].hasAttribute("hidden"))
                return i;
        }
        return -1;
    }
    gBrowser.tabContainer.clearDropIndicator = function() {
        var tabs = this.children;
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
        if (newIndex < this.children.length) {
            this.children[newIndex].style.setProperty("border-left-color","red","important");
        } else {
            newIndex = gBrowser.tabContainer.lastVisibleTab();
            if (newIndex >= 0)
                this.children[newIndex].style.setProperty("border-right-color","red","important");
        }
    }
    gBrowser.tabContainer.addEventListener("dragover", gBrowser.tabContainer._onDragOver, false);
    gBrowser.tabContainer._getDragTargetTab = function(event, isLink) {
        let tab = event.target.localName == "tab" ? event.target : null;
        if (tab && isLink) {
            let {width} = tab.getBoundingClientRect();
            if (event.screenX < tab.screenX + width * .25 ||
                event.screenX > tab.screenX + width * .75)
                return null;
        }
        return tab;
    }
    gBrowser.tabContainer._getDropIndex = function(event, isLink) {
        var tabs = this.children;
        var tab = this._getDragTargetTab(event, isLink);
        if (!RTL_UI) {
            for (let i = tab ? tab._tPos : 0; i < tabs.length; i++) {
                if (event.screenY < tabs[i].screenY + tabs[i].getBoundingClientRect().height) {
                    if (event.screenX < tabs[i].screenX + tabs[i].getBoundingClientRect().width / 2) {
                        return i;
                    }
                    if (event.screenX > tabs[i].screenX + tabs[i].getBoundingClientRect().width / 2 &&
                        event.screenX < tabs[i].screenX + tabs[i].getBoundingClientRect().width) {
                        return i + 1;
                    }
                }
            }
        } else {
            for (let i = tab ? tab._tPos : 0; i < tabs.length; i++) {
                if (event.screenY < tabs[i].screenY + tabs[i].getBoundingClientRect().height) {
                    if (event.screenX < tabs[i].screenX + tabs[i].getBoundingClientRect().width &&
                        event.screenX > tabs[i].screenX + tabs[i].getBoundingClientRect().width / 2) {
                        return i;
                    }
                    if (event.screenX < tabs[i].screenX + tabs[i].getBoundingClientRect().width / 2) {
                        return i + 1;
                    }
                }
            }
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
    }
    gBrowser.tabContainer.addEventListener("drop",gBrowser.tabContainer.onDrop, false);
}
