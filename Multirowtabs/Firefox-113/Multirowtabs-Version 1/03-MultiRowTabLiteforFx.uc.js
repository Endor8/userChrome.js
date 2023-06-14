// ==UserScript==
// @name           zzzz-MultiRowTab_LiteforFx48.uc.js
// @namespace      http://space.geocities.yahoo.co.jp/gl/alice0775
// @description    Experimentelle CSS Version für Mehrzeilige Tableiste
// @include        main
// @compatibility  Firefox 113
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

    var css =` /* USER_SHEET */
    @-moz-document url-prefix("chrome://browser/content/browser.xhtml") {

    /* Symbolleiste Sortieren */
    #toolbar-menubar { order: 1; } /* Menüleiste */
    #nav-bar         { order: 2; } /* Navigationsleiste */
    #PersonalToolbar { order: 3; } /* Lesezeichenleiste */
    #titlebar        { order: 4; } /* Tableiste */

    /* Anpassung der Symbolleiste */
    #titlebar,#tabbrowser-tabs { appearance: none !important; }

    /* Anpassung für Titelleistenschaltflächen */
    #nav-bar > .titlebar-buttonbox-container .titlebar-button { width: 46px !important; }
    #toolbar-menubar:not([inactive]) ~ #nav-bar:not([inFullscreen]) > .titlebar-buttonbox-container { display: none !important; }

    /* Mehrzeilige Tableiste */
    box.scrollbox-clip[orient="horizontal"] > scrollbox {
      display: flex !important;
      flex-wrap: wrap !important;
    }

    /* Ausblenden - Verstecken */
    #alltabs-button { display: none !important; }

   /* --- Ziehbereich der Tab-Leiste --- */
    
    /* Anpassung */
    hbox.titlebar-spacer[type="pre-tabs"] { width: 0px !important; } /* Linker Ziehbereich: Standard 40px  */
    hbox.titlebar-spacer[type="post-tabs"] { width: 0px !important; } /* Rechter Ziehbereich: Standard 40px  */
    /* ↓ Wenn Sie die Auskommentierung links und rechts von unten stehenden CSS-Code entfernen und den CSS-Code aktivieren, 
       können Sie den Ziehbereich links einblenden, der beim Maximieren des Fensters ausgeblendet wird. */    /* :root:not([sizemode="normal"]) hbox.titlebar-spacer[type="pre-tabs"] { display: block !important; } */

    /* ↓ Wenn Sie die Auskommentierung links und rechts von unten stehenden CSS-Code entfernen und den CSS-Code aktivieren, 
	     können Sie den linken und rechten Ziehbereich einblenden, der im Vollbildmodus ausgeblendet wird.   */
    /* :root[inFullscreen] hbox.titlebar-spacer { display: block !important; } */

    } `;
    var sss = Cc['@mozilla.org/content/style-sheet-service;1'].getService(Ci.nsIStyleSheetService);
    var uri = makeURI('data:text/css;charset=UTF=8,' + encodeURIComponent(css));
    sss.loadAndRegisterSheet(uri, sss.USER_SHEET);

    var css =` /* AUTHOR_SHEET */

    /*
    #tabbrowser-arrowscrollbox::part(scrollbox) {
      display: flex !important;
      flex-wrap: wrap !important;
    }
    */

    /* Bildlaufschaltfläche und Abstandshalter in der Schattenwurzel der Tab-Leiste ausblenden */
    #tabbrowser-arrowscrollbox[scrolledtostart]::part(overflow-start-indicator),
    #tabbrowser-arrowscrollbox[scrolledtoend]::part(overflow-end-indicator),
    #tabbrowser-arrowscrollbox::part(scrollbutton-up),
    #tabbrowser-arrowscrollbox::part(scrollbutton-down) { display: none !important; }

    `;
    var sss = Components.classes['@mozilla.org/content/style-sheet-service;1'].getService(Components.interfaces.nsIStyleSheetService);
    var uri = makeURI('data:text/css;charset=UTF=8,' + encodeURIComponent(css));
    sss.loadAndRegisterSheet(uri, sss.AUTHOR_SHEET);

    if(location.href !== 'chrome://browser/content/browser.xhtml') return;

    // Verschieben Sie die Menüleiste an den oberen Rand der Symbolleiste 
    document.getElementById("titlebar").parentNode.insertBefore(document.getElementById("toolbar-menubar"),document.getElementById("titlebar"));

    // Titelleisten Schaltflächen in die Tableiste an den Rechten Rand verschieben
    document.getElementById("nav-bar").appendChild(document.querySelector("#TabsToolbar .titlebar-buttonbox-container"));

    // drag & drop & DropIndicator

    gBrowser.tabContainer.on_dragover = function(event) {
      var effects = this.getDropEffectForTabDrag(event);

      var ind = this._tabDropIndicator;
      if (effects == "" || effects == "none") {
        ind.hidden = true;
        return;
      }
      event.preventDefault();
      event.stopPropagation();

      var arrowScrollbox = this.arrowScrollbox;

      if (effects == "link") {
        let tab = this._getDragTargetTab(event, { ignoreTabSides: true });
        if (tab) {
          if (!this._dragTime) {
            this._dragTime = Date.now();
          }
          if (Date.now() >= this._dragTime + this._dragOverDelay) {
            this.selectedItem = tab;
          }
          ind.hidden = true;
          return;
        }
      }

      var rect = arrowScrollbox.getBoundingClientRect();
      var newMarginX, newMarginY;
      let newIndex = this._getDropIndex(event);
      let children = this.allTabs;
      if (newIndex == children.length) {
        let tabRect = this._getVisibleTabs().at(-1).getBoundingClientRect();
        if (RTL_UI) {
          newMarginX = rect.right - tabRect.left;
        } else {
          newMarginX = tabRect.right - rect.left;
        }
          newMarginY = tabRect.top - rect.top + tabRect.height / 2 - rect.height / 2;
      } else {
        let tabRect = children[newIndex].getBoundingClientRect();
        if (RTL_UI) {
          newMarginX = rect.right - tabRect.right;
        } else {
          newMarginX = tabRect.left - rect.left;
        }
          newMarginY = tabRect.top - rect.top + tabRect.height / 2 - rect.height / 2;
      }

      ind.hidden = false;
      newMarginX += ind.clientWidth / 2;
      if (RTL_UI) {
        newMarginX *= -1;
      }
      ind.style.transform = "translate(" + Math.round(newMarginX) + "px," + Math.round(newMarginY) + "px)";
    }

    gBrowser.tabContainer.on_drop = function(event) {
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
        let newIndex = this._getDropIndex(event);
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
          dropIndex = this._getDropIndex(event);
        } else {
          dropIndex = this._getDropIndex(event);
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
        const dropIndex = this._getDropIndex(event);
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

        let targetTab = this._getDragTargetTab(event, { ignoreTabSides: true });
        let userContextId = this.selectedItem.getAttribute("usercontextid");
        let replace = !!targetTab;
        let newIndex = this._getDropIndex(event);
        let urls = links.map(link => link.url);
        let csp = browserDragAndDrop.getCsp(event);
        let triggeringPrincipal =
          browserDragAndDrop.getTriggeringPrincipal(event);

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

}
