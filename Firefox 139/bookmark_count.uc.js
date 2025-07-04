//bookmark_count.uc.js, RC_5 Rudolf
//Ende Juni 2025
//Zeigt Anzahl der Lesezeichenordner und Links an in Lesezeichenpopups
//RC_5 R: Verblassen bei 0 leichter einstellbar, Fehlerkorrekturen, Standardfarben sollten sich jetzt an Themes anpassen, Aufraeumen
//basiert auf Script von BrokenHeart =>
//https://www.camp-firefox.de/forum/thema/136572-nur-die-anzeige-der-ordner-lesezeichenanzahl-in-einer-anderen-farbe-darstellen/?postID=1269879#post1269879
//Release Candidate 5.R =>
//https://www.camp-firefox.de/forum/thema/136572-nur-die-anzeige-der-ordner-lesezeichenanzahl-in-einer-anderen-farbe-darstellen/?postID=1274447#post1274447

(function() {
    if (!window.gBrowser)
        return;
    setTimeout(function() {
        setFunction();
    },50);

    //Einstellungen Javascript =>
    //Nach Script Aenderungen Neustart mit Start-Cache loeschen => about:support

    //Eigenes Icon erwartet in Profilordner/chrome/icons, icons Ordner falls noetig erstellen
    //Eigene Icons eintragen, falls vorhanden
    let ProfilePath = PathUtils.toFileURI(PathUtils.join(PathUtils.profileDir, 'chrome', 'icons'));
    let bm_icon1 = 'YourFolderIcon.svg';        //  Custom  Folder Icon
    let bm_icon2 = 'YourLinkIcon.svg';          //  Custom  Link Icon
    //Variablen zur Auswahl der Icons; kein Auto Fallback falls eigenes Icon nicht vorhanden
    let bm_icon_folder = 0;      //  Ordner: 0 Firefox Fallback Icon / 1 eigenes Icon
    let bm_icon_link = 0;        //  Links:  0 Firefox Fallback Icon / 1 eigenes Icon

    //Variablen zur Auswahl der Klammern
    let bm_bracket = 0;           //  0 keine Klammern / 1 runde Klammern / 2 eckige Klammern
    //Variablen zur Auswahl der Reihenfolge
    let bm_order = 0;             //  0 Icons links Ziffern rechts / 1 Ziffern links Icons rechts

    //Variablen zur Auswahl der Farben
    let bm_colors = 0;            //  0 Standardfarben / 1 eigene Farben benutzen

    //Verblassen bei Zahl = 0
    let bm_opacity_null = 1;      //  0 kein Verblassen / 1 Verblassen Zahl, Icon, Trennlinie / 2 Verblassen nur Zahl

    //Variablen zur Auswahl der Trennlinie
    //  0 ohne Trennlinie
    //  1 ohne Trennlinie / Zaehler #1 = 0 => Zaehler #1 + Icon #2 wird versteckt
    //  2 mit Trennlinie
    //  3 mit Trennlinie nur bei Zaehler #1 > 0 / Zaehler #1 = 0 => Zaehler #1 + Icon #2 wird versteckt
    let trenner = 2;
    //  Trennlinie Inhalt, beliebige Textzeichen
    let trennzeichen = '|';

    function setFunction() {
        const css =`

       /*
       Einstellungen CSS , OPTIONAL =>
       #A Zaehler (Counter) anpassen,
       #B Feinabstimmung allgemein,
       #C Feinabstimmung Zentrierung Trennlinie,
       #D Eigene Farben, Verblassen,
       #E Allgemeines,
       #F Optionale Extras.
       */

       /*** User Einstellungen ***/

       /* ------ A ------ */

       /** Feste Breite der beiden Counter, abhaengig von Anzahl Ziffern, AUTO Anpassung für mit/ohne Klammern.
          Falls noetig => Werte erhoehen NUR bis Icons untereinander auf gleicher Hoehe sind **/

       /* Beispiel: 2 Ziffern plus Klammern, Systemfont Mac */
       #bmContent:is(
       [data-value1^='['],
       [data-value1^='(']) {
          --bm_width_one: 2.1em;
          --bm_width_two: 2.1em;
          }
       /* Beispiel: 2 Ziffern ohne Klammern, Systemfont Mac */
       #bmContent {
          --bm_width_one: 1.3em;
          --bm_width_two: 1.3em;

       /* ------ B ------ */

       /** Abstaende / Groessen fuer die Counter = Basisanpassungen **/

          /* Abstand mittig zwischen Counter #1 <=> Counter #2 / wird x2 benutzt */
          --bm_margin_mid: 8px;

          /* Groesse Icons = 16px Firefox Standard */
          --bm_icon_size: 16px;

          /* Abstand zwischen Icon und Ziffer */
          --bm_space: 4px;
          }

       /* ------ C ------ */

       /** Trennlinie , fuer trenner = 2/3 **/

       /* Feinabstimmung Zentrierung Mitte / Standard = 0px */
       #bmContent.trennclass {
          --bm_divider: 0px;
          }
       /* Fuer Reihenfolge/ Order = 1 */
       #bmContent.trennclass.order_2 {
          --bm_divider: 0.3em;
          }
       /* Element Trennlinie allgemein */
       #trennID {
          display: flex;
          align-items: center;
          font-size: calc(1em - 1px);        /* Hoehe, optional */
          padding-bottom: 1px;               /* ausrichten vertikal, optional */
          color: var(--trenn_color, currentColor);
          }

       /* ------ D ------ */

       /* Eigene Farben, fuer bm_colors = 1 */
       /* Farben Text / kompatible svg Icons aendern , anpassen nach Belieben */
       /* Info: HSL Farben: https://www.w3schools.com/css/css_colors_hsl.asp */
       /* Ordner Icon, Zahl / Links Icon, Zahl / Trennlinie */
       #bmContent.bm_my_colors {
          --folder_fill:  hsl(190, 60%, 20%, 1);
          --folder_color: hsl(190, 20%, 30%, 1);
          --link_fill:    hsl(35, 100%, 20%, 1);
          --link_color:   hsl(35, 60%, 30%, 1);
          --trenn_color:  hsl(250, 60%, 30%, 1);
          }

       /* Grad des Verblassens bei Zahl = 0, fuer bm_opacity_null = 1/2 */
       #bmContent {
          --bm_opacity: 50%;
          }

       /* ------ E ------ */

       /** Counter gesamt **/

       #bmContent {
          display: flex !important;
          -moz-context-properties: fill, fill-opacity;
          margin-left: auto !important;         /* Gesamt rechtsbuendig */
          /*margin-right: -8px !important;*/    /* Abstand rechts zu Pfeil > ist evtl. OS abhaengig, optional */
          height: var(--bm_icon_size);          /* Layout passt sich Icon Groesse an */
          padding-left: 8px;                    /* min. Abstand links Gesamt für enge Popups */

       /* Font Aenderungen , optional */
          /* font-family: Aenderungen nicht empfohlen => einheitlichen Standardfont behalten */
          /*font-size: 12px !important;*/       /* font-size */
          /*font-weight: 200 !important;*/      /* font-weight */
          }

       /* ------ F ------ */

       /** Optionale Extras **/

       /* Text vertikal ausrichten */
       /*
       #bmContent::after,
       #bmContent::before {
          padding-top: 3px;
          }
          */

       /* Pfeil rechts > bei Beidem = 0 */
       .bookmark-item.bm_chevron_00 > .menu-right,
       .bookmark-item.bm_chevron_00::after {
          fill: hsl(30, 100%, 50%, 1) !important;
          fill-opacity: 0.7 !important;
          }

       /* Hide empty Popup */
       .bookmark-item.bm_chevron_00 > menupopup[emptyplacesresult] {
          display: none !important;
          }

       /** Pfeil rechts > allgemein **/
       /*
       menu.bookmark-item .menu-right,
       menu.bookmark-item::after {
           fill: hsl(210, 100%, 50%, 1) !important;
           fill-opacity: 1 !important;
           }
           */

       /*** User Einstellungen Ende ***/


       /*** Feste Werte ***/

       /** Reihenfolge Varianten Icons / Ziffern **/
       /* order 0: Icons links / Ziffern rechts */
       #bmContent {
            --bm_padding_inline: calc(var(--bm_icon_size) + var(--bm_space)) 0;
            --bm_bg_position: center left;
            }
       /* order 1: Ziffern links / Icons rechts */
       #bmContent.order_2 {
            --bm_padding_inline: 0 calc(var(--bm_icon_size) + var(--bm_space));
            --bm_bg_position: center right;
            }

       /** Icons Varianten **/
       /* Eigene Icons, falls Icons existieren im icons Ordner */
       #bmContent {
            --bm_icon_image_1: url("${ProfilePath}/${bm_icon1}");
            --bm_icon_image_2: url("${ProfilePath}/${bm_icon2}");
            }
       /* Firefox Icons Fallback */
       #bmContent.icon_fallback_folder {
            --bm_icon_image_1: url("chrome://global/skin/icons/folder.svg");
            }
       #bmContent.icon_fallback_link {
            --bm_icon_image_2: url("chrome://browser/skin/bookmark-hollow.svg");
            }

       /** Anpassungen bei Zahl = 0 **/
       /* Verstecken #1 automatisch bei Trennlinie 1/3 , beides = 0 */
       #bmContent:is(.trennclass_1, .trennclass_3)::before {
            display: none !important;
            }
       /* Verstecken Icon #2 , Trennlinie 1/3 , beides = 0 */
       #bmContent.Null_1.Null_2:is(.trennclass_1, .trennclass_3)::after {
            /*content: "X";*/             /* eigener Inhalt */
            background-image: linear-gradient(transparent, transparent);
            }
       /* Verblassen Icon + Zahl, fuer #1 , #2 , Alles Zahl = 0 */
       #bmContent.opacity_Null:is(.Null_1:not(.Null_2), .Null_1.Null_2)::before,
       #bmContent.opacity_Null:is(.Null_2:not(.Null_1), .Null_1.Null_2)::after,
       #bmContent.opacity_Null:is(.Null_1, .Null_2) #trennID {
            filter: opacity(var(--bm_opacity));
            }
       /* Verblassen nur Zahl */
       #bmContent.opacity_Null_B:is(.Null_1:not(.Null_2), .Null_1.Null_2)::before {
            -webkit-text-fill-color: color-mix(in srgb, var(--folder_color, currentColor) var(--bm_opacity), transparent) !important;
            }
       #bmContent.opacity_Null_B:is(.Null_2:not(.Null_1), .Null_1.Null_2)::after {
            -webkit-text-fill-color: color-mix(in srgb, var(--link_color, currentColor) var(--bm_opacity), transparent) !important;
            }

       /** Counters (Zaehler) **/
       /* Counter #1 Ordner */
       #bmContent::before {
            content: attr(data-value1);
            display: flex;
            min-width: fit-content;
            width: var(--bm_width_one);
            padding-inline: var(--bm_padding_inline);
            align-items: center;
            justify-content: flex-end;
            margin-right: var(--bm_margin_mid);
            background-image: var(--bm_icon_image_1);
            background-position: var(--bm_bg_position);
            background-repeat: no-repeat;
            background-size: var(--bm_icon_size);
            color: var(--folder_color, currentColor) !important;
            fill: var(--folder_fill, currentColor) !important;
            }
       /* Counter #2 Links */
       #bmContent::after {
            content: attr(data-value2);
            display: flex;
            min-width: fit-content;
            width: var(--bm_width_two);
            padding-inline: var(--bm_padding_inline);
            align-items: center;
            justify-content: flex-end;
            margin-left: calc(var(--bm_margin_mid) - var(--bm_divider, 0px));
            background-image: var(--bm_icon_image_2);
            background-position: var(--bm_bg_position);
            background-repeat: no-repeat;
            background-size: var(--bm_icon_size);
            color: var(--link_color, currentColor) !important;
            fill: var(--link_fill, currentColor) !important;
            }
		`;
        const sss = Cc['@mozilla.org/content/style-sheet-service;1'].getService(Ci.nsIStyleSheetService);
        const uri = Services.io.newURI('data:text/css,' + encodeURIComponent(css));
        sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);

        let bmbMenu = document.getElementById('bookmarks-menu-button');
        let bookMenu = document.getElementById('bookmarksMenu');
        let persToolBar = document.getElementById('PersonalToolbar');
        if(bmbMenu)
            bmbMenu.addEventListener('popupshowing', onPopupShowing );
        if(bookMenu)
            bookMenu.addEventListener('popupshowing', onPopupShowing );
        if(persToolBar)
            persToolBar.addEventListener('popupshowing', onPopupShowing );
    }
    function onPopupShowing(aEvent) {
        let popup = aEvent.originalTarget;
        for (let item of popup.children) {
            if (item.localName != 'menu' || item.id?.startsWith('history'))
                continue;
            setTimeout(() => {
              let itemPopup = item.menupopup;
			        itemPopup.hidden = true;
			        itemPopup.collapsed = true;
              itemPopup.openPopup();
              itemPopup.hidePopup();
              let menuitemCount = 0;
              let menuCount = 0;
              for (let subitem of itemPopup.children) {
                if (subitem.classList.contains('bookmark-item') && !subitem.disabled && !subitem.hidden) {
                  if (subitem.localName == 'menuitem') {
                    menuitemCount++;
                  } else if (subitem.localName == 'menu') {
                    menuCount++;
                  }
                }
              }
			        itemPopup.hidden = false;
			        itemPopup.collapsed = false;
              //Eigenes Element für Zaehler
              let bmCounta = item.childNodes[1];
              bmCounta.innerHTML = '';
              let bmVario = document.createElement("bmElement");
              bmVario.id = "bmContent";
              bmCounta.appendChild(bmVario);
              //Zaehler Design Optionen =>  ohne/ mit: runde, eckige Klammern
              if (bm_bracket === 0) {
                  strCountOut1 = '' + menuCount + '';
                  strCountOut2 = '' + menuitemCount + '';
                  }
              if (bm_bracket === 1) {
                  strCountOut1 = '(' + menuCount + ')';
                  strCountOut2 = '(' + menuitemCount + ')';
                  }
              if (bm_bracket === 2) {
                  strCountOut1 = '[' + menuCount + ']';
                  strCountOut2 = '[' + menuitemCount + ']';
                  }
              bmVario.setAttribute('data-value1', strCountOut1);
              bmVario.setAttribute('data-value2', strCountOut2);
              // Trennlinie Element
              let trennelementVario = document.createElement("trennelement");
              trennelementVario.id = "trennID";
              // Trennlinie Varianten
              if (trenner === 2 || trenner === 3 && menuCount !== 0) {
                  bmVario.appendChild(trennelementVario);
                  trennelementVario.textContent = trennzeichen;
                  bmVario.classList.add('trennclass');
                  }
              if (trenner === 3 && menuCount === 0) {
                  bmVario.classList.add('trennclass_3');
                  }
              if (trenner === 1 && menuCount === 0) {
                  bmVario.classList.add('trennclass_1');
                  }
              // Extra class item / ganzes menu fuer 00
              if (menuCount === 0 && menuitemCount === 0) {
                  item.classList.add('bm_chevron_00');
                  } else {
                     item.classList.remove('bm_chevron_00');
                     }
              // Anpassungen fuer 00, #1 = 0, #2 = 0
              if (menuCount === 0) {
                  bmVario.classList.add('Null_1');
                  }
              if (menuitemCount === 0) {
                  bmVario.classList.add('Null_2');
                  }
              // Reihenfolge Varianten Icons / Ziffern
              if (bm_order === 1) {
                  bmVario.classList.add('order_2');
                  }
              // Icons Auswahl
              if (bm_icon_folder === 0) {
                  bmVario.classList.add('icon_fallback_folder');
                  }
              if (bm_icon_link === 0) {
                  bmVario.classList.add('icon_fallback_link');
                  }
              // Farben Auswahl
              if (bm_colors === 1) {
                  bmVario.classList.add('bm_my_colors');
                  }
              // Verblassen bei Anzeige = 0
              if (bm_opacity_null === 1) {
                  bmVario.classList.add('opacity_Null');
                  }
              if (bm_opacity_null === 2) {
                   bmVario.classList.add('opacity_Null_B');
                   }
            }, 100);
        }
    }
})();
