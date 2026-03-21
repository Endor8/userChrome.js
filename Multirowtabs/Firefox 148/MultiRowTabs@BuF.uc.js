// 'MultiRowTabs@BuF.uc.js' – Logik-Version mit MultiRow + DnD + Emoji-Marker
// Styling (Farben, Tabhöhe, Breite, max. Zeilen) in userChrome.css

"use strict";

MultiRowTabs();

function MultiRowTabs() {
  if (!window.gBrowser) {
    return;
  }

  // ----------------------------
  // --- User-Settings: Start ---
  // ----------------------------

  // Position der Tab-Leiste:
  //
  // [1] Tab-Leiste ist oberhalb aller Symbolleisten
  // [2] Tab-Leiste ist unterhalb aller Symbolleisten, aber über dem Inhaltsbereich
  // [6] Tab-Leiste ist unterhalb des Inhaltsbereichs 
  var nTabbarPosition = 2;

  // MultiRow-Einstellungen (nur horizontale Positionen [1], [2], [6])
  // Die tatsächliche Zeilenanzahl wird ausschließlich über CSS (max-height) begrenzt.
  var nTabLines     = 3;      // Dokumentationswert; in userChrome.css via max-height nachziehen
  var bTabScrollbar = true;   // Scrollbar für Tab-Leiste anzeigen
  var bTabTooltips  = false;  // Tab-Tooltips (Tabvorschau) anzeigen?

  // Einstellungen für Maus-Bedienung
  var bTabWheel               = false; // Tab per Mausrad wechseln
  var bPageScroll             = true;  // seitenweises Scrollen (statt zeilenweise)
  var bDblclickOnTabbarNewTab = true;  // Doppelklick auf freie Tabbar -> neuer Tab
  var bDblclickOnTabReloadTab = true;  // Doppelklick auf Tab -> Reload

  // ----------------------------
  // --- User-Settings: Ende ---
  // ----------------------------    

  let strHomepageURL;
  try {
    strHomepageURL = Services.prefs.getCharPref("browser.startup.homepage");
  } catch (e) {
    console.log("Error Homepage-String loading...");
  }

  if (nTabbarPosition < 1 || (nTabbarPosition != 1 && nTabbarPosition != 2 && nTabbarPosition != 6)) {
    nTabbarPosition = 1;
  }

  // Tab-Leiste ganz unten 
  if (nTabbarPosition == 6) {
    let tabbarBoxBottom = document.createXULElement("vbox");
    tabbarBoxBottom.id = "tabbarboxbottom";

    document
      .getElementById("navigator-toolbox")
      .parentNode.insertBefore(tabbarBoxBottom, null);

    let tabbar = document.getElementById("TabsToolbar");
    tabbarBoxBottom.appendChild(tabbar);
  }

  // -------------------------------------------------------------
  // Grund-CSS für Slot-Layout & Scrollbar (keine Farben!)
  // -------------------------------------------------------------
  {
    let cssAgent = `
      /* Scrollbars in der Tabbar sollen nicht als Fenster-Drag-Bereich dienen */
      scrollbar,
      scrollcorner,
      scrollbar thumb,
      scrollbar scrollbarbutton {
        -moz-window-dragging: no-drag !important;
      }

      /* Slot-Inhalt (Tabs) direkt in den Flex-Container holen */
      scrollbox[smoothscroll="true"] > slot {
        display: contents !important;
      }
    `;

    let sss = Cc["@mozilla.org/content/style-sheet-service;1"].getService(
      Ci.nsIStyleSheetService
    );
    let uriAgent = makeURI(
      "data:text/css;charset=UTF=8," + encodeURIComponent(cssAgent)
    );
    if (!sss.sheetRegistered(uriAgent, sss.AGENT_SHEET)) {
      sss.loadAndRegisterSheet(uriAgent, sss.AGENT_SHEET);
    }
  }

  {
    // MultiRow-Layout: Wrap, keine Pfeile, „Alle Tabs“-Button entfernen
    let cssAuthor = `
      #tabbrowser-tabs {
        --tab-overflow-pinned-tabs-width: 0px !important;
      }
      
      #alltabs-button,
      hbox.titlebar-spacer,
      #tabbrowser-arrowscrollbox::part(scrollbutton-up), 
      #tabbrowser-arrowscrollbox::part(scrollbutton-down),
      #tabbrowser-arrowscrollbox::part(overflow-start-indicator), 
      #tabbrowser-arrowscrollbox::part(overflow-end-indicator) {
        display: none !important;
      }
      
      tabs > arrowscrollbox::part(scrollbox) {
        flex-wrap: wrap !important;
        overflow-x: hidden !important;
        overflow-y: ${bTabScrollbar ? "auto" : "hidden"} !important;
      }
    `;

    let sss = Cc["@mozilla.org/content/style-sheet-service;1"].getService(
      Ci.nsIStyleSheetService
    );
    let uriAuthor = makeURI(
      "data:text/css;charset=UTF=8," + encodeURIComponent(cssAuthor)
    );
    if (!sss.sheetRegistered(uriAuthor, sss.AUTHOR_SHEET)) {
      sss.loadAndRegisterSheet(uriAuthor, sss.AUTHOR_SHEET);
    }
  }

  // Tab-Leiste unterhalb der Symbolleisten (Position 2)
  if (nTabbarPosition == 2) {
    let tabbar = document.getElementById("TabsToolbar");
    tabbar.parentNode.appendChild(tabbar);
  }

  //------------------------------------------------------------------------------------------

  var tabsToolbar   = document.getElementById("TabsToolbar");
  var tabsscrollbox = document.getElementById("tabbrowser-arrowscrollbox");
  var ScrollBox     = tabsscrollbox.scrollbox;    

  // ----------------------------------
  // Load-Event: MultiRow aktivieren (keine Höhenberechnung mehr)
  // ----------------------------------
  function onReady() {
    console.log("MultiRowTabs OnReady");
    // Auswahl sichtbar halten
    gBrowser.selectedTab.scrollIntoView();
  }    
    
  if (document.readyState !== "loading") {
    setTimeout(onReady, 500); 
  } else {
    window.addEventListener("DOMContentLoaded", onReady);
  }

  // ----------------------------------
  // ToggleMenuObserver (Menüleiste ein/aus) – nur für Position 2/6
  // ----------------------------------
  if (nTabbarPosition == 2 || nTabbarPosition == 6) {
    let targetMenubar = document.getElementById("toolbar-menubar");
    let titlebar      = document.querySelector("#navigator-toolbox>vbox#titlebar");

    const callback = (mutationList, observer) => {
      for (const mutation of mutationList) {
        if (mutation.type === "attributes") {
          let bInactive = targetMenubar.getAttribute("inactive");
          if (bInactive == "true") {
            titlebar.style.display = "none";
          } else {
            titlebar.style.display = "initial";
          }
        }
      }
    };
    
    let observerToggleMenu = new MutationObserver(callback);
    let configObserver = {
      attributes: true,
      attributeFilter: ["autohide","inactive"]
    };
    observerToggleMenu.observe(targetMenubar, configObserver);    
  }

  // ----------------------------------
  // Middleclick auf Tab -> Close Tab
  // ----------------------------------
  gBrowser.tabContainer.addEventListener(
    "click",
    function(event) {
      if (event.button == 1) {
        let element = event.target.parentNode;
        while (element) {
          if (element.localName == "tab") {
            gBrowser.removeTab(element, { animate: false });
            event.preventDefault();
            event.stopPropagation();    
            return;
          }
          element = element.parentNode;
        }
      }
    },
    true
  );

  // ----------------------------------
  // Middleclick auf TabsToolbar -> New Tab
  // ----------------------------------
  tabsToolbar.addEventListener(
    "click",
    function(event) {
      if (event.button == 1) {
        if (event.target.parentNode.id == "TabsToolbar") { 
          if (strHomepageURL) {
            event.target.ownerGlobal.openTrustedLinkIn(strHomepageURL,"tab");
          } else {
            BrowserOpenTab();
          }
          return;
        }
      }
    },
    true
  );

  // ----------------------------------
  // Doubleclick auf TabsToolbar -> New Tab
  // ----------------------------------
  tabsToolbar.addEventListener(
    "dblclick",
    function(event) {
      if (!bDblclickOnTabbarNewTab) return;
      if (event.button == 0) {
        if (event.target.parentNode.id == "TabsToolbar") {
          if (strHomepageURL) {
            event.target.ownerGlobal.openTrustedLinkIn(strHomepageURL,"tab");
          } else {
            BrowserOpenTab();
          }
          event.preventDefault();
          event.stopPropagation();    
          return;
        }
      }
    },
    true
  );
        
  // ----------------------------------
  // Doubleclick auf leeren Bereich in TabContainer -> New Tab
  // ----------------------------------
  gBrowser.tabContainer.addEventListener(
    "dblclick",
    function(event) {
      if (!bDblclickOnTabbarNewTab) return;
      if (event.button == 0) {
        let element = event.target.parentNode;
        if (element == gBrowser.tabContainer) {
          if (strHomepageURL) {
            event.target.ownerGlobal.openTrustedLinkIn(strHomepageURL,"tab");
          } else {
            BrowserOpenTab();
          }
          event.preventDefault();
          event.stopPropagation();    
          return;
        }
      }
    },
    true
  );
    
  // ----------------------------------
  // Doubleclick auf Tab -> Reload Tab
  // ----------------------------------
  gBrowser.tabContainer.addEventListener(
    "dblclick",
    function(event) {
      if (!bDblclickOnTabReloadTab) return;
      if (event.button == 0) {
        let element = event.target.parentNode;
        while (element) {
          if (element.localName == "tab") {
            element.linkedBrowser.reload();
            return;
          }
          element = element.parentNode;
        }
      }
    },
    true
  );

  // ----------------------------------
  // TabSelect -> Tab in Sicht bekommen
  // ----------------------------------
  gBrowser.tabContainer.addEventListener(
    "TabSelect",
    function(event) {
      let bScroll    = false;
      let bScrollTop = true;
                
      let scrollBoxY1     = event.target.parentElement.scrollbox.screenY;
      let scrollBoxHeight = event.target.parentElement.scrollbox.clientHeight;
      let scrollBoxY2     = scrollBoxY1 + scrollBoxHeight;
        
      let TabSelY1     = event.target.screenY;
      let TabSelHeight = event.target.clientHeight;
      let TabSelY2     = TabSelY1 + TabSelHeight;
        
      if (TabSelY2 > scrollBoxY2) {
        bScroll    = true;
        bScrollTop = false;
      }
      if (TabSelY1 < scrollBoxY1) {
        bScroll    = true;
        bScrollTop = true;
      }
        
      if (bScroll) {
        setTimeout(function() {
          event.target.scrollIntoView(bScrollTop);
        }, 0);
      }
    },
    true
  );
      
  // ----------------------------------
  // Wheel-Event über Tab-Leiste  
  // ----------------------------------
  let tabsScrollbox2 = document.getElementById(
    "tabbrowser-arrowscrollbox"
  ).scrollbox;

  tabsScrollbox2.addEventListener(
    "wheel",
    function(event) {
      event.preventDefault();
      event.stopPropagation();
        
      let scrollUp    = true;
      let wrap        = false;
      let scrollBoxY1 =
        gBrowser.tabContainer._animateElement.scrollbox.scrollTop; 
      let scrollHeight;
        
      if (bPageScroll) {
        scrollHeight =
          gBrowser.tabContainer._animateElement.scrollbox.clientHeight;
      } else {            
        let firstTab = gBrowser.visibleTabs[0];
        let h = firstTab ? firstTab.getBoundingClientRect().height : 24;
        scrollHeight = h;
      }
        
      let dir = (scrollUp ? 1 : -1) * Math.sign(event.deltaY);
      let bLastScrollLine = false; 
        
      if (
        gBrowser.tabContainer._animateElement.scrollbox.scrollTopMax ==
        gBrowser.tabContainer._animateElement.scrollbox.scrollTop
      ) {
        bLastScrollLine = true;
      }        

      if (
        !bTabWheel ||
        event.ctrlKey ||
        event.originalTarget.localName == "thumb"  ||
        event.originalTarget.localName == "slider" ||
        event.originalTarget.localName == "scrollbarbutton"
      ) {
        setTimeout(function() {
          let scrollBoxMod = scrollBoxY1 % scrollHeight;
          if (scrollBoxMod > 0) {
            if (dir == -1) {
              scrollBoxY1 -= scrollBoxMod;
              if (scrollBoxMod < scrollHeight && !bLastScrollLine) {
                scrollBoxY1 -= scrollHeight;
              }
            } else {
              scrollBoxY1 += scrollHeight - scrollBoxMod;
              if (scrollHeight - scrollBoxMod < scrollHeight) {
                scrollBoxY1 += scrollHeight;
              }
            }
          } else {
            if (dir == -1) {
              scrollBoxY1 -= scrollHeight;
            } else {
              scrollBoxY1 += scrollHeight;
            }
          }
          gBrowser.tabContainer._animateElement.scrollbox.scrollTo({
            top: scrollBoxY1,
            left: 0,
            behavior: "auto"
          }); 
        }, 20);
      }

      if (bTabWheel && !event.ctrlKey) {
        setTimeout(function() {
          if (
            event.originalTarget.localName != "slider" &&
            event.originalTarget.localName != "thumb"  &&
            event.originalTarget.localName != "scrollbarbutton"
          ) {
            gBrowser.tabContainer.advanceSelectedTab(dir, wrap);
            if (
              gBrowser.tabContainer._firstTab == gBrowser.selectedTab ||
              gBrowser.tabContainer._lastTab  == gBrowser.selectedTab
            ) {
              gBrowser.selectedTab.scrollIntoView(); 
            }
          }    
        }, 50);
      }
    },
    false
  );

  //-------------------------------------------------------------------------------------------
  // Drag & Drop – Multirow-fähig, mit Emoji-Einfüge-Marker
  //-------------------------------------------------------------------------------------------

  // Einfüge-Markierung vorbereiten: Attribut "dnd-marker" statt Border
  if (!gBrowser.tabContainer.clearDropIndicator) {
    gBrowser.tabContainer.clearDropIndicator = function() {
      for (let tab of this.allTabs) {
        tab.removeAttribute("dnd-marker");
      }
    };

    gBrowser.tabContainer.addEventListener(
      "dragleave",
      function () {
        this.clearDropIndicator();
      },
      true
    );
  }

  // _getDropIndex: ermittelt die Zielposition für den Drop
  gBrowser.tabContainer._getDropIndex = function(event) {
    let tabToDropAt = getTabFromEventTarget(event, false);

    if (tabToDropAt?.localName == "tab-group") {
      tabToDropAt = tabToDropAt.previousSibling;
      if (!tabToDropAt) {
        tabToDropAt = gBrowser.visibleTabs[0];
      }
    }

    if (!tabToDropAt) {
      tabToDropAt =
        gBrowser.visibleTabs[gBrowser.visibleTabs.length - 1];
    }

    const tabPos = gBrowser.tabContainer.getIndexOfItem(tabToDropAt);

    if (window.getComputedStyle(this).direction == "ltr") {
      let rect = tabToDropAt.getBoundingClientRect();
      if (event.clientX < rect.x + rect.width / 2) {
        return tabPos;
      }
      return tabPos + 1;
    }

    let rect = tabToDropAt.getBoundingClientRect();
    if (event.clientX > rect.x + rect.width / 2) {
      return tabPos;
    }
    return tabPos + 1;
  };

  let listenersActive = false;

  gBrowser.tabContainer.addEventListener("dragstart", () => {
    gBrowser.visibleTabs.forEach(t => (t.style.transform = ""));

    if (!listenersActive) {
      gBrowser.tabContainer.getDropEffectForTabDrag = function() {};
      gBrowser.tabContainer._getDropEffectForTabDrag = function() {};

      gBrowser.tabContainer.on_dragover  = dragoverEvent => performTabDragOver(dragoverEvent);
      gBrowser.tabContainer._onDragOver  = dragoverEvent => performTabDragOver(dragoverEvent);
      gBrowser.tabContainer.ondrop       = dropEvent    => performTabDropEvent(dropEvent);

      listenersActive = true;
    }
  });
} // Ende MultiRowTabs()

// -----------------------------------------------------------------------------
// Globale Hilfsfunktionen für Drag&Drop (mit Emoji-Einfüge-Marker)
// -----------------------------------------------------------------------------

var lastKnownIndex = null;
var lastGroupStart = null;
var lastGroupEnd   = null;

function getTabFromEventTarget(event, ignoreTabSides = false) {
  let { target } = event;
  if (target.nodeType != Node.ELEMENT_NODE) {
    target = target.parentElement;
  }
  let tab =
    target?.closest("tab") || target?.closest("tab-group");
  const selectedTab = gBrowser.selectedTab;

  if (tab && ignoreTabSides) {
    let { width, height } = tab.getBoundingClientRect();
    if (
      event.screenX < tab.screenX + width * 0.25 ||
      event.screenX > tab.screenX + width * 0.75 ||
      ((event.screenY < tab.screenY + height * 0.25 ||
        event.screenY > tab.screenY + height * 0.25) &&
        gBrowser.tabContainer.verticalMode)
    ) {
      return selectedTab;
    }
  }
  return tab;
}

function performTabDragOver(event) {
  event.preventDefault();
  event.stopPropagation();

  let tc  = gBrowser.tabContainer;
  let ind = tc._tabDropIndicator;

  // Alte Marker entfernen
  if (tc.clearDropIndicator) {
    tc.clearDropIndicator();
  }

  let effects = orig_getDropEffectForTabDrag(event);
  let tab;

  // Link-Drop (Links auf Tabs ziehen) – nur Auswahl, kein Marker
  if (effects == "link") {
    tab = getTabFromEventTarget(event, true);
    if (tab) {
      if (!tc._dragTime) {
        tc._dragTime = Date.now();
      }
      if (
        !tab.hasAttribute("pendingicon") &&
        Date.now() >= tc._dragTime + tc._dragOverDelay
      ) {
        tc.selectedItem = tab;
      }
      if (ind) {
        ind.hidden = true;
      }
      return;
    }
  }

  if (!tab) {
    tab = getTabFromEventTarget(event, false);
  }

  let newIndex = tc._getDropIndex(event);
  if (newIndex == null) {
    return;
  }

  // eingebauten Indikator verstecken
  if (ind) {
    ind.hidden = true;
  }

  let tabs = gBrowser.tabs;

  // Am Ende der Tab-Leiste: Marker "right" am letzten Tab
  if (newIndex == tabs.length) {
    let lastTab = tabs[newIndex - 1];
    if (lastTab) {
      lastTab.setAttribute("dnd-marker", "right");
    }
  } else {
    // Sonst: Marker "left" am Tab an der Drop-Position
    let targetTab = tabs[newIndex];
    if (targetTab) {
      targetTab.setAttribute("dnd-marker", "left");
    }
  }
}

function performTabDropEvent(event) {
  let newIndex;
  let dt         = event.dataTransfer;
  let dropEffect = dt.dropEffect;
  let draggedTab;

  if (dt.mozTypesAt(0)[0] == TAB_DROP_TYPE) {
    draggedTab = dt.mozGetDataAt(TAB_DROP_TYPE, 0);
    if (!draggedTab) {
      return;
    }
  }

  if (
    draggedTab &&
    dropEffect != "copy" &&
    draggedTab.container == gBrowser.tabContainer
  ) {
    newIndex = gBrowser.tabContainer._getDropIndex(event);

    let selectedTabs =
      gBrowser.selectedTabs.length > 1
        ? gBrowser.selectedTabs
        : [draggedTab];
    let tabToMoveAt = gBrowser.tabContainer.getItemAtIndex(newIndex);
    let tab         = getTabFromEventTarget(event, false);
    let tabgroup    = tab?.closest("tab-group");

    if (!tab) {
      newIndex = gBrowser.tabs.length;
      tabToMoveAt = null;
    }

    if (tabgroup && !tab.previousSibling) {
      newIndex = 0;
      selectedTabs.forEach(t => {
        gBrowser.moveTabTo(t, {
          tabIndex: newIndex++,
          forceUngrouped: true
        });
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

    lastKnownIndex = null;
    lastGroupStart = null;
    lastGroupEnd   = null;
  }

  // Marker nach dem Drop entfernen
  if (gBrowser.tabContainer.clearDropIndicator) {
    gBrowser.tabContainer.clearDropIndicator();
  }
}

function orig_getDropEffectForTabDrag(event) {
  let dt = event.dataTransfer;

  let isMovingTabs = dt.mozItemCount > 0;
  for (let i = 0; i < dt.mozItemCount; i++) {
    let types = dt.mozTypesAt(0);
    if (types[0] != TAB_DROP_TYPE) {
      isMovingTabs = false;
      break;
    }
  }

  if (isMovingTabs) {
    let sourceNode = dt.mozGetDataAt(TAB_DROP_TYPE, 0);
    if (
      XULElement.isInstance(sourceNode) &&
      sourceNode.localName == "tab" &&
      sourceNode.ownerGlobal.isChromeWindow &&
      sourceNode.ownerDocument.documentElement.getAttribute("windowtype") ==
        "navigator:browser" &&
      sourceNode.ownerGlobal.gBrowser.tabContainer == sourceNode.container
    ) {
      if (
        PrivateBrowsingUtils.isWindowPrivate(window) !=
        PrivateBrowsingUtils.isWindowPrivate(sourceNode.ownerGlobal)
      ) {
        return "none";
      }

      if (
        window.gMultiProcessBrowser !=
        sourceNode.ownerGlobal.gMultiProcessBrowser
      ) {
        return "none";
      }

      if (window.gFissionBrowser != sourceNode.ownerGlobal.gFissionBrowser) {
        return "none";
      }

      return dt.dropEffect == "copy" ? "copy" : "move";
    }
  }

  if (Services.droppedLinkHandler.canDropLink(event, true)) {
    return "link";
  }

  return "none";
}
