// ==UserScript==
// @name                LongPressCloseTab.uc.js
// @include             main
// @charset             UTF-8
// @note                längerer Klick auf eine geöffnete Website erstellt einen roten Button
// @note                Klick darauf schließt den Tab
// @version             1.0 Fx149+ 
// ==/UserScript==


(function () {
  "use strict";

  // =========================================================
  // [1] Kontextprüfung: nur im Firefox-Browserfenster laufen
  // =========================================================
  if (location.href !== "chrome://browser/content/browser.xhtml")
    return;

  if (!window.gBrowser || !document.getElementById("mainPopupSet"))
    return;

  // =========================================================
  // [2] Konfiguration
  // =========================================================
  const SCRIPT_NAME = "LongPressCloseTab.uc.js";
  const LONG_PRESS_TIME = 500;        // Mindestdauer für einen langen Klick in ms
  const PANEL_SIZE = 18;              // Größe des roten Buttons
  const PANEL_COLOR = "red";          // Farbe des Buttons
  const NSXUL = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";

  // =========================================================
  // [3] Bereits vorhandene Instanz entfernen
  // =========================================================
  const existingPanel = document.getElementById("close-tab-buttonPanel");
  if (existingPanel)
    existingPanel.remove();

  // =========================================================
  // [4] Hilfsobjekte und Statuswerte
  // =========================================================
  let downTime = 0;
  let downX = 0;
  let downY = 0;
  let boundBrowser = null;

  // =========================================================
  // [5] Panel erstellen
  // =========================================================
  const panel = document.createElementNS(NSXUL, "panel");
  panel.id = "close-tab-buttonPanel";
  panel.setAttribute("tooltiptext", "Tab schließen");
  panel.setAttribute("noautohide", "true");
  panel.setAttribute(
    "style",
    [
      "width:" + PANEL_SIZE + "px",
      "height:" + PANEL_SIZE + "px",
      "min-width:" + PANEL_SIZE + "px",
      "min-height:" + PANEL_SIZE + "px",
      "background:" + PANEL_COLOR,
      "border:none",
      "padding:0",
      "margin:0"
    ].join(";") + ";"
  );

  panel.addEventListener("click", function (event) {
    if (event.button !== 0)
      return;

    if (gBrowser && gBrowser.selectedTab)
      gBrowser.removeTab(gBrowser.selectedTab);

    this.hidePopup();
  }, false);

  document.getElementById("mainPopupSet").appendChild(panel);

  // =========================================================
  // [6] Maus-Handling: Long-Press erkennen
  // =========================================================
  function onMouseDown(event) {
    downTime = Date.now();
    downX = event.screenX;
    downY = event.screenY;
  }

  function onMouseUp(event) {
    const upTime = Date.now();

    const isLongPress = (upTime - downTime) >= LONG_PRESS_TIME;
    const isSamePosition = (downX === event.screenX) && (downY === event.screenY);

    if (isLongPress && isSamePosition) {
      panel.openPopupAtScreen(
        downX - PANEL_SIZE / 2,
        downY - PANEL_SIZE / 2,
        false
      );
    }
  }

  // =========================================================
  // [7] Browser-Bindung: Events an den aktiven Tab binden
  // =========================================================
  function bindBrowser(browser) {
    if (!browser)
      return;

    browser.addEventListener("mousedown", onMouseDown, true);
    browser.addEventListener("mouseup", onMouseUp, true);
    boundBrowser = browser;
  }

  function unbindBrowser(browser) {
    if (!browser)
      return;

    browser.removeEventListener("mousedown", onMouseDown, true);
    browser.removeEventListener("mouseup", onMouseUp, true);
  }

  function refreshBrowserBinding() {
    const browser = gBrowser.selectedBrowser;

    if (browser === boundBrowser)
      return;

    unbindBrowser(boundBrowser);
    bindBrowser(browser);
  }

  // =========================================================
  // [8] Initialisierung
  // =========================================================
  bindBrowser(gBrowser.selectedBrowser);
  gBrowser.tabContainer.addEventListener("TabSelect", refreshBrowserBinding, false);

  // =========================================================
  // [9] Aufräumen beim Beenden
  // =========================================================
  window.addEventListener("unload", function () {
    unbindBrowser(boundBrowser);
    gBrowser.tabContainer.removeEventListener("TabSelect", refreshBrowserBinding, false);

    if (panel && panel.isConnected)
      panel.remove();
  }, { once: true });

})();