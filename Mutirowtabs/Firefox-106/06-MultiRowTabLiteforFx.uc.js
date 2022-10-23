// ==UserScript==
// @name           zzzz-MultiRowTab_LiteforFx48.uc.js
// @namespace      http://space.geocities.yahoo.co.jp/gl/alice0775
// @description    Experimentelle CSS Version für Mehrzeilige Tableiste
// @include        main
// @compatibility  Firefox 106
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

    var css =` @-moz-document url-prefix("chrome://browser/content/browser.xhtml") {

     /* Symbolleiste Sortieren */
    #toolbar-menubar { -moz-box-ordinal-group: 1; } /* Menüleiste */
    #nav-bar         { -moz-box-ordinal-group: 2; } /* Navigationsleiste */
    #PersonalToolbar { -moz-box-ordinal-group: 3; } /* Lesezeichenleiste */

    /* Symbolleistenanpassung */
    #titlebar,#tabbrowser-tabs { -moz-appearance: none !important; }
    #titlebar { border-top: 1px solid var(--chrome-content-separator-color) !important; }

    /* Anpassung für Titelleistenschaltflächen */
    #nav-bar > .titlebar-buttonbox-container .titlebar-button { width: 46px !important; }
    #toolbar-menubar:not([inactive]) ~ #nav-bar:not([inFullscreen]) > .titlebar-buttonbox-container { display: none !important; }

    /* Ich habe versucht, die Tableiste im Vollbildmodus auszublenden und anzuzeigen, indem ich die Maus über den oberen und unteren Bildschirmrand bewegte.
        Wenn Sie mit der Maus über den oberen Bildschirmrand fahren, wird die Tableiste zusammen mit der Symbolleiste angezeigt.
        Wenn Sie mit der Maus über den unteren Bildschirmrand fahren, wird nur die Tableiste angezeigt.  */
    #titlebar > #TabsToolbar[inFullscreen] { max-height: 0 !important; }
    #navigator-toolbox-background:hover ~ #titlebar > #TabsToolbar[inFullscreen],
    #titlebar:hover > #TabsToolbar[inFullscreen] { max-height: 100% !important; }

    /* Mehrzeilige Tableiste */
    box.scrollbox-clip[orient="horizontal"] { display: block !important; }
    box.scrollbox-clip[orient="horizontal"] > scrollbox {
        display: flex !important;
        flex-wrap: wrap !important;
        max-height: calc(calc(8px + var(--tab-min-height)) * 5); /* Anzahl der Tabzeilen(Standard = 5 Zeilen) */
        overflow-x: hidden !important;
        overflow-y: auto !important; }
    .tabbrowser-tab[fadein]:not([pinned]) { flex-grow: 1 !important; }
    .tabbrowser-tab {
         height: calc(8px + var(--tab-min-height));
         overflow: hidden; }
    .tabbrowser-tab > .tab-stack { width: 100% !important; }
    #TabsToolbar .toolbarbutton-1 { margin: 0 !important; }

    /* Ausblenden - Verstecken */
    .tabbrowser-tab:not([fadein]),#alltabs-button { display: none !important; }

    /* --- Ziehbereich der Tab-Leiste --- */
    /* Anpassung */
    hbox.titlebar-spacer[type="pre-tabs"] { width: 0px !important; } /* Linker Ziehbereich: Standard 40px  */
    hbox.titlebar-spacer[type="post-tabs"] { width: 0px !important; } /* Rechter Ziehbereich: Standard 40px  */
    /* ↓ Wenn Sie die Auskommentierung links und rechts von unten stehenden CSS-Code entfernen und den CSS-Code aktivieren, 
       können Sie den Ziehbereich links einblenden, der beim Maximieren des Fensters ausgeblendet wird. */
    /* :root:not([sizemode="normal"]) hbox.titlebar-spacer[type="pre-tabs"] { display: block !important; } */

    /* ↓ Wenn Sie die Auskommentierung links und rechts von unten stehenden CSS-Code entfernen und den CSS-Code aktivieren, 
	     können Sie den linken und rechten Ziehbereich einblenden, der im Vollbildmodus ausgeblendet wird. */
    /* :root[inFullscreen] .titlebar-spacer { display: block !important; } */

    /* --- Tableiste mit Script an den unteren Rand des Fensters verschieben --- */

    /* Da das Script mit Themes nicht funktionierte, wurde benötigter CSS Code
aus browser.css Datei entnommen und # navigator-toolbox in #titlebar geändert */
    #titlebar:-moz-lwtheme {
        background-image: var(--lwt-additional-images);
        background-repeat: var(--lwt-background-tiling);
        background-position: var(--lwt-background-alignment);
    }

    /* TODO bug 1695280: Remove these media selectors and merge the rule below
       with the ruleset above. We must set background properties on :root and not
       #navigator-toolbox on Windows 7/8 due to a WebRender bug that hides the
       minimize/maximize/close buttons. */
    @media not (-moz-os-version: windows-win7) {
        @media not (-moz-os-version: windows-win8) {
            #titlebar:-moz-lwtheme {
                background-color: var(--lwt-accent-color);
            }

            /* When a theme defines both theme_frame and additional_backgrounds, show
               the latter atop the former. */
            :root[lwtheme-image] #titlebar {
                background-image: var(--lwt-header-image), var(--lwt-additional-images);
                background-repeat: no-repeat, var(--lwt-background-tiling);
                background-position: right top, var(--lwt-background-alignment);
            }

            #titlebar:-moz-window-inactive:-moz-lwtheme {
                background-color: var(--lwt-accent-color-inactive, var(--lwt-accent-color));
            }
        }
    }

    } `;
    var sss = Cc['@mozilla.org/content/style-sheet-service;1'].getService(Ci.nsIStyleSheetService);
    var uri = makeURI('data:text/css;charset=UTF=8,' + encodeURIComponent(css));
    sss.loadAndRegisterSheet(uri, sss.USER_SHEET);

    var css =` @-moz-document url-prefix("chrome://browser/content/browser.xhtml") {

    /* Bei Überschreitung der angegebenen Zeilenanzahl, mit der Maus,    
	   über die dann eingeblendetet Scrolleiste zur gewünschten Zeile wechseln */
    box.scrollbox-clip > scrollbox[orient="horizontal"] > scrollbar { -moz-window-dragging: no-drag !important; }

    } `;
    var sss = Cc['@mozilla.org/content/style-sheet-service;1'].getService(Ci.nsIStyleSheetService);
    var uri = makeURI('data:text/css;charset=UTF=8,' + encodeURIComponent(css));
    sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);

    if(location.href !== 'chrome://browser/content/browser.xhtml') return;

    // Menüleiste an den oberen Rand der Symbolleiste verschieben
    document.getElementById("titlebar").parentNode.insertBefore(document.getElementById("toolbar-menubar"),document.getElementById("nav-bar"));

    // Tab-Leiste an den unteren Rand des Fensters verschieben
    document.body.appendChild(document.getElementById("titlebar"));

    // Titelleistenschaltflächen aus der Tableiste, rechts neben die Navigationsleiste verschieben
    document.getElementById("nav-bar").appendChild(document.querySelector("#TabsToolbar .titlebar-buttonbox-container"));

    // Scroll-Buttons und Spacer in der Tableiste ausblenden shadowRoot
    gBrowser.tabContainer.arrowScrollbox.shadowRoot.getElementById('scrollbutton-up').style.display = "none";
    gBrowser.tabContainer.arrowScrollbox.shadowRoot.getElementById('scrollbutton-down').style.display = "none";
    gBrowser.tabContainer.arrowScrollbox.shadowRoot.querySelector('[part="overflow-start-indicator"]').style.display = "none";
    gBrowser.tabContainer.arrowScrollbox.shadowRoot.querySelector('[part="overflow-end-indicator"]').style.display = "none";

    // Tabbar scrollIntoView
    gBrowser.tabContainer.addEventListener("SSTabRestoring", function(event) {event.target.scrollIntoView({behavior: "instant", block: "nearest", inline: "nearest"})}, true);
    gBrowser.tabContainer.addEventListener("TabAttrModified", function(event) {event.target.scrollIntoView({behavior: "instant", block: "nearest", inline: "nearest"})}, true);
    gBrowser.tabContainer.addEventListener("TabMove", function(event) {event.target.scrollIntoView({behavior: "instant", block: "nearest", inline: "nearest"})}, true);

    // drag & drop & DropIndicator

    gBrowser.tabContainer.clearDropIndicator = function() {
      let tabs = this.allTabs;
      for (let i = 0, len = tabs.length; i < len; i++) {
        tabs[i].removeAttribute("style");
      }
    }
    gBrowser.tabContainer.addEventListener("dragleave", function(event) { this.clearDropIndicator(event); }, true);

    gBrowser.tabContainer.on_dragover = function(event) {
      this.clearDropIndicator();
      var effects = this.getDropEffectForTabDrag(event);

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
      let children = this.allTabs;
      if (newIndex == children.length) {
        children[newIndex - 1].style.setProperty("box-shadow","-1px 0 0 red inset,1px 0 0 red","important");
      } else {
        children[newIndex].style.setProperty("box-shadow","1px 0 0 red inset,-1px 0 0 red","important");
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

        let dropIndex;
        if (draggedTab._dragData.fromTabList) {
          dropIndex = this._getDropIndex(event, false);
        } else {
          dropIndex = this._getDropIndex(event, false);
         // "animDropIndex" in draggedTab._dragData &&
         // draggedTab._dragData.animDropIndex;
        }
        let incrementDropIndex = true;
        if (dropIndex && dropIndex > movingTabs[0]._tPos) {
          dropIndex--;
          incrementDropIndex = false;
        }

        if (oldTranslateX && oldTranslateX != newTranslateX && !gReduceMotion) {
          for (let tab of movingTabs) {
            tab.setAttribute("tabdrop-samewindow", "true");
            tab.style.transform = "translateX(" + newTranslateX + "px)";
            let postTransitionCleanup = () => {
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
            if (gReduceMotion) {
              postTransitionCleanup();
            } else {
              let onTransitionEnd = transitionendEvent => {
                if (
                  transitionendEvent.propertyName != "transform" ||
                  transitionendEvent.originalTarget != tab
                ) {
                  return;
                }
                tab.removeEventListener("transitionend", onTransitionEnd);

                postTransitionCleanup();
              };
              tab.addEventListener("transitionend", onTransitionEnd);
            }
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
        // Move the tabs. To avoid multiple tab-switches in the original window,
        // the selected tab should be adopted last.
        const dropIndex = this._getDropIndex(event, false);
        let newIndex = dropIndex;
        let selectedTab;
        let indexForSelectedTab;
        for (let i = 0; i < movingTabs.length; ++i) {
          const tab = movingTabs[i];
          if (tab.selected) {
            selectedTab = tab;
            indexForSelectedTab = newIndex;
          } else {
            const newTab = gBrowser.adoptTab(tab, newIndex, tab == draggedTab);
            if (newTab) {
              ++newIndex;
            }
          }
        }
        if (selectedTab) {
          const newTab = gBrowser.adoptTab(
            selectedTab,
            indexForSelectedTab,
            selectedTab == draggedTab
          );
          if (newTab) {
            ++newIndex;
          }
        }

        // Restore tab selection
        gBrowser.addRangeToMultiSelectedTabs(
          gBrowser.tabs[dropIndex],
          gBrowser.tabs[newIndex - 1]
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
