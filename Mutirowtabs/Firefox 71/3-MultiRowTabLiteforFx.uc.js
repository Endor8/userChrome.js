// ==UserScript==
// @name           zzzz-MultiRowTab_LiteforFx48.uc.js
// @namespace      http://space.geocities.yahoo.co.jp/gl/alice0775
// @description    Experimentelle CSS Version für Mehrzeilige Tableiste
// @include        main
// @compatibility  Firefox 71
// @author         Alice0775
// @version        2016/08/05 00:00 Firefox 48
// @version        2016/05/01 00:01 hide favicon if busy
// @version        2016/03/09 00:01 Bug 1222490 - Actually remove panorama for Fx45+
// @version        2016/02/09 00:01 workaround css for lwt
// @version        2016/02/09 00:00
// ==/UserScript==
"use strict";
MultiRowTabLiteforFx();
function MultiRowTabLiteforFx() {

    /* Symbolleisten und Menüleiste von der Titelleiste in die Navigator-Toolbox verschieben */
    document.getElementById("navigator-toolbox").appendChild(document.getElementById("toolbar-menubar"));

    var css =` @-moz-document url-prefix("chrome://browser/content/browser.xhtml") {

    /* Symbolleiste Sortieren */
    #toolbar-menubar { -moz-box-ordinal-group: 1 !important; } /* Menüleiste */
    #nav-bar { -moz-box-ordinal-group: 2 !important; }         /* Navigationsleiste */
    #PersonalToolbar { -moz-box-ordinal-group: 3 !important; } /* Lesezeichen-Symbolleiste */
    #titlebar { -moz-box-ordinal-group: 4 !important; }        /* Titelleiste */

    /* Anpassung der Symbolleiste */
    [tabsintitlebar="true"][sizemode="maximized"] #navigator-toolbox { padding-top: 8px !important; }
    #titlebar,#tabbrowser-tabs { -moz-appearance: none !important; }

    /* Windows 10 und Firefox Standardtheme, Fensterausenlinie in weiß. 
       Anpassung für Titelleistenschaltflächen wenn sie in den Hintergrund verschoben sind */
    #main-window:not([lwtheme="true"]) #window-controls toolbarbutton,
    #main-window:not([lwtheme="true"]) .titlebar-buttonbox .titlebar-button { color: rgb(24, 25, 26) !important; }
    #main-window:not([lwtheme="true"]) #window-controls toolbarbutton:not([id="close-button"]):hover,
    #main-window:not([lwtheme="true"]) .titlebar-buttonbox .titlebar-button:not(.titlebar-close):hover {
    background-color: var(--lwt-toolbarbutton-hover-background, hsla(0,0%,70%,.4)) !important; }

    /* Anpassung für Titelleistenschaltflächen */
    #navigator-toolbox:not([style^="margin-top:"])[style=""][inFullscreen="true"] #window-controls,
    [tabsintitlebar="true"] .titlebar-buttonbox-container { display: block; position: fixed; right:0; }
    [tabsintitlebar="true"][sizemode="normal"] .titlebar-buttonbox-container { top: 1px; }
    [tabsintitlebar="true"][sizemode="maximized"] .titlebar-buttonbox-container { top: 8px; }
    #navigator-toolbox:not([style^="margin-top:"])[style=""][inFullscreen="true"] #window-controls { top: 0; }

    /* auf der rechten Seite Platz für die Schaltflächen der Titelleiste einfügen, damit die    
	   Schaltflächen der Titelleiste und der Navigationsleiste nicht verdeckt werden */
    [tabsintitlebar="true"]:not([inFullscreen="true"]) #nav-bar { padding-right: 139px !important; }
    #navigator-toolbox[inFullscreen="true"] #nav-bar { padding-right: 109px !important; }

    /* Mehrzeilige Tableiste */
    tabs > arrowscrollbox { display: block; }
    scrollbox[part][orient="horizontal"] {
        display: flex;
        flex-wrap: wrap; }
    tabs tab[fadein]:not([pinned]) { flex-grow: 1; }
    tabs tab,.tab-background {
        height: var(--tab-min-height);
        z-index: 1 !important; }
    tab > .tab-stack { width: 100%; }

    /* Drag-Bereich auf der linken und rechten Seite der
       Tab-Leiste ausblenden - verstecken
       Links und rechts → hbox.titlebar-spacer 
       links → hbox.titlebar-spacer[type="pre-tabs"] 
       rechts → hbox.titlebar-spacer[type="post-tabs"] */
    hbox.titlebar-spacer
    ,
    /* Ausblenden - Verstecken */
    #alltabs-button,tabs tab:not([fadein]),
    #toolbar-menubar .titlebar-buttonbox,
    [class="scrollbutton-up"],
    [class="scrollbutton-up"] + spacer,
    scrollbox[part][orient="horizontal"] + spacer,
    [class="scrollbutton-down"] { display: none; }

    } `;
    var sss = Cc['@mozilla.org/content/style-sheet-service;1'].getService(Ci.nsIStyleSheetService);
    var uri = makeURI('data:text/css;charset=UTF=8,' + encodeURIComponent(css));
    sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);

    var css =`
    tabs tab {
        border-left: solid 1px hsla(0,0%,50%,.5) !important;
        border-right: solid 1px hsla(0,0%,50%,.5) !important;
    }
    tabs tab:after,tabs tab:before { display: none !important; }
    `;
    var sss = Cc['@mozilla.org/content/style-sheet-service;1'].getService(Ci.nsIStyleSheetService);
    var uri = makeURI('data:text/css;charset=UTF=8,' + encodeURIComponent(css));
    sss.loadAndRegisterSheet(uri, sss.AUTHOR_SHEET);

    gBrowser.tabContainer.clearDropIndicator = function() {
        var tabs = this.allTabs;
        for (let i = 0, len = tabs.length; i < len; i++) {
            tabs[i].style.removeProperty("border-left-color");
            tabs[i].style.removeProperty("border-right-color");
        }
    }
    gBrowser.tabContainer.addEventListener("dragleave", function(event) { this.clearDropIndicator(event); }, true);

    gBrowser.tabContainer.on_dragover = function(event) {
        this.clearDropIndicator();
        var effects = this._getDropEffectForTabDrag(event);
        var ind = this._tabDropIndicator;
        if (effects == "" || effects == "none") {
            ind.hidden = true;
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        var arrowScrollbox = this.arrowScrollbox;
        // autoscroll the tab strip if we drag over the scroll
        // buttons, even if we aren't dragging a tab, but then
        // return to avoid drawing the drop indicator
        var pixelsToScroll = 0;
        if (this.getAttribute("overflow") == "true") {
            switch (event.originalTarget) {
                case arrowScrollbox._scrollButtonUp:
                    pixelsToScroll = arrowScrollbox.scrollIncrement * -1;
                    break;
                case arrowScrollbox._scrollButtonDown:
                    pixelsToScroll = arrowScrollbox.scrollIncrement;
                    break;
            }
            if (pixelsToScroll) {
                arrowScrollbox.scrollByPixels(
                    (RTL_UI ? -1 : 1) * pixelsToScroll,
                    true
                );
            }
        }
/*
        let draggedTab = event.dataTransfer.mozGetDataAt(TAB_DROP_TYPE, 0);
        if (
            (effects == "move" || effects == "copy") &&
            this == draggedTab.container
        ) {
            ind.hidden = true;
            if (!this._isGroupTabsAnimationOver()) {
                // Wait for grouping tabs animation to finish
                return;
            }
            this._finishGroupSelectedTabs(draggedTab);
            if (effects == "move") {
                this._animateTabMove(event);
                return;
            }
        }
        this._finishAnimateTabMove();
*/
        if (effects == "link") {
            let tab = this._getDragTargetTab(event, true);
            if (tab) {
                if (!this._dragTime) {
                    this._dragTime = Date.now();
                }
                if (Date.now() >= this._dragTime + this._dragOverDelay) {
                    this.selectedItem = tab;
                }
                ind.hidden = true;
                return;
            }
        }
        var rect = arrowScrollbox.getBoundingClientRect();
        var newMargin;
        if (pixelsToScroll) {
            // if we are scrolling, put the drop indicator at the edge
            // so that it doesn't jump while scrolling
            let scrollRect = arrowScrollbox.scrollClientRect;
            let minMargin = scrollRect.left - rect.left;
            let maxMargin = Math.min(
                minMargin + scrollRect.width,
                scrollRect.right
            );
            if (RTL_UI) {
                [minMargin, maxMargin] = [
                    this.clientWidth - maxMargin,
                    this.clientWidth - minMargin,
                ];
            }
            newMargin = pixelsToScroll > 0 ? maxMargin : minMargin;
        } else {
            let newIndex = this._getDropIndex(event, effects == "link");
            let children = this.allTabs;
            if (newIndex == children.length) {
                let tabRect = children[newIndex - 1].getBoundingClientRect();
                if (RTL_UI) {
                    newMargin = rect.right - tabRect.left;
                } else {
                    newMargin = tabRect.right - rect.left;
                }
                children[newIndex - 1].style.setProperty("border-right-color","red","important");
            } else {
                let tabRect = children[newIndex].getBoundingClientRect();
                if (RTL_UI) {
                    newMargin = rect.right - tabRect.right;
                } else {
                    newMargin = tabRect.left - rect.left;
                }
                children[newIndex].style.setProperty("border-left-color","red","important");
            }
        }
        ind.hidden = false;
        newMargin += ind.clientWidth / 2;
        if (RTL_UI) {
            newMargin *= -1;
        }
        ind.style.transform = "translate(" + Math.round(newMargin) + "px)";
        ind.style.marginInlineStart = -ind.clientWidth + "px";
    }

    gBrowser.tabContainer.on_drop = function(event) {
        this.clearDropIndicator();
        var dt = event.dataTransfer;
        var dropEffect = dt.dropEffect;
        var draggedTab;
        let movingTabs;
        if (dt.mozTypesAt(0)[0] == TAB_DROP_TYPE) {
            // tab copy or move
            draggedTab = dt.mozGetDataAt(TAB_DROP_TYPE, 0);
            // not our drop then
            if (!draggedTab) {
                return;
            }
            movingTabs = draggedTab._dragData.movingTabs;
            draggedTab.container._finishGroupSelectedTabs(draggedTab);
        }
        this._tabDropIndicator.hidden = true;
        event.stopPropagation();
        if (draggedTab && dropEffect == "copy") {
            // copy the dropped tab (wherever it's from)
            let newIndex = this._getDropIndex(event, false);
            let draggedTabCopy;
            for (let tab of movingTabs) {
                let newTab = gBrowser.duplicateTab(tab);
                gBrowser.moveTabTo(newTab, newIndex++);
                if (tab == draggedTab) {
                    draggedTabCopy = newTab;
                }
            }
            if (draggedTab.container != this || event.shiftKey) {
                this.selectedItem = draggedTabCopy;
            }
        } else if (draggedTab && draggedTab.container == this) {
            let oldTranslateX = Math.round(draggedTab._dragData.translateX);
            let tabWidth = Math.round(draggedTab._dragData.tabWidth);
            let translateOffset = oldTranslateX % tabWidth;
            let newTranslateX = oldTranslateX - translateOffset;
            if (oldTranslateX > 0 && translateOffset > tabWidth / 2) {
                newTranslateX += tabWidth;
            } else if (oldTranslateX < 0 && -translateOffset > tabWidth / 2) {
                newTranslateX -= tabWidth;
            }
            let dropIndex = this._getDropIndex(event, false);
            //  "animDropIndex" in draggedTab._dragData &&
            //  draggedTab._dragData.animDropIndex;
            let incrementDropIndex = true;
            if (dropIndex && dropIndex > movingTabs[0]._tPos) {
                dropIndex--;
                incrementDropIndex = false;
            }
            let animate = gBrowser.animationsEnabled;
            if (oldTranslateX && oldTranslateX != newTranslateX && animate) {
                for (let tab of movingTabs) {
                    tab.setAttribute("tabdrop-samewindow", "true");
                    tab.style.transform = "translateX(" + newTranslateX + "px)";
                    let onTransitionEnd = transitionendEvent => {
                        if (
                            transitionendEvent.propertyName != "transform" ||
                            transitionendEvent.originalTarget != tab
                        ) {
                            return;
                        }
                        tab.removeEventListener("transitionend", onTransitionEnd);
                        tab.removeAttribute("tabdrop-samewindow");
                        this._finishAnimateTabMove();
                        if (dropIndex !== false) {
                            gBrowser.moveTabTo(tab, dropIndex);
                            if (incrementDropIndex) {
                                dropIndex++;
                            }
                        }
                        gBrowser.syncThrobberAnimations(tab);
                    };
                    tab.addEventListener("transitionend", onTransitionEnd);
                }
            } else {
                this._finishAnimateTabMove();
                if (dropIndex !== false) {
                    for (let tab of movingTabs) {
                        gBrowser.moveTabTo(tab, dropIndex);
                        if (incrementDropIndex) {
                            dropIndex++;
                        }
                    }
                }
            }
        } else if (draggedTab) {
            let newIndex = this._getDropIndex(event, false);
            let newTabs = [];
            for (let tab of movingTabs) {
                let newTab = gBrowser.adoptTab(tab, newIndex++, tab == draggedTab);
                newTabs.push(newTab);
            }
            // Restore tab selection
            gBrowser.addRangeToMultiSelectedTabs(
                newTabs[0],
                newTabs[newTabs.length - 1]
            );
        } else {
            // Pass true to disallow dropping javascript: or data: urls
            let links;
            try {
                links = browserDragAndDrop.dropLinks(event, true);
            } catch (ex) {}
            if (!links || links.length === 0) {
                return;
            }
            let inBackground = Services.prefs.getBoolPref(
                "browser.tabs.loadInBackground"
            );
            if (event.shiftKey) {
                inBackground = !inBackground;
            }
            let targetTab = this._getDragTargetTab(event, true);
            let userContextId = this.selectedItem.getAttribute("usercontextid");
            let replace = !!targetTab;
            let newIndex = this._getDropIndex(event, true);
            let urls = links.map(link => link.url);
            let csp = browserDragAndDrop.getCSP(event);
            let triggeringPrincipal = browserDragAndDrop.getTriggeringPrincipal(
                event
            );
            (async () => {
                if (
                    urls.length >=
                    Services.prefs.getIntPref("browser.tabs.maxOpenBeforeWarn")
                ) {
                    // Sync dialog cannot be used inside drop event handler.
                    let answer = await OpenInTabsUtils.promiseConfirmOpenInTabs(
                        urls.length,
                        window
                    );
                    if (!answer) {
                        return;
                    }
                }
                gBrowser.loadTabs(urls, {
                    inBackground,
                    replace,
                    allowThirdPartyFixup: true,
                    targetTab,
                    newIndex,
                    userContextId,
                    triggeringPrincipal,
                    csp,
                });
            })();
        }
        if (draggedTab) {
            delete draggedTab._dragData;
        }
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
