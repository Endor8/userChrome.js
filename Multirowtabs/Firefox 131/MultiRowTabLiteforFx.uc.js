// ==UserScript==
// @name           zzzz-MultiRowTab_LiteforFx48.uc.js
// @namespace      http://space.geocities.yahoo.co.jp/gl/alice0775
// @description    Mehrzeilige Tableiste - Experimentelle CSS Version
// @include        main
// @compatibility  Firefox 128esr Firefox 131+
// @author         Alice0775
// @version        2024/09/30 12:00 Firefox 131+
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
    // Vergleichbarer CSS Code in userChrome.css Datei wird vorrangig behandelt!

    const                                        // Tab-Leistenzeilen Anzahl
    TabBar_Rows =                      	false   ,// [false] = unbegrenzt
                                                 // true    = Begrenzte Tabzeilen - Anzahl der Zeilen
    Max_Rows =                         	3       ,// Tabzeilen angeben (Standard: 3 Zeilen)
                                                 // Anzahl der Tab-Leistenzeilen für „true“ Normalerweise auf 1 Zeile eingestellt und
						 // die zweite und die folgenden Zeilen werden bis zur angegebenen Anzahl von Zeilen
						 // angezeigt, wenn der Mauszeiger über die Tab-Leiste bewegt wird.
    MultiRowTab_on_MouseOver =         	false   ,// [false] = Standard
                                                 // true = Standard 1 Zeile
    TabBar_MouseOver_DisplayTime =     	1       ,// Sie können die Anzeigezeit (Sekunden) festlegen, nachdem die zweite und die folgenden
	                                         // Zeilen beim Mouseover angezeigt werden. Das Display zeigt den eingestellten Wert
				                // (Sekunden) an und kehrt dann zur ersten Zeile zurück.
														
                                                 // ProtonUI Erscheinungsbild der Tabs ändern
    Proton_Margins =                   	true    ,// [true] = Darstellung ProtonUI
                                                 // Die Höhe der Tab-Leiste entspricht der Höhe derUI-Dichte plus dem Leerraum darüber
						 // und darunter.                                                 
						 // false  = Darstellung wie bei browser.proton.enabled auf false, was man vor Firefox 90
					 	 // noch einstellen konnte.
                                                 // Wenn der Leerraum um die Registerkarte auf 0 und die Höhe auf die UI-Dichte eingestellt
                                                 // ist, ist sie 4 Pixel breiter und 8 Pixel niedriger als die Standardeinstellung.
                                                 // Ränder auf der linken und rechten Seite der Tabs
    Tab_Separators  =                   false   ,// [false] = Nicht anzeigen
                                                 // true    = Anzeigen
                                                 // Rahmen CSS wurde extrahiert und angepasst, an Aussehen wie bei browser.proton.enabled
						 // auf false, was man vor Firefox 90 noch einstellen konnte.

                                                 // Position der Tab-Leiste.
    TabBar_Position =              	    0   ,// [0] = Standard
                                                 // 1   = unter der Symbolleiste
                                                 // 2   = unter dem Fenster
                                                 // Standardposition der Tableiste Blenden Sie die Titelleistenschaltfläche [-□×] 
						 // aus und verwenden Sie die Breite der Tableiste entsprechend
    TitleBar_Button_Autohide =         	false	,// [false] = Aktiviert
                                                 // true    = Deaktiviert
                                                 // Äußeren Rahmen der Titelleistenschaltfläche [-□×] reduzieren und transparent machen.
						 // Obere rechte Ecke der Tab-Leiste auf ihre ursprüngliche Größe zurücksetzen und
						 // Transparenz aufheben.
    TitleBar_Button_DisplayTime =       0.6	,// Dauer der Anzeige in Sekunden, nach der Rückkehr zur Originalgröße und dem Aufheben
	                                         // der Transparenz per Mouseover angeben.
    
                                                 // Tab-Höhe „UI-Dichte“
    UI_Density_Compact =               	29	,// Standard = 29 Pixelbei Kompakt
    UI_Density_Normal =                	36	,// Standard = 36 Pixel bei Normal
    UI_Density_Touch =                 	41	,// Standard = 41 Pixel bei Touch
                                                 // Entsprechender CSS Code in UserChrome.css wird vorrangig behandelt!

                                                 // Tab-Breite
                                                 // Bei gleichen Werten bei Min und Max, wird Tabbreite fixiert!
    Tab_Min_Width =                    	76	,// Standard - Mindestwert = 76px
    Tab_Max_Width =                    	225	,// Standard - Maxwert = 225px
                                                 // Entsprechender CSS Code in UserChrome.css wird vorrangig behandelt!

                                                 // „Tab schließen“ Schaltfläche
    Tab_Close_Button =                 	0	,// [0] = Standard
                                                 //  1  = Ausgeblendet
                                                 //  2  = Auf allen Tabs anzeigen
						 //  3  = Nur bei Mausberührung anzeigen

                                                 // .Tab-Drop-Indikator-Icon-Ersetzung.
    Tab_Drop_Indicator =               	false	,// [false] = Stecknadel Symbol 📍
                                                 // true    = Rote Linie (2px × 29px) als Symbol

                                                 // Angeheftete Tabs neu positionieren
    Separate_Tabs_and_PinnedTabs =     	false	,// [false] = Standard
                                                 // true    = Angeheftete Tabs von der Tab-Leiste lösen und in die darüber liegende 
						 // Zeile verschieben. Breite der angehefteten Tabs für die Position der 
						 // angehefteten Tabs „true“ anpassen.
    PinnedTab_Width =                   false	,// [false] = Kein Standard
                                                 //  true   = Breite angehefteter Tabs anpassen, z. B. „Tab-Breite“.
    PinnedTab_Min_Width =               76   	,// Standard Mindestbreite =  76 Pixel
    PinnedTab_Max_Width =               225   	,// Standard Maximalbreite = 225 Pixel
                                                 // Bei gleichen Werten ist die Breite fixiert.

                                                 // Tab-Leisten-Ziehbereich
    Left_Drag_Area =                   	0	,// Linker Ziehbereich Breite: Standard 40 Pixel
    Right_Drag_Area =                  	0	,// Rechter Ziehbereich Breite: Standard 40 Pixel
    Maximize_Left_Drag_Area =           false   ,// true = Linken Ziehbereich bei maximiertem Fenster anzeigen. Standard ausgeblendet.
    Fullscreen_Drag_Area =             	false	,// true = Linken und rechten Ziehbereich bei Vollbild anzeigen. Standard ausgeblendet.
                                                 // Alle Tabs Schaltfläche
    All_Tabs_Button =                  	false	,// [false] = ausblenden
                                                 // true    = anzeigen

                                                 // Firefox132 oder höher?
                                                 // Breite beim Öffnen/schließen, beim fahren mit der Maus über die vertikale Tab-Leiste
    VerticalTabs_MouseOver_OpenClose =  false	,// [false] Kein Standard. Drücken Sie im vertikalen Tab-Modus die Seitenleistentaste,  
	                                         // um die Breite zu vergrößern oder zu verkleinern.
                                                 // true  Unabhängig davon, welche Seitenleistenschaltfläche Sie im vertikalen Tab-Modus  
						 // auswählen, können Sie die Breite vergrößern oder verkleinern, indem Sie mit der Maus
                                                 // darüber fahren.

    // -- Config End --

    css = `

    #TabsToolbar:has([orient="horizontal"]) {

      :root[uidensity="compact"] & {
        --tab-min-height: ${UI_Density_Compact}px;
      }
      :root:not([uidensity]) & {
        --tab-min-height: ${UI_Density_Normal}px;
      }
      :root[uidensity="touch"] & {
         --tab-min-height: ${UI_Density_Touch}px;
      }

      ${Tab_Drop_Indicator ? `
        #tabbrowser-tabs > .tab-drop-indicator {
          background: url(
            data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAAdCAIAAAAPVCo9AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAASSURBVBhXY3growJEQ5+SUQEAOb1EM8kwskcAAAAASUVORK5CYII=
          ) no-repeat center !important;
        }
      ` : ``}

      .titlebar-spacer[type="pre-tabs"] {
        width: ${Left_Drag_Area}px;
      }
      .titlebar-spacer[type="post-tabs"] {
        width: ${Right_Drag_Area}px;
      }
      ${Maximize_Left_Drag_Area ? `
        .titlebar-spacer {
          :root[tabsintitlebar]:not([sizemode="normal"], [inFullscreen]) &[type="pre-tabs"] {
            display: block !important;
          }
        }
      ` : ``}
      ${Fullscreen_Drag_Area ? `
        .titlebar-spacer {
          :root[tabsintitlebar][inFullscreen] & {
            display: block !important;
          }
        }
      ` : ``}

      ${All_Tabs_Button ? `` : `
        #alltabs-button {
          display: none;
        }
      `}

      ${Separate_Tabs_and_PinnedTabs ? `
        #tabbrowser-tabs {
          padding: 0 !important;
          & + #new-tab-button {
            display: none !important;
          }

          #tabbrowser-arrowscrollbox {
            &:has(> .tabbrowser-tab[fadein][pinned]) {
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
            }
            .tabbrowser-tab[fadein] {
              &:not([pinned]) {
                #tabbrowser-tabs[haspinnedtabs] & {
                  &, & + :not(#tabs-newtab-button) {
                    order: 1;
                  }
                }
              }

              &[pinned] {
                .tab-loading-burst:after {
                  content: "📌";
                  font-size: 11px;
                  right: -2px;
                  position: absolute;
                  top: -2px;
                }
              }

              ${PinnedTab_Width ? `
                &[pinned] {
                  flex: 100 100;
                  max-width: ${PinnedTab_Max_Width}px;
                  min-width: ${PinnedTab_Min_Width}px;
                }
                .tab-throbber, .tab-icon-pending, .tab-icon-image, .tab-sharing-icon-overlay, .tab-icon-overlay {
                  &[pinned] {
                    margin-inline-end: 5.5px !important;
                  }
                }
              ` : ``}

            }
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

            ${MultiRowTab_on_MouseOver ? `
              max-height: calc(var(--tab-min-height) + ${Proton_Margins ? 8 : 0}px);
              scrollbar-width: none;
              transition: all 0s ease-in-out ${TabBar_MouseOver_DisplayTime}s;
              &:hover {
                max-height: calc((var(--tab-min-height) + ${Proton_Margins ? 8 : 0}px) * ${Max_Rows}) !important;
                scrollbar-width: auto !important;
                transition: none 0s !important;
              }
            ` : `
              max-height: calc((var(--tab-min-height) + ${Proton_Margins ? 8 : 0}px) * ${Max_Rows});
            `}

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

        .tabbrowser-tab[fadein]:not([pinned]) {
          max-width: ${Tab_Max_Width}px;
          min-width: ${Tab_Min_Width}px;

          ${Tab_Close_Button == 1 ? `
            .tab-close-button {
              display: none !important;
            }
          ` : Tab_Close_Button == 2 ? `
            .tab-close-button {
              display: block !important;
            }
          ` : Tab_Close_Button == 3 ? `
            .tab-close-button {
              opacity: 0;
            }
            &:hover .tab-close-button {
              display: block !important;
              opacity: 1;
            }
          ` : Tab_Close_Button == 4 ? `
            .tab-close-button {
              opacity: 0;
            }
            &:hover .tab-close-button,
            .tab-close-button[selected] {
              display: block !important;
              opacity: 1;
            }
          ` : ``}
        }

        #tabbrowser-tabs[haspinnedtabs]:not([positionpinnedtabs]):not([orient="vertical"]) > & {
          &  > .tabbrowser-tab:nth-child(1 of :not([pinned], [hidden])) {
            margin-inline-start: 0 !important;
          }
        }

      }

      ${Tab_Separators ? `
        .titlebar-spacer[type="pre-tabs"] {
          border-inline-end: 1px solid color-mix(in srgb, currentColor 20%, transparent);
        }
        .tabbrowser-tab {
          &::after,
          &::before {
            border-left: 1px solid color-mix(in srgb, currentColor 50%, transparent);
            height: calc(var(--tab-min-height) - 15%);
            margin-block: auto;
          }
          &:hover::after,
          &[multiselected]::after,
          #tabbrowser-tabs:not([movingtab]) &:has(+ .tabbrowser-tab:hover)::after,
          #tabbrowser-tabs:not([movingtab]) &:has(+ [multiselected])::after {
            height: 100%;
          }
          &::after,
          #tabbrowser-tabs[movingtab] &[visuallyselected]::before {
            display: block;
            content: "";
          }
        }
      ` : ``}

      ${Proton_Margins ? `` : `
        .tabbrowser-tab,
        .toolbarbutton-1 {
          padding: 0 !important;
        }
        .tabbrowser-tab,
        #tabs-newtab-button {
          height: var(--tab-min-height) !important;
        }
        .tab-background {
          box-shadow: none !important;
          margin-block: 0 !important;
        }
        .tabbrowser-tab[usercontextid] > .tab-stack > .tab-background > .tab-context-line {
          margin-block-start: 1px !important;
        }
      `}

    ${TabBar_Position == 0 ? `
      .titlebar-buttonbox-container {
        height: calc(var(--tab-min-height) + ${Proton_Margins ? 8 : 0}px);
      }

      ${TitleBarButton_Autohide ? `
        .titlebar-buttonbox-container {
          background-color: color-mix(in srgb, currentColor 20%, transparent);
          height: 6px !important;
          opacity: 0;
          position: fixed;
          right: 0;
          transition: all 0s ease-in-out ${TitleBarButton_DisplayTime}s;
          z-index: 2147483647;
          .titlebar-button {
            opacity: 0;
            padding: 0;
            transition: all 0s ease-in-out ${TitleBarButton_DisplayTime}s;
          }
          &:hover {
            height: calc(var(--tab-min-height) + ${Proton_Margins ? 8 : 0}px) !important;
            opacity: 1;
            transition: none 0s;
            .titlebar-button {
              opacity: 1;
              padding: 8px 17px;
              transition: none 0s;
            }
          }
        }
      ` : ``}

    }` : `}
      #nav-bar {
        :root:not([inFullscreen]) #toolbar-menubar:not([inactive]) + & {
          & > .titlebar-buttonbox-container {
            display: none;
          }
        }
        .titlebar-button {
          padding-block: 0;
        }
      }

      ${TabBar_Position == 2 ? `
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
              border-top: 0.5px solid transparent;
              & > #navigator-toolbox {
                max-height: 0;
              }
            }
          }
        }
      ` : ``}

    `}

    ${VerticalTabs_MouseOver_OpenClose ? `
      #sidebar-main:has(sidebar-main > [collapsed="false"]) {
        sidebar-main {
          #tabbrowser-arrowscrollbox {
            &[overflowing]:not([scrolledtoend]) {
              mask-image: none !important;
            }
          }
          &[expanded] {
            #tabbrowser-tabs[haspinnedtabs] {
              #vertical-pinned-tabs-container-separator {
                display: block !important;
              }
            }
          }
        }
        &:hover {
          sidebar-main {
            &[expanded] {
              #vertical-pinned-tabs-container-separator {
                width: 226px !important;
              }
              #tabbrowser-arrowscrollbox {
                .tabbrowser-tab {
                  .tab-close-button {
                    padding-inline-start: 4px !important;
                  }
                }
              }
            }
            &:not([expanded]) {
              #tabbrowser-tabs[haspinnedtabs] {
                #vertical-pinned-tabs-container {
                  display: flex !important;
                  flex-direction: column !important;
                }
              }
              .tabbrowser-tab {
                #vertical-pinned-tabs-container &,
                #tabbrowser-arrowscrollbox & {
                  width: 234px !important;
                  transition: none;
                  max-width: 234px !important;
                  .tab-background {
                    width: 226px !important;
                    max-width: 226px !important;
                  }
                  &:hover .tab-close-button,
                  .tab-close-button[selected],
                  .tab-label-container {
                    display: block !important;
                  }
                }
                #vertical-pinned-tabs-container & {
                  .tab-close-button {
                    padding-inline-start: 0px !important;
                  }
                }
                #tabbrowser-arrowscrollbox {
                  .tabbrowser-tab {
                    .tab-close-button {
                      padding-inline-end: 2px !important;
                    }
                  }
                }
                #tabbrowser-arrowscrollbox & {
                  #tabbrowser-tabs[overflow] & {
                    .tab-background {
                      width: 218px !important;
                    }
                  }
                }
                .tab-icon-image {
                  #vertical-pinned-tabs-container & {
                    margin-inline: 7px !important;
                  }
                  #tabbrowser-arrowscrollbox & {
                    padding-inline-end: 7.5px !important;
                  }
                }
              }
              [id*="tabs-newtab-button"] {
                width: 226px !important;
                .toolbarbutton-icon {
                  margin-inline-end: 2px !important;
                }
                .toolbarbutton-text {
                  display: block !important;
                }
              }
            }
          }
        }
        &:not(:hover) {
          * {
            font-size: 0 !important;
          }
          sidebar-main {
            width: 55px !important;
            #tabbrowser-arrowscrollbox::part(scrollbox),
            #vertical-pinned-tabs-container {
              scrollbar-width: none !important;
            }
            &[expanded] {
              #vertical-pinned-tabs-container {
                .tabbrowser-tab {
                 width: 38px !important;
                }
              }
              #vertical-pinned-tabs-container-separator {
                #tabbrowser-tabs[haspinnedtabs] & {
                  width: 36px !important;
                }
              }
              #tabbrowser-arrowscrollbox {
                .tabbrowser-tab {
                   width: 56px !important;
                  .tab-close-button {
                    display: none !important;
                  }
                }
              }
            }
          }
        }
      }
      #sidebar-main:has(sidebar-main:not([hidden]) > [collapsed="true"]) {
        &:not([expanded]) {
          width: 165px;
        }
      }
      .wrapper {
        :not(:hover) button-group:not(.bottom-actions) {
          moz-button {
            width: 55px !important;
          }
        }
        &:has(.bottom-actions) {
          moz-button {
            width: 170px !important;
          }
        }
      }
      button > span {
        &.button-background {
            width: 226px !important;
          &.labelled {
            & > img {
              margin-inline-start: 2px;
            }
          }
          &:not(.labelled) {
            width: 226px !important;
            max-width: 100%;
            & > img {
              margin-inline-start: 7px;
              & + label {
                text-align: start;
                width: 226px !important;
                & > slot:after {
                  font-size: var(--font-size-large);
                  font-weight: var(--font-weight);
                  margin-inline-start: 7px;
                }
              }
              &[src*="view-syncedtabs"] + label > slot:after {
                content: "他の端末からのタブ";
              }
              &[src*="view-history"] + label > slot:after {
                content: "履歴";
              }
              &[src*="bookmark-hollow"] + label > slot:after {
                content: "ブックマーク";
              }
              &[src*="category-general"] + label > slot:after {
                content: "サイドバーをカスタマイズ";
              }
            }
          }
        }
      }
    ` : ``}

    `,
    sss = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService),
    uri = Services.io.newURI("data:text/css;charset=UTF=8," + encodeURIComponent(css));
    ["0", "2", "dragend", "SSTabRestored", "TabAttrModified"].find(eventType => {
      if(!sss.sheetRegistered(uri, eventType)) sss.loadAndRegisterSheet(uri, eventType);
      if (TabBar_Rows == true) {
        gBrowser.tabContainer.addEventListener(eventType, (e) => {
          e.target.scrollIntoView({ behavior: "instant", block: "nearest" })
        })
      }
    })

    if (TabBar_Position == 1 || TabBar_Position == 2) {
      document.getElementById("nav-bar").appendChild(
        document.querySelector("#TabsToolbar > .titlebar-buttonbox-container")
      )
      document.getElementById("navigator-toolbox").prepend(
        document.getElementById("toolbar-menubar"),
        document.getElementById("nav-bar"),
        document.getElementById("PersonalToolbar"),
        document.adoptNode(document.getElementById("titlebar")),
      )
    }
    if (TabBar_Position == 2) {
      document.body.appendChild(
        document.createXULElement("tabbox")
      ).appendChild(
        document.importNode(document.getElementById("navigator-toolbox"))
      ).appendChild(
        document.adoptNode(document.getElementById("titlebar"))
      )
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
            (RTL_UI ? -1 : 1) * pixelsToScroll,
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
          // Pinned tabs in expanded vertical mode are on a grid format and require
          // different logic to drag and drop
          if (this._isContainerVerticalPinnedExpanded(draggedTab)) {
            this._animateExpandedPinnedTabMove(event);
            return;
          }
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

      var rect = arrowScrollbox.getBoundingClientRect();
      var newMargin, newMarginY;
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
        if (RTL_UI) {
          [minMargin, maxMargin] = [
            this.clientWidth - maxMargin,
            this.clientWidth - minMargin,
          ];
        }
        newMargin = pixelsToScroll > 0 ? maxMargin : minMargin;
      } else {
        let newIndex = this._getDropIndex(event);
        let children = this.allTabs;
        if (newIndex == children.length) {
          let tabRect = this._getVisibleTabs().at(-1).getBoundingClientRect();
          if (this.verticalMode) {
            newMargin = tabRect.bottom - rect.top;
          } else if (RTL_UI) {
            newMargin = rect.right - tabRect.left;
          } else {
            newMargin = tabRect.right - rect.left;
          }
            newMarginY = tabRect.top - rect.top + tabRect.height / 2 - rect.height / 2;
        } else {
          let tabRect = children[newIndex].getBoundingClientRect();
          if (this.verticalMode) {
            newMargin = rect.top - tabRect.bottom;
          } else if (RTL_UI) {
            newMargin = rect.right - tabRect.right;
          } else {
            newMargin = tabRect.left - rect.left;
          }
            newMarginY = tabRect.top - rect.top + tabRect.height / 2 - rect.height / 2;
        }
      }

      ind.hidden = false;
      newMargin += this.verticalMode ? ind.clientHeight : ind.clientWidth / 2;
      if (RTL_UI) {
        newMargin *= -1;
      }
      ind.style.transform = this.verticalMode
        ? "translateY(" + Math.round(newMargin) + "px)"
        : "translate(" + Math.round(newMargin) + "px, " + Math.round(newMarginY) + "px)";
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
        let oldTranslateX = Math.round(draggedTab._dragData.translateX);
        let oldTranslateY = Math.round(draggedTab._dragData.translateY);
        let tabWidth = Math.round(draggedTab._dragData.tabWidth);
        let tabHeight = Math.round(draggedTab._dragData.tabHeight);
        let translateOffsetX = oldTranslateX % tabWidth;
        let translateOffsetY = oldTranslateY % tabHeight;
        let newTranslateX = oldTranslateX - translateOffsetX;
        let newTranslateY = oldTranslateY - translateOffsetY;

        // Update both translate axis for pinned vertical expanded tabs
        if (oldTranslateX > 0 && translateOffsetX > tabWidth / 2) {
          newTranslateX += tabWidth;
        } else if (oldTranslateX < 0 && -translateOffsetX > tabWidth / 2) {
          newTranslateX -= tabWidth;
        }
        if (oldTranslateY > 0 && translateOffsetY > tabHeight / 2) {
          newTranslateY += tabHeight;
        } else if (oldTranslateY < 0 && -translateOffsetY > tabHeight / 2) {
          newTranslateY -= tabHeight;
        }

        let dropIndex;
        if (draggedTab._dragData.fromTabList) {
          dropIndex = this._getDropIndex(event);
        } else {
          dropIndex = this.verticalMode ?
            "animDropIndex" in draggedTab._dragData &&
            draggedTab._dragData.animDropIndex
            : this._getDropIndex(event);
        }
        let incrementDropIndex = true;
        if (dropIndex && dropIndex > movingTabs[0]._tPos) {
          dropIndex--;
          incrementDropIndex = false;
        }

        let shouldTranslate;
        if (this._isContainerVerticalPinnedExpanded(draggedTab)) {
          shouldTranslate =
            ((oldTranslateX && oldTranslateX != newTranslateX) ||
              (oldTranslateY && oldTranslateY != newTranslateY)) &&
            !gReduceMotion;
        } else if (this.verticalMode) {
          shouldTranslate =
            oldTranslateY && oldTranslateY != newTranslateY && !gReduceMotion;
        } else {
          shouldTranslate =
            oldTranslateX && oldTranslateX != newTranslateX && !gReduceMotion;
        }

        if (shouldTranslate) {
          for (let tab of movingTabs) {
            tab.toggleAttribute("tabdrop-samewindow", true);
            tab.style.transform = `translate(${newTranslateX}px, ${newTranslateY}px)`;
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

    gBrowser.tabContainer._isContainerVerticalPinnedExpanded = function(tab) {
      return (
        this.verticalMode &&
        tab.hasAttribute("pinned") &&
        this.hasAttribute("expanded")
      );
    }

    gBrowser.tabContainer._animateExpandedPinnedTabMove = function(event) {
      let draggedTab = event.dataTransfer.mozGetDataAt(TAB_DROP_TYPE, 0);
      let movingTabs = draggedTab._dragData.movingTabs;

      if (!this.hasAttribute("movingtab")) {
        this.toggleAttribute("movingtab", true);
        gNavToolbox.toggleAttribute("movingtab", true);
        if (!draggedTab.multiselected) {
          this.selectedItem = draggedTab;
        }
      }

      if (!("animLastScreenX" in draggedTab._dragData)) {
        draggedTab._dragData.animLastScreenX = draggedTab._dragData.screenX;
      }
      if (!("animLastScreenY" in draggedTab._dragData)) {
        draggedTab._dragData.animLastScreenY = draggedTab._dragData.screenY;
      }

      let screenX = event.screenX;
      let screenY = event.screenY;

      if (
        screenY == draggedTab._dragData.animLastScreenY &&
        screenX == draggedTab._dragData.animLastScreenX
      ) {
        return;
      }

      let tabs = this._getVisibleTabs().slice(0, gBrowser._numPinnedTabs);

      let directionX = screenX > draggedTab._dragData.animLastScreenX;
      let directionY = screenY > draggedTab._dragData.animLastScreenY;
      draggedTab._dragData.animLastScreenY = screenY;
      draggedTab._dragData.animLastScreenX = screenX;

      let tabWidth = draggedTab.getBoundingClientRect().width;
      let tabHeight = draggedTab.getBoundingClientRect().height;
      let shiftSizeX = tabWidth * movingTabs.length;
      let shiftSizeY = tabHeight;
      draggedTab._dragData.tabWidth = tabWidth;
      draggedTab._dragData.tabHeight = tabHeight;

      // In expanded vertical mode, 6 is the max number of pinned tabs per row
      const maxTabsPerRow = 6;

      // Move the dragged tab based on the mouse position.
      let firstTabInRow;
      let lastTabInRow;
      if (RTL_UI) {
        firstTabInRow =
          tabs.length >= maxTabsPerRow ? tabs[maxTabsPerRow - 1] : tabs.at(-1);
        lastTabInRow = tabs[0];
      } else {
        firstTabInRow = tabs[0];
        lastTabInRow =
          tabs.length >= maxTabsPerRow ? tabs[maxTabsPerRow - 1] : tabs.at(-1);
      }
      let firstMovingTabScreenX = movingTabs.at(-1).screenX;
      let firstMovingTabScreenY = movingTabs.at(-1).screenY;
      let lastMovingTabScreenX = movingTabs[0].screenX;
      let lastMovingTabScreenY = movingTabs[0].screenY;
      let translateX = screenX - draggedTab._dragData.screenX;
      let translateY = screenY - draggedTab._dragData.screenY;
      let firstBoundX = firstTabInRow.screenX - lastMovingTabScreenX;
      let firstBoundY = firstTabInRow.screenY - lastMovingTabScreenY;
      let lastBoundX =
        lastTabInRow.screenX +
        lastTabInRow.getBoundingClientRect().width -
        (firstMovingTabScreenX + tabWidth);
      let lastBoundY =
        tabs.at(-1).screenY +
        lastTabInRow.getBoundingClientRect().height -
        (firstMovingTabScreenY + tabHeight);
      translateX = Math.min(Math.max(translateX, firstBoundX), lastBoundX);
      translateY = Math.min(Math.max(translateY, firstBoundY), lastBoundY);

      for (let tab of movingTabs) {
        tab.style.transform = `translate(${translateX}px, ${translateY}px)`;
      }

      draggedTab._dragData.translateX = translateX;
      draggedTab._dragData.translateY = translateY;

      // Determine what tab we're dragging over.
      // * Single tab dragging: Point of reference is the center of the dragged tab. If that
      //   point touches a background tab, the dragged tab would take that
      //   tab's position when dropped.
      // * Multiple tabs dragging: All dragged tabs are one "giant" tab with two
      //   points of reference (center of tabs on the extremities). When
      //   mouse is moving from top to bottom, the bottom reference gets activated,
      //   otherwise the top reference will be used. Everything else works the same
      //   as single tab dragging.
      // * We're doing a binary search in order to reduce the amount of
      //   tabs we need to check.

      tabs = tabs.filter(t => !movingTabs.includes(t) || t == draggedTab);
      let firstTabCenterX = lastMovingTabScreenX + translateX + tabWidth / 2;
      let lastTabCenterX = firstMovingTabScreenX + translateX + tabWidth / 2;
      let tabCenterX = directionX ? lastTabCenterX : firstTabCenterX;
      let firstTabCenterY = lastMovingTabScreenY + translateY + tabWidth / 2;
      let lastTabCenterY = firstMovingTabScreenY + translateY + tabWidth / 2;
      let tabCenterY = directionY ? lastTabCenterY : firstTabCenterY;

      let newIndex = -1;
      let oldIndex =
        "animDropIndex" in draggedTab._dragData
          ? draggedTab._dragData.animDropIndex
          : movingTabs[0]._tPos;

      let low = 0;
      let high = tabs.length - 1;
      let shiftNumber = maxTabsPerRow - movingTabs.length;

      let getTabShift = (tab, dropIndex) => {
        if (tab._tPos < draggedTab._tPos && tab._tPos >= dropIndex) {
          // If tab is at the end of a row, shift back and down
          let tabRow = Math.ceil((tab._tPos + 1) / maxTabsPerRow);
          let shiftedTabRow = Math.ceil(
            (tab._tPos + 1 + movingTabs.length) / maxTabsPerRow
          );
          if (tab._tPos && tabRow != shiftedTabRow) {
            return [
              RTL_UI
                ? tabWidth * shiftNumber + tabWidth / 2
                : -tabWidth * shiftNumber - tabWidth / 2,
              shiftSizeY,
            ];
          }
          return [RTL_UI ? -shiftSizeX : shiftSizeX, 0];
        }
        if (tab._tPos > draggedTab._tPos && tab._tPos < dropIndex) {
          // If tab is not index 0 and at the start of a row, shift across and up
          let tabRow = Math.floor(tab._tPos / maxTabsPerRow);
          let shiftedTabRow = Math.floor(
            (tab._tPos - movingTabs.length) / maxTabsPerRow
          );
          if (tab._tPos && tabRow != shiftedTabRow) {
            return [
              RTL_UI
                ? -tabWidth * shiftNumber - tabWidth / 2
                : tabWidth * shiftNumber + tabWidth / 2,
              -shiftSizeY,
            ];
          }
          return [RTL_UI ? shiftSizeX : -shiftSizeX, 0];
        }
        return [0, 0];
      };

      while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        if (tabs[mid] == draggedTab && ++mid > high) {
          break;
        }
        let shift = getTabShift(tabs[mid], oldIndex);
        screenX = tabs[mid].screenX + shift[0];
        screenY = tabs[mid].screenY + shift[1];

        if (screenY + tabHeight < tabCenterY) {
          low = mid + 1;
        } else if (screenY > tabCenterY) {
          high = mid - 1;
        } else if (screenX > tabCenterX) {
          high = mid - 1;
        } else if (screenX + tabWidth < tabCenterX) {
          low = mid + 1;
        } else {
          newIndex = tabs[mid]._tPos;
          break;
        }
      }

      if (newIndex >= oldIndex) {
        newIndex++;
      }

      if (newIndex < 0 || newIndex == oldIndex) {
        return;
      }
      draggedTab._dragData.animDropIndex = newIndex;

      // Shift background tabs to leave a gap where the dragged tab
      // would currently be dropped.
      for (let tab of tabs) {
        if (tab != draggedTab) {
          let [shiftX, shiftY] = getTabShift(tab, newIndex);
          tab.style.transform =
            shiftX || shiftY ? `translate(${shiftX}px, ${shiftY}px)` : "";
        }
      }
    }

}
