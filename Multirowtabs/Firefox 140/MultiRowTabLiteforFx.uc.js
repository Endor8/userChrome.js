// ==UserScript==
// @name           MultiRowTabLiteforFx.uc.js
// @namespace      Based on Alice0775's zzzz-MultiRowTab_LiteforFx48.uc.js
// @description    Mehrzeilige Tableiste - Experimentelle CSS Version
// @include        main
// @compatibility  Firefox 140+
// @version        2025/06/30 12:00
// @note           Wenn Sie das Gefühl haben, dass Tab-Gruppen beim Reinziehen zu schnell 
//                 geöffnet und geschlossen werden, oder dass Tabs beim Reinziehen von Links 
//                 zu schnell ausgewählt werden, versuchen Sie, diese Werte in about:config 
//                 zu erhöhen, z. B. 
//                 browser.tabs.dragDrop.selectTab.delayMS:800, 
//                 browser.tabs.dragDrop.expandGroup.delayMS:1000.
// ==/UserScript==
"use strict";

MultiRowTabLiteforFx();
function MultiRowTabLiteforFx() {
if (!window.gBrowser) { return; }

    // -- Config --
							    // Vergleichbarer CSS Code in userChrome.css Datei wird vorrangig behandelt!

    const                                   	    	    // Mehrzeilige Tableiste Ein/Aus Anzahl der Tabzeilen
    MultiRowTab_OnOff_and_TabBar_Rows =     	-1         ,// [-1] = Mehrzeilige Tableiste aktiv unbegrenzte Anzahl von Zeilen.
                                            	    	    //  0   = Mehrzeilige Tableiste aus.
                                            	    	    //  1   = Mehrzeilige Tableiste aktiv. Standard = 1 Zeile. Bei Berührung
							    //        der Tableiste mit der der Maus, werden die zweite und die folgenden 
                                                            //        Zeilen bis zur angegebenen Anzahl von Zeilen angezeigt.
	                                                    //  2   = Mehrzeilige Tableiste aktiv. Anzahl der Tabzeilen angeben.
    TabBar_Rows_on_MouseOver =              	3   	   ,// Standard = 1 Zeile. Anzahl der Zeilen angeben, die angezeigt werden sollen, 
	                                                    // wenn der Mauszeiger über die Tableiste bewegt wird. Voraussetzung: 
							    // „MultiRowTab_OnOff_and_TabBar_Rows“ auf „1“ setzen.
	    
    TabBar_DisplayTime_on_MouseOver =       	1    	   ,// Sie können die Anzeigezeit (Sekunden) festlegen, wann die zweite und die 
	                                                    // folgenden Zeilen beim Mouseover angezeigt werden. Das Display zeigt den  
							    // eingestellten Wert(Sekunden) an und kehrt dann zur ersten Zeile zurück.

                                            	    	    // Position der Tab-Leiste.
    TabBar_Position =          	    	    	0    	   ,// [0] = Standard
							    // 1   = unter der Symbolleiste
							    // 2   = unter dem Fenster

							    // Positionen der Tab-Leiste und der Lesezeichen-Symbolleiste tauschen.
							    // sofern die Position der Tab-Leiste unterhalb der Symbolleiste festgelegt ist.
							    // Voraussetzung: "TabBar_Position" auf "1".
    Bookmark_Toolbar_Position =             	true	   ,// [true] = Menüleiste, Navigationsleiste, Lesezeichenleiste, Tableiste
							    // false = Menüleiste, Navigationsleiste, Tableiste, Lesezeichensymbolleiste

							    // Tab-Höhe „UI-Dichte“
    UI_Density_Compact =               		29	   ,// Standard = 29 Pixelbei Kompakt
    UI_Density_Normal =                		36	   ,// Standard = 36 Pixel bei Normal
    UI_Density_Touch =                 		41	   ,// Standard = 41 Pixel bei Touch

							    // Tab-Breite
    Tab_Min_Width =                    		76	   ,// Standard - Mindestwert = 76px
    Tab_Max_Width =                    		225	   ,// Standard - Maxwert = 225px
							    // Bei gleichen Werten bei Min und Max, wird die Tabbreite fixiert!

							    // „Tab schließen“ Schaltfläche
    Tab_Close_Button =                 		0	   ,// [0] = Standard
							    //  1  = Ausgeblendet
							    //  2  = Auf allen Tabs anzeigen
							    //  3  = Nur bei Mausberührung anzeigen
							    //  4  = Aktive Tabs werden immer angezeigt, inaktive Tabs
							    // werden beim Mouseover angezeigt. *Standard für vertikalen Tab-Modus.

							    // ProtonUI Erscheinungsbild der Tabs ändern
    Proton_Margins =                   		true       ,// [true] = Darstellung ProtonUI
					    		    // Die Höhe der Tab-Leiste entspricht der Höhe der UI-Dichte plus dem Leerraum darüber
							    // und darunter.                                                 
							    // false  = Darstellung wie bei browser.proton.enabled auf false, was man vor Firefox 90
							    // noch einstellen konnte.
							    // Wenn der Leerraum um die Tabs auf 0 und die Höhe auf die UI-Dichte eingestellt
							    // ist, ist sie 4 Pixel breiter und 8 Pixel niedriger als die Standardeinstellung.
 
							    // Ränder auf der linken und rechten Seite der Tabs
    Tab_Separators  =                  		false      ,// [false] = Nicht anzeigen
							    // true    = Anzeigen
							    // Rahmen CSS wurde extrahiert und angepasst, an Aussehen wie bei browser.proton.enabled
							    // auf false, was man vor Firefox 90 noch einstellen konnte.
	
							    // Voraussetzung: „TabBar_Position“ auf „0“ setzen.
    TitleBar_Button_Autohide =         		false	   ,// [false] = Aktiviert
							    // true    = Deaktiviert
	    
							    // Äußeren Rahmen der Titelleistenschaltfläche [-□×] reduzieren und transparent machen.
    TitleBar_Button_DisplayTime =       	0.6	   ,// Dauer der Anzeige in Sekunden, nach der Rückkehr zur Originalgröße und dem Aufheben
							    // der Transparenz per Mouseover angeben.

							    // Tab-Leiste von Anfang an auf die angegebene Höhe einstellen.
							    // Voraussetzung: „MultiRowTab_OnOff_and_TabBar_Rows“ auf „2“ oder höher setzen.
    Set_the_TabBar_to_the_Specified_Height =	false  	   ,// [false] = Die Tab-Leiste wird höher, wenn der nächsten Zeile weitere Tabs hinzugefügt werden.
                                            	    	    //  true   = Verwendung: Die Tab-Leiste wird von Anfang an auf die angegebene Höhe eingestellt 

                                         	    	    // „.tabDropIndicator“, der beim Ziehen und Ablegen eines Tabs angezeigt wird, ersetzen.
                                            	    	    // Voraussetzung: „MultiRowTab_OnOff_and_TabBar_Rows“ auf einen anderen Wert als „0“ setzen.
    Tab_Drop_Indicator =                    	false  	   ,// [false] = Stecknadel Symbol 📍
							    // true    = Rote Linie (2px × 29px) als Symbol

                                            	     	    // Position der angepinnten Tabs
                                            	    	    // Voraussetzung: „MultiRowTab_OnOff_and_TabBar_Rows“ auf einen Wert ungleich „0“ setzen.
    Separate_Tabs_and_PinnedTabs =     		false  	   ,// [false] = Standard
							    // true    = Angeheftete Tabs von der Tab-Leiste lösen und in die darüber liegende 
							    // Zeile verschieben. Breite der angehefteten Tabs für die Position der 
							    // angehefteten Tabs „true“ anpassen.

    PinnedTab_Width =                   	false	   ,// [false] = Kein Standard
							    //  true   = Breite angehefteter Tabs anpassen, z. B. „Tab-Breite“.

    PinnedTab_Min_Width =               	76   	   ,// Standard Mindestbreite =  76 Pixel
    PinnedTab_Max_Width =               	225   	   ,// Standard Maximalbreite = 225 Pixel
							    // Bei gleichen Werten ist die Breite fixiert.

                                            	    	    // Angeheftete Tab, Schließen Schaltfläche
                                            	    	    // Voraussetzung: „Separate_Tabs_and_PinnedTabs“ auf „true“ setzen.
    PinnedTab_Close_Button =                	0   	   ,// [0] = Standard
							    //  1  = auf allen Tabs sichtbar
							    //  2  = auf Tab bei Mouseover anzeigen
							    //  3  = Aktiver Tab immer sichtbar, inaktiver Tab bei Mouseover sichtbar 
							    // *Standard für vertikalen Tab-Modus.
 
							    // Tab-Leisten-Ziehbereich
    Left_Drag_Area =                   		0	   ,// Linker Ziehbereich Breite: Standard 40 Pixel
    Right_Drag_Area =                  		0	   ,// Rechter Ziehbereich Breite: Standard 40 Pixel
    Maximize_Left_Drag_Area =   	    	false      ,// true = Linken Ziehbereich bei maximiertem Fenster anzeigen. Standard ausgeblendet.
    Fullscreen_Drag_Area =             		false	   ,// true = Linken und rechten Ziehbereich bei Vollbild anzeigen. Standard ausgeblendet.
							    // Wenn die Titelleiste angezeigt wird, funktioniert sie nicht als Drag-Bereich, selbst
							    // wenn „.titlebar-spacer“ angezeigt wird. Daher habe ich dafür gesorgt, dass sie nichts bewirkt.
    // -- Config Ende --

    css = `

    #TabsToolbar:not([collapsed="true"]) {

      :root[uidensity="compact"] & {
        --tab-min-height: ${UI_Density_Compact}px;
      }
      :root:not([uidensity]) & {
        --tab-min-height: ${UI_Density_Normal}px;
      }
      :root[uidensity="touch"] & {
        --tab-min-height: ${UI_Density_Touch}px;
      }
      
&[dragtarget] {
    z-index: unset !important;
    position: unset !important;
    pointer-events: unset !important; /* avoid blocking dragover events on scroll buttons */
}
#tabbrowser-tabs[movingtab] & {
   position: unset !important;
}
#tabbrowser-tabs[movingtab] &:is(:active, [multiselected]) {
    position: relative;
    z-index: 2;
    pointer-events: none; /* avoid blocking dragover events on scroll buttons */
}

      #tabbrowser-tabs {
        min-height: calc(var(--tab-min-height) + ${Proton_Margins ? 8 : 0}px);

        ${MultiRowTab_OnOff_and_TabBar_Rows != 0 ? `
          &[overflow] {
            padding-inline: 0 !important;
            & > #tabbrowser-arrowscrollbox {
              & > .tabbrowser-tab[pinned] {
                display: flex;
                margin-inline-start: 0 !important;
                position: static !important;
              }
              &::part(scrollbox) {
                padding-inline: 0;
              }
            }
            & + #new-tab-button {
              display: none;
            }
          }

          ${Tab_Drop_Indicator ? `
            & > .tab-drop-indicator {
              background: url(
                data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAAdCAIAAAAPVCo9AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAASSURBVBhXY3growJEQ5+SUQEAOb1EM8kwskcAAAAASUVORK5CYII=
              ) no-repeat center;
            }
          ` : ``}

          #tabbrowser-arrowscrollbox {
            &::part(scrollbox) {
              & > slot {
                flex-wrap: wrap;
              }

              ${MultiRowTab_OnOff_and_TabBar_Rows != -1 ? `
                ${MultiRowTab_OnOff_and_TabBar_Rows == 1 ? `
                  ${TabBar_Rows_on_MouseOver == 0 || TabBar_Rows_on_MouseOver == 1 ? `
                    max-height: calc((var(--tab-min-height) + ${Proton_Margins ? 8 : 0}px) * 2);
                  ` : `
                    max-height: calc((var(--tab-min-height) + ${Proton_Margins ? 8 : 0}px) * ${TabBar_Rows_on_MouseOver});
                  `}
                  &:not(:hover) {
                    max-height: calc(var(--tab-min-height) + ${Proton_Margins ? 8 : 0}px) !important;
                    ${Proton_Margins ? `scrollbar-width: none;` : ``}
                    transition: all 0s ease-in-out ${TabBar_DisplayTime_on_MouseOver}s;
                  }
                ` : `
                  ${Set_the_TabBar_to_the_Specified_Height ? `
                    min-height: calc((var(--tab-min-height) + ${Proton_Margins ? 8 : 0}px) * ${MultiRowTab_OnOff_and_TabBar_Rows});
                    & > slot {
                      max-height: calc(var(--tab-min-height) + ${Proton_Margins ? 8 : 0}px);
                    }
                  ` : `
                    max-height: calc((var(--tab-min-height) + ${Proton_Margins ? 8 : 0}px) * ${MultiRowTab_OnOff_and_TabBar_Rows});
                  `}
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

            ${Separate_Tabs_and_PinnedTabs ? `
              &:has(> .tabbrowser-tab[fadein][pinned]) {
                &::part(scrollbox) {
                  & > slot::after {
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
                  .tab-background:after {
                    content: "📌";
                    font-size: 11px;
                    right: -2px;
                    position: absolute;
                    top: -2px;
                  }

                  ${PinnedTab_Width ? `
                    flex: 100 100;
                    max-width: ${PinnedTab_Max_Width}px;
                    min-width: ${PinnedTab_Min_Width}px;
                    .tab-throbber, .tab-icon-pending, .tab-icon-image, .tab-sharing-icon-overlay, .tab-icon-overlay {
                      margin-inline-end: 5.5px !important;
                    }

                    ${PinnedTab_Close_Button == 1 ? `
                      .tab-close-button {
                        display: flex;
                      }
                    ` : PinnedTab_Close_Button == 2 ? `
                      .tab-close-button {
                        display: none;
                      }
                      &:hover .tab-close-button {
                        display: flex;
                      }
                    ` : PinnedTab_Close_Button == 3 ? `
                      &:not([selected]):hover,
                      &[selected] {
                        .tab-close-button {
                          display: flex;
                        }
                      }
                    ` : ``}

                  ` : ``}

                }
              }
            ` : ``}

            #tabbrowser-tabs[haspinnedtabs]:not([positionpinnedtabs]):not([orient="vertical"]) > & {
              &  > .tabbrowser-tab:nth-child(1 of :not([pinned], [hidden])) {
                margin-inline-start: 0 !important;
              }
            }

          }
        ` : ``}
      }

      .tabbrowser-tab[fadein]:not([pinned]) {
        max-width: ${Tab_Max_Width}px;
        min-width: ${Tab_Min_Width}px;

        ${Tab_Close_Button == 1 ? `
          .tab-close-button {
            display: none;
          }
        ` : Tab_Close_Button == 2 ? `
          .tab-close-button {
            display: flex;
          }
        ` : Tab_Close_Button == 3 ? `
          .tab-close-button {
            display: none;
          }
          &:hover .tab-close-button {
            display: flex;
          }
        ` : Tab_Close_Button == 4 ? `
          &:not([selected]):hover {
            .tab-close-button {
              display: flex;
            }
          }
        ` : ``}

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
            display: flex;
            content: "";
          }
        }
      ` : ``}

      ${Proton_Margins ? `` : `
        .tabbrowser-tab,
        .toolbarbutton-1 {
          padding: 0;
        }
        .tabbrowser-tab,
        #tabs-newtab-button {
          height: var(--tab-min-height);
        }
        .tabbrowser-tab {
          .tab-background {
            box-shadow: none;
            margin-block: 0;
          }
          .tab-label-container {
            height: var(--tab-min-height);
            max-height: 24px;
          }
          .tab-close-button {
            height: 20px !important;
            padding-block: 3px !important;
          }
          &[usercontextid] > .tab-stack > .tab-background > .tab-context-line {
            margin-block-start: 1px !important;
          }
        }
      `}

    ${TabBar_Position == 0 ? `
      .titlebar-buttonbox-container {
        height: calc(var(--tab-min-height) + ${Proton_Margins ? 8 : 0}px);
      }

      ${TitleBar_Button_Autohide ? `
        & > .titlebar-buttonbox-container {
          background-color: color-mix(in srgb, currentColor 20%, transparent);
          position: fixed;
          right: 0;
          &:not(:hover) {
            height: 6px;
            .titlebar-button {
              padding: 0;
            }
            &,& .titlebar-button {
              opacity: 0;
              transition: all 0s ease-in-out ${TitleBar_Button_DisplayTime}s;
            }
          }
        }
      ` : ``}

    }` : `

      ${TabBar_Position == 1 || TabBar_Position == 2 ? `
        & > .titlebar-buttonbox-container {
            display: none;
        }}
        #nav-bar {
          &:not(.browser-titlebar) {
            :root[customtitlebar] #toolbar-menubar[autohide="true"] ~ &,
            :root[inFullscreen] #toolbar-menubar ~ & {
              & > .titlebar-buttonbox-container {
                display: flex;
              }
            }
          }
          .titlebar-button {
            padding-block: 0;
          }
        }
      ` : ``}

      body:has(> #navigator-toolbox:not([tabs-hidden])) {
        ${TabBar_Position == 1 ? `
          script, toolbar:not(#TabsToolbar ${Bookmark_Toolbar_Position ? `` : `, #PersonalToolbar`}) {
            order: -1;
          }
        ` : TabBar_Position == 2 ? `
          & > #fullscr-toggler[hidden] + tabbox,
          :root[inFullscreen] & > tabbox:hover {
            border-top: 0.01px solid var(--chrome-content-separator-color);
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
                display: flex;
              }
            }
            & > tabbox:not(:hover) {
              border-top: 0.01px solid transparent;
              & > #navigator-toolbox {
                display: none;
              }
            }
          }
        ` : ``}
      }

    `}

    toolbar[id$="bar"].browser-titlebar {
      .titlebar-spacer {
        &[type="pre-tabs"] {
          width: ${Left_Drag_Area}px;
        }
        &[type="post-tabs"] {
          width: ${Right_Drag_Area}px;
        }
        ${Maximize_Left_Drag_Area ? `
          :root[customtitlebar]:not([sizemode="normal"], [inFullscreen]) &[type="pre-tabs"] {
            display: flex;
          }
        ` : ``}
        ${Fullscreen_Drag_Area ? `
          :root[customtitlebar][inFullscreen] & {
            display: flex;
          }
        ` : ``}
      }
      #navigator-toolbox[tabs-hidden] & {
        #new-tab-button {
          display: none;
        }
      }
    }

    `,
    sss = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService),
    uri = Services.io.newURI("data:text/css;charset=UTF=8," + encodeURIComponent(css));
    ["0", "2", "dragend", "SSTabRestored", "TabAttrModified"].find(eventType => {
      if(!sss.sheetRegistered(uri, eventType)) sss.loadAndRegisterSheet(uri, eventType);
      if (MultiRowTab_OnOff_and_TabBar_Rows > 0) {
        gBrowser.tabContainer.addEventListener(eventType, (e) => {
          e.target.scrollIntoView({ behavior: "instant", block: "nearest" })
        })
      }
    })

    if (TabBar_Position == 2) {
      document.body.appendChild(
        document.createXULElement("tabbox")
      ).appendChild(
        document.importNode(document.getElementById("navigator-toolbox"))
      ).appendChild(
        document.adoptNode(document.getElementById("TabsToolbar"))
      )
    }

    gBrowser.tabContainer._getDropIndex = function(event) {
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
        const tabPos = gBrowser.tabContainer.getIndexOfItem(tabToDropAt);

        if (window.getComputedStyle(this).direction == "ltr") {
            let rect = tabToDropAt.getBoundingClientRect();
            if (event.clientX < rect.x + rect.width / 2)
                return tabPos;
            else 
                return tabPos + 1;
            
        } else {
            let rect = tabToDropAt.getBoundingClientRect();
            if (event.clientX > rect.x + rect.width / 2)
                return tabPos;
            else
                return tabPos + 1;
        }
    };

    // We set this to check if the listeners were added before
    let listenersActive = false;

gBrowser.tabContainer.startTabDrag = function    startTabDrag(event, tab, { fromTabList = false } = {}) {
  const isTab = element => gBrowser.isTab(element);
  const isTabGroup = element => gBrowser.isTabGroup(element);
  const isTabGroupLabel = element => gBrowser.isTabGroupLabel(element);
      if (tab.multiselected) {
        for (let multiselectedTab of gBrowser.selectedTabs.filter(
          t => t.pinned != tab.pinned
        )) {
          gBrowser.removeFromMultiSelectedTabs(multiselectedTab);
        }
      }

      let dataTransferOrderedTabs;
      if (fromTabList || isTabGroupLabel(tab)) {
        // Dragging a group label or an item in the all tabs menu doesn't
        // change the currently selected tabs, and it's not possible to select
        // multiple tabs from the list, thus handle only the dragged tab in
        // this case.
        dataTransferOrderedTabs = [tab];
      } else {
        this.selectedItem = tab;
        let selectedTabs = gBrowser.selectedTabs;
        let otherSelectedTabs = selectedTabs.filter(
          selectedTab => selectedTab != tab
        );
        dataTransferOrderedTabs = [tab].concat(otherSelectedTabs);
      }

      let dt = event.dataTransfer;
      for (let i = 0; i < dataTransferOrderedTabs.length; i++) {
        let dtTab = dataTransferOrderedTabs[i];
        dt.mozSetDataAt(TAB_DROP_TYPE, dtTab, i);
        if (isTab(dtTab)) {
          let dtBrowser = dtTab.linkedBrowser;

          // We must not set text/x-moz-url or text/plain data here,
          // otherwise trying to detach the tab by dropping it on the desktop
          // may result in an "internet shortcut"
          dt.mozSetDataAt(
            "text/x-moz-text-internal",
            dtBrowser.currentURI.spec,
            i
          );
        }
      }

      // Set the cursor to an arrow during tab drags.
      dt.mozCursor = "default";

      // Set the tab as the source of the drag, which ensures we have a stable
      // node to deliver the `dragend` event.  See bug 1345473.
      dt.addElement(tab);

      // Create a canvas to which we capture the current tab.
      // Until canvas is HiDPI-aware (bug 780362), we need to scale the desired
      // canvas size (in CSS pixels) to the window's backing resolution in order
      // to get a full-resolution drag image for use on HiDPI displays.
      let scale = window.devicePixelRatio;
      let canvas = this._dndCanvas;
      if (!canvas) {
        this._dndCanvas = canvas = document.createElementNS(
          "http://www.w3.org/1999/xhtml",
          "canvas"
        );
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.mozOpaque = true;
      }

      canvas.width = 160 * scale;
      canvas.height = 90 * scale;
      let toDrag = canvas;
      let dragImageOffset = -16;
      let browser = isTab(tab) && tab.linkedBrowser;
      if (isTabGroupLabel(tab)) {
        toDrag = tab;
      } else if (gMultiProcessBrowser) {
        var context = canvas.getContext("2d");
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);

        let captureListener;
        let platform = AppConstants.platform;
        // On Windows and Mac we can update the drag image during a drag
        // using updateDragImage. On Linux, we can use a panel.
        if (platform == "win" || platform == "macosx") {
          captureListener = function () {
            dt.updateDragImage(canvas, dragImageOffset, dragImageOffset);
          };
        } else {
          // Create a panel to use it in setDragImage
          // which will tell xul to render a panel that follows
          // the pointer while a dnd session is on.
          if (!this._dndPanel) {
            this._dndCanvas = canvas;
            this._dndPanel = document.createXULElement("panel");
            this._dndPanel.className = "dragfeedback-tab";
            this._dndPanel.setAttribute("type", "drag");
            let wrapper = document.createElementNS(
              "http://www.w3.org/1999/xhtml",
              "div"
            );
            wrapper.style.width = "160px";
            wrapper.style.height = "90px";
            wrapper.appendChild(canvas);
            this._dndPanel.appendChild(wrapper);
            document.documentElement.appendChild(this._dndPanel);
          }
          toDrag = this._dndPanel;
        }
        // PageThumb is async with e10s but that's fine
        // since we can update the image during the dnd.
        PageThumbs.captureToCanvas(browser, canvas)
          .then(captureListener)
          .catch(e => console.error(e));
      } else {
        // For the non e10s case we can just use PageThumbs
        // sync, so let's use the canvas for setDragImage.
        PageThumbs.captureToCanvas(browser, canvas).catch(e =>
          console.error(e)
        );
        dragImageOffset = dragImageOffset * scale;
      }
      dt.setDragImage(toDrag, dragImageOffset, dragImageOffset);

      // _dragData.offsetX/Y give the coordinates that the mouse should be
      // positioned relative to the corner of the new window created upon
      // dragend such that the mouse appears to have the same position
      // relative to the corner of the dragged tab.
      let clientPos = ele => {
        const rect = ele.getBoundingClientRect();
        return this.verticalMode ? rect.top : rect.left;
      };

      let tabOffset = clientPos(tab) - clientPos(this);

      let movingTabs = tab.multiselected ? gBrowser.selectedTabs : [tab];
      let movingTabsSet = new Set(movingTabs);

      tab._dragData = {
        offsetX: this.verticalMode
          ? event.screenX - window.screenX
          : event.screenX - window.screenX - tabOffset,
        offsetY: this.verticalMode
          ? event.screenY - window.screenY - tabOffset
          : event.screenY - window.screenY,
        scrollPos:
          this.verticalMode && tab.pinned
            ? this.verticalPinnedTabsContainer.scrollPosition
            : this.arrowScrollbox.scrollPosition,
        screenX: event.screenX,
        screenY: event.screenY,
        movingTabs,
        movingTabsSet,
        fromTabList,
        tabGroupCreationColor: gBrowser.tabGroupMenu.nextUnusedColor,
        expandGroupOnDrop: false,
      };

      event.stopPropagation();

    }
    // This sets when to apply the fix (by default a new row starts after the 23th open tab, unless you changed the min-size of tabs)
    gBrowser.tabContainer.addEventListener("dragstart", () => {
        // Multiple tab select fix
        gBrowser.visibleTabs.forEach(t => t.style.transform = "");

        // Event handling
        if (!listenersActive) {
            gBrowser.tabContainer.getDropEffectForTabDrag = function(){};
            gBrowser.tabContainer._getDropEffectForTabDrag = function(){};
            gBrowser.tabContainer.on_dragover = (dragoverEvent) => performTabDragOver(dragoverEvent);
            gBrowser.tabContainer._onDragOver = (dragoverEvent) => performTabDragOver(dragoverEvent);
            gBrowser.tabContainer.ondrop = (dropEvent) => performTabDropEvent(dropEvent);
            gBrowser.tabContainer.ondragleave = (ondragleave) => {gBrowser.tabContainer._dragTime = 0};
            gBrowser.tabContainer.ondragend = (ondragend) => clearTimeout(dragovertimer);
            listenersActive = true;
        }
    });
}

var lastKnownIndex = null;
var lastGroupStart = null;
var lastGroupEnd = null;
let dragovertimer = null;
let lasttabgroup = null;

/**
 * Gets the tab from the event target.
 * @param {*} event The event.
 * @returns The tab if it was part of the target or its parents, otherwise null
 */
function getTabFromEventTarget(event, { ignoreTabSides = false } = {}) {
    let { target } = event;
    if (target.nodeType != Node.ELEMENT_NODE) {
        target = target.parentElement;
    }
    let tab = target?.closest("tab") || target?.closest("tab-group");
    const selectedTab = gBrowser.selectedTab;
    if (tab && ignoreTabSides) {
        let { width, height } = tab.getBoundingClientRect();
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

/**
 * Performs the tab drag over event.
 * @param {*} event The drag over event.
 */
function performTabDragOver(event) {
    event.preventDefault();
    event.stopPropagation();

    let ind = gBrowser.tabContainer._tabDropIndicator;

    let effects = orig_getDropEffectForTabDrag(event);
    let tab;
    if (effects == "link") {
      tab = getTabFromEventTarget(event, true);
      if (tab) {
        if (!gBrowser.tabContainer._dragTime)
          gBrowser.tabContainer._dragTime = Date.now();
        if (!tab.hasAttribute("pendingicon") && // annoying fix
            Date.now() >= gBrowser.tabContainer._dragTime + Services.prefs.getIntPref("browser.tabs.dragDrop.selectTab.delayMS")) {
            gBrowser.selectedTab = tab;
            ind.hidden = true;
            return;
        }
      }
    }

    if (!tab) {
        tab = getTabFromEventTarget(event, false);
    }
    if (tab?.nodeName == "tab-group") {
      if(lasttabgroup !== tab) {
        lasttabgroup = tab
        clearTimeout(dragovertimer);
        dragovertimer = setTimeout((tabgroup) => {
          tabgroup.collapsed = !tabgroup.collapsed
        }, Services.prefs.getIntPref("browser.tabs.dragDrop.expandGroup.delayMS"), tab);
      }
    } else {
      clearTimeout(dragovertimer);
      lasttabgroup = null;
    }



    let newIndex = gBrowser.tabContainer._getDropIndex(event);
    if (newIndex == null)
        return;

    // Update the last known index and group position
    lastKnownIndex = newIndex;
    
    if (tab?.nodeName == "tab-group" && !lastGroupStart) {
        lastGroupStart = tab.querySelector("tab:first-of-type")._tPos;
        lastGroupEnd = tab.querySelector("tab:last-of-type")._tPos;
    }

    let tabs = gBrowser.tabs;
    let ltr = (window.getComputedStyle(gBrowser.tabContainer).direction == "ltr");
    let rect = gBrowser.tabContainer.arrowScrollbox.getBoundingClientRect();
    let newMarginX, newMarginY;

   if (newIndex == tabs.length) {
        let tabRect = tabs[newIndex - 1].getBoundingClientRect();
        if (ltr)
            newMarginX = tabRect.right - rect.left;
        else
            newMarginX = rect.right - tabRect.left;
        newMarginY = tabRect.top + tabRect.height - rect.top - rect.height; // multirow fix

        if (CSS.supports("offset-anchor", "left bottom")) // Compatibility fix for FF72+
            newMarginY += rect.height / 2 - tabRect.height / 2;
        
    } else if (newIndex != null || newIndex != 0) {
        let tabRect = tabs[newIndex].getBoundingClientRect();
        if (ltr)
            newMarginX = tabRect.left - rect.left;
        else
            newMarginX = rect.right - tabRect.right;
        newMarginY = tabRect.top + tabRect.height - rect.top - rect.height; // multirow fix

        if (CSS.supports("offset-anchor", "left bottom")) // Compatibility fix for FF72+
            newMarginY += rect.height / 2 - tabRect.height / 2;
    }

    newMarginX += ind.clientWidth / 2;
    if (!ltr)
        newMarginX *= -1;

    ind.hidden = false;

    ind.style.transform = "translate(" + Math.round(newMarginX) + "px," + Math.round(newMarginY) + "px)"; // multirow fix
    ind.style.marginInlineStart = (-ind.clientWidth) + "px";
}

/**
 * Performs the tab drop event.
 * @param {*} event The drop event.
 */
function performTabDropEvent(event) {
    clearTimeout(dragovertimer);
    let newIndex;
    let dt = event.dataTransfer;
    let dropEffect = dt.dropEffect;
    let draggedTab;
    if (dt.mozTypesAt(0)[0] == TAB_DROP_TYPE) {
        draggedTab = dt.mozGetDataAt(TAB_DROP_TYPE, 0);
        if (!draggedTab) {
            return;
        }
    }

    if (draggedTab && dropEffect != "copy" && draggedTab.container == gBrowser.tabContainer) {
        newIndex = gBrowser.tabContainer._getDropIndex(event);

        let selectedTabs = gBrowser.selectedTabs.length > 1 ? gBrowser.selectedTabs : [draggedTab];
        let tabToMoveAt = gBrowser.tabContainer.getItemAtIndex(newIndex);
        let tab = getTabFromEventTarget(event, false);
        let tabgroup = tab?.closest("tab-group");
        if (!tab) {
          newIndex = gBrowser.tabs.length;
          tabToMoveAt = null;
        }
        if (tab?.pinned && !selectedTabs[0].pinned) {
          selectedTabs.forEach(t => gBrowser.pinTab(t));
          if (tabToMoveAt == tab) {
            selectedTabs.forEach(t => {gBrowser.moveTabBefore(t, tab)});
          } else {
            selectedTabs.forEach(t => {gBrowser.moveTabBefore(t, tabToMoveAt)});
          }
          return;
        } else if(!tab?.pinned && selectedTabs[0].pinned) {
          selectedTabs.forEach(t => gBrowser.unpinTab(t));
        }

        if (tabgroup && !tabgroup.previousSibling) {
          newIndex = 0; 
          selectedTabs.forEach(t => {gBrowser.moveTabTo(t, { tabIndex: newIndex++,forceUngrouped:true});});
        } else if (!tab || 
            !tabgroup && !tabToMoveAt?.group || 
            tabgroup && tabToMoveAt?.group) {
          if (tab !== tabToMoveAt) {
            tabToMoveAt = gBrowser.tabContainer.getItemAtIndex(newIndex -1);
            selectedTabs.forEach(t => {gBrowser.moveTabAfter(t, tabToMoveAt); tabToMoveAt = t});
          } else {
            selectedTabs.forEach(t => {gBrowser.moveTabBefore(t, tabToMoveAt)});
          }
        } else  {
          tabToMoveAt = gBrowser.tabContainer.getItemAtIndex(newIndex -1);
          selectedTabs.forEach(t => {gBrowser.moveTabAfter(t, tabToMoveAt); tabToMoveAt = t});
        }

        // Restart global vars
        lastKnownIndex = null;
        lastGroupStart = null;
        lastGroupEnd = null;
    }
}

// copy of the original and overrided _getDropEffectForTabDrag method
function orig_getDropEffectForTabDrag(event) {
    let dt = event.dataTransfer;

    let isMovingTabs = dt.mozItemCount > 0;
    for (let i = 0; i < dt.mozItemCount; i++) {
        // tabs are always added as the first type
        let types = dt.mozTypesAt(0);
        if (types[0] != TAB_DROP_TYPE) {
            isMovingTabs = false;
            break;
        }
    }

    if (isMovingTabs) {
        let sourceNode = dt.mozGetDataAt(TAB_DROP_TYPE, 0);
        if (XULElement.isInstance(sourceNode) &&
            sourceNode.localName == "tab" &&
            sourceNode.ownerGlobal.isChromeWindow &&
            sourceNode.ownerDocument.documentElement.getAttribute("windowtype") ==
            "navigator:browser" &&
            sourceNode.ownerGlobal.gBrowser.tabContainer == sourceNode.container) {
            // Do not allow transfering a private tab to a non-private window
            // and vice versa.
            if (PrivateBrowsingUtils.isWindowPrivate(window) !=
                PrivateBrowsingUtils.isWindowPrivate(sourceNode.ownerGlobal))
                return "none";
        

            if (window.gMultiProcessBrowser !=
                sourceNode.ownerGlobal.gMultiProcessBrowser)
                return "none";
        

            if (window.gFissionBrowser != sourceNode.ownerGlobal.gFissionBrowser)
                return "none";
        

            return dt.dropEffect == "copy" ? "copy" : "move";
        }
    }

    if (Services.droppedLinkHandler.canDropLink(event, true)) 
        return "link";

    return "none";
}
