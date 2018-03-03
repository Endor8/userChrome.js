// ==UserScript==
// @name           zzzz-MultiRowTab_LiteforFx48.uc.js
// @namespace      http://space.geocities.yahoo.co.jp/gl/alice0775
// @description    Mehrzeilige Tableiste, Experimentelle CSS Version
// @include        main
// @compatibility  Firefox 48
// @author         Alice0775
// @version        2016/08/05 00:00 Firefox 48
// @version        2016/05/01 00:01 hide favicon if busy
// @version        2016/03/09 00:01 Bug 1222490 - Actually remove panorama for Fx45+
// @version        2016/02/09 00:01 workaround css for lwt
// @version        2016/02/09 00:00
// ==/UserScript==
    zzzz_MultiRowTabLite();
function zzzz_MultiRowTabLite() {
    var style=' \
    @namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul); \
    #TabsToolbar .tabbrowser-tab { \
        border-left: solid 1px rgba(0,0,0,.0) !important; \
        border-right: solid 1px rgba(0,0,0,.0) !important; \
    } \ ';
    var sspi = document.createProcessingInstruction(
        'xml-stylesheet',
        'type="text/css" href="data:text/css,' + encodeURIComponent(style) + '"');
    document.insertBefore(sspi, document.documentElement);
    gBrowser.tabContainer._animateTabMove = function(event){};
    gBrowser.tabContainer.lastVisibleTab = function() {
        var tabs = this.childNodes;
        for (let i = tabs.length - 1; i >= 0; i--) {
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
    gBrowser.tabContainer.addEventListener("drop", function(event) {
        this.onDrop(event);
    }.bind(gBrowser.tabContainer), true);
    gBrowser.tabContainer._onDragOver = function(event) {
        this.MultiRowTabonDragOver(event);
        var effects = this._getDropEffectForTabDrag(event);
        this.clearDropIndicator();
        var newIndex = this._getDropIndex(event);
        if (newIndex == null) {
            return;
        }
        if (newIndex < this.childNodes.length) {
            this.childNodes[newIndex].style.setProperty("border-left-color","red","important");
        } else {
            newIndex = gBrowser.tabContainer.lastVisibleTab();
            if (newIndex >= 0)
                this.childNodes[newIndex].style.setProperty("border-right-color","red","important");
        }
    };
    gBrowser.tabContainer.addEventListener("dragover", gBrowser.tabContainer._onDragOver, true);
    gBrowser.tabContainer.onDrop = function(event) {
        var newIndex;
        console.log("onDrop");
        this.clearDropIndicator();
        var dt = event.dataTransfer;
        var dropEffect = dt.dropEffect;
        var draggedTab;
        if (dt.mozTypesAt(0)[0] == TAB_DROP_TYPE) {
            draggedTab = dt.mozGetDataAt(TAB_DROP_TYPE, 0);
            if (!draggedTab)
                return;
        }
        if (draggedTab && dropEffect == "copy") {}
        else if (draggedTab && draggedTab.parentNode == this) {
            newIndex = this._getDropIndex(event, false);
            if (newIndex > draggedTab._tPos)
                newIndex--;
            this.tabbrowser.moveTabTo(draggedTab, newIndex);
        }
    };
    gBrowser.tabContainer.MultiRowTabonDragOver = function(event) {};
}
