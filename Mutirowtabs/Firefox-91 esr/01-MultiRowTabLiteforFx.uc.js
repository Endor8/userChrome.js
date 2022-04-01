// ==UserScript==
// @name           zzzz-MultiRowTab_LiteforFx48.uc.js
// @namespace      http://space.geocities.yahoo.co.jp/gl/alice0775
// @description    Experimentelle CSS Version für Mehrzeilige Tableiste
// @include        main
// @compatibility  Firefox 91esr
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

    /* Anpassung der Symbolleiste */
    :root[tabsintitlebar="true"][sizemode="maximized"] #navigator-toolbox { padding-top: 8px !important; }
    #titlebar,#tabbrowser-tabs { -moz-appearance: none !important; }

    /* Verhindern, dass die Titelleistenschaltfläche der Registerkarte im Hochformat angezeigt wird */
    :root[tabsintitlebar="true"] #TabsToolbar > .titlebar-buttonbox-container { display: block; margin: 0 !important; }
    :root[tabsintitlebar="true"] #TabsToolbar .titlebar-button { padding: 0 !important; width: 46px; }
    #toolbar-menubar:not([inactive]) ~ #TabsToolbar .titlebar-buttonbox-container { display: none !important; }
    :root[inFullscreen="true"] #window-controls { display: flex; }
    :root[inFullscreen="true"] #window-controls > toolbarbutton { display: inline; padding: 0 !important; width: 36px; }

    /* Mehrzeilige Tableiste */
    box.scrollbox-clip[orient="horizontal"] { display: block; }
    box.scrollbox-clip > scrollbox[orient="horizontal"] {
        display: flex;
        flex-wrap: wrap; }
    .tabbrowser-tab[fadein]:not([pinned]) { flex-grow: 1; }
    .tabbrowser-tab,:root[tabsintitlebar="true"] #TabsToolbar .titlebar-button,
    #tabs-newtab-button,#window-controls > toolbarbutton { height: calc(8px + var(--tab-min-height)); }
    .tabbrowser-tab > .tab-stack { width: 100%; }
    #tabs-newtab-button { margin: 0 !important; }

    /* Ausblenden - Verstecken */
    .tabbrowser-tab:not([fadein]) { display: none !important; }

    /* --- Ziehbereich der Tab-Leiste --- */
    /* Anpassung */
    hbox.titlebar-spacer[type="pre-tabs"] { width: 0px !important; } /* Linker Ziehbereich: Standard 40px  */
    hbox.titlebar-spacer[type="post-tabs"] { width: 0px !important; } /* Rechter Ziehbereich: Standard 40px  */
    /* ↓ Wenn Sie die linke und rechte Seite des CSS-Codes auskommentieren und den CSS-Code aktivieren, 
       können Sie den Ziehbereich links einblenden, der beim Maximieren des Fensters ausgeblendet wird. 
    /* :root:not([sizemode="normal"]) hbox.titlebar-spacer[type="pre-tabs"] { display: block !important; } */

    /* ↓Wenn Sie die Auskommentierung links und rechts von unten stehenden CSS-Code entfernen und den CSS-Code 
	     aktivieren, können Sie den linken und rechten Ziehbereich einblenden, der im Vollbildmodus ausgeblendet wird. */
    /* :root[inFullscreen] .titlebar-spacer { display: block !important; } */

    } `;
    var sss = Cc['@mozilla.org/content/style-sheet-service;1'].getService(Ci.nsIStyleSheetService);
    var uri = makeURI('data:text/css;charset=UTF=8,' + encodeURIComponent(css));
    sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);

    if(location.href !== 'chrome://browser/content/browser.xhtml') return;

    // Scroll-Buttons und Spacer in der Tab-Leiste ausblenden - shadowRoot 
    gBrowser.tabContainer.arrowScrollbox.shadowRoot.getElementById('scrollbutton-up').style.display = "none";
    gBrowser.tabContainer.arrowScrollbox.shadowRoot.getElementById('scrollbutton-down').style.display = "none";
    gBrowser.tabContainer.arrowScrollbox.shadowRoot.querySelector('[part="overflow-start-indicator"]').style.display = "none";
    gBrowser.tabContainer.arrowScrollbox.shadowRoot.querySelector('[part="overflow-end-indicator"]').style.display = "none";

    // Tabbar scrollIntoView
    gBrowser.tabContainer.addEventListener("dragend", function(event) {event.target.scrollIntoView({behavior: "instant", block: "nearest", inline: "nearest"})}, true);
    gBrowser.tabContainer.addEventListener("SSTabRestoring", function(event) {event.target.scrollIntoView({behavior: "instant", block: "nearest", inline: "nearest"})}, true);
    gBrowser.tabContainer.addEventListener("TabOpen", function(event) {event.target.scrollIntoView({behavior: "instant", block: "nearest", inline: "nearest"})}, true);
    gBrowser.tabContainer.addEventListener("TabSelect", function(event) {event.target.scrollIntoView({behavior: "instant", block: "nearest", inline: "nearest"})}, true);

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
      var effects = this._getDropEffectForTabDrag(event);

      var ind = this._tabDropIndicator;
      if (effects == "" || effects == "none") {
        ind.hidden = true;
        return;
      }
      event.preventDefault();
      event.stopPropagation();

      var arrowScrollbox = this.arrowScrollbox;

      // autoscroll the tab strip if we drag over the scroll
      // buttons, even if we aren't dragging a tab, but then
      // return to avoid drawing the drop indicator
      var pixelsToScroll = 0;
      if (this.getAttribute("overflow") == "true") {
        switch (event.originalTarget) {
          case arrowScrollbox._scrollButtonUp:
            pixelsToScroll = arrowScrollbox.scrollIncrement * -1;
            break;
          case arrowScrollbox._scrollButtonDown:
            pixelsToScroll = arrowScrollbox.scrollIncrement;
            break;
        }
        if (pixelsToScroll) {
          arrowScrollbox.scrollByPixels(
            (RTL_UI ? -1 : 1) * pixelsToScroll,
            true
          );
        }
      }

      let draggedTab = this._getDropIndex(event, false); // event.dataTransfer.mozGetDataAt(TAB_DROP_TYPE, 0);
      if (
        (effects == "move" || effects == "copy") &&
        this == draggedTab.container
      ) {
        ind.hidden = true;

        if (!this._isGroupTabsAnimationOver()) {
          // Wait for grouping tabs animation to finish
          return;
        }
        this._finishGroupSelectedTabs(draggedTab);

        if (effects == "move") {
          this._animateTabMove(event);
          return;
        }
      }

      this._finishAnimateTabMove();

      if (effects == "link") {
        let tab = this._getDragTargetTab(event, true);
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
      var newMargin;
      if (pixelsToScroll) {
        // if we are scrolling, put the drop indicator at the edge
        // so that it doesn't jump while scrolling
        let scrollRect = arrowScrollbox.scrollClientRect;
        let minMargin = scrollRect.left - rect.left;
        let maxMargin = Math.min(
          minMargin + scrollRect.width,
          scrollRect.right
        );
        if (RTL_UI) {
          [minMargin, maxMargin] = [
            this.clientWidth - maxMargin,
            this.clientWidth - minMargin,
          ];
        }
        newMargin = pixelsToScroll > 0 ? maxMargin : minMargin;
      } else {
        let newIndex = this._getDropIndex(event, effects == "link");
        let children = this.allTabs;
        if (newIndex == children.length) {
       // let tabRect = children[newIndex - 1].getBoundingClientRect();
          children[newIndex - 1].style.setProperty("box-shadow","-1px 0 0 red inset,1px 0 0 red","important");
          if (RTL_UI) {
            newMargin = rect.right - tabRect.left;
          } else {
            newMargin = tabRect.right - rect.left;
          }
        } else {
       // let tabRect = children[newIndex].getBoundingClientRect();
          children[newIndex].style.setProperty("box-shadow","1px 0 0 red inset,-1px 0 0 red","important");
          if (RTL_UI) {
            newMargin = rect.right - tabRect.right;
          } else {
            newMargin = tabRect.left - rect.left;
          }
        }
      }

      ind.hidden = false;
      newMargin += ind.clientWidth / 2;
      if (RTL_UI) {
        newMargin *= -1;
      }
      ind.style.transform = "translate(" + Math.round(newMargin) + "px)";
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

        let dropIndex = this._getDropIndex(event, false);
       // "animDropIndex" in draggedTab._dragData &&
       // draggedTab._dragData.animDropIndex;
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
        let newIndex = this._getDropIndex(event, false);
        let newTabs = [];
        for (let tab of movingTabs) {
          let newTab = gBrowser.adoptTab(tab, newIndex++, tab == draggedTab);
          newTabs.push(newTab);
        }

        // Restore tab selection
        gBrowser.addRangeToMultiSelectedTabs(
          newTabs[0],
          newTabs[newTabs.length - 1]
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
