// ==UserScript==
// @name           zzzz-MultiRowTab_LiteforFx48.uc.js
// @namespace      http://space.geocities.yahoo.co.jp/gl/alice0775
// @description    多段タブもどき実験版 CSS入れ替えまくりLiteバージョン
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
    /* タイトルバーボタン｢－□×｣ 幅 */
    #titlebar-buttonbox .titlebar-button {
        padding: 7px 17px !important;
    }
    /* ツールバー 並べ替え */
    #nav-bar {/* デフォルトテーマの場合｢－□×｣の色がかぶって見えないので margin-right に変えたほうがいいかも */
        padding-right: 139px !important;
    }
    #PersonalToolbar {
        -moz-box-ordinal-group: 2 !important;
        margin-block-start: -1px !important;
    }
    #TabsToolbar {
        -moz-box-ordinal-group: 3 !important;
    }
    /* 多段タブ時のタイトルバーボタン｢－□×｣の不具合対策 */
    #main-window:not([customizing]):not([pinned]) #titlebar {
        height: var(--tab-min-height) !important;
        margin-bottom: calc(var(--tab-min-height) * -1 + 0px) !important;
    }
    #main-window:not([customizing])[sizemode="maximized"] #titlebar {
        margin-bottom: calc(var(--tab-min-height) * -1 + 8px) !important;
    }
    #titlebar-buttonbox {
        display: block !important;
    }
    /* 多段タブ */
    #tabbrowser-tabs .arrowscrollbox-scrollbox {
        overflow: visible !important;
        display: block !important;
    }
    #tabbrowser-tabs .scrollbox-innerbox {
        display: flex !important;
        flex-wrap: wrap !important;
        overflow-x: hidden !important;
        overflow-y: auto !important;
        max-height: calc(var(--tab-min-height) * 5 /* 段数 */) !important;
    }
    .tabbrowser-tab:not([pinned]) {
        flex-grow: 1 !important;
    }
    .tabbrowser-tab,.tab-background {
        height: var(--tab-min-height) !important;
        display: -webkit-box !important;
        z-index: 1 !important;
    }
    .tabs-newtab-button {
        width: var(--tab-min-height) !important;
        height: calc(var(--tab-min-height) + -1px) !important;
    }
    .tab-stack {
        width: 100% !important;
    }
    /* 多段タブ時指定した段数以上になった時タブバーに出てくるスクロールバーをマウスドラッグで上下出来るようにする */
    #tabbrowser-tabs .scrollbox-innerbox scrollbar {
        -moz-window-dragging: no-drag !important;
    }
    /* -- 非表示 -- */
    #tabbrowser-tabs [anonid^="scrollbutton"],
    hbox.titlebar-placeholder,#alltabs-button {
        display: none !important;
    }
    /* ナビゲーションツールバー 幅 */
    #urlbar,.searchbar-textbox {
        margin: var(--tab-min-height) !important;
        min-height: var(--tab-min-height) !important;
    }
    #urlbar-zoom-button,
    #nav-bar .toolbarbutton-1 {
        padding: 0 !important;
        margin: 0 !important;
    }
    /* urlbar searchbar 幅 */
    #page-action-buttons,
    .search-go-container {
        height: 24px !important;
    }
    .urlbar-textbox-container {
        max-height: 26px !important;
    }
    /* メインツールバー アイコン 幅 */
    #nav-bar [id="back-button"] .toolbarbutton-icon {
        width: 26px !important;
        height: 26px !important;
        padding: 4px !important;
    }
    #nav-bar toolbarbutton.toolbarbutton-1.chromeclass-toolbar-additional:not([id="back-button"]):not([id="forward-button"]) .toolbarbutton-icon,
    #nav-bar toolbarbutton.toolbarbutton-1.chromeclass-toolbar-additional .toolbarbutton-badge-stack,
    #nav-bar toolbaritem toolbarbutton.toolbarbutton-1 .toolbarbutton-badge-stack,
    #urlbar .urlbar-icon,.search-go-button.urlbar-icon {
        width: 24px !important;
        height: 24px !important;
        padding: 4px !important;
    }
    #nav-bar [id="forward-button"] .toolbarbutton-icon,
    #urlbar toolbarbutton.toolbarbutton-1.chromeclass-toolbar-additional .toolbarbutton-icon,
    #urlbar toolbarbutton.toolbarbutton-1.chromeclass-toolbar-additional .toolbarbutton-badge-stack,
    #urlbar toolbaritem toolbarbutton.toolbarbutton-1 .toolbarbutton-badge-stack {
        width: 22px !important;
        height: 22px !important;
        padding: 3px !important;
    }
    #nav-bar toolbarbutton#downloads-button .toolbarbutton-icon,
    #nav-bar toolbarbutton.toolbarbutton-1.webextension-browser-action .toolbarbutton-badge-stack {
        width: 22px !important;
        height: 22px !important;
        padding: 0 !important;
    }
    #PanelUI-button {
        margin-inline-start: 0 !important;
        border-inline-start: none !important;
    }
    /* メインツールバー toolbarbutton-badge */
    #nav-bar .toolbarbutton-badge {
        margin-block-start: 1px !important;
        margin-inline-end: 0px !important;
        min-width: var(--arrowpanel-padding) !important;
        font-size: 8px !important;
    }
    /* ブックマークツールバー toolbarbutton-badge */
    #PersonalToolbar .toolbarbutton-badge {
        margin-block-start: -2px !important;
        margin-inline-end: -3px !important;
        min-width: var(--arrowpanel-padding) !important;
        font-size: 8px !important;
    }
    /* ブックマークツールバー */
    #navigator-toolbox > #PersonalToolbar {
        padding: 1px 2px 1px 2px !important;
        visibility: visible !important;
    }
    #PersonalToolbar toolbarbutton {
        padding: 1px 3px 1px 3px !important;
        margin: 0 !important;
    }
    #PlacesToolbarItems toolbarbutton.bookmark-item {
        max-width: calc(var(--tab-min-width)*2) !important;
    }
    #PersonalToolbar #personal-bookmarks {
        height: calc(var(--arrowpanel-padding)*2) !important;
    }
    /* 000-addToolbarInsideLocationBar.uc.js アイコン */
    #ucjs-Locationbar-toolbar .toolbarbutton-1 .toolbarbutton-icon {
        width: 22px !important;
        height: 22px !important;
        padding: 3px !important;
    }
    #ucjs-Locationbar-toolbar toolbarbutton#downloads-button .toolbarbutton-icon,
    #ucjs-Locationbar-toolbar .webextension-browser-action .toolbarbutton-badge-stack {
        width: 22px !important;
        height: 22px !important;
        padding: 0 !important;
    }
    #ucjs-Locationbar-toolbar toolbarbutton.toolbarbutton-1:hover,
    #ucjs-Locationbar-toolbar toolbaritem toolbarbutton:hover {
        background-color: hsla(0,0%,80%,.25) !important;
    }
    /* MultiRowTab_LiteforFx */
    .tabbrowser-tab, {
        z-index: 1 !important;
    }
    .tabbrowser-tab:not([selected="true"])[last-visible-tab="true"]::after {
        border-left: 1px none !important;
    }
    .tabbrowser-tab[style="border-left-color: red !important;"] .tab-background {
        border-left: 1px solid red !important;
    }
    .tabbrowser-tab[style="border-right-color: red !important;"] .tab-background {
        border-right: 1px solid red !important;
    }
    .tabbrowser-tab:not([style="border-right-color: red !important;"]):not([selected="true"])[last-visible-tab="true"] .tab-background {
        border-right: 1px solid rgba(249, 249, 250, 0.3) !important;
    }`;
    var sss = Cc['@mozilla.org/content/style-sheet-service;1'].getService(Ci.nsIStyleSheetService);
    var uri = makeURI('data:text/css;charset=UTF=8,' + encodeURIComponent(css));
    sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
    gBrowser.tabContainer._getDropEffectForTabDrag = function(event){return "";}; // multirow fix: to make the default "dragover" handler does nothing
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
    gBrowser.tabContainer.addEventListener("drop",function(event){this.onDrop(event);},true);
    gBrowser.tabContainer.addEventListener("dragleave",function(event){this.clearDropIndicator(event);},true);
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
    gBrowser.tabContainer.addEventListener("dragover", gBrowser.tabContainer._onDragOver, true);
    gBrowser.tabContainer._getDropIndex = function(event, isLink) {
        var tabs = this.childNodes;
        var tab = this._getDragTargetTab(event, isLink);
        if (window.getComputedStyle(this).direction == "ltr") {
            for (let i = tab ? tab._tPos : 0; i < tabs.length; i++) {
                let boxObject = tabs[i].boxObject;
                if (event.screenX < boxObject.screenX + boxObject.width / 2
                 && event.screenY < boxObject.screenY + boxObject.height) // multirow fix
                   return i;
            }
        } else {
            for (let i = tab ? tab._tPos : 0; i < tabs.length; i++) {
                let boxObject = tabs[i].boxObject;
                if (event.screenX > boxObject.screenX + boxObject.width / 2
                 && event.screenY < boxObject.screenY + boxObject.height) // multirow fix
                    return i;
            }
        }
        return tabs.length;
    };
    gBrowser.tabContainer.onDrop = function(event) {
        var newIndex;
        this.clearDropIndicator();
        var dt = event.dataTransfer;
        var dropEffect = dt.dropEffect;
        var draggedTab;
        if (dt.mozTypesAt(0)[0] == TAB_DROP_TYPE) {
            draggedTab = dt.mozGetDataAt(TAB_DROP_TYPE, 0);
            if (!draggedTab)
                return;
        }
        if (draggedTab && dropEffect == "copy") {
        } else if (draggedTab && draggedTab.parentNode == this) {
            newIndex = this._getDropIndex(event, false);
            if (newIndex > draggedTab._tPos)
                newIndex--;
            gBrowser.moveTabTo(draggedTab, newIndex);
        }
        if (draggedTab) {
          delete draggedTab._dragData;
        }
    };
}