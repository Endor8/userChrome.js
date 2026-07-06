// ==UserScript==
// @name           TabMoveOnly.uc.js
// @namespace      local
// @description    Nur das Verschieben von Tabs per Drag & Drop
// @include        main
// @compatibility  Firefox152+
// @version        2026-07-05
// ==/UserScript==
"use strict";

TabMoveOnly();

function TabMoveOnly() {
  if (!window.gBrowser) return;

  const TAB_DROP_TYPE = window.TAB_DROP_TYPE || "application/x-moz-tabbrowser-tab";

  // =========================================================
  // FEINEINSTELLUNGEN FÜR DIE MARKER
  // =========================================================
  // Links: Marker horizontal verschieben in px
  const LEFT_MARKER_SHIFT = 0;

  // Rechts: Marker horizontal verschieben in px
  const RIGHT_MARKER_SHIFT = 0;

  // Marker vertikal leicht nach oben/unten korrigieren in px
  const MARKER_TOP = -1;

  // =========================================================
  // MARKER-CSS
  // =========================================================
  const css = `
.tabbrowser-tab[dnd-marker]{
  position: relative !important;
}

.tab-dnd-marker{
  position: absolute !important;
  pointer-events: none !important;
  z-index: 1000 !important;
  content: "" !important;
  width: 14px !important;
  height: 18px !important;
  border-radius: 50% !important;
  background:
    radial-gradient(circle at center,
    #00ffff 0 35%,
    #1dacd6 36% 60%,
    rgba(255,255,255,0) 61%) !important;
  box-shadow: 0 0 3px rgba(255, 90, 82, 0.35) !important;
}
`;

  // =========================================================
  // CSS EINBINDEN
  // =========================================================
  const sss = Cc["@mozilla.org/content/style-sheet-service;1"]
    .getService(Ci.nsIStyleSheetService);

  const uri = Services.io.newURI(
    "data:text/css;charset=UTF-8," + encodeURIComponent(css)
  );

  if (!sss.sheetRegistered(uri, sss.USER_SHEET)) {
    sss.loadAndRegisterSheet(uri, sss.USER_SHEET);
  }

  const tabContainer = gBrowser.tabContainer;

  // Listener nur einmal aktivieren
  let listenersActive = false;

  // Reserviert für Gruppen-/Drop-Zustand
  let lastGroupStart = null;
  let lastGroupEnd = null;

  // =========================================================
  // MARKER-VERWALTUNG
  // =========================================================

  function clearDndMarkers() {
    for (const tab of gBrowser.tabs) {
      tab.removeAttribute("dnd-marker");
      tab.style.removeProperty("--tab-dnd-marker-top");

      if (tab._dndMarkerEl) {
        tab._dndMarkerEl.remove();
        tab._dndMarkerEl = null;
      }
    }
  }

  function setDndMarker(tab, side) {
    clearDndMarkers();
    if (!tab || !side) return;

    // Nur zur Erkennung / CSS-Selektoren
    tab.setAttribute("dnd-marker", side);

    // Vertikale Feinkorrektur als Variable direkt am Tab
    tab.style.setProperty("--tab-dnd-marker-top", `${MARKER_TOP}px`);

    // Echtes Marker-Element, damit dein CSS sicher greift
    const marker = tab.ownerDocument.createXULElement("box");
    marker.className = `tab-dnd-marker ${side}`;

    // Horizontale Feineinstellung pro Seite
    if (side === "left") {
      marker.style.setProperty("left", `${1 + LEFT_MARKER_SHIFT}px`, "important");
    } else if (side === "right") {
      marker.style.setProperty("right", `${1 + RIGHT_MARKER_SHIFT}px`, "important");
    }

    tab.appendChild(marker);
    tab._dndMarkerEl = marker;
  }

  // =========================================================
  // HILFSFUNKTIONEN FÜR TAB / DROP
  // =========================================================

  function getTabFromEventTarget(event, ignoreTabSides = false) {
    let { target } = event;
    if (!target) return null;

    if (target.nodeType !== Node.ELEMENT_NODE) {
      target = target.parentElement;
    }

    let tab = target?.closest("tab") || target?.closest("tab-group");
    const selectedTab = gBrowser.selectedTab;

    // Falls der Cursor nur im Randbereich ist, nimm den aktuell ausgewählten Tab
    if (tab && ignoreTabSides) {
      const { width, height } = tab.getBoundingClientRect();
      if (
        event.screenX < tab.screenX + width * 0.25 ||
        event.screenX > tab.screenX + width * 0.75 ||
        ((event.screenY < tab.screenY + height * 0.25 ||
          event.screenY > tab.screenY + height * 0.75) &&
          gBrowser.tabContainer.verticalMode)
      ) {
        return selectedTab;
      }
    }

    return tab;
  }

  // Firefox-interne Drop-Index-Berechnung für Multirow / normales Tab-Layout
  gBrowser.tabContainer._getDropIndex = function (event) {
    let tabToDropAt = getTabFromEventTarget(event, false);

    if (tabToDropAt?.localName == "tab-group") {
      tabToDropAt = tabToDropAt.previousSibling;
      if (!tabToDropAt) {
        tabToDropAt = gBrowser.visibleTabs[0];
      }
    }

    if (!tabToDropAt) {
      tabToDropAt = gBrowser.visibleTabs[gBrowser.visibleTabs.length - 1];
    }

    if (!tabToDropAt) return null;

    const tabPos = gBrowser.tabContainer.getIndexOfItem(tabToDropAt);
    const rect = tabToDropAt.getBoundingClientRect();
    const ltr = window.getComputedStyle(this).direction == "ltr";

    if (ltr) {
      return event.clientX < rect.x + rect.width / 2 ? tabPos : tabPos + 1;
    }
    return event.clientX > rect.x + rect.width / 2 ? tabPos : tabPos + 1;
  };

  // Prüft, ob der Drag wirklich ein Tab-Drag ist
  function orig_getDropEffectForTabDrag(event) {
    const dt = event.dataTransfer;

    let isMovingTabs = dt.mozItemCount > 0;
    for (let i = 0; i < dt.mozItemCount; i++) {
      const types = dt.mozTypesAt(0);
      if (types[0] != TAB_DROP_TYPE) {
        isMovingTabs = false;
        break;
      }
    }

    if (isMovingTabs) {
      const sourceNode = dt.mozGetDataAt(TAB_DROP_TYPE, 0);
      if (
        XULElement.isInstance(sourceNode) &&
        sourceNode.localName == "tab" &&
        sourceNode.documentGlobal.isChromeWindow &&
        sourceNode.ownerDocument.documentElement.getAttribute("windowtype") == "navigator:browser" &&
        sourceNode.documentGlobal.gBrowser.tabContainer == sourceNode.container
      ) {
        if (
          PrivateBrowsingUtils.isWindowPrivate(window) !=
          PrivateBrowsingUtils.isWindowPrivate(sourceNode.documentGlobal)
        ) {
          return "none";
        }

        if (window.gMultiProcessBrowser != sourceNode.documentGlobal.gMultiProcessBrowser) return "none";
        if (window.gFissionBrowser != sourceNode.documentGlobal.gFissionBrowser) return "none";

        return dt.dropEffect == "copy" ? "copy" : "move";
      }
    }

    if (Services.droppedLinkHandler.canDropLink(event, true)) return "link";
    return "none";
  }

  function getMarkerInfo(event) {
    let tabToDropAt = getTabFromEventTarget(event, false);

    if (tabToDropAt?.localName == "tab-group") {
      tabToDropAt = tabToDropAt.previousSibling;
      if (!tabToDropAt) {
        tabToDropAt = gBrowser.visibleTabs[0];
      }
    }

    if (!tabToDropAt) {
      const lastTab = gBrowser.visibleTabs[gBrowser.visibleTabs.length - 1];
      return { tab: lastTab, side: "right" };
    }

    const rect = tabToDropAt.getBoundingClientRect();
    const ltr = window.getComputedStyle(gBrowser.tabContainer).direction == "ltr";

    const side = ltr
      ? (event.clientX < rect.x + rect.width / 2 ? "left" : "right")
      : (event.clientX > rect.x + rect.width / 2 ? "left" : "right");

    return { tab: tabToDropAt, side };
  }

  // =========================================================
  // DRAG OVER
  // =========================================================
  function performTabDragOver(event) {
    const effects = orig_getDropEffectForTabDrag(event);

    // Nur echte Tab-Drags zulassen
    if (effects == "none" || effects == "link") {
      clearDndMarkers();
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const tab = getTabFromEventTarget(event, true);

    // Kleine Starthilfe für Gruppen-Merker
    if (tab && tab.nodeName == "tab-group" && !lastGroupStart) {
      const first = tab.querySelector("tab:first-of-type");
      const last = tab.querySelector("tab:last-of-type");
      if (first && last) {
        lastGroupStart = first._tPos;
        lastGroupEnd = last._tPos;
      }
    }

    const newIndex = gBrowser.tabContainer._getDropIndex(event);
    if (newIndex == null) {
      clearDndMarkers();
      return;
    }

    const markerInfo = getMarkerInfo(event);
    setDndMarker(markerInfo.tab, markerInfo.side);
  }

  // =========================================================
  // DROP
  // =========================================================
  function performTabDropEvent(event) {
    clearDndMarkers();

    const dt = event.dataTransfer;
    const dropEffect = dt.dropEffect;
    let draggedTab;

    if (dt.mozTypesAt(0)[0] == TAB_DROP_TYPE) {
      draggedTab = dt.mozGetDataAt(TAB_DROP_TYPE, 0);
      if (!draggedTab) return;
    }

    if (draggedTab && dropEffect != "copy" && draggedTab.container == gBrowser.tabContainer) {
      let newIndex = gBrowser.tabContainer._getDropIndex(event);
      if (newIndex == null) return;

      const selectedTabs = gBrowser.selectedTabs.length > 1 ? gBrowser.selectedTabs : [draggedTab];
      let tabToMoveAt = gBrowser.tabContainer.getItemAtIndex(newIndex);
      const tab = getTabFromEventTarget(event, false);
      const tabgroup = tab?.closest("tab-group");

      if (!tab) {
        newIndex = gBrowser.tabs.length;
        tabToMoveAt = null;
      }

      if (tabgroup && !tab.previousSibling) {
        newIndex = 0;
        selectedTabs.forEach(t => {
          gBrowser.moveTabTo(t, { tabIndex: newIndex++, forceUngrouped: true });
        });
      } else if (
        !tab ||
        (!tabgroup && !tabToMoveAt?.group) ||
        (tabgroup && tabToMoveAt?.group)
      ) {
        selectedTabs.forEach(t => {
          gBrowser.moveTabBefore(t, tabToMoveAt);
        });
      } else {
        tabToMoveAt = gBrowser.tabContainer.getItemAtIndex(newIndex - 1);
        selectedTabs.forEach(t => {
          gBrowser.moveTabAfter(t, tabToMoveAt);
        });
      }

      lastGroupStart = null;
      lastGroupEnd = null;
    }
  }

  // =========================================================
  // EINMALIGE INITIALISIERUNG
  // =========================================================
  tabContainer.addEventListener("dragstart", () => {
    if (listenersActive) return;

    tabContainer.on_dragover = e => performTabDragOver(e);
    tabContainer._onDragOver = e => performTabDragOver(e);
    tabContainer.ondrop = e => performTabDropEvent(e);

    tabContainer.addEventListener("dragend", clearDndMarkers, true);
    tabContainer.addEventListener("drop", clearDndMarkers, true);

    listenersActive = true;
  });
}
