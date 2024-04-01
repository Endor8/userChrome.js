// ==UserScript==
// @name            addToolbarInsideLocationBar.uc.js
// @description     Symbolleiste in Adressleiste einfügen
// @license         MIT License
// @compatibility   Firefox 123
// @version         0.0.2
// @charset         UTF-8
// @include         chrome://browser/content/browser.xul
// @include         chrome://browser/content/browser.xhtml
// @homepageURL     https://github.com/benzBrake/FirefoxCustomize/tree/master/userChromeJS
// @note            Aus Statusleistenskript des Floorp-Browsers entwickelt
// ==/UserScript==
(function (css) {
    const Services = globalThis.Services || Cu.import("resource://gre/modules/Services.jsm").Services;
    const MENU_LABEL = "Symbolleiste-Urlbar";

    window.LocationBar = {
        delayedInit: function () {
            if (typeof Tabmix !== "undefined") {
                Tabmix._deferredInitialized.promise.then(() => {
                    this.init();
                })
            } else {
                this.init();
            }
        },
        init: function () {
            const toolbarElem = window.MozXULElement.parseXULToFragment(
                `
            <toolbar id="location-bar" customizable="true"
                class="browser-toolbar customization-target" mode="icons" context="toolbar-context-menu" align="center">
            </toolbar>
            `
            );

            //insert style
            const sss = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService);
            const style = {
                url: Services.io.newURI('data:text/css;charset=UTF-8,' + encodeURIComponent(css)),
                type: sss.AUTHOR_SHEET
            }
            sss.loadAndRegisterSheet(style.url, style.type);

            document.getElementById("navigator-toolbox").appendChild(toolbarElem);

            CustomizableUI.registerArea("location-bar", {
                type: CustomizableUI.TYPE_TOOLBAR
            });

            CustomizableUI.registerToolbarNode(document.getElementById("location-bar"));

            //move elem into urlbar
            document.getElementById("page-action-buttons").after(document.getElementById("location-bar"));

            //menuitem for status bar
            let toggleItem = $C("menuitem", {
                id: "toggle_location-bar",
                label: MENU_LABEL,
                type: "checkbox",
                accesskey: "y",
                checked: String(Services.prefs.getBoolPref("browser.display.locationbar", false)),
                oncommand: "LocationBar.togglePref();",
            });
            document.getElementById("toolbarItemsMenuSeparator").after(toggleItem);

            let checked = Services.prefs.getBoolPref("browser.display.locationbar", false);
            document.getElementById("toggle_location-bar").setAttribute("checked", String(checked));
            if (checked) {
                this.show();
            } else {
                this.hide();
            }

            Services.prefs.addObserver("browser.display.locationbar", function () {
                let checked = Services.prefs.getBoolPref("browser.display.locationbar", false);
                document.getElementById("toggle_location-bar").setAttribute("checked", String(checked));
                if (checked) {
                    LocationBar.show();
                } else {
                    LocationBar.hide();
                }
            });
            window.addEventListener("beforecustomization", this, false);
            window.addEventListener("aftercustomization", this, false);
        },
        togglePref: function () {
            let checked = document.getElementById("toggle_location-bar").getAttribute("checked") == "true";
            Services.prefs.setBoolPref("browser.display.locationbar", checked);
        },
        show: function () {
            document.getElementById("location-bar").classList.remove("optional-hidden");
        },
        hide: function () {
            document.getElementById("location-bar").classList.add("optional-hidden");
        },
        handleEvent: function (event) {
            switch (event.type) {
                case "beforecustomization":
                    document.getElementById("nav-bar").appendChild(document.getElementById("location-bar"));
                    break;
                case "aftercustomization":
                    document.getElementById("page-action-buttons").after(document.getElementById("location-bar"));
                    break;
            }
        }
    }

    function $C(name, attr) {
        const appVersion = Services.appinfo.version.split(".")[0];
        attr || (attr = {});
        var el;
        if (appVersion >= 69) {
            el = document.createXULElement(name);
        } else {
            el = document.createElement(name);
        }
        if (attr) Object.keys(attr).forEach(function (n) {
            el.setAttribute(n, attr[n])
        });
        return el;
    }

    if (gBrowserInit.delayedStartupFinished) window.LocationBar.delayedInit();
    else {
        let delayedListener = (subject, topic) => {
            if (topic == "browser-delayed-startup-finished" && subject == window) {
                Services.obs.removeObserver(delayedListener, topic);
                window.LocationBar.delayedInit();
            }
        };
        Services.obs.addObserver(delayedListener, "browser-delayed-startup-finished");
    }
})(`
#urlbar-input-container .optional-hidden {
    visibility: collapse;
}
#urlbar-input-container #location-bar {
    background-color: transparent;
}
#urlbar-input-container > #location-bar .toolbarbutton-1:not([disabled="true"]):is([open], [checked], :hover:active) > .toolbarbutton-icon, #urlbar-input-container > #location-bar .toolbarbutton-1:not([disabled="true"]):is([open], [checked], :hover:active) > .toolbarbutton-text, #urlbar-input-container > #location-bar .toolbarbutton-1:not([disabled="true"]):is([open], [checked], :hover:active) > .toolbarbutton-badge-stack {
    background-color: transparent;
}
#urlbar-input-container > #location-bar .chromeclass-toolbar-additional {
    height: unset;
    width: unset;
}
#urlbar-input-container > #location-bar .toolbarbutton-1 {
    width: calc(var(--urlbar-min-height) - 2px - 2 * var(--urlbar-container-padding));
    height: calc(var(--urlbar-min-height) - 2px - 2 * var(--urlbar-container-padding));
    border-radius: var(--urlbar-icon-border-radius);
    padding: 0 var(--urlbar-icon-padding) !important;
    color: inherit;
}
#urlbar-input-container > #location-bar :where(#reload-button, #stop-button) > .toolbarbutton-icon {
    padding: var(--toolbarbutton-inner-padding) !important;
}
#urlbar-input-container > #location-bar .toolbarbutton-1:hover {
    background-color: var(--urlbar-box-hover-bgcolor);
    color: var(--urlbar-box-hover-text-color);
}
#urlbar-input-container > #location-bar .toolbarbutton-1:hover:active {
    background-color: var(--urlbar-box-active-bgcolor);
    color: var(--urlbar-box-hover-text-color);
}
#urlbar-input-container > #location-bar .toolbarbutton-1:not(#reload-button):not(#stop-button) > .toolbarbutton-icon {
    width: 16px !important;
    height: 16px !important;
    -moz-context-properties: fill, fill-opacity;
    fill: currentColor;
    fill-opacity: var(--urlbar-icon-fill-opacity);
    padding: 0 !important;
}
#urlbar-input-container #location-bar toolbarbutton {
    --toolbarbutton-hover-background: transparent;
}
:root[uidensity="compact"] #urlbar-input-container #location-bar toolbarbutton > .toolbarbutton-badge-stack > .toolbarbutton-badge {
    margin-inline-end: 0 !important;
}

#urlbar-input-container #location-bar #stop-reload-button[animate] > #reload-button > .toolbarbutton-icon, #urlbar-input-container #location-bar #stop-reload-button[animate] > #reload-button[displaystop] + #stop-button > .toolbarbutton-icon {
    fill: var(--urlbar-box-hover-text-color);
}
`)
