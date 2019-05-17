// ==UserScript==
// @name           zzzz-MultiRowTab_LiteforFx48.uc.js
// @namespace      http://space.geocities.yahoo.co.jp/gl/alice0775
// @description    Experimentelle CSS Version für Mehrzeilige Tableiste
// @include        main
// @compatibility  Firefox 66
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
    /* Tableiste unter Adressleiste verschieben */
    #titlebar { -moz-box-ordinal-group: 2; -moz-appearance: none !important; }
    /* Menüleiste nach oben verschieben */
    #toolbar-menubar { position: fixed; display: inline-flex; flex-wrap: nowrap; left:0; }
    [sizemode="maximized"]:not([tabsintitlebar="true"]) #toolbar-menubar,
    [sizemode="normal"] #toolbar-menubar { top: 1px; }
    [sizemode="maximized"] #toolbar-menubar { top: 8px; }
    /*  Titelleisten-Schaltfläche nach oben verschieben */
    #navigator-toolbox:not([style^="margin-top:"])[style=""] #window-controls,
    [tabsintitlebar="true"] .titlebar-buttonbox-container { position: fixed; right:0; }
    [tabsintitlebar="true"][sizemode="normal"] .titlebar-buttonbox-container { top: 1px; }
    [tabsintitlebar="true"][sizemode="maximized"] .titlebar-buttonbox-container { top: 8px; }
    #navigator-toolbox:not([style^="margin-top:"])[style=""] #window-controls { top: 0; }
    /* Menüleiste über der Symbolleiste Platz zuweisen */
    [sizemode="maximized"]:not([tabsintitlebar="true"]) #navigator-toolbox,
    [sizemode="normal"] #navigator-toolbox { padding-top: 28px !important; }
    [sizemode="maximized"] #navigator-toolbox { padding-top: 36px !important; }
    /*  Anderen leeren Bereich als die Menü- oder Titelleistenschaltflächen als Ziehbereich angeben */
    [tabsintitlebar="true"] #navigator-toolbox { -moz-window-dragging:drag; }
    /* Auf der rechten Seite Platz für die Schaltflächen der Titelleiste zuweißen, damit die 
	Schaltflächen der Titelleiste und der Naigationssymbolleiste nicht verdeckt werden */
    [sizemode="fullscreen"] #nav-bar { padding-right: 109px !important; }
    /* Mehrzeilige Tableiste */
    tabs>arrowscrollbox{display:block;}
    tabs arrowscrollbox>scrollbox{display:flex;flex-wrap:wrap;}
    tabs tab[fadein]:not([pinned]){flex-grow:1;}
    tabs tab,.tab-background {
        height: var(--tab-min-height);
        z-index: 1 !important;
    }
    tab>.tab-stack{width:100%;}
    [sizemode="fullscreen"] #TabsToolbar>#window-controls,
    .titlebar-buttonbox-container>.titlebar-buttonbox{display:block;}
    /* Drag-Bereich auf der linken und rechten Seite der Tab-Leiste auslenden - verstecken,
	   bei Bedarf Code aktivieren,:
        Links und rechts → hbox.titlebar-spacer 
		links → hbox.titlebar-spacer [type = "pre-tabs"] 
		rechts → hbox.titlebar-spacer [type = "post-tabs"] */
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