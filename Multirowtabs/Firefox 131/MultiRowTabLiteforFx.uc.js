// ==UserScript==
// @name           zzzz-MultiRowTab_LiteforFx48.uc.js
// @namespace      http://space.geocities.yahoo.co.jp/gl/alice0775
// @description    Mehrzeilige Tableiste - Experimentelle CSS Version
// @include        main
// @compatibility  Firefox 128esr Firefox 131+
// @author         Alice0775
// @version        2024/09/11 12:00 Firefox 131+
// @version        2016/08/05 00:00 Firefox 48
// @version        2016/05/01 00:01 hide favicon if busy
// @version        2016/03/09 00:01 Bug 1222490 - Actually remove panorama for Fx45+
// @version        2016/02/09 00:01 workaround css for lwt
// @version        2016/02/09 00:00
// ==/UserScript==
"use strict";

MultiRowTabLiteforFx();
function MultiRowTabLiteforFx() {
if (!window.gBrowser) { return; }

    // -- Config --

    const                                        // Tab-Leistenzeilen Anzahl angeben, oder unbegrenzte Anzahl der Zeilen wählen.
    TabBar_Rows =                      	false	,// [false] = unbegrenzt
                                                 // true    = Begrenzte Tabzeilen - Anzahl der Zeilen angeben
    Max_Rows =                      	3		,// Tabzeilen angeben (Standard: 3 Zeilen)

                                                 // ProtonUI Erscheinungsbild der Tabs ändern
    Proton_Margins =                    true	,// [true] = Darstellung ProtonUI
                                                 //          Die Höhe der Tab-Leiste entspricht der Höhe der UI-Dichte plus dem Leerraum darüber und darunter.
                                                 // false  = Darstellung wie bei browser.proton.enabled auf false, was man vor Firefox 90 noch einstellen konnte.
                                                 //          Leerraum um die Tabs auf 0 anpassen, um der Höhe der UI-Dichte zu entsprechen.

                                                 // Position der Tab-Leiste.
    TabBar_Position =                  	0		,// [0] = Standard
                                                 // 1   = unter der Symbolleiste
                                                 // 2   = unter dem Fenster

                                                 // Standardposition der Tableiste Blenden Sie die Titelleistenschaltfläche [-□×] 
												 // aus und verwenden Sie die Breite der Tableiste entsprechend
    TitleBar_Button_Autohide =         	false	,// [false] = Aktiviert
                                                 //  true   = Deaktiviert
                                                 // Äußeren Rahmen der Titelleistenschaltfläche [-□×] reduzieren und transparent machen.
												 // Obere rechte Ecke der Tab-Leiste auf ihre ursprüngliche Größe zurücksetzen und Transparenz aufheben.

                                                 // Tab-Höhe „UI-Dichte“
    UI_Density_Compact =               	29		,// Standard = 29 Pixel bei Kompakt
    UI_Density_Normal =                	36		,// Standard = 36 Pixel bei Normal
    UI_Density_Touch =                 	41		,// Standard = 41 Pixel bei Touch
                                                 // Entsprechender CSS Code in UserChrome.css wird vorrangig behandelt!

                                                 // Tab-Breite
                                                 // Bei gleichen Werten bei Min und Max, wird Tabbreite fixiert!
    Tab_Min_Width =                    	76		,// Standard - Mindestwert = 76px
    Tab_Max_Width =                    	225		,// Standard - Maxwert = 225px
                                                 // Entsprechender CSS Code in UserChrome.css wird vorrangig behandelt!

                                                 // .Tab-Drop-Indikator-Icon-Ersetzung.
    Tab_Drop_Indicator =               	false	,// [false] = Stecknadel Symbol 📍
                                                 // true    = Rote Linie (2px × 29px) als Symbol

                                                 // Ränder auf der linken und rechten Seite der Tabs
    Tab_Separators  =                  	false	,// [false] = Nicht anzeigen
                                                 // true    = Anzeigen
                                                 // Rahmen CSS wurde extrahiert und angepasst, an Aussehen wie bei browser.proton.enabled 
												 // auf false, was man vor Firefox 90 noch einstellen konnte.

                                                 // Tab-Leisten-Ziehbereich
    Left_Drag_Area =                   	0		,// Linker Ziehbereich Breite: Standard 40 Pixel
    Right_Drag_Area =                  	0		,// Rechter Ziehbereich Breite: Standard 40 Pixel
    Maximize_Left_Drag_Area =   	    false   ,// true = Linken Ziehbereich bei maximiertem Fenster anzeigen. Standardmäßig ausgeblendet.
    Fullscreen_Drag_Area =             	false	,// true = Linken und rechten Ziehbereich bei Vollbild anzeigen. Standardmäßig ausgeblendet.

                                                 // Angeheftete Tabs neu positionieren
    Separate_Tabs_and_PinnedTabs =     	false	,// [false] = Standard
                                                 // true    = Angeheftete Tabs von der Tab-Leiste lösen und in die darüber liegende Zeile verschieben.

                                                 // „Tab schließen“ Schaltfläche .
    Tab_Close_Button =                 	0		,// [0] = Standard
                                                 //  1  = Ausgeblendet
                                                 //  2  = Auf allen Tabs anzeigen
												 //  3  = Nur bei Mausberührung anzeigen

                                                 // Alle Tabs Schaltfläche
    All_Tabs_Button =                  	false	,// [false] = ausblenden
                                                 // true    = anzeigen

    // -- Config End --

    css = `

    #TabsToolbar {

      :root[uidensity="compact"] & { --tab-min-height: ${UI_Density_Compact}px; }
      :root:not([uidensity])     & { --tab-min-height: ${UI_Density_Normal}px; }
      :root[uidensity="touch"]   & { --tab-min-height: ${UI_Density_Touch}px; }

      ${Tab_Drop_Indicator ? `
        #tabbrowser-tabs > .tab-drop-indicator {
          background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAAdCAIAAAAPVCo9AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAASSURBVBhXY3growJEQ5+SUQEAOb1EM8kwskcAAAAASUVORK5CYII=) no-repeat center !important;
        }
      ` : ``}

      .titlebar-spacer[type="pre-tabs"] {
        width: ${Left_Drag_Area}px !important;
      }

      .titlebar-spacer[type="post-tabs"] {
        width: ${Right_Drag_Area}px !important;
      }

      ${Maximize_Left_Drag_Area ? `
        .titlebar-spacer {
          :root:not([sizemode="normal"], [inFullscreen]) &[type="pre-tabs"] {
            display: block !important;
          }
        }
      ` : ``}

      ${Fullscreen_Drag_Area ? `
        .titlebar-spacer {
          :root[inFullscreen] &, :root:not([tabsintitlebar]) & {
            display: block !important;
          }
        }
      ` : ``}

      #tabbrowser-arrowscrollbox {
        &::part(scrollbox) {

          &:has(+ spacer) > slot,
          .scrollbox-clip > & {
            flex-wrap: wrap;
          }

          ${TabBar_Rows ? `
            max-height: calc((var(--tab-min-height) + ${Proton_Margins ? 8 : 0}px) * ${Max_Rows});
            overflow: hidden auto;
            & scrollbar {
              -moz-window-dragging: no-drag;
            }
          ` : ``}

        }

        &::part(overflow-start-indicator),
        &::part(overflow-end-indicator),
        &::part(scrollbutton-up),
        &::part(scrollbutton-down) {
          display: none;
        }

        ${Separate_Tabs_and_PinnedTabs ? `
          &::part(scrollbox) {
            &:has(+ spacer) > slot::after,
            .scrollbox-clip > &::after {
              display: flow-root list-item;
              content: "";
              flex-basis: -moz-available;
              height: 0;
              overflow: hidden;
            }
          }
          .tabbrowser-tab:not([pinned]) {
            #tabbrowser-tabs[haspinnedtabs] & {
              &, & + :not(#tabs-newtab-button) {
                order: 1;
              }
            }
          }
        ` : ``}

        .tabbrowser-tab[fadein]:not([pinned]) {
          --tab-min-width: ${Tab_Min_Width}px;
          --tab-max-width: ${Tab_Max_Width}px;
          max-width: var(--tab-max-width);

          ${Tab_Close_Button !== 0 ? `
            ${Tab_Close_Button === 1 ? `
              .tab-close-button {
                display: none !important;
              }
            ` : Tab_Close_Button === 2 ? `
              .tab-close-button {
                display: block !important;
              }
            ` : Tab_Close_Button === 3 ? `
              .tab-close-button {
                opacity: 0;
              }
              &:hover .tab-close-button {
                opacity: 1;
                display: block !important;
              }
            ` : ``}
          ` : ``}
        }

        #tabbrowser-tabs[haspinnedtabs]:not([positionpinnedtabs]):not([orient="vertical"]) > & > .tabbrowser-tab:nth-child(1 of :not([pinned], [hidden])) {
          margin-inline-start: 0 !important;
        }

      }

      ${Proton_Margins ? `` : `
        .toolbarbutton-1 {
          margin: 0 !important;
          padding: 0 !important;
        }
        .tabbrowser-tab,
        #tabs-newtab-button {
          height: var(--tab-min-height);
          padding: 0 !important;
        }
        .tab-background {
          box-shadow: none !important;
          margin-block: 0 !important;
        }
        .tabbrowser-tab[usercontextid] > .tab-stack > .tab-background > .tab-context-line {
          margin: 1px 2px 0 !important;
        }
      `}

      ${Tab_Separators ? `
        .titlebar-spacer[type="pre-tabs"] {
          border-inline-end: 1px solid color-mix(in srgb, currentColor 20%, transparent);
        }
        .tabbrowser-tab::after,
        .tabbrowser-tab::before {
          border-left: 1px solid color-mix(in srgb, currentColor 50%, transparent);
          height: calc(var(--tab-min-height) - 15%);
          margin-block: auto;
        }
        .tabbrowser-tab:hover::after,
        .tabbrowser-tab[multiselected]::after,
        #tabbrowser-tabs:not([movingtab]) .tabbrowser-tab:has(+ .tabbrowser-tab:hover)::after,
        #tabbrowser-tabs:not([movingtab]) .tabbrowser-tab:has(+ [multiselected])::after {
          height: 100%;
        }
        .tabbrowser-tab::after,
        #tabbrowser-tabs[movingtab] .tabbrowser-tab[visuallyselected]::before {
          content: "";
          display: block;
        }
      ` : ``}

      ${All_Tabs_Button ? `` : `
        #alltabs-button {
          display: none;
        }
      `}

    }

    ${TabBar_Position === 0 ? `
      #TabsToolbar {
        .titlebar-buttonbox-container {
          height: calc(var(--tab-min-height) + ${Proton_Margins ? 8 : 0}px);
          margin-bottom: 0 !important;

          ${TitleBar_Button_Autohide ? `
            background-color: color-mix(in srgb, currentColor 20%, transparent);
            height: 6px;
            opacity: 0;
            position: fixed;
            right: 0;
            z-index: 2147483647;
            .titlebar-button {
              opacity: 0;
              padding: 0;
            }
            &:hover {
              height: calc(var(--tab-min-height) + ${Proton_Margins ? 8 : 0}px);
              opacity: 1;
              .titlebar-button {
                opacity: 1;
                padding: 8px 17px;
              }
            }
          ` : ``}

        }
      }
    ` : `
      #nav-bar {
        :root:not([inFullscreen]) #toolbar-menubar:not([inactive]) + & > .titlebar-buttonbox-container {
          display: none;
        }
        .titlebar-button {
          padding-block: 0 !important;
        }
      }
    `}

    ${TabBar_Position !== 2 ? `` : `
      body {
        & > #fullscr-toggler[hidden] + tabbox,
        :root[inFullscreen] & > tabbox:hover {
          border-top: 0.5px solid var(--toolbar-bgcolor);
        }
        & > tabbox > #navigator-toolbox {
          border-block: none !important;
        }
        :root[inFullscreen] & {
          & > #navigator-toolbox {
            transition: none;
            &:has(~ tabbox:hover) {
              margin-top: 0 !important;
            }
            &:hover ~ tabbox > #navigator-toolbox {
              max-height: 100%;
          }}
          & > tabbox:not(:hover) {
            border-top: .5px solid transparent;
            & > #navigator-toolbox {
              max-height: 0;
            }
          }
        }
      }
    `}

    `,
    sss = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService),
    uri = Services.io.newURI("data:text/css;charset=UTF=8," + encodeURIComponent(css));
    if (TabBar_Rows == false) {
      ["0", "2"].find(type => {
        if(sss.sheetRegistered(uri, type)) sss.unregisterSheet(uri, type); sss.loadAndRegisterSheet(uri, type);
      });
    } else {
      ["0", "2", "SSTabRestored", "TabMove", "TabOpen", "TabSelect"].find(type => {
        if(sss.sheetRegistered(uri, type)) sss.unregisterSheet(uri, type); sss.loadAndRegisterSheet(uri, type);
        gBrowser.tabContainer.addEventListener(type, (e) => { e.target.scrollIntoView({ block: "nearest" }); });
      });
    }

    if (TabBar_Position !== 0) {
      if (TabBar_Position === 1) {
        document.getElementById("navigator-toolbox").prepend(
          document.getElementById("toolbar-menubar"),
          document.getElementById("nav-bar"),
          document.getElementById("PersonalToolbar"),
          document.getElementById("titlebar"),
        );
      } else {
        document.getElementById("navigator-toolbox").prepend(
          document.getElementById("toolbar-menubar"),
          document.getElementById("nav-bar"),
          document.getElementById("PersonalToolbar"),
        );
      }
      document.getElementById("nav-bar").appendChild(
        document.querySelector("#TabsToolbar > .titlebar-buttonbox-container")
      );
    }

    if (TabBar_Position === 2) {
      document.body.appendChild(
        document.createXULElement("tabbox")
      ).appendChild(
        document.importNode(document.getElementById("navigator-toolbox"))
      ).appendChild(
        document.getElementById("titlebar")
      );
    }

    gBrowser.tabContainer.addEventListener("dragover", function(event) { this._on_dragover(event); }, false)
    gBrowser.tabContainer.addEventListener("drop", function(event) { this._on_drop(event); }, false)

    gBrowser.tabContainer.on_dragover = function(event) { return false; }
    gBrowser.tabContainer.on_drop = function(event) { return false; }

    gBrowser.tabContainer._on_dragover = function(event) {
      var effects = this.getDropEffectForTabDrag(event);

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
      if (this.overflowing) {
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
            (this.verticalMode ? 1 : -1) * pixelsToScroll,
            true
          );
        }
      }

      if (this.verticalMode) {
        let draggedTab = event.dataTransfer.mozGetDataAt(TAB_DROP_TYPE, 0);
        if (
          (effects == "move" || effects == "copy") &&
          this == draggedTab.container &&
          !draggedTab._dragData.fromTabList
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
      }

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

      var tabRect, rect = arrowScrollbox.getBoundingClientRect();
      var newMargin, newMarginX, newMarginY;
      if (pixelsToScroll) {
        // if we are scrolling, put the drop indicator at the edge
        // so that it doesn't jump while scrolling
        let scrollRect = arrowScrollbox.scrollClientRect;
        let minMargin = this.verticalMode
          ? scrollRect.top - rect.top
          : scrollRect.left - rect.left;
        let maxMargin = this.verticalMode
          ? Math.min(minMargin + scrollRect.height, scrollRect.bottom)
          : Math.min(minMargin + scrollRect.width, scrollRect.right);
        newMargin = pixelsToScroll > 0 ? maxMargin : minMargin;
      } else {
        let newIndex = this._getDropIndex(event);
        let children = this.allTabs;
        if (this.verticalMode) {
          newMargin = ind.clientHeight - rect.top + ((newIndex == children.length)
            ? (tabRect = this._getVisibleTabs().at(-1).getBoundingClientRect()).bottom
            : (tabRect = children[newIndex].getBoundingClientRect()).bottom);
        } else {
          newMarginX = ind.clientWidth / 2 - rect.left + ((newIndex == children.length)
              ? (tabRect = this._getVisibleTabs().at(-1).getBoundingClientRect()).right
              : (tabRect = children[newIndex].getBoundingClientRect()).left);
          newMarginY = tabRect.top - rect.top + tabRect.height / 2 - rect.height / 2;
        }
      }

      ind.hidden = false;
      ind.style.transform = this.verticalMode
        ? "translateY(" + Math.round(newMargin) + "px)"
        : "translate(" + Math.round(newMarginX) + "px," + Math.round(newMarginY) + "px)";
    }

    gBrowser.tabContainer._on_drop = function(event) {
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
        let oldTranslate = Math.round(draggedTab._dragData.translatePos);
        let tabSize = Math.round(draggedTab._dragData.tabSize);
        let translateOffset = oldTranslate % tabSize;
        let newTranslate = oldTranslate - translateOffset;
        if (oldTranslate > 0 && translateOffset > tabSize / 2) {
          newTranslate += tabSize;
        } else if (oldTranslate < 0 && -translateOffset > tabSize / 2) {
          newTranslate -= tabSize;
        }

        let dropIndex;
        if (draggedTab._dragData.fromTabList) {
          dropIndex = this._getDropIndex(event);
        } else {
          dropIndex = this.verticalMode
            ? "animDropIndex" in draggedTab._dragData && draggedTab._dragData.animDropIndex
            : this._getDropIndex(event);
        }
        let incrementDropIndex = true;
        if (dropIndex && dropIndex > movingTabs[0]._tPos) {
          dropIndex--;
          incrementDropIndex = false;
        }

        if (oldTranslate && oldTranslate != newTranslate && !gReduceMotion) {
          for (let tab of movingTabs) {
            tab.toggleAttribute("tabdrop-samewindow", true);
            tab.style.transform = this.verticalMode
              ? "translateY(" + newTranslate + "px)"
              : "translateX(" + newTranslate + "px)";
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

};
