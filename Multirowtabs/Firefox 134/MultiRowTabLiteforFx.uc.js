// ==UserScript==
// @name           MultiRowTabLiteforFx.uc.js
// @namespace      Based on Alice0775's zzzz-MultiRowTab_LiteforFx48.uc.js
// @description    Mehrzeilige Tableiste - Experimentelle CSS Version
// @include        main
// @compatibility  Firefox133+
// @version        2024/11/25 12:00
// ==/UserScript==
"use strict";

MultiRowTabLiteforFx();
function MultiRowTabLiteforFx() {
if (!window.gBrowser) { return; }

    // -- Config --
    // Vergleichbarer CSS Code in userChrome.css Datei wird vorrangig behandelt!

    const                                   	    		// Mehrzeilige Tableiste Ein/Aus Anzahl der Tabzeilen
    MultiRowTab_OnOff_and_TabBar_Rows =     		-1     ,// [-1] = Mehrzeilige Tableiste aktiv unbegrenzte Anzahl von Zeilen.
                                            	    	 	//  0   = Mehrzeilige Tableiste aus.
                                            	    		//  1   = Mehrzeilige Tableiste aktiv. Standard = 1 Zeile. Bei Berührung
								//        der Tableise mit der der Maus, werden die zweite und die folgenden Zeilen
                                                         	//        bis zur angegebenen Anzahl von Zeilen angezeigt.
	                                                        //  2   = Mehrzeilige Tableiste aktiv. Anzahl der Tabzeilen angeben.
	    
    TabBar_Rows_on_MouseOver =              		 3     ,// Standard = 1 Zeile. Anzahl der Zeilen angeben, die angezeigt werden sollen, 
	                                                        // wenn der Mauszeiger über die Tableiste bewegt wird. Voraussetzung: 
								// „MultiRowTab_OnOff_and_TabBar_Rows“ auf „1“ setzen.
	    
    TabBar_DisplayTime_on_MouseOver =       		 1     ,// Sie können die Anzeigezeit (Sekunden) festlegen, wann die zweite und die folgenden
	                                                        // Zeilen beim Mouseover angezeigt werden. Das Display zeigt den eingestellten Wert 
								// (Sekunden) an und kehrt dann zur ersten Zeile zurück.

								 // Position der Tab-Leiste.
    TabBar_Position =              	    		0       ,// [0] = Standard
								 // 1   = unter der Symbolleiste
								 // 2   = unter dem Fenster
	    
								 // Tab-Höhe „UI-Dichte“
    UI_Density_Compact =               			29	,// Standard = 29 Pixelbei Kompakt
    UI_Density_Normal =                			36	,// Standard = 36 Pixel bei Normal
    UI_Density_Touch =                 			41	,// Standard = 41 Pixel bei Touch

								 // Tab-Breite
    Tab_Min_Width =                    			76	,// Standard - Mindestwert = 76px
    Tab_Max_Width =                    			225	,// Standard - Maxwert = 225px
								 // Bei gleichen Werten bei Min und Max, wird die Tabbreite fixiert!

								 // „Tab schließen“ Schaltfläche
    Tab_Close_Button =                 			0	,// [0] = Standard
								 //  1  = Ausgeblendet
								 //  2  = Auf allen Tabs anzeigen
								 //  3  = Nur bei Mausberührung anzeigen
								 //  4  = Aktive Tabs werden immer angezeigt, inaktive Tabs
								 // werden beim Mouseover angezeigt. *Standard für vertikalen Tab-Modus.

								 // ProtonUI Erscheinungsbild der Tabs ändern
    Proton_Margins =                   			true    ,// [true] = Darstellung ProtonUI
								 // Die Höhe der Tab-Leiste entspricht der Höhe der UI-Dichte plus dem Leerraum darüber
								 // und darunter.                                                 
								 // false  = Darstellung wie bei browser.proton.enabled auf false, was man vor Firefox 90
								 // noch einstellen konnte.
								 // Wenn der Leerraum um die Tabs auf 0 und die Höhe auf die UI-Dichte eingestellt
								 // ist, ist sie 4 Pixel breiter und 8 Pixel niedriger als die Standardeinstellung.
								 
								 // Ränder auf der linken und rechten Seite der Tabs
    Tab_Separators  =                  			false   ,// [false] = Nicht anzeigen
								 // true    = Anzeigen
								 // Rahmen CSS wurde extrahiert und angepasst, an Aussehen wie bei browser.proton.enabled
								 // auf false, was man vor Firefox 90 noch einstellen konnte.
	    
								 // Voraussetzung: „TabBar_Position“ auf „0“ setzen.
    TitleBar_Button_Autohide =         			false	,// [false] = Aktiviert
								 // true    = Deaktiviert
	    
								 // Äußeren Rahmen der Titelleistenschaltfläche [-□×] reduzieren und transparent machen.
    TitleBar_Button_DisplayTime =       		0.6	,// Dauer der Anzeige in Sekunden, nach der Rückkehr zur Originalgröße und dem Aufheben
								 // der Transparenz per Mouseover angeben.

								 // Tab-Leiste von Anfang an auf die angegebene Höhe einstellen.
								 // Voraussetzung: „MultiRowTab_OnOff_and_TabBar_Rows“ auf „2“ oder höher setzen.
    Set_the_TabBar_to_the_Specified_Height =		false	,// [false] = Die Tab-Leiste wird höher, wenn der nächsten Zeile weitere Tabs hinzugefügt werden.
                                            	    	 	 //  true   = Verwendung: Die Tab-Leiste wird von Anfang an auf die angegebene Höhe eingestellt 

                                            	    	 	 // „.tabDropIndicator“, der beim Ziehen und Ablegen eines Tabs angezeigt wird, ersetzen.
                                            	    	 	 // Voraussetzung: „MultiRowTab_OnOff_and_TabBar_Rows“ auf einen anderen Wert als „0“ setzen.
    Tab_Drop_Indicator =                    		false	,// [false] = Stecknadel Symbol 📍
								 // true    = Rote Linie (2px × 29px) als Symbol

                                            	    	 	 // Position der angepinnten Tabs
                                            	    	 	 // Voraussetzung: „MultiRowTab_OnOff_and_TabBar_Rows“ auf einen Wert ungleich „0“ setzen.
    Separate_Tabs_and_PinnedTabs =     			false	,// [false] = Standard
								 // true    = Angeheftete Tabs von der Tab-Leiste lösen und in die darüber liegende 
								 // Zeile verschieben. Breite der angehefteten Tabs für die Position der 
								 // angehefteten Tabs „true“ anpassen.

    PinnedTab_Width =                   		false	,// [false] = Kein Standard
								 //  true   = Breite angehefteter Tabs anpassen, z. B. „Tab-Breite“.

    PinnedTab_Min_Width =               		76   	,// Standard Mindestbreite =  76 Pixel
    PinnedTab_Max_Width =               		225   	,// Standard Maximalbreite = 225 Pixel
								 // Bei gleichen Werten ist die Breite fixiert.

                                            	    	 	 // Angeheftete Tab, Schließen Schaltfläche
                                            	    	 	 // Voraussetzung: „Separate_Tabs_and_PinnedTabs“ auf „true“ setzen.
    PinnedTab_Close_Button =                		0   	,// [0] = Standard
                                            	    	 	 //  1  = auf allen Tabs sichtbar
                                            	    		 //  2  = auf Tab bei Mouseover anzeigen
                                            	    	 	 //  3  = Aktiver Tab immer sichtbar, inaktiver Tab bei Mouseover sichtbar *Standard für vertikalen Tab-Modus.

								 // Tab-Leisten-Ziehbereich
    Left_Drag_Area =                   			0	,// Linker Ziehbereich Breite: Standard 40 Pixel
    Right_Drag_Area =                  			0	,// Rechter Ziehbereich Breite: Standard 40 Pixel
    Maximize_Left_Drag_Area =   	    		false   ,// true = Linken Ziehbereich bei maximiertem Fenster anzeigen. Standard ausgeblendet.
    Fullscreen_Drag_Area =             			false	,// true = Linken und rechten Ziehbereich bei Vollbild anzeigen. Standard ausgeblendet.
								 // Wenn die Titelleiste angezeigt wird, funktioniert sie nicht als Drag-Bereich, selbst
								 // wenn „.titlebar-spacer“ angezeigt wird. Daher habe ich dafür gesorgt, dass sie nichts bewirkt.

								 // Öffnen/schließen Sie die horizontale Breite, indem Sie mit der Maus über die Tab-Leiste 
								 // eines vertikalen Tabs fahren. Firefox 133 oder höher?
    VerticalTabs_MouseOver_OpenClose =  		false	,// [false] Kein Standard. Drücken Sie im vertikalen Tab-Modus die Seitenleistentaste,  
								 // um die Breite zu vergrößern oder zu verkleinern.
							         // true  Unabhängig davon, welche Seitenleistenschaltfläche Sie im vertikalen Tab-Modus  
								 // auswählen, können Sie die Breite vergrößern oder verkleinern, indem Sie mit der Maus
								 // darüber fahren.

    // -- Config End --

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
          .tab-label-container,
          .tab-close-button {
            height: var(--tab-min-height);
            max-height: 24px;
          }
          .tab-close-button {
            padding-block: 0;
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
            :root[tabsintitlebar] #toolbar-menubar[autohide="true"] ~ &,
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
          script, toolbar:not(#TabsToolbar) {
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
          :root[tabsintitlebar]:not([sizemode="normal"], [inFullscreen]) &[type="pre-tabs"] {
            display: flex;
          }
        ` : ``}
        ${Fullscreen_Drag_Area ? `
          :root[tabsintitlebar][inFullscreen] & {
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

    ${VerticalTabs_MouseOver_OpenClose ? `
      #sidebar-main {
        &:has(sidebar-main:not([hidden]) > [collapsed="true"]) {
          width: 165px;
        }
        &:has(sidebar-main > [collapsed="false"]) {
          sidebar-main {
            &[expanded] {
              #tabbrowser-tabs[haspinnedtabs] {
                #vertical-pinned-tabs-container-separator {
                  display: flex;
                }
              }
            }
          }
          &:hover {
            sidebar-main {
              &[expanded] {
                #tabbrowser-arrowscrollbox {
                  .tabbrowser-tab {
                    .tab-close-button {
                      padding-inline-start: 4px;
                    }
                  }
                }
              }
              &:not([expanded]) {
                #tabbrowser-tabs[haspinnedtabs] {
                  #vertical-pinned-tabs-container {
                    display: flex;
                    flex-direction: column;
                  }
                }
                .tabbrowser-tab {
                  #vertical-pinned-tabs-container &,
                  #tabbrowser-arrowscrollbox & {
                    max-width: 234px;
                    width: 234px;
                    .tab-background {
                      width: 226px;
                    }
                    &:hover .tab-close-button,
                    .tab-close-button[selected],
                    .tab-label-container {
                      display: flex;
                    }
                  }
                  #vertical-pinned-tabs-container & {
                    .tab-close-button {
                      margin-inline-end: 1px;
                    }
                  }
                  #tabbrowser-arrowscrollbox & {
                    #tabbrowser-tabs[overflow] & {
                      @media not (-moz-overlay-scrollbars) {
                        .tab-background {
                          width: 218px !important;
                        }
                      }
                    }
                  }
                  .tab-icon-image {
                    #vertical-pinned-tabs-container & {
                      margin-inline: 6.5px;
                    }
                    #tabbrowser-arrowscrollbox & {
                      padding-inline-end: 7.5px;
                    }
                  }
                }
                [id*="tabs-newtab-button"] {
                  width: 226px !important;
                  .toolbarbutton-icon {
                    margin-inline-end: 2px;
                  }
                  .toolbarbutton-text {
                    display: flex !important;
                  }
                }
              }
            }
          }
          &:not(:hover) {
            * {
              font-size: 0;
            }
            sidebar-main {
              width: 48px !important;
              #tabbrowser-arrowscrollbox::part(scrollbox),
              #vertical-pinned-tabs-container {
                scrollbar-width: none;
              }
              #vertical-pinned-tabs-container-separator {
                #tabbrowser-tabs[haspinnedtabs] & {
                  width: 29px;
                }
              }
              &[expanded] {
                #vertical-pinned-tabs-container {
                  .tabbrowser-tab {
                   width: 36px;
                  }
                }
                #tabbrowser-arrowscrollbox {
                  .tabbrowser-tab {
                     width: 49px;
                    .tab-close-button {
                      display: none;
                    }
                  }
                }
              }
            }
          }
        }
      }
      button > span {
        &.button-background:has(img) {
          width: 226px !important;
          &:not(.labelled) {
            & > img {
              @media (-moz-bool-pref: "sidebar.verticalTabs") {
                margin-inline: 5px 7px;
              }
              @media not (-moz-bool-pref: "sidebar.verticalTabs") {
                margin-inline: 7px 6.5px;
              }
              & + label {
                text-align: start;
                width: 226px;
                & > slot:after {
                  font-size: var(--font-size-large);
                  font-weight: var(--font-weight);
                }
              }
              &[src$="synced-tabs.svg"] + label > slot:after {
                content: "Tabs von anderen Geräten";
              }
              &[src$="history.svg"] + label > slot:after {
                content: "Chronik";
              }
              &[src$="bookmark-hollow.svg"] + label > slot:after {
                content: "Lesezeichen";
              }
              &[src$="settings.svg"] + label > slot:after {
                content: "Seitenleiste anpassen";
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

      if (this.verticalMode || MultiRowTab_OnOff_and_TabBar_Rows == 0) {

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

      let draggedTab = event.dataTransfer.mozGetDataAt(TAB_DROP_TYPE, 0);
      if (
        (effects == "move" || effects == "copy") &&
        this == draggedTab.container &&
        !draggedTab._dragData.fromTabList
      ) {
        ind.hidden = true;

     // if (this.#isAnimatingMoveTogetherSelectedTabs()) {
     //   // Wait for moving selected tabs together animation to finish.
     //   return;
     // }
        this._finishMoveTogetherSelectedTabs(draggedTab);

        if (effects == "move") {
          // Pinned tabs in expanded vertical mode are on a grid format and require
          // different logic to drag and drop.
       // if (this.#isContainerVerticalPinnedExpanded(draggedTab)) {
       //   this.#animateExpandedPinnedTabMove(event);
       //   return;
       // }
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
        if (newIndex === children.length) {
          tabRect = this.visibleTabs.at(-1).getBoundingClientRect();
          if (this.verticalMode) {
            newMargin = tabRect.bottom - rect.top;
          } else if (RTL_UI) {
            newMargin = rect.right - tabRect.left;
          } else {
            newMargin = tabRect.right - rect.left;
          }
        } else {
          tabRect = children[newIndex].getBoundingClientRect();
          if (this.verticalMode) {
            newMargin = rect.top - tabRect.bottom;
          } else if (RTL_UI) {
            newMargin = rect.right - tabRect.right;
          } else {
            newMargin = tabRect.left - rect.left;
          }
        }
        newMarginY = tabRect.top - rect.top + tabRect.height / 2 - rect.height / 2;
      }

      ind.hidden = false;
      newMargin += this.verticalMode ? ind.clientHeight : ind.clientWidth / 2;
      if (RTL_UI) {
        newMargin *= -1;
      }
      ind.style.transform = this.verticalMode
        ? "translateY(" + Math.round(newMargin) + "px)"
        : MultiRowTab_OnOff_and_TabBar_Rows == 0
        ? "translateX(" + Math.round(newMargin) + "px)"
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
        draggedTab.container._finishMoveTogetherSelectedTabs(draggedTab);
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
          dropIndex = this.verticalMode || MultiRowTab_OnOff_and_TabBar_Rows == 0
            ? "animDropIndex" in draggedTab._dragData && draggedTab._dragData.animDropIndex
            : this._getDropIndex(event);
        }
        let incrementDropIndex = true;
        if (dropIndex && dropIndex > movingTabs[0]._tPos) {
          dropIndex--;
          incrementDropIndex = false;
        }

        let shouldTranslate =
          !gReduceMotion && !("groupDropIndex" in draggedTab._dragData);
     // if (this.#isContainerVerticalPinnedExpanded(draggedTab)) {
     //   shouldTranslate &&=
     //     (oldTranslateX && oldTranslateX != newTranslateX) ||
     //     (oldTranslateY && oldTranslateY != newTranslateY);
     // } else
        if (this.verticalMode) {
          shouldTranslate &&= oldTranslateY && oldTranslateY != newTranslateY;
        } else {
          shouldTranslate &&= oldTranslateX && oldTranslateX != newTranslateX;
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
          let groupTab =
            "groupDropIndex" in draggedTab._dragData
              ? this.allTabs[draggedTab._dragData.groupDropIndex]
              : null;
          this._finishAnimateTabMove();
          if (dropIndex !== false) {
            for (let tab of movingTabs) {
              gBrowser.moveTabTo(tab, dropIndex);
              if (incrementDropIndex) {
                dropIndex++;
              }
            }
          }
          if (groupTab) {
            gBrowser.addTabGroup([groupTab, ...movingTabs], {
              insertBefore: draggedTab,
            });
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
