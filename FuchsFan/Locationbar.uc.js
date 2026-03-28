// ==UserScript==
// @name            LocationBar.uc.js
// @description     Symbolleiste in Adressleiste einfügen (+ Kontextmenü Toggle)
// @license         MIT License
// @compatibility   Firefox 148+
// @version         0.6.3-ff148-toggle-popupshowing-reliable
// @charset         UTF-8
// @include         chrome://browser/content/browser.xhtml
// @include         chrome://browser/content/browser.xul
// ==/UserScript==

(function (css) {
  const LB_MIN_WIDTH_PX = 120;

  const MAX_PLACE_REATTEMPTS = 30;
  const PLACE_REATTEMPT_DELAY = 300;

  const PREF_KEY = "browser.display.locationbar";
  const MENU_LABEL = "Symbolleiste-Urlbar anzeigen";
  const TOGGLE_MENUITEM_ID = "toggle_location-bar";

  const STANDARD_BUTTON_IDS = [
    "downloads-button",
    "library-button",
    "alltabs-button",
    "firefox-view-button",
    "fxa-toolbar-menu-button",
    "import-button",
    "ucjs_unified-extensions-button",
    "unified-extensions-button",
    "home-button",
    "stop-reload-button",
    "reload-button",
    "stop-button"
  ];

  function ensureStyleSheet(cssText) {
    const sss = Cc["@mozilla.org/content/style-sheet-service;1"].getService(
      Ci.nsIStyleSheetService
    );
    const styleUrl = Services.io.newURI(
      "data:text/css;charset=UTF-8," + encodeURIComponent(cssText)
    );

    try {
      const authorSheet = sss.AUTHOR_SHEET;
      if (typeof sss.sheetRegistered === "function") {
        try {
          if (sss.sheetRegistered(styleUrl, authorSheet)) return;
        } catch (e) {}
      }
      sss.loadAndRegisterSheet(styleUrl, authorSheet);
    } catch (e) {}
  }

  function getUrlbarContainer() {
    return (
      document.getElementById("urlbar-input-container") ||
      document.querySelector(".urlbar-input-container")
    );
  }

  function getOrCreateLocationBar() {
    let existing = document.getElementById("location-bar");
    if (existing) return existing;

    const frag = window.MozXULElement.parseXULToFragment(`
      <toolbar id="location-bar" customizable="true"
        class="browser-toolbar customization-target" mode="icons"
        context="toolbar-context-menu" align="center">
      </toolbar>
    `);

    document.getElementById("navigator-toolbox").appendChild(frag);
    return document.getElementById("location-bar");
  }

  function forceShowNode(node) {
    if (!node) return;
    try {
      node.classList.remove("optional-hidden");
    } catch (e) {}
    try {
      node.removeAttribute("collapsed");
    } catch (e) {}
  }

  function hideNode(node) {
    if (!node) return;
    try {
      node.classList.add("optional-hidden");
    } catch (e) {}
  }

  function applyLayout120(node) {
    if (!node) return;
    try {
      node.style.minWidth = LB_MIN_WIDTH_PX + "px";
    } catch (e) {}
    try {
      node.style.width = LB_MIN_WIDTH_PX + "px";
    } catch (e) {}
    try {
      node.style.flex = "0 0 " + LB_MIN_WIDTH_PX + "px";
    } catch (e) {}
    try {
      node.style.overflow = "visible";
    } catch (e) {}
    try {
      node.style.maxWidth = "none";
    } catch (e) {}
  }

  function getLocationBarEl() {
    return document.getElementById("location-bar");
  }

  function getPrefChecked() {
    try {
      return Services.prefs.getBoolPref(PREF_KEY, false);
    } catch (e) {
      return false;
    }
  }

  function setPrefChecked(checked) {
    try {
      Services.prefs.setBoolPref(PREF_KEY, !!checked);
    } catch (e) {}
  }

  function syncMenuChecked(menuItem) {
    if (!menuItem) return;

    const checked = !!getPrefChecked();

    try {
      menuItem.checked = checked;
    } catch (e) {}

    try {
      if (checked) menuItem.setAttribute("checked", "true");
      else menuItem.removeAttribute("checked");
    } catch (e) {}
  }

  function readMenuItemChecked(menuItem) {
    if (!menuItem) return null;

    try {
      if (menuItem.hasAttribute && menuItem.hasAttribute("checked")) {
        return menuItem.getAttribute("checked") === "true";
      }
    } catch (e) {}

    try {
      if (typeof menuItem.checked !== "undefined") return !!menuItem.checked;
    } catch (e) {}

    return null;
  }

  function fixLocationBarButtonsEvents() {
    const lb = getLocationBarEl();
    if (!lb) return;

    STANDARD_BUTTON_IDS.forEach((id) => {
      const btn = lb.querySelector("#" + id);
      if (!btn) return;
      if (btn.__locationbarFixed) return;
      btn.__locationbarFixed = true;

      btn.addEventListener(
        "mousedown",
        (ev) => {
          try {
            switch (id) {
              case "downloads-button":
                if (
                  typeof DownloadsIndicatorView !== "undefined" &&
                  typeof DownloadsIndicatorView.onCommand === "function"
                ) {
                  DownloadsIndicatorView.onCommand(ev);
                  ev.preventDefault();
                  ev.stopPropagation();
                  return;
                }
                break;

              case "library-button":
                if (
                  typeof PanelUI !== "undefined" &&
                  typeof PanelUI.showSubView === "function"
                ) {
                  PanelUI.showSubView(
                    "appMenu-libraryView",
                    document.getElementById("library-button"),
                    ev
                  );
                  ev.preventDefault();
                  ev.stopPropagation();
                  return;
                }
                break;

              case "home-button":
                if (typeof BrowserHome === "function") {
                  BrowserHome();
                  ev.preventDefault();
                  ev.stopPropagation();
                  return;
                }
                break;

              case "stop-reload-button":
              case "reload-button":
                if (gBrowser && gBrowser.selectedBrowser) {
                  if (
                    gBrowser.selectedBrowser.webProgress &&
                    gBrowser.selectedBrowser.webProgress.isLoadingDocument
                  ) {
                    if (typeof BrowserStop === "function") BrowserStop();
                  } else {
                    if (typeof BrowserReload === "function") BrowserReload();
                  }
                  ev.preventDefault();
                  ev.stopPropagation();
                  return;
                }
                break;
            }
          } catch (e) {}
        },
        true
      );
    });

    const scriptButtons = lb.querySelectorAll(
      'toolbarbutton[data-uc-script-button="1"]'
    );
    scriptButtons.forEach((btn) => {
      if (btn.__locationbarScriptFixed) return;
      btn.__locationbarScriptFixed = true;

      btn.addEventListener(
        "click",
        (ev) => {
          const oldClick = btn.onclick;
          if (typeof oldClick === "function") oldClick.call(btn, ev);
        },
        true
      );
    });
  }

  window.LocationBar = {
    __initialized: false,
    __customizing: false,

    delayedInit() {
      try {
        if (
          typeof Tabmix !== "undefined" &&
          Tabmix._deferredInitialized &&
          Tabmix._deferredInitialized.promise
        ) {
          Tabmix._deferredInitialized.promise.then(() => this.init());
          return;
        }
      } catch (e) {}
      this.init();
    },

    init() {
      if (this.__initialized) return;
      this.__initialized = true;

      ensureStyleSheet(css);
      this.locationBar = getOrCreateLocationBar();

      try {
        CustomizableUI.registerArea("location-bar", {
          type: CustomizableUI.TYPE_TOOLBAR
        });
      } catch (e) {}
      try {
        CustomizableUI.registerToolbarNode(this.locationBar);
      } catch (e) {}

      // Toggle: Pref Observer → show/hide (+ optional Haken-Sync)
      try {
        Services.prefs.addObserver(PREF_KEY, () => {
          const lb = getLocationBarEl();
          if (!lb) return;

          if (getPrefChecked()) {
            forceShowNode(lb);
            applyLayout120(lb);
          } else {
            hideNode(lb);
          }

          try {
            const mi = document.getElementById(TOGGLE_MENUITEM_ID);
            syncMenuChecked(mi);
          } catch (e) {}
        });
      } catch (e) {}

      // Toggle Menu Item zuverlässig bei jedem Öffnen hinzufügen/syncen
      try {
        const tcm = document.getElementById("toolbar-context-menu");
        if (tcm) {
          tcm.addEventListener(
            "popupshowing",
            () => {
              try {
                const lb = getLocationBarEl();

                // MenuItem im aktuell geöffneten Menü sicherstellen
                let menuItem = tcm.querySelector("#" + TOGGLE_MENUITEM_ID);

                if (!menuItem) {
                  const frag = window.MozXULElement.parseXULToFragment(`
                    <menuitem id="${TOGGLE_MENUITEM_ID}"
                      label="${MENU_LABEL}"
                      type="checkbox"
                      accesskey="L"
                      checked="false"/>
                  `);
                  menuItem = frag.firstChild;

                  const sep = tcm.querySelector("#viewToolbarsMenuSeparator");
                  if (sep) tcm.insertBefore(menuItem, sep);
                  else tcm.appendChild(menuItem);
                }

                // Handler einmalig (per Flag) anbringen
                if (!menuItem.__locationbarToggleHooked) {
                  menuItem.__locationbarToggleHooked = true;

                  menuItem.addEventListener(
                    "command",
                    () => {
                      setTimeout(() => {
                        try {
                          const newVal = !getPrefChecked();
                          setPrefChecked(newVal);

                          // sofort synken (Haken + Visibility)
                          syncMenuChecked(menuItem);

                          if (lb) {
                            if (newVal) {
                              forceShowNode(lb);
                              applyLayout120(lb);
                            } else {
                              hideNode(lb);
                            }
                          }
                        } catch (e) {}
                      }, 0);
                    },
                    true
                  );
                }

                // Status syncen
                syncMenuChecked(menuItem);

                // und LocationBar entsprechend zeigen/ausblenden
                if (lb) {
                  if (getPrefChecked()) {
                    forceShowNode(lb);
                    applyLayout120(lb);
                  } else {
                    hideNode(lb);
                  }
                }
              } catch (e) {}
            },
            false
          );
        }
      } catch (e) {}

      window.addEventListener("beforecustomization", this, false);
      window.addEventListener("aftercustomization", this, false);

      this.insertIntoUrlbar();
      this.startReattemptPlacementLoop();

      // Startzustand aus Pref setzen
      const lb = getLocationBarEl();
      if (lb) {
        if (getPrefChecked()) {
          forceShowNode(lb);
          applyLayout120(lb);
        } else {
          hideNode(lb);
        }
      }

      fixLocationBarButtonsEvents();
    },

    insertIntoUrlbar() {
      const lb = getLocationBarEl() || this.locationBar;
      if (!lb) return;

      const pageActions = document.getElementById("page-action-buttons");
      if (pageActions && pageActions.parentNode) {
        try {
          if (lb.parentNode) lb.parentNode.removeChild(lb);
        } catch (e) {}
        try {
          pageActions.after(lb);
        } catch (e) {}
      } else {
        const container = getUrlbarContainer();
        if (container) {
          try {
            if (lb.parentNode && lb.parentNode !== container) {
              lb.parentNode.removeChild(lb);
            }
          } catch (e) {}
          try {
            if (lb.parentNode !== container) container.appendChild(lb);
          } catch (e) {}
        }
      }

      if (getPrefChecked()) {
        forceShowNode(lb);
        applyLayout120(lb);
      } else {
        hideNode(lb);
      }

      fixLocationBarButtonsEvents();
    },

    startReattemptPlacementLoop() {
      let attempt = 0;

      const tick = () => {
        attempt++;

        if (!this.__customizing) {
          this.insertIntoUrlbar();
        } else {
          const lb = getLocationBarEl() || this.locationBar;
          if (lb) {
            if (getPrefChecked()) {
              forceShowNode(lb);
              applyLayout120(lb);
            } else {
              hideNode(lb);
            }
            fixLocationBarButtonsEvents();
          }
        }

        if (attempt >= MAX_PLACE_REATTEMPTS) return;
        setTimeout(tick, PLACE_REATTEMPT_DELAY);
      };

      setTimeout(tick, PLACE_REATTEMPT_DELAY);
    },

    handleEvent(event) {
      const lb = getLocationBarEl() || this.locationBar;
      if (!lb) return;

      switch (event.type) {
        case "beforecustomization": {
          this.__customizing = true;

          const navBar =
            document.getElementById("nav-bar") ||
            document.getElementById("navigator-toolbox");

          if (navBar) {
            try {
              if (lb.parentNode) lb.parentNode.removeChild(lb);
            } catch (e) {}
            try {
              navBar.appendChild(lb);
            } catch (e) {}
          }

          if (getPrefChecked()) {
            forceShowNode(lb);
            applyLayout120(lb);
          } else {
            hideNode(lb);
          }

          fixLocationBarButtonsEvents();
          break;
        }

        case "aftercustomization": {
          this.__customizing = false;
          this.insertIntoUrlbar();
          break;
        }
      }
    }
  };

  function startup() {
    window.LocationBar.delayedInit();
  }

  if (
    typeof gBrowserInit !== "undefined" &&
    gBrowserInit.delayedStartupFinished
  ) {
    startup();
  } else {
    let delayedListener = (subject, topic) => {
      if (
        topic === "browser-delayed-startup-finished" &&
        subject === window
      ) {
        Services.obs.removeObserver(delayedListener, topic);
        startup();
      }
    };
    Services.obs.addObserver(
      delayedListener,
      "browser-delayed-startup-finished"
    );
  }
})(`

:is(#urlbar-input-container,.urlbar-input-container) .optional-hidden {
  visibility: collapse;
}

:is(#urlbar-input-container,.urlbar-input-container) #location-bar {
  background-color: transparent /* lightyellow */;
  padding-left: 4px !important;
  padding-right: 0px !important;
  margin-right: -40px !important;
  min-width: auto !important;
}

:is(#urlbar-input-container,.urlbar-input-container) > #location-bar .chromeclass-toolbar-additional {
  height: unset;
  width: unset;
  margin-inline: 0px;
}

:is(#urlbar-input-container,.urlbar-input-container) > #location-bar .toolbarbutton-1 {
  width: calc(var(--urlbar-min-height) - 2px - 2 * var(--urlbar-container-padding));
  height: calc(var(--urlbar-min-height) - 2px - 2 * var(--urlbar-container-padding));
  border-radius: var(--urlbar-icon-border-radius);
  padding: 0 var(--urlbar-icon-padding) !important;
  color: inherit;
}

:is(#urlbar-input-container,.urlbar-input-container) > #location-bar :where(#reload-button, #stop-button) > .toolbarbutton-icon {
  padding: var(--toolbarbutton-inner-padding) !important;
}

:is(#urlbar-input-container,.urlbar-input-container) > #location-bar .toolbarbutton-1:hover {
  background-color: var(--urlbar-box-hover-bgcolor);
  color: var(--urlbar-box-hover-text-color);
}

:is(#urlbar-input-container,.urlbar-input-container) > #location-bar .toolbarbutton-1:hover:active {
  background-color: var(--urlbar-box-active-bgcolor);
  color: var(--urlbar-box-hover-text-color);
}

:is(#urlbar-input-container,.urlbar-input-container) > #location-bar .toolbarbutton-1:not(#reload-button):not(#stop-button) > .toolbarbutton-icon {
  width: 21px !important;
  height: 21px !important;
  -moz-context-properties: fill, fill-opacity;
  fill: currentColor;
  fill-opacity: var(--urlbar-icon-fill-opacity);
  padding: 3px !important;
}

:is(#urlbar-input-container,.urlbar-input-container) #location-bar toolbarbutton {
  --toolbarbutton-hover-background: transparent;
}

:root[uidensity="compact"] :is(#urlbar-input-container,.urlbar-input-container) #location-bar toolbarbutton > .toolbarbutton-badge-stack > .toolbarbutton-badge {
  margin-inline-end: 0 !important;
}

:is(#urlbar-input-container,.urlbar-input-container) #location-bar #stop-reload-button[animate] > #reload-button > .toolbarbutton-icon,
:is(#urlbar-input-container,.urlbar-input-container) #location-bar #stop-reload-button[animate] > #reload-button[displaystop] + #stop-button > .toolbarbutton-icon {
  fill: var(--urlbar-box-hover-text-color);
}

`);