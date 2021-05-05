// ==UserScript==
// @name           zzzz-MultiRowTab_LiteforFx48.uc.js
// @namespace      http://space.geocities.yahoo.co.jp/gl/alice0775
// @description    Experimentelle CSS Version für Mehrzeilige Tableiste
// @include        main
// @compatibility  Firefox 89
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

    var css =` @-moz-document url-prefix("chrome://browser/content/browser.xhtml") {

    /* Symbolleistenanpassung  */
    :root[tabsintitlebar="true"][sizemode="maximized"] #navigator-toolbox { padding-top: 8px !important; }
    #titlebar,#tabbrowser-tabs { -moz-appearance: none !important; }

    /* Firefox-Design bei Standard Theme, und wenn Weiß in den persönlichen Einstellungen von Windows 10 → Farbe → Farbauswahl 
	   ausgewählt ist, Anpassung für die Titelleistenschaltflächen, da sonst der Hintergrund der Schaltflächen transparent ist.
       Vollbild nur bei Proton false */
    :root:not([tabsintitlebar="true"]) .tab-background { border-top-color: transparent !important; }
    tabs tab[beforeselected-visible]:after,tabs tab[selected]:after { border-left-color: transparent !important; }

    /* Anpassung der Titelleistenschaltflächen */
    :root[tabsintitlebar="true"] #nav-bar .titlebar-buttonbox > .titlebar-button { width: 46px !important; }
    :root[inFullscreen="true"] #window-controls > toolbarbutton { width: 36px !important; }
    :root[inFullscreen="true"] #window-controls toolbarbutton:not([id="close-button"]):hover {
        background-color: var(--urlbarView-button-background-hover) !important; }

    /* Mehrzeilige Tableiste */
    box.scrollbox-clip[orient="horizontal"] { display: block; }
    scrollbox[part][orient="horizontal"] {
        display: flex;
        flex-wrap: wrap; }
    tabs tab[fadein]:not([pinned]) { flex-grow: 1; }
    tab > .tab-stack { width: 100%; }
    @media not (-moz-proton) {
        tabs tab { height: var(--tab-min-height); }
        #tabs-newtab-button { height: calc(var(--tab-min-height) - 1px); } }
    @media (-moz-proton) {
        tabs tab,#tabs-newtab-button { height: calc(var(--tab-min-height) + 8px); }
        tab>.tab-stack>.tab-background[style$="px solid red !important;"] { border-radius: 0 !important; } }

    /* Drag-Bereich auf der linken und rechten Seite der Tab-Leiste ausblenden - verstecken
       Beidseitig → hbox.titlebar-spacer 
       links      → hbox.titlebar-spacer[type="pre-tabs"] 
       rechts     → hbox.titlebar-spacer[type="post-tabs"] */
    hbox.titlebar-spacer { display: none; }

    /* Ausblenden - Verstecken  */
    tabs tab:not([fadein]),
    #toolbar-menubar[autohide="false"] ~ #nav-bar hbox.titlebar-buttonbox-container { display: none; }

    /* Durch das Verschieben der Tableiste an den unteren Rand des Browserfenster mit diesem Script,
       funktionierte das Theme nicht mehr. Daher wurde unten angeführter CSS Code hinzugefügt,
       um die Funktion wieder herzustellen. */
    #titlebar:-moz-lwtheme {
        background-image: var(--lwt-additional-images);
        background-repeat: var(--lwt-background-tiling);
        background-position: var(--lwt-background-alignment);
    }
    @media not (-moz-os-version: windows-win7) {
        @media not (-moz-os-version: windows-win8) {
            #titlebar:-moz-lwtheme {
                background-color: var(--lwt-accent-color);
            }
            :root[lwtheme-image] #titlebar {
                background-image: var(--lwt-header-image), var(--lwt-additional-images);
                background-repeat: no-repeat, var(--lwt-background-tiling);
                background-position: right top, var(--lwt-background-alignment);
            }
            #titlebar:-moz-window-inactive:-moz-lwtheme {
                background-color: var(--lwt-accent-color-inactive, var(--lwt-accent-color));
            }
        }
    }
    @media (-moz-os-version: windows-win7),
    (-moz-os-version: windows-win8) {
        :root:-moz-lwtheme {
            background-color: var(--lwt-accent-color);
        }
        :root[lwtheme-image] {
            background-image: var(--lwt-header-image) !important;
            background-repeat: no-repeat;
            background-position: right top !important;
        }
        :root:-moz-lwtheme:-moz-window-inactive {
            background-color: var(--lwt-accent-color-inactive, var(--lwt-accent-color));
        }
    }

    } `;
    var sss = Cc['@mozilla.org/content/style-sheet-service;1'].getService(Ci.nsIStyleSheetService);
    var uri = makeURI('data:text/css;charset=UTF=8,' + encodeURIComponent(css));
    sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);

    /* Menüleiste von der Titelleiste in die Navigator-Toolbox verschieben */
    document.getElementById("titlebar").parentNode.insertBefore(document.getElementById("toolbar-menubar"),document.getElementById("nav-bar"));
    document.body.appendChild(document.getElementById("titlebar"));

    /* Titelleistenschaltflächen aus der Tableiste, rechts neben die Navigationsleiste verschieben */
    document,document.getElementById("PanelUI-button").appendChild(document.querySelector("#TabsToolbar .titlebar-buttonbox-container"));
    document,document.getElementById("PanelUI-button").appendChild(document.getElementById("window-controls"));

    /* DropIndicator */

    gBrowser.tabContainer.clearDropIndicator = function() {
        let tabs = this.allTabs;
        for (let i = 0, len = tabs.length; i < len; i++) {
            tabs[i].removeAttribute("style");
            tabs[i].querySelector(".tab-background").removeAttribute("style");
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

        // let draggedTab = event.dataTransfer.mozGetDataAt(TAB_DROP_TYPE, 0);
        let draggedTab = this._getDropIndex(event, false);
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
                // let tabRect = children[newIndex - 1].getBoundingClientRect();
                let tabRect = children[newIndex - 1].querySelector(".tab-background").style.setProperty("border-right","2px solid red","important");
                if (RTL_UI) {
                    newMargin = rect.right - tabRect.left;
                } else {
                    newMargin = tabRect.right - rect.left;
                }
            } else {
                // let tabRect = children[newIndex].getBoundingClientRect();
                let tabRect = children[newIndex].querySelector(".tab-background").style.setProperty("border-left","2px solid red","important");
                if (RTL_UI) {
                    newMargin = rect.right - tabRect.right;
                } else {
                    newMargin = tabRect.left - rect.left;
                }
            }
        }

        ind.hidden = false;
        newMargin += ind.clientWidth / 2;
        if (RTL_UI) {
            newMargin *= -1;
        }
        ind.style.transform = "translate(" + Math.round(newMargin) + "px)";
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
            if (oldTranslateX && oldTranslateX != newTranslateX && !gReduceMotion) {
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
                    event.screenY >
                    tabs[i].screenY &&
                    event.screenY <
                    tabs[i].screenY + tabs[i].getBoundingClientRect().height
                ) {
                    if (
                        event.screenX >
                        tabs[i].screenX &&
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
                    event.screenY >
                    tabs[i].screenY &&
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
                        tabs[i].screenX + tabs[i].getBoundingClientRect().width / 2 &&
                        event.screenX >
                        tabs[i].screenX
                    ) {
                        return i + 1;
                    }
                }
            }
        }
        return tabs.length;
    }

}
