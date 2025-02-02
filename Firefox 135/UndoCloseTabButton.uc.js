// ==UserScript==
// @name            UndoCloseTabButtonN
// @description	    Kürzlich geschlossene Tabs, mit Klick auf Schaltfläche in der Navbar oder Mittelklick auf freie Stelle in Tableiste, wiederherstellen.
// @version         1.2.8
// @include         main
// @charset         UTF-8
// @note            2025/01/31 Fx136 fix Remove Cu.import, per Bug Bug 1881888, Bug 1937080 Block inline event handlers in Nightly and collect telemetry
// @note            2023/08/16 Fx117 fix this is undefined
// @note            2023/06/08 Fx115 SessionStore.getClosedTabData → SessionStore.getClosedTabDataForWindow
// @note            2022/11/12 Das Verhalten der linken, mittleren und rechten Taste verändern
// @note            2021/12/12 Fx95 SessionStore.getClosedTabData / getClosedWindowData
// @note            2019/01/23 Fx66 Problem, bei dem das Klicken in die Tableiste nicht funktionierte - behoben 
// @note            2019/07/04 Fx69
// @note            2019/09/03 Fx70
// @note            2019/12/09 Fx72
// ==/UserScript==
// Schaltfläche wird standardmäßig in die Tableiste eingefügt.
(function () {
    "use strict";

    const useTabbarMiddleClick = true; // 	// Kürzlich geschlossene Tabs mit Mittelklick auf Tableiste oder neuen Tab 
    // Schaltfläche wiederherstellen, aktivieren? ( true = ja false = nein )

    const XULNS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";

    window.ucjsUndoCloseTabButtonService = {
        prepareMenu (event) {
            const doc = (event.view && event.view.document) || document;
            const menu = event.originalTarget;
            this.removeChilds(menu);

            // Geschlossene Tabs
            let data = "getClosedTabDataForWindow" in SessionStore ? SessionStore.getClosedTabDataForWindow(window) : SessionStore.getClosedTabData(window);
            if (typeof (data) === "string") {
                data = JSON.parse(data);
            }
            const tabLength = data.length;

            for (let i = 0; i < tabLength; i++) {
                const item = data[i];
                const m = this.createFaviconMenuitem(doc, item.title, item.image, i, this.undoTab);

                const state = item.state;
                let idx = state.index;
                if (idx == 0)
                    idx = state.entries.length;
                if (--idx >= 0 && state.entries[idx])
                    m.setAttribute("targetURI", state.entries[idx].url);

                menu.appendChild(m);
            }

            // // Geschlossene Fenster
            data = SessionStore.getClosedWindowData(window);
            if (typeof (data) === "string") {
                data = JSON.parse(data);
            }
            const winLength = data.length;
            if (winLength > 0) {
                if (tabLength > 0)
                    menu.appendChild(this.$C(doc, "menuseparator"));

                menu.appendChild(this.$C(doc, "menuitem", {
                    disabled: true,
                    label: Services.locale.appLocaleAsBCP47.includes("de") ? "Geschlossene Fenster" : "Geschlossene Fenster"
                }));

                for (let i = 0; i < winLength; i++) {
                    const item = data[i];

                    let title = item.title;
                    const tabsCount = item.tabs.length - 1;
                    if (tabsCount > 0)
                        title += " (他:" + tabsCount + ")";

                    const tab = item.tabs[item.selected - 1];

                    const m = this.createFaviconMenuitem(doc, title, tab.image, i, this.undoWindow);
                    menu.appendChild(m);
                }
            }

            if (tabLength + winLength === 0) {
                /*				menu.appendChild(this.$C(doc, "menuitem", {
                                    disabled: true,
                                    label	: "履歴がありません"
                                }));*/
                event.preventDefault();
            }
        },

        createFaviconMenuitem (doc, label, icon, value, command) {
            const attr = {
                class: "menuitem-iconic bookmark-item menuitem-with-favicon",
                label: label,
                value: value
            };
            if (icon) {
                if (/^https?:/.test(icon))
                    icon = "moz-anno:favicon:" + icon;
                attr.image = icon;
            }
            const m = this.$C(doc, "menuitem", attr);
            m.addEventListener("command", command, false);
            return m;
        },

        undoTab (event) {
            undoCloseTab(event.originalTarget.getAttribute("value"));
        },
        undoWindow (event) {
            undoCloseWindow(event.originalTarget.getAttribute("value"));
        },
        removeChilds (element) {
            const range = document.createRange();
            range.selectNodeContents(element);
            range.deleteContents();
        },

        onClick (event) {
            if (event.button === 0 && event.target.id === "ucjs-undo-close-tab-button") {
                console.log(event.target.id)
                event.preventDefault();
                event.stopPropagation();
                undoCloseTab();
            } else if (event.button == 1) {
                switch (event.originalTarget.localName) {
                    case "box": // -Fx65
                    case "scrollbox": // Fx66-
                        event.preventDefault();
                        event.stopPropagation();
                        undoCloseTab();
                        break;
                }
            } else if (event.button === 2 && event.target.id === "ucjs-undo-close-tab-button") {
                event.preventDefault();
                event.stopPropagation();
                let pos = "after_end", x, y;
                if ((event.target.ownerGlobal.innerWidth / 2) > event.pageX) {
                    pos = "after_position";
                    x = 0;
                    y = 0 + event.target.clientHeight;
                }
                event.target.querySelector("menupopup").openPopup(event.target, pos, x, y);
            }
        },

        $C (doc, tag, attrs) {
            const e = tag instanceof Node ? tag : doc.createElementNS(XULNS, tag);
            if (attrs) {
                Object.entries(attrs).forEach(([key, value]) => {
                    if (key.startsWith('on')) {
                        const eventName = key.slice(2).toLowerCase();
                        if (typeof value === 'string') {
                            e.addEventListener(eventName, new Function(value));
                        } else if (typeof value === 'function') {
                            e.addEventListener(eventName, value);
                        }
                    } else {
                        e.setAttribute(key, value);
                    }
                });
            }
            return e;
        },
    };

    function run () {
        if (useTabbarMiddleClick) {
            gBrowser.tabContainer.addEventListener("click", ucjsUndoCloseTabButtonService.onClick, true);
        }

        const buttonId = "undo1-close-tab-button";

        if (document.getElementById(buttonId)) {
            return;
        }

        try {
            const CustomizableUI = globalThis.CustomizableUI || Cu.import("resource:///modules/CustomizableUI.jsm").CustomizableUI;
            CustomizableUI.createWidget({
                id: buttonId,
                defaultArea: CustomizableUI.AREA_NAVBAR,
                type: "custom",
                onBuild: doc => {
                    const btn = ucjsUndoCloseTabButtonService.$C(doc, "toolbarbutton", {
                        id: buttonId,
                        class: "toolbarbutton-1 chromeclass-toolbar-additional",
                        type: "contextmenu",
                        anchor: "dropmarker",
                        label: "Kürzlich geschlossene Tabs",
                        tooltiptext: "Kürzlich geschlossene Tabs wieder herstellen",
                        image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAADgUlEQVR42mL8//8/AyUAIIBYYIzVq1dLC4mIrvr08ZPV379/vjEzMwOZnycmxMV04DMAIIAYQC4A4dXr1oU+fvLk/5/fv/9//fzl/9ev3/6vWLnqK0weFwYIIBZ0A79//crw5+9fhh+//jBYWlhz1dc3fgIqZeDh4WHk4uaqysnKmoysHiCAwAbceHRD6uLdQ0kGunoMv9hYGX79/sPw7cdvhn///jNYWJjzgtRw8/AwvHz5smzutlbN4yeP/k8Pqeo11bW5BxBAjCBnFPbHd7EIMJRoiZgx8nBwMvz+85fhJ9CQf3//Mzx9+pQBFM483FwMQG8xMDL/ZXj46cZ/9v/sk6ZWriwACCCwC25eviprEKbGeOP/AYavb34wsHCwMPz9AzTg9z+GP7x/Gf7++ws07B/Djz+/GZiYGBhYBdgYrx68JwXUyggQQGADePgFfjD+ZGHgF+Bl+P7yHZDPycDGws2gKW7GIMAhwnDs4XaGJ1/uMPz+8Z2BnYOZ4fOnzwwsrMxfgVr/AwQQ2ABpGYkv/GLcDELSfEDn/2HgFeZh8JdLYfjw6SODvqw5g4KiPMOsMw0MDEDbOYWABrz5zsAtI/wJpBcggJhABD+P8MefX38x/AU6k+EvIwPHHx4GNgYuhuuPLzCcuL2f4QswZozEHBjYGDmAdjIw/Pn+l0FCVOoNSC9AAIENEBEQe/Pjy0+GP8CA42LgZ/BXTWb48OUdw6m7+xmm7W5hePTqLoOLaigD+28+hnfv3jN8ePMJaIDMc5BegAACGyApLPX82+fvDB/ev2f4/eU/Ax+bEMOLd08ZpITkGbTl9IHp4jfDsev7GL59/8Lw+9dvhp/ffjPISio+BekFCCCwAQpiyrdfPn3F8OrVa4bHr+8zXHxwioGbjY+hwq+PwVkzmCHYMpFBS84A6Pp/DP/+/2P4+/Mvg5Ks+gOQXoAAggSimNqTb59+/v7x7SfL289vGRccmMDAxyrEsO3sKmCC+sKw9+xmhicf7gLxfQZ2QSaG/38YfkvyyoPCgBEggMAGfPnyhV2eV6vzxs7LWr9//Gf+yPKS6f/fl8zAhMgISkX//11h+M/I+A/ohL/f2P7/1VA2uvb161cOkAMAAogRmp1Znz17xsrCwsL07ds3lu/fvzOD2D9+/GCCpXk2Nra/XFxc/4Bif7i5uf9ISUn9Bgr/BggwAMhljD12v/akAAAAAElFTkSuQmCC",
                        onclick: "ucjsUndoCloseTabButtonService.onClick(event);",
                    });
                    const menu = ucjsUndoCloseTabButtonService.$C(doc, "menupopup", {
                        tooltip: "bhTooltip",
                        popupsinherittooltip: "true",
                        oncontextmenu: "event.preventDefault();",
                        onpopupshowing: "ucjsUndoCloseTabButtonService.prepareMenu(event);",
                    });
                    btn.appendChild(menu);
                    return btn;
                },
            });
        } catch (e) { }
    }

    if (gBrowserInit.delayedStartupFinished) {
        run();
    } else {
        const OBS_TOPIC = "browser-delayed-startup-finished";
        const delayedStartupFinished = (subject, topic) => {
            if (topic === OBS_TOPIC && subject === window) {
                Services.obs.removeObserver(delayedStartupFinished, topic);
                run();
            }
        };
        Services.obs.addObserver(delayedStartupFinished, OBS_TOPIC);
    }
})();
