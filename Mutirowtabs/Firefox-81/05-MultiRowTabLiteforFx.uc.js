// ==UserScript==
// @name           zzzz-MultiRowTab_LiteforFx48.uc.js
// @namespace      http://space.geocities.yahoo.co.jp/gl/alice0775
// @description    Experimentelle CSS Version für Mehrzeilige Tableiste
// @include        main
// @compatibility  Firefox 81
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
    document.getElementById("titlebar").parentNode.insertBefore(document.getElementById("toolbar-menubar"),document.getElementById("nav-bar"));
    /* # Titelleiste aus der # Navigator-Toolbox an den unteren Rand des Fenster verschieben */
    document.body.appendChild(document.getElementById("titlebar"));

    var css =` @-moz-document url-prefix("chrome://browser/content/browser.xhtml") {

    /* Symbolleiste Sortieren */
    #toolbar-menubar { -moz-box-ordinal-group: 1 !important; } /* Menüleiste */
    #nav-bar { -moz-box-ordinal-group: 2 !important; }         /* Navigationsleiste */
    #PersonalToolbar { -moz-box-ordinal-group: 3 !important; } /* Lesezeichen-Symbolleiste */
    
    /* Anpassung der Symbolleisten */
    [tabsintitlebar="true"] #toolbar-menubar { height: 29px; }
    [tabsintitlebar="true"][sizemode="maximized"] #navigator-toolbox { padding-top: 8px !important; }
    #titlebar,#tabbrowser-tabs { -moz-appearance: none !important; }

    /* Tableiste an den unteren Fensterand verschieben und bei aktiven Tab den weißen Rand transparent machen */
    #main-window:not([tabsintitlebar="true"]) .tab-background { border-top-color: transparent !important; }
    tabs tab[beforeselected-visible]:after,tabs tab[selected]:after { border-left-color: transparent !important; }

    /* Windows 10 und Firefox Standardtheme, Fensterausenlinie in weiß. 
       Anpassung für Titelleistenschaltflächen wenn sie in den Hintergrund verschoben sind */
    #main-window:not([lwtheme="true"]) #toolbar-menubar[autohide="true"][inactive="true"] .titlebar-button { color: rgb(24, 25, 26) !important; }
    #main-window:not([lwtheme="true"]) #toolbar-menubar[autohide="true"][inactive="true"] .titlebar-button:not(.titlebar-close):hover {
        background-color: var(--lwt-toolbarbutton-hover-background, hsla(0,0%,70%,.4)) !important; }

    /* Position der Titelleistenschaltflächen anpassen */
    [tabsintitlebar="true"] #toolbar-menubar[autohide="true"][inactive="true"] .titlebar-buttonbox-container {
        display: block; position: fixed; z-index: 1 !important; right:0; }
    #main-window[inFullscreen="true"] #window-controls { display: flex; }
    #main-window[inFullscreen="true"] #window-controls > toolbarbutton { display: inline; max-height: var(--tab-min-height);}

    /* auf der rechten Seite Platz für die Schaltflächen der Titelleiste einfügen, damit die    
	   Schaltflächen der Titelleiste und der Navigationsleiste nicht verdeckt werden */
    [tabsintitlebar="true"] #toolbar-menubar[autohide="true"][inactive="true"] ~ #nav-bar:not([inFullscreen="true"]) { padding-right: 139px !important; }

    /* Mehrzeilige Tableiste */
    box[class="scrollbox-clip"][orient="horizontal"],
    tabs > arrowscrollbox { display: block; }
    scrollbox[part][orient="horizontal"] {
        display: flex;
        flex-wrap: wrap; }
    tabs tab[fadein]:not([pinned]) { flex-grow: 1; }
    tabs tab,.tab-background { height: var(--tab-min-height); }
    tab > .tab-stack { width: 100%; }

    /* Drag-Bereich auf der linken und rechten Seite der
       Tab-Leiste ausblenden - verstecken
       Links und rechts → hbox.titlebar-spacer 
       links → hbox.titlebar-spacer[type="pre-tabs"] 
       rechts → hbox.titlebar-spacer[type="post-tabs"] */
    hbox.titlebar-spacer
    ,
    /* Ausblenden - Verstecken */
    tabs tab:not([fadein]),
    [tabsintitlebar="true"] #TabsToolbar .titlebar-buttonbox-container { display: none; }

    } `;
    var sss = Cc['@mozilla.org/content/style-sheet-service;1'].getService(Ci.nsIStyleSheetService);
    var uri = makeURI('data:text/css;charset=UTF=8,' + encodeURIComponent(css));
    sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);

    gBrowser.tabContainer.clearDropIndicator = function() {
        var tabs = document.getElementsByClassName("tab-background");
        for (let i = 0, len = tabs.length; i < len; i++) {
            tabs[i].style.removeProperty("border-left-style");
            tabs[i].style.removeProperty("border-right-style");
        }
    }
    gBrowser.tabContainer.addEventListener("dragleave", function(event) { this.clearDropIndicator(event); }, true);

    gBrowser.tabContainer.on_dragover = function(event) {
        this.clearDropIndicator();
        var effects = this._getDropEffectForTabDrag(event);
        event.preventDefault();
        event.stopPropagation();
        if (effects == "link") {
            let tab = this._getDragTargetTab(event, true);
            if (tab) {
                if (!this._dragTime) {
                    this._dragTime = Date.now();
                }
                if (Date.now() >= this._dragTime + this._dragOverDelay) {
                    this.selectedItem = tab;
                }
                return;
            }
        }
        let newIndex = this._getDropIndex(event, effects == "link");
        let children = document.getElementsByClassName("tab-background");
        if (newIndex == children.length) {
            children[newIndex - 1].style.setProperty("border-right","2px solid red","important");
        } else {
            children[newIndex].style.setProperty("border-left","2px solid red","important");
        }
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
