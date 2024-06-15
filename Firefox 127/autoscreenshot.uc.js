// ==UserScript==
// @name           AutoSaveScreenshot.uc.js
// @description    Screenshot mit einem Klick speichern, Linksklick, speichert sichtbaren Bereich, Umschalttaste + Linksklick, die gesamte Seite.
// @namespace      https://github.com/benzBrake/FirefoxCustomize
// @author         Ryan, aborix
// @include        main
// @license        MIT License
// @compatibility  Firefox 127
// @homepageURL    https://github.com/benzBrake/FirefoxCustomize/tree/master/userChromeJS
// @downloadURL    https://github.com/benzBrake/FirefoxCustomize/raw/master/AutoSaveScreenshot.uc.js
// @version        0.0.3
// @note           0.0.3 Das Problem, dass Screenshots immer im ersten Fenster erstellt wurden, wurde behoben
// @note           0.0.2 Kompatibilitätsprobleme in Version 127 behoben
// ==/UserScript==
(async function () {

    const CustomizableUI = globalThis.CustomizableUI || ChromeUtils.importESModule("resource:///modules/CustomizableUI.sys.mjs").CustomizableUI;

    document.addEventListener('DOMContentLoaded', async (e) => {
        const { location } = e.target;
        if (location.href.startsWith("chrome://browser/content/screenshots/screenshots-preview.html?")) {
            let preview_area = await new Promise(resolve => {
                let count = 0;
                let timer = setInterval(() => {
                    let area = e.target.documentElement.querySelector("screenshots-preview");
                    count++;
                    if (area) {
                        clearInterval(timer);
                        resolve(area);
                    }
                    if (count > 300) {
                        clearInterval(timer);
                        reject(null);
                    }
                }, 10);
            });
            if (preview_area) {
                let download_btn = await new Promise(resolve => {
                    let count = 0;
                    let timer = setInterval(() => {
                        let btn = preview_area.shadowRoot.querySelector("#download");
                        count++;
                        if (btn) {
                            clearInterval(timer);
                            resolve(btn);
                        }
                        if (count > 300) {
                            clearInterval(timer);
                            reject(null);
                        }
                    }, 10);
                });
                download_btn.click();
            }
        }
    })

    window.AutoSaveScreenshot = {
        BTN_ID: "AutoSaveScreenshot-button",
        init() {
            if (!(CustomizableUI.getWidget(this.BTN_ID) && CustomizableUI.getWidget(this.BTN_ID).forWindow(window)?.node)) {
                CustomizableUI.createWidget({
                    id: this.BTN_ID,
                    removable: true,
                    defaultArea: CustomizableUI.AREA_NAVBAR,
                    type: "custom",
                    onBuild: doc => this.createButton(doc)
                });
            }
        },
        createButton(doc) {
            let btn = createElement(doc, 'toolbarbutton', {
                id: this.BTN_ID,
                label: "AutoSaveScreenshot",
		tooltiptext: "Screenshots\nLinks-klick: Sichtbarer Bereich\nUmschaltaste + Links-klick: Ganze Seite",
                'data-l10n-id': 'auto-save-screenshot',
                class: 'toolbarbutton-1 chromeclass-toolbar-additional',
                image: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSJjb250ZXh0LWZpbGwiIGZpbGwtb3BhY2l0eT0iY29udGV4dC1maWxsLW9wYWNpdHkiIHRyYW5zZm9ybT0ic2NhbGUoMS4zKSI+PHBhdGggZD0iTTUgM0MzLjg5NSAzIDMgMy44OTUgMyA1TDUgNUw1IDMgeiBNIDcgM0w3IDVMOSA1TDkgM0w3IDMgeiBNIDExIDNMMTEgNUwxMyA1TDEzIDNMMTEgMyB6IE0gMTUgM0wxNSA1TDE3IDVMMTcgM0wxNSAzIHogTSAxOSAzTDE5IDVMMjEgNUMyMSAzLjg5NSAyMC4xMDUgMyAxOSAzIHogTSAzIDdMMyA5TDUgOUw1IDdMMyA3IHogTSAxOSA3TDE5IDlMMjEgOUwyMSA3TDE5IDcgeiBNIDEyIDlMMTAuNjY3OTY5IDExTDguNSAxMUM3LjY3MiAxMSA3IDExLjY3MiA3IDEyLjVMNyAxOS41QzcgMjAuMzI4IDcuNjcyIDIxIDguNSAyMUwxOS41IDIxQzIwLjMyOCAyMSAyMSAyMC4zMjggMjEgMTkuNUwyMSAxMi41QzIxIDExLjY3MiAyMC4zMjggMTEgMTkuNSAxMUwxNy4zMzIwMzEgMTFMMTYgOUwxMiA5IHogTSAzIDExTDMgMTNMNSAxM0w1IDExTDMgMTEgeiBNIDEzLjA3MDMxMiAxMUwxNC45Mjk2ODggMTFMMTUuNjY5OTIyIDEyLjEwOTM3NUwxNi4yNjM2NzIgMTNMMTcuMzMyMDMxIDEzTDE5IDEzTDE5IDE5TDkgMTlMOSAxM0wxMC42Njc5NjkgMTNMMTEuNzM2MzI4IDEzTDEyLjMzMDA3OCAxMi4xMDkzNzVMMTMuMDcwMzEyIDExIHogTSAxNCAxNCBBIDIgMiAwIDAgMCAxMiAxNiBBIDIgMiAwIDAgMCAxNCAxOCBBIDIgMiAwIDAgMCAxNiAxNiBBIDIgMiAwIDAgMCAxNCAxNCB6IE0gMyAxNUwzIDE3TDUgMTdMNSAxNUwzIDE1IHogTSAzIDE5QzMgMjAuMTA1IDMuODk1IDIxIDUgMjFMNSAxOUwzIDE5IHoiLz48L3N2Zz4=",
                style: "fill: #3AADE2" // Farbe nach Wunsch ändern
            });
            btn.addEventListener('click', this, false);
            return btn;
        },
        handleEvent(event) {
            if (event.button === 0) {
                this.takeScreenshot(event.target.ownerDocument, event.shiftKey);
            }
        },
        async takeScreenshot(doc, isFullPage) {
            doc.getElementById('key_screenshot').doCommand();
            let btn = await this.getScreenSortButton(doc, isFullPage);
            btn.click();
        },
        async getScreenSortButton(doc, isFullPage) {
            let screenshotsPagePanel = await new Promise(resolve => {
                let interval = setInterval(() => {
                    let screenshotsPagePanel = doc.getElementById("screenshotsPagePanel");
                    if (screenshotsPagePanel) {
                        clearInterval(interval);
                        resolve(screenshotsPagePanel);
                    }
                }, 10);
            });
            return screenshotsPagePanel.querySelector("screenshots-buttons").shadowRoot.querySelector(isFullPage ? "#full-page" : "#visible-page");
        }
    }
    window.AutoSaveScreenshot.init();

    /**
     * DOM-Elemente erstellen
     * 
     * @param {Document} d HTML-Dokument
     * @param {string} t DOM-Element-Tag
     * @param {Object} o DOM-Elementattribut-Schlüssel-Wert-Paar
     * @returns 
     */
    function createElement(d, t, o = {}) {
        if (!d) return;
        let e = /^html:/.test(t) ? d.createElement(t) : d.createXULElement(t);
        for (let [k, v] of Object.entries(o)) {
            e.setAttribute(k, v);
        }
        return e;
    }
})()
