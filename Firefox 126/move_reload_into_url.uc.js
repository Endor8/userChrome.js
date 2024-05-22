// ==UserScript==
// @name           moveReloadIntoUrl.uc.js
// @description    Neuladen Schaltfläche in Adressleiste verschieben
// @compatibility  Firefox 57
// @author         Ryan, GOLF-AT
// @include        main
// @shutdown       window.moveReloadIntoURL.unload();
// @homepageURL    https://github.com/benzBrake/FirefoxCustomize
// @version        1.2.4
// @note           1.2.4 Bug 1880914  Move Browser* helper functions used from global menubar and similar commands to a single object in a separate file, loaded as-needed and Bug 1820534 - Move front-end to modern flexbox
// @note           1.2.3 Änderung wird in neuen Fenstern nicht wirksam und kann nicht verwendet werden, wenn Hot-Swapping stattfindet.
// @note           1.2.2 Kompatibilität für Firefox 103
// @note           1.2.0 Hot-Swap-fähig, kompatibel mit Nachtmodus und Bilder wurden ins Script integriert
// @note           1.1 20220424 Fehler behoben, und Firefox 100 Kompatibel
// @note           1.0 20171104
// ==/UserScript==
(function () {
    let { classes: Cc, interfaces: Ci, utils: Cu, results: Cr } = Components;

    const isGerman = (Services.locale.appLocaleAsBCP47 || Services.locale.getAppLocaleAsBCP47()).includes("de");

    if (window.moveReloadIntoURL) {
        window.moveReloadIntoURL.unload();
        delete window.moveReloadIntoURL;
    }

    window.moveReloadIntoURL = {
        handleEvent: function (aEvent) {
            if (aEvent.type === "MoveReloadIntoUrlUnload") {
                let window = aEvent.originalTarget,
                    doc = window.document;
                let RELOADBTN = CustomizableUI.getWidget("reload-button").forWindow(window).node;
                if (RELOADBTN)
                    RELOADBTN.removeEventListener('DOMAttrModified', this.reloadBtnAttr);
                let BTN = doc.getElementById("new-stop-reload-button");
                if (BTN)
                    BTN.parentNode.removeChild(BTN);
                if (this.STYLE) {
                    this.sss.unregisterSheet(this.STYLE.url, this.STYLE.type);
                }
                window.removeEventListener('MoveReloadIntoUrlUnload', this);
                if (window.moveReloadIntoURL)
                    delete window.moveReloadIntoURL;
            }
        },
        init: function () {
            if (window.moveReloadIntoURL) {
                this.sss = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService);
                this.STYLE = {
                    url: Services.io.newURI('data:text/css;charset=UTF-8,' + encodeURIComponent(`
                @-moz-document url-prefix('chrome://browser/content/browser.x') {
                    #stop-reload-button {
                        display: none;
                    }
                    #new-stop-reload-button {
                        display: flex !important;
                        order: 9999;
                    }
                    #new-stop-reload-button .urlbar-icon {
                        -moz-context-properties: fill, fill-opacity !important;
                        fill: currentColor !important;
                    }
                }
              `)),
                    type: this.sss.AGENT_SHEET
                };
                this.sss.loadAndRegisterSheet(this.STYLE.url, this.STYLE.type);
            }
            let PABTN = CustomizableUI.getWidget("pageActionButton").forWindow(window).node;
            let RELOADBTN = CustomizableUI.getWidget("reload-button").forWindow(window).node;
            let BTN = $C(document, 'hbox', {
                id: "new-stop-reload-button",
                class: "urlbar-page-action urlbar-addon-page-action",
                "tooltiptext": isGerman ? 'Linksklick： Seite neuladen\r\nRechtsklick： Neu laden ohne Cache' : 'Left click: refresh page\nRight click: force refresh page',
                style: "list-style-image: url('data:image/svg+xml;base64,PCEtLSBUaGlzIFNvdXJjZSBDb2RlIEZvcm0gaXMgc3ViamVjdCB0byB0aGUgdGVybXMgb2YgdGhlIE1vemlsbGEgUHVibGljCiAgIC0gTGljZW5zZSwgdi4gMi4wLiBJZiBhIGNvcHkgb2YgdGhlIE1QTCB3YXMgbm90IGRpc3RyaWJ1dGVkIHdpdGggdGhpcwogICAtIGZpbGUsIFlvdSBjYW4gb2J0YWluIG9uZSBhdCBodHRwOi8vbW96aWxsYS5vcmcvTVBMLzIuMC8uIC0tPgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDE2IDE2IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGZpbGw9IiNkOTAwMDAiIGZpbGwtb3BhY2l0eT0iMS4wIiBzdHJva2U9IiNkOTAwMDAiIHN0cm9rZS13aWR0aD0iMSIgPgogIDxwYXRoIGQ9Ik0xMC43MDcgNiAxNC43IDZsLjMtLjMgMC0zLjk5M2EuNS41IDAgMCAwLS44NTQtLjM1NGwtMS40NTkgMS40NTlBNi45NSA2Ljk1IDAgMCAwIDggMUM0LjE0MSAxIDEgNC4xNDEgMSA4czMuMTQxIDcgNyA3YTYuOTcgNi45NyAwIDAgMCA2Ljk2OC02LjMyMi42MjYuNjI2IDAgMCAwLS41NjItLjY4Mi42MzUuNjM1IDAgMCAwLS42ODIuNTYyQTUuNzI2IDUuNzI2IDAgMCAxIDggMTMuNzVjLTMuMTcxIDAtNS43NS0yLjU3OS01Ljc1LTUuNzVTNC44MjkgMi4yNSA4IDIuMjVhNS43MSA1LjcxIDAgMCAxIDMuODA1IDEuNDQ1bC0xLjQ1MSAxLjQ1MWEuNS41IDAgMCAwIC4zNTMuODU0eiIvPgo8L3N2Zz4K",
                onclick: function (e) {
                    let r = CustomizableUI.getWidget("reload-button").forWindow(window).node;
                    e.preventDefault();
                    if (r && r.getAttribute('displaystop'))
                        gBrowser.stop();
                    else
                        if (e.button == 2) {
                            gBrowser.reloadWithFlags(Ci.nsIWebNavigation.LOAD_FLAGS_BYPASS_CACHE)
                        } else {
                            if (gBrowser.selectedBrowser._userTypedValue) {
                                e.target.ownerGlobal.openTrustedLinkIn(gBrowser.selectedBrowser._userTypedValue, 'current', {
                                    postData: null,
                                    triggeringPrincipal: gBrowser.selectedBrowser.contentPrincipal
                                });
                            } else {
                                gBrowser.reload();
                            }
                        }
                }
            })

            BTN.appendChild($C(document, 'image', {
                class: 'urlbar-icon',
            }));

            PABTN.after(BTN);
            RELOADBTN.addEventListener('DOMAttrModified', this.reloadBtnAttr);
            this.reloadBtnAttr();

            window.addEventListener('MoveReloadIntoUrlUnload', this)
        },
        unload: function () {
            let windows = Services.wm.getEnumerator('navigator:browser');
            while (windows.hasMoreElements()) {
                let win = windows.getNext();
                win.dispatchEvent(new CustomEvent("MoveReloadIntoUrlUnload"));
            }
        },
        reloadBtnAttr: function (e) {
            let doc = e ? e.target.ownerDocument : document;
            btn = doc.getElementById('new-stop-reload-button');
            if (btn && (!e || e.attrName == 'displaystop')) {
                var newVal = e ? e.newValue : doc.getElementById(
                    "reload-button").getAttribute('displaystop');
                if (newVal)
                    btn.style.listStyleImage = "url('data:image/svg+xml;base64,PCEtLSBUaGlzIFNvdXJjZSBDb2RlIEZvcm0gaXMgc3ViamVjdCB0byB0aGUgdGVybXMgb2YgdGhlIE1vemlsbGEgUHVibGljCiAgIC0gTGljZW5zZSwgdi4gMi4wLiBJZiBhIGNvcHkgb2YgdGhlIE1QTCB3YXMgbm90IGRpc3RyaWJ1dGVkIHdpdGggdGhpcwogICAtIGZpbGUsIFlvdSBjYW4gb2J0YWluIG9uZSBhdCBodHRwOi8vbW96aWxsYS5vcmcvTVBMLzIuMC8uIC0tPgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDE2IDE2IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGZpbGw9IiMwMDhjMjMiIGZpbGwtb3BhY2l0eT0iMS4wIiBzdHJva2U9IiMwMDhjMjMiIHN0cm9rZS13aWR0aD0iMS41Ij4KICA8cGF0aCBkPSJtOS4xMDggNy43NzYgNC43MDktNC43MDlhLjYyNi42MjYgMCAwIDAtLjg4NC0uODg1TDguMjQ0IDYuODcxbC0uNDg4IDAtNC42ODktNC42ODhhLjYyNS42MjUgMCAxIDAtLjg4NC44ODVMNi44NyA3Ljc1NGwwIC40OTEtNC42ODcgNC42ODdhLjYyNi42MjYgMCAwIDAgLjg4NC44ODVMNy43NTQgOS4xM2wuNDkxIDAgNC42ODcgNC42ODdhLjYyNy42MjcgMCAwIDAgLjg4NSAwIC42MjYuNjI2IDAgMCAwIDAtLjg4NUw5LjEwOCA4LjIyM2wwLS40NDd6Ii8+Cjwvc3ZnPgo=')";
                else
                    btn.style.listStyleImage = "url('data:image/svg+xml;base64,PCEtLSBUaGlzIFNvdXJjZSBDb2RlIEZvcm0gaXMgc3ViamVjdCB0byB0aGUgdGVybXMgb2YgdGhlIE1vemlsbGEgUHVibGljCiAgIC0gTGljZW5zZSwgdi4gMi4wLiBJZiBhIGNvcHkgb2YgdGhlIE1QTCB3YXMgbm90IGRpc3RyaWJ1dGVkIHdpdGggdGhpcwogICAtIGZpbGUsIFlvdSBjYW4gb2J0YWluIG9uZSBhdCBodHRwOi8vbW96aWxsYS5vcmcvTVBMLzIuMC8uIC0tPgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDE2IDE2IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGZpbGw9IiNkOTAwMDAiIGZpbGwtb3BhY2l0eT0iMS4wIiBzdHJva2U9IiNkOTAwMDAiIHN0cm9rZS13aWR0aD0iMSIgPgogIDxwYXRoIGQ9Ik0xMC43MDcgNiAxNC43IDZsLjMtLjMgMC0zLjk5M2EuNS41IDAgMCAwLS44NTQtLjM1NGwtMS40NTkgMS40NTlBNi45NSA2Ljk1IDAgMCAwIDggMUM0LjE0MSAxIDEgNC4xNDEgMSA4czMuMTQxIDcgNyA3YTYuOTcgNi45NyAwIDAgMCA2Ljk2OC02LjMyMi42MjYuNjI2IDAgMCAwLS41NjItLjY4Mi42MzUuNjM1IDAgMCAwLS42ODIuNTYyQTUuNzI2IDUuNzI2IDAgMCAxIDggMTMuNzVjLTMuMTcxIDAtNS43NS0yLjU3OS01Ljc1LTUuNzVTNC44MjkgMi4yNSA4IDIuMjVhNS43MSA1LjcxIDAgMCAxIDMuODA1IDEuNDQ1bC0xLjQ1MSAxLjQ1MWEuNS41IDAgMCAwIC4zNTMuODU0eiIvPgo8L3N2Zz4K')";
            }
        },
    }

    function $C(aDoc, tag, attrs, skipAttrs) {
        let d = (aDoc || document);
        attrs = attrs || {};
        skipAttrs = skipAttrs || [];
        var el = "createXULElement" in d ? d.createXULElement(tag) : d.createElement(tag);
        return $A(el, attrs, skipAttrs);
    }

    function $A(el, obj, skipAttrs) {
        skipAttrs = skipAttrs || [];
        if (obj) Object.keys(obj).forEach(function (key) {
            if (!skipAttrs.includes(key)) {
                if (typeof obj[key] === 'function') {
                    el.setAttribute(key, "(" + obj[key].toString() + ").call(this, event);");
                } else {
                    el.setAttribute(key, obj[key]);
                }
            }
        });
        return el;
    }

    "canLoadToolbarContentPromise" in PlacesUIUtils ? PlacesUIUtils.canLoadToolbarContentPromise.then(_ => moveReloadIntoURL.init()) : moveReloadIntoURL.init();
})();