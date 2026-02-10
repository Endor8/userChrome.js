// ==UserScript==
// @name           wetterfuchsbutton.uc.js
// @compatibility  Firefox 147+
// @include        main
// @note           by mira with help from www.perplexity.ai and chat.mistral.ai
// @note           completely rewritten on February 7, 2026
// @version        1.1.
// ==/UserScript==

(function() {
  if (!window.gBrowser)
    return;

  const
  // ■■ START UserConfiguration ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
           id = 'wetterfuchs-toolbarbutton', // Id des Buttons
        label = 'Wetterfuchs', // Bezeichnung des Buttons
  tooltiptext = 'Lokale und globale Wetter Infos',
  // Icon-------------------------------------------------------
         icon = 'Wetter.png',  // [Name.Dateiendung] des Symbols
     iconPath = '/chrome/image/', // Pfad zum Ordner der das Icon beinhaltet
  // ■■ END UserConfiguration ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
   curProfDir = PathUtils.toFileURI(PathUtils.join(PathUtils.profileDir)),

  // kleines Lade-GIF als Platzhalter
   wfthrobber = "https://raw.github.com/ardiman/userChrome.js/master/wetterfuchsbutton/loading51.gif",

  // ■■ urlobj-Array ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  urlobj = {
    MO_Doppelklick:           {url:"https://www.msn.com/de-de/wetter/heute/de/Berlin,BE,Deutschland/we-city-52.520,13.380",width:700,height:640},
    MO_Rechtsklick:           {url:"http://www.wetter.net/47/Berlin",width:850,height:630},
    MO_Mittelklick:           {url:"https://www.daswetter.com/wetter_Berlin-Europa-Deutschland-Berlin--1-26301.html",width:800,height:638},
    DED_WetterAktuell:        {url:"https://www.wetterkontor.de/de/deutschland_aktuell.asp?id=0&page=0&sort=0",width:625,height:865},
    DED_Vorhersage:           {url:"https://www.wetterkontor.de/de/wetter/deutschland.asp",width:670,height:780},
	  DED_Wetterlage:           {url:"https://www.wetterkontor.de/de/wetterlage.asp",width:430,height:405},
    DED_Pollenbelastung:      {url:"https://www.wetterkontor.de/de/bio/pollenflug-erle.asp",width:560,height:730},
    DED_UVIndexVorhersage:    {url:"https://www.wetterkontor.de/de/bio/uv-index.asp",width:478,height:720},
	  DED_Gesund:               {url:"https://www.wetterkontor.de/de/bio/befinden-und-gesundheit.asp?id=1",width:572,height:565},
	  DED_Therm:                {url:"https://www.wetterkontor.de/de/bio/thermische-belastung.asp",width:572,height:565},
	  DED_Flusspegel:           {url:"https://www.wetterkontor.de/de/pegel/",width:670,height:792},
	  DED_Regenradar:           {url:"https://www.wetterkontor.de/de/radar.asp?p=1",width:532,height:575},
    DED_RegenradarVorhersage: {url:"https://www.wetterkontor.de/de/radar/radar-vorhersage.asp?p=1",width:528,height:570},
	  DED_Satellitenbild:       {url:"https://www.austrocontrol.at/jart/met/radar/satloop.gif",width:620,height:470},
	  DED_BlitzMittel:          {url:"https://map.blitzortung.org/#5.34/51.978/10.499",width:740,height:740},
	  DED_BlitzEuro:            {url:"https://map.blitzortung.org/#5.25/50.48/11.333",width:740,height:740},
	  DED_BlitzWelt:            {url:"https://map.blitzortung.org/#1.37/43.3/21.9",width:940,height:678},
    DE_WetterAktuell:         {url:"https://www.dwd.de/DWD/wetter/aktuell/deutschland/bilder/wx_deutschland.jpg",width:780,height:520},
    DE_Vorhersage:            {url:"https://www.dwd.de/DWD/wetter/wv_allg/deutschland/film/vhs_deutschland.jpg",width:780,height:485},
    DE_Unwetterwarnung:       {url:"http://www.unwetterzentrale.de/images/map/deutschland_index.png",width:572,height:572},
    DE_RegenradarAktuell:     {url:"https://www.niederschlagsradar.de/de-de",width:570,height:650},
    DE_RegenradarPrognose:    {url:"https://www.windy.com/de/-Regen-Gewitter-rain?rain,50.723,10.525,7",width:620,height:690},
    EU_AktuellVorhersage:     {url:"https://www.wetterkontor.de/de/wetter/europa/",width:680,height:690},
    EU_Unwetterwarnung:       {url:"http://www.unwetterzentrale.de/images/map/europe_index.png",width:572,height:572},
    EU_RegenradarAktuell:     {url:"https://www.niederschlagsradar.de/de-de/continent/eu",width:570,height:670},
    EU_RegenradarPrognose:    {url:"https://www.wetteronline.de/regenradar/europa?wro=true",width:660,height:700},
    WE_WetterAktuell:         {url:"https://www.wetterdienst.de/Weltwetter/Beobachtungen/Aktuell/Nordamerika/",width:660,height:690},
	  WE_WetterVorhersage:      {url:"https://wetter.faz.net/reisewetter/",width:660,height:700},
    RE_AktuellVorhersage:     {url:"https://www.wetterkontor.de/de/wetter/deutschland/brandenburg-berlin.asp",width:675,height:640},
    RE_Unwetterwarnung:       {url:"https://www.wetterkontor.de/warnungen/wetterwarnungen-brandenburg-berlin.asp",width:850,height:560},
    RE_RegenradarAktuell:     {url:"https://www.wetterkontor.de/de/radar/radar-nordost.asp",width:568,height:530},
    RE_RegenradarPrognose:    {url: "https://www.wetteronline.de/regenradar/berlin-bundesland?mode=interactive&wrx=50.16,8.77&wrm=8", width: 850, height: 850},
  };
  // ■■ END Arrey ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  if (Services.prefs.getBoolPref('svg.context-properties.content.enabled') == false) {
    Services.prefs.setBoolPref('svg.context-properties.content.enabled', true);
  }

  // Button erstellen
  try {
    CustomizableUI.createWidget({
      id: id,
      defaultArea: CustomizableUI.AREA_NAVBAR,
      label: label,
      tooltiptext: tooltiptext,
      onCreated: (button) => {
        button.style.MozContextProperties = 'fill, stroke, fill-opacity';
        button.style.listStyleImage = 'url("' + curProfDir + iconPath + icon + '")';
        button.style.minWidth = 'fit-content';

        // Menü hinzufügen
        let menupopup = document.createXULElement('menupopup');
        menupopup.id = 'wetterfuchs-menupopup';

        const menues = [
          {
            label: "DE Wetterdaten",
            items: [
              ["Wetter aktuell", "DED_WetterAktuell"],
              ["Vorhersage", "DED_Vorhersage"],
              ["Pollenbelastung", "DED_Pollenbelastung"],
              ["UV-Index", "DED_UVIndexVorhersage"],
              ["Gesund. Beschwerden", "DED_Gesund"],
              ["Thermische Belastung", "DED_Therm"],
              ["Wetterlage", "DED_Wetterlage"],
              ["Flusspegel", "DED_Flusspegel"],
              ["Regenradar", "DED_Regenradar"],
              ["Regenradar Vorhersage", "DED_RegenradarVorhersage"],
              ["Satellitenbild", "DED_Satellitenbild"]
            ]
          },
          {
            label: "DE Wetterkarten",
            items: [
              ["Wetter aktuell", "DE_WetterAktuell"],
              ["Vorhersage", "DE_Vorhersage"],
              ["Unwetterwarnung", "DE_Unwetterwarnung"],
              ["Regenradar aktuell", "DE_RegenradarAktuell"],
              ["Regenradarprognose", "DE_RegenradarPrognose"]
            ]
          },
          {
            label: "EU Wetter",
            items: [
              ["Aktuell und Vorhersage", "EU_AktuellVorhersage"],
              ["Unwetterwarnung", "EU_Unwetterwarnung"],
              ["Regenradar aktuell", "EU_RegenradarAktuell"],
              ["Regenradarprognose", "EU_RegenradarPrognose"]
            ]
          },
          {
            label: "Welt Wetter",
            items: [
              ["Aktuell", "WE_WetterAktuell"],
              ["Vorhersage", "WE_WetterVorhersage"]
            ]
          },
          {
            label: "Blitzortung",
            items: [
              ["Mitteleuropa", "DED_BlitzMittel"],
              ["Europa", "DED_BlitzEuro"],
              ["Welt", "DED_BlitzWelt"]
            ]
          },
          {
            label: "Regionales Wetter",
            items: [
              ["Aktuell und Vorhersage", "RE_AktuellVorhersage"],
              ["Unwetterwarnung", "RE_Unwetterwarnung"],
              ["Regenradar aktuell", "RE_RegenradarAktuell"],
              ["Regenradarprognose", "RE_RegenradarPrognose"]
            ]
          }
        ];

        menues.forEach(menu => {
          let menuElement = document.createXULElement('menu');
          menuElement.setAttribute('label', menu.label);
          let menuPopup = document.createXULElement('menupopup');
          menuElement.appendChild(menuPopup);

          menu.items.forEach(item => {
            let menuItem = document.createXULElement('menuitem');
            menuItem.setAttribute('label', item[0]);
            menuItem.addEventListener('command', () => {
              const cfg = urlobj[item[1]];
              openPanel(cfg.url, cfg.width, cfg.height);
            });
            menuPopup.appendChild(menuItem);
          });

          menupopup.appendChild(menuElement);
        });

        button.appendChild(menupopup);
        button.setAttribute('type', 'menu');
      }
    });
  } catch (e) { console.error(e); }

  // Event-Listener für Mausklicks hinzufügen
  (function add_button() {
    const button = document.getElementById(id);
    if (button) {
      button.addEventListener('click', (event) => {
        if (event.button === 0) {
          // Linksklick: Menü öffnen (automatisch)
        } else if (event.button === 1) {
          event.preventDefault();
          const cfg = urlobj['MO_Mittelklick'];
          openPanel(cfg.url, cfg.width, cfg.height);
        } else if (event.button === 2) {
          event.preventDefault();
          const cfg = urlobj['MO_Rechtsklick'];
          openPanel(cfg.url, cfg.width, cfg.height);
        }
      });

      button.addEventListener('dblclick', (event) => {
        event.preventDefault();
        const cfg = urlobj['MO_Doppelklick'];
        openPanel(cfg.url, cfg.width, cfg.height);
      });
    } else {
      setTimeout(add_button, 100);
    }
  })();

  // Größe über Stylesheet setzen
  function setIFrameSize(width, height) {
    let cssIn = `
      #wetterfuchs-panel vbox {
        width:  ${width}px !important;
        height: ${height}px !important;
      }
    `;
    let service = Cc['@mozilla.org/content/style-sheet-service;1'].getService(Ci.nsIStyleSheetService);
    let uri = makeURI('data:text/css;charset=UTF-8,' + encodeURIComponent(cssIn));
    if (!service.sheetRegistered(uri, service.AGENT_SHEET)) {
      service.loadAndRegisterSheet(uri, service.AGENT_SHEET);
    }
  }

  // Panel erstellen
  function createPanel() {
    let doc = document;
    let panel = doc.createXULElement('panel');
    panel.id = "wetterfuchs-panel";
    panel.setAttribute('noautohide', "false");
    panel.setAttribute('type', "arrow");
    panel.setAttribute('position', "after_end");

    panel.addEventListener('popuphiding', () => {
      clearPanel();
    });

    panel.addEventListener('mousedown', event => {
      if (event.button == 1) {
        openUrlFromPanel();
      }
    });

    let vbox = doc.createXULElement('vbox');
    vbox.setAttribute('flex', '1');
    panel.appendChild(vbox);

    let browser = doc.createXULElement('browser');
    browser.id = "wetterfuchs-iframe";
    browser.setAttribute('type', 'content');
    browser.setAttribute('flex', '1');
    browser.setAttribute('remote', 'true');
    browser.setAttribute('maychangeremoteness', 'true');
    browser.setAttribute('disableglobalhistory', 'true');
    browser.setAttribute('src', wfthrobber);
    vbox.appendChild(browser);

    doc.getElementById('mainPopupSet').appendChild(panel);
    return panel;
  }

  // Panel öffnen und URL laden
  function openPanel(url, width, height) {
    let panel  = document.getElementById("wetterfuchs-panel");
    let iframe = document.getElementById("wetterfuchs-iframe");

    if (!panel || !iframe) {
      panel  = createPanel();
      iframe = document.getElementById("wetterfuchs-iframe");
    }

    iframe.setAttribute("src", "about:blank");

    setTimeout(() => {
      setIFrameSize(width, height);
      iframe.setAttribute("src", url);
      panel.openPopup(
        document.getElementById("wetterfuchs-toolbarbutton"),
        "after_end"
      );
    }, 50);
  }

  // Panel zurücksetzen
  function clearPanel() {
    let myiframe = document.getElementById("wetterfuchs-iframe");
    if (!myiframe || !myiframe.parentNode) return;
    myiframe.parentNode.width = 146;
    myiframe.parentNode.height = 146;
    myiframe.setAttribute("src", wfthrobber);
  }

  // URL aus dem Panel in einem Tab öffnen
  function openUrlFromPanel() {
    let url = document.getElementById("wetterfuchs-iframe").getAttribute("src");
    openWebLinkIn(url, "tab");
    document.getElementById("wetterfuchs-panel").hidePopup();
  }

  // Sichtbarkeits-Handling: nach Minimieren/Zurückholen neu laden
  document.addEventListener("visibilitychange", function() {
    if (document.visibilityState === "visible") {
      let myiframe = document.getElementById("wetterfuchs-iframe");
      if (myiframe) {
        let currentUrl = myiframe.getAttribute("src");
        if (currentUrl && currentUrl !== "about:blank" && currentUrl !== wfthrobber) {
          myiframe.setAttribute("src", currentUrl);
        }
      }
    }
  });

  // Optional: regelmäßiges Auffrischen alle 30 Sekunden
  setInterval(function() {
    if (document.visibilityState === "visible") {
      let myiframe = document.getElementById("wetterfuchs-iframe");
      if (myiframe) {
        let currentUrl = myiframe.getAttribute("src");
        if (currentUrl && currentUrl !== "about:blank" && currentUrl !== wfthrobber) {
          myiframe.setAttribute("src", currentUrl);
        }
      }
    }
  }, 30000);

})();
