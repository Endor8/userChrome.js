// ==UserScript==
// @name            UndoCloseTabButtonN
// @description		Kürzlich geschlossene Tabs, mit Klick auf Schaltfläche in der Tableiste 
// @description		oder Mittelklick auf freie Stelle in Tableiste, wiederherstellen.
// @version         1.2.6
// @include         main
// @charset         UTF-8
// @note            2022/11/12 Das Verhalten der linken, mittleren und rechten Taste verändern
// @note            2021/12/12 Fx95 SessionStore.getClosedTabData / getClosedWindowData 
// @note            2021/12/12 Rückgabe Wert von JSON in Array geändert 
// @note            2019/01/23 Fx66 Problem, bei dem das Klicken in die Tableiste nicht funktionierte - behoben 
// @note            2019/07/04 Fx69
// @note            2019/09/03 Fx70
// @note            2019/12/09 Fx72
// ==/UserScript==
// Schaltfläche wird standardmäßig in die Navigationsleiste eingefügt.
(function () {
    "use strict";

    const useTabbarMiddleClick = true; 
	// Kürzlich geschlossene Tabs mit Mittelklick auf Tableiste oder neuen Tab 
    // Schaltfläche wiederherstellen, aktivieren? ( true = ja false = nein )

    const XULNS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";

    window.ucjsUndoCloseTabButtonService = {
        prepareMenu(event) {
            const doc = (event.view && event.view.document) || document;
            const menu = event.originalTarget;
            this.removeChilds(menu);

            // Geschlossene Tabs
            let data = SessionStore.getClosedTabData(window);
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

            // Geschlossenes Fenster 
            data = SessionStore.getClosedWindowData();
            if (typeof (data) === "string") {
                data = JSON.parse(data);
            }
            const winLength = data.length;
            if (winLength > 0) {
                if (tabLength > 0)
                    menu.appendChild(this.$C(doc, "menuseparator"));

                menu.appendChild(this.$C(doc, "menuitem", {
                    disabled: true,
                    label: Services.locale.appLocaleAsBCP47.includes("de") ? "Geschlossene Fenster" : "閉じたウインドウ"
                }));

                for (let i = 0; i < winLength; i++) {
                    const item = data[i];

                    let title = item.title;
                    const tabsCount = item.tabs.length - 1;
                    if (tabsCount > 0)
                        title += " und (" + tabsCount + " weitere Tabs)";

                    const tab = item.tabs[item.selected - 1];

                    const m = this.createFaviconMenuitem(doc, title, tab.image, i, this.undoWindow);
                    menu.appendChild(m);
                }
            }

            if (tabLength + winLength === 0) {
                /*				menu.appendChild(this.$C(doc, "menuitem", {
                                    disabled: true,
                                    label	: "Chronik"
                                }));*/
                event.preventDefault();
            }
        },

        createFaviconMenuitem(doc, label, icon, value, command) {
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

        undoTab(event) {
            undoCloseTab(event.originalTarget.getAttribute("value"));
        },
        undoWindow(event) {
            undoCloseWindow(event.originalTarget.getAttribute("value"));
        },
        removeChilds(element) {
            const range = document.createRange();
            range.selectNodeContents(element);
            range.deleteContents();
        },

        onClick(event) {
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

        $C(doc, tag, attrs) {
            const e = tag instanceof Node ? tag : doc.createElementNS(XULNS, tag);
            if (attrs) {
                Object.entries(attrs).forEach(([key, value]) => e.setAttribute(key, value));
            }
            return e;
        },
    };

    function run() {
        if (useTabbarMiddleClick) {
            gBrowser.tabContainer.addEventListener("click", ucjsUndoCloseTabButtonService.onClick, true);
        }

        const buttonId = "ucjs-undo-close-tab-button";

        if (document.getElementById(buttonId)) {
            return;
        }

        try {
            Cu.import("resource:///modules/CustomizableUI.jsm");
            CustomizableUI.createWidget({
                id: buttonId,
                defaultArea: CustomizableUI.AREA_TABSTRIP,
                type: "custom",
                onBuild: doc => {
                    const btn = ucjsUndoCloseTabButtonService.$C(doc, "toolbarbutton", {
                        id: buttonId,
                        class: "toolbarbutton-1 chromeclass-toolbar-additional",
                        type: "contextmenu",
                        anchor: "dropmarker",
                        label: Services.locale.appLocaleAsBCP47.includes("de") ? "Kürzlich geschlossene Tabs" : "閉じたタブ",
                        tooltiptext: Services.locale.appLocaleAsBCP47.includes("de") ? "Kürzlich geschlossene Tabs wieder herstellen" : "閉じたタブ\n中クリックで最後に閉じたタブを復元",
                        image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADRklEQVRYhcWV32tbZRjHc7ELL3bRP8ELL7zohTeCl70IijhEkJcWdmcdSFDBoWydlIZSsE7tLFLowLqs1YKpdCXM1bhhxM11SsuMZml2znkW94vRJOc9OusuZpKPF6fnNMlJNtvE7IXv3fu+38/7/HpDoTZXCvaI5nC79+xq5R16xOGsaPJdN7c0vZbGEg1dBxDNPtFsbpl3F0AcRkSDZVOdSHYR4EqBveKwIBpyRSoH5yE87gPcMYv0ebI0vXmHno6Z5x0et2wyouHHa7B/2jWvAWilm+JwzNL07tpcSoQtm5JoSKThxYlt8/A4fH4pqETaBfVBbMriMJKCPTsyt0q8LpqyaJj6Dp49Wm/+MKlP4MNvIFegIhpMm5+ulnjyocb5PI+JwwnRsF6geuSrnRk3qn8KljN+RDYNh6ce/PICT4hm3ct5/1R7AJ68rrmmuRxIB9AD9Hmy/2bw+h8kRcMPFveH2oxCeByeOwpzl3yIsUaAPhpWFbDvuQcsG0YTwUuHF4Ma/BSe/6B1XVzZoCKasmnzTAAgFosRjUbrNPflEkbxH0TD7MX6YmzVgtkNGGsCHB53H7IVhbkAQDQaRSkV0FtvH+aX3x1EQzILL09uA2RubXJ8Nu5r6dwKZrGCaHj/TBDghY8gVwTR/PWfAZRSvDJ4gO/XDETD6k031KJh1SwE9h56N4pZrJArbsPWKpl1z+4IQClF/8AA8a9TW2GutgRQSjG/9C2iwRvbjQNsVwCeJqZm/DC3Ajg+G0e0W5gdB1BKMTQ8ym837rYESF78FdFw4LMgQHytAwBKKV6LvMHy+cuBNM3Mn0I0/Hy9eUuetzoE4BlOTsdYNQusmgU/NdmNKpGTzWeBaBAHsyMAtfn2Xh1faz3CZy74AMc6BjA5HUM0vHf6weN4aAHWC5SvFklLiae7CrB/Gs7lwLKpmDavNv0L2k1Bs5bz8p5Iu6G/8SfLtcYjWzrxfwEML0LmjluYt+9CucIXnm+o8QfsBMBLH7vhHktsj1yzVGFxOUW1wS8EEIlEdmXaqgsatZK9xZsH36nbH4lEOgtQOwcupPOcXclwcuE0Q8Oj9A8MBPbXARiGQSaT6aoMw/ABUo9SoUe9/gWm1ZHCwkU2TQAAAABJRU5ErkJggg==",
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