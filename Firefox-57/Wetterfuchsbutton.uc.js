// ==UserScript==
// @name           wetterfuchsbutton.uc.js
// @compatibility  Firefox 33. - 56
// @include        main
// @version        1.0.20171107
// ==/UserScript==

var wetterfuchs = {
  urlobj: {
    MO_Doppelklick: {url:"https://www.msn.com/de-de/wetter/heute/de/Berlin,BE,Deutschland/we-city-52.520,13.380",width:700,height:640},
    MO_Rechtsklick: {url:"http://www.wetter.net/47/Berlin",width:820,height:442},
    MO_Mittelklick: {url:"https://www.daswetter.com/wetter_Berlin-Europa-Deutschland-Berlin--1-26301.html",width:800,height:620},
    DED_WetterAktuell: {url:"https://www.wetterkontor.de/de/deutschland_aktuell.asp?id=0&page=0&sort=0",width:625,height:865},
    DED_Vorhersage: {url:"https://www.wetterkontor.de/de/wetter/deutschland.asp",width:670,height:780},
    DED_Pollenbelastung: {url:"https://www.wetterkontor.de/de/bio/pollenflug-erle.asp",width:478,height:590},
    DED_UVIndexVorhersage: {url:"https://www.wetterkontor.de/de/bio/uv-index.asp",width:478,height:590},
    DE_WetterAktuell: {url:"https://www.dwd.de/DWD/wetter/aktuell/deutschland/bilder/wx_deutschland.jpg",width:780,height:520},
    DE_Vorhersage: {url:"https://www.dwd.de/DWD/wetter/wv_allg/deutschland/film/vhs_deutschland.jpg",width:780,height:485},
    DE_Unwetterwarnung: {url:"http://www.unwetterzentrale.de/images/map/deutschland_index.png",width:572,height:572},
    DE_RegenradarAktuell: {url:"https://www.niederschlagsradar.de/image.ashx",width:568,height:530},
    DE_RegenradarPrognose: {url:"https://www.niederschlagsradar.de/images.aspx?srt=loopvorhersage&jaar=-3&regio=homepage&tijdid=&m=&d=&uhr=&mi=",width:568,height:530},
    EU_AktuellVorhersage: {url:"https://www.wetterkontor.de/de/wetter/europa/",width:680,height:690},
    EU_Unwetterwarnung: {url:"http://www.unwetterzentrale.de/images/map/europe_index.png",width:572,height:572},
    EU_RegenradarAktuell: {url:"http://www.meteox.de/images.aspx?jaar=-3&voor=&soort=loop-bliksem&c=&n=&tijdid=20128241541",width:570,height:570},
    EU_RegenradarPrognose: {url:"http://db.eurad.uni-koeln.de/prognose/data/aktuell/trh_eur_1h_movd1.gif",width:518,height:518},
    WE_WetterAktuell: {url:"http://www.meteocentrale.ch/de/wetter/weltwetter.html#sytl",width:575,height:360},
    RE_AktuellVorhersage: {url:"https://www.wetterkontor.de/de/wetter/deutschland/brandenburg-berlin.asp",width:675,height:640},
    RE_Unwetterwarnung: {url:"https://www.wetterkontor.de/warnungen/wetterwarnungen-brandenburg-berlin.asp",width:850,height:480},
    RE_RegenradarAktuell: {url:"https://www.niederschlagsradar.de/image.ashx?type=regioloop&regio=bln&j=&m=&d=&mi=&uhr=&bliksem=0&voor=&srt=loop1stunde&tijdid=201194154",width:568,height:530},
    RE_RegenradarPrognose: {url:"https://www.wetter.de/deutschland/regenradar-karte-brandenburg-c49p12.html",width:640,height:690},
  },
  wfthrobber: "https://raw.github.com/ardiman/userChrome.js/master/wetterfuchsbutton/loading51.gif",  // alternativ z.B. wfthrobber: "chrome://global/skin/media/throbber.png",
  createBtn: function() {
   try {
      CustomizableUI.createWidget({
         id: 'wetterfuchs-toolbarbutton',
         type: 'custom',
         onBuild: function(aDocument) {
            var toolbaritem = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
            var attributes = {
               id: 'wetterfuchs-toolbarbutton',
               class: 'toolbarbutton-1 chromeclass-toolbar-additional',
               type: 'menu',
               removable: 'true',
               label: 'Wetterfuchs',
               tooltiptext: 'Lokale und globale Wetter Infos',
               ondblclick: "if (event.button === 0) { wetterfuchs.openPanel(\'MO_Doppelklick\',event,\'b\')}",
               onclick: "if (event.button === 1) {wetterfuchs.openPanel(\'MO_Mittelklick\',event,\'b\')};if (event.button === 2) {wetterfuchs.openPanel(\'MO_Rechtsklick\',event,\'b\')}",
               style: 'list-style-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAD+0lEQVQ4jb3Tf0zUZRwH8LdgEngngitiMVBXcxH4h+lmETndkqVIOYemrewH4ipJmCjmmDLJRmrKBkPgMNYSMYNN3cQ1YoG4ovjpwQEnX+644ziP7/fbHd9z4SnH8+4PxXIWtLX13j7bsz17Xtvz+TwP8H9lfXx02NT62HJd3JHlurgHe9GhYX9/appkx+k31m0JKtEBzzdlLLz08+6FlxcAz9VtCi7JjtNv/NfQ60sXJQJA/VocutVx6I77+9fGbl/fNeG7nu53X355zNu89W5DSkA+AGyIj1o1I1i1KtQglyzn2MUk/+TNYgq1nEIuohg9TuHK56Qtg2PfxftdJ2L4zStzK6azHgOwoDNRf9Q/kEPeqiJ/MwiqZaRSQsqFpOswhSNL0PEeJ9pXsDVBd1IH3ZMA5jyiFSwOWt//2eIfTF+lyt3XjrCvrZjjN0vJsQpSOUbezCQdH5D2N0nrBk6aYun5+nHF+KmusXDJ/JRHwI7UrS9WH05TW1quUZLMorOjlacNp9j/ay7p2kmquyhGd5HOHeTwNgrLq0J0hfPGhyE9BUA0gICHwIq8vNy2tva7DoeDZrOZNTU1rK6uZl1dPc+fr+HF2uOUBw9SKPtJ18fk8FZOGqPYsy34l1Ig9iEwBogs+uLzVpPJRIvFIoxGIxsaGihJEm02G212O43dfaysrKC9L4/05JDOHRTmeKHVzOaVJH1tInRPTHmBGe9v3/NTc/P40NAQrVYrJUni4ODgPcxm4/DwMB0OBzs6Onm2qpAj/bmcdKZTmBbRtD2o80pw4MZ9gB4AkJaWFnHhwoU7qqrS6XSKkZGRB5DL5aIsy1QUhaqq0uVycWBggF1d7aLlx+OcuB4hpMwQaz6w5P4rAVJSUhJ6e3vpdrupKAplWaYkSTSZTJRlmZqm0ev10uv1UtM0jo+P0+fzcXBIFj1nEiekzBDnt0vnffKgfytXrlxWX1/v93g8dLvdtFqt7O7uFhaLhXa7nYqiUNM0appGVVXp8/mE3+/nrdvjrMrY214FJJUBkX8dSkRycvKpsrIy58VLl+5cbW6m0WgUHo+HsizT1NtLVVWpaRodIyNUVDdv+3x0jI6y8I017SeAp7OBuQBmTYEBAGL1ev27EWFhB/ZnZTkbm5rYb77BltZWGsrLRWPTVfaZB1h7tpKGL/ewsqTo992bNnXs0wfvBRD0T19vdjgQFQmkLwkPN2x+aVnbO3ExA6uB2p0vPGX7KOEZxzrgXE402rbMw7nVwOZS4NnpwKkEA4hZByRnAm/lA2tP6HHgaAgOngTW1ABJZ4AV9282awbrz2QBwQVAaCowpxiIMQCLUoE5ecD8t+/17D8l8H7NmD8Aw0h46qvM+RMAAAAASUVORK5CYII=)'
            };
            for (var a in attributes)
               toolbaritem.setAttribute(a, attributes[a]);
            return toolbaritem;
         }
      });
   } catch(e) { };
   
   var css = ' \
   @-moz-document domain(daswetter.com), \
                  domain(dwd.de), \
                  domain(meteocentrale.ch), \
		  domain(niederschlagsradar.de), \
		  domain(www.meteox.de), \
                  domain(msn.com), \
		  domain(wetter.faz.net), \
                  domain(wetter.de), \
                  domain(wetter.net), \
                  domain(wetterkontor.de) { \
     scrollbar {display: none !important} \
   }'; 
   var cssUri = Services.io.newURI('data:text/css,' + encodeURIComponent(css), null, null);
   var SSS = Cc['@mozilla.org/content/style-sheet-service;1'].getService(Ci.nsIStyleSheetService);
   SSS.loadAndRegisterSheet(cssUri, SSS.AGENT_SHEET);
   
   this.$F('wetterfuchs-toolbarbutton','\
		<menupopup id="wetterfuchsmenu">\
			<menu label="DE Wetterdaten">\
				<menupopup id="wetterfuchsdatamenu">\
					<menuitem label="Wetter aktuell" oncommand="wetterfuchs.openPanel(\'DED_WetterAktuell\',event,\'p\')"/>\
					<menuitem label="Vorhersage" oncommand="wetterfuchs.openPanel(\'DED_Vorhersage\',event,\'p\')"/>\
					<menuitem label="Pollenbelastung" oncommand="wetterfuchs.openPanel(\'DED_Pollenbelastung\',event,\'p\')"/>\
					<menuitem label="UV-Index" oncommand="wetterfuchs.openPanel(\'DED_UVIndexVorhersage\',event,\'p\')"/>\
				</menupopup>\
			</menu>\
			<menu label="DE Wetterkarten">\
				<menupopup id="wetterfuchsDEmapsmenu">\
					<menuitem label="Wetter aktuell" oncommand="wetterfuchs.openPanel(\'DE_WetterAktuell\',event,\'p\')"/>\
					<menuitem label="Vorhersage" oncommand="wetterfuchs.openPanel(\'DE_Vorhersage\',event,\'p\')"/>\
					<menuitem label="Unwetterwarnung" oncommand="wetterfuchs.openPanel(\'DE_Unwetterwarnung\',event,\'p\')"/>\
					<menuitem label="Regenradar aktuell" oncommand="wetterfuchs.openPanel(\'DE_RegenradarAktuell\',event,\'p\')"/>\
					<menuitem label="Regenradarprognose" oncommand="wetterfuchs.openPanel(\'DE_RegenradarPrognose\',event,\'p\')"/>\
				</menupopup>\
			</menu>\
			<menu label="EU Wetter">\
				<menupopup id="wetterfuchsEUmapsmenu">\
					<menuitem label="Aktuell und Vorhersage" oncommand="wetterfuchs.openPanel(\'EU_AktuellVorhersage\',event,\'p\')"/>\
					<menuitem label="Unwetterwarnung" oncommand="wetterfuchs.openPanel(\'EU_Unwetterwarnung\',event,\'p\')"/>\
					<menuitem label="Regenradar aktuell" oncommand="wetterfuchs.openPanel(\'EU_RegenradarAktuell\',event,\'p\')"/>\
					<menuitem label="Regenradarprognose" oncommand="wetterfuchs.openPanel(\'EU_RegenradarPrognose\',event,\'p\')"/>\
				</menupopup>\
			</menu>\
			<menu label="Welt Wetter">\
				<menupopup id="wetterfuchsWEmapsmenu">\
					<menuitem label="Aktuell und Vorhersage" oncommand="wetterfuchs.openPanel(\'WE_WetterAktuell\',event,\'p\')"/>\
				</menupopup>\
			</menu>\
			<menu label="Regionales Wetter">\
				<menupopup id="wetterfuchsRegiomapsmenu">\
					<menuitem label="Aktuell und Vorhersage" oncommand="wetterfuchs.openPanel(\'RE_AktuellVorhersage\',event,\'p\')"/>\
					<menuitem label="Unwetterwarnung" oncommand="wetterfuchs.openPanel(\'RE_Unwetterwarnung\',event,\'p\')"/>\
					<menuitem label="Regenradar aktuell" oncommand="wetterfuchs.openPanel(\'RE_RegenradarAktuell\',event,\'p\')"/>\
					<menuitem label="Regenradarprognose" oncommand="wetterfuchs.openPanel(\'RE_RegenradarPrognose\',event,\'p\')"/>\
				</menupopup>\
			</menu>\
		</menupopup>\
	');
  },
  init: function() {
    this.createBtn();
    this.$F('mainPopupSet','\
		<panel id="wetterfuchs-panel" noautohide="false" type="arrow" onpopuphiding="wetterfuchs.clearPanel()" onmousedown="if (event.button === 1) {wetterfuchs.openUrlFromPanel()}">\
			<vbox>\
				<browser type="content" flex="1" id="wetterfuchs-iframe" src="' + this.wfthrobber + '" />\
			</vbox>\
		</panel>'
    );
  },
  myEventhandler: function (e,toDo) {
    switch (toDo) {
     case "p":
      e.preventDefault();
      break;
     case "s":
      e.stopPropagation();
      break;
     case "b":
      e.preventDefault();
      e.stopPropagation();
      break;
    }
  },
  clearPanel: function() {
    myiframe = document.getElementById("wetterfuchs-iframe");
    myiframe.parentNode.width = 146;
    myiframe.parentNode.height = 146;
    myiframe.setAttribute("src",this.wfthrobber);
  },
  openUrlFromPanel: function() {
    getBrowser().selectedTab = getBrowser().addTab(document.getElementById("wetterfuchs-iframe").getAttribute("src"));
    document.getElementById("wetterfuchs-panel").hidePopup();
  },
  openPanel: function(bezeichner,e,toDo) {
    this.myEventhandler(e,toDo);
    mymenu = document.getElementById("wetterfuchsmenu");
    if (mymenu.state === "open" && e.button !== 0) return;
    mymenu.hidePopup();
    myiframe = document.getElementById("wetterfuchs-iframe");
    myiframe.parentNode.width = this.urlobj[bezeichner]["width"];
    myiframe.parentNode.height = this.urlobj[bezeichner]["height"];
    myiframe.setAttribute("src",this.urlobj[bezeichner]["url"]);
    mypanel = document.getElementById("wetterfuchs-panel");
    mypanel.openPopup(document.getElementById("wetterfuchs-toolbarbutton"));
  },
  $F: function (zId,sXml) {
    var range = document.createRange();
    range.selectNodeContents(document.getElementById(zId));
    range.collapse(false);
    range.insertNode(range.createContextualFragment(sXml.replace(/\n|\t/g, '')));
    range.detach();
  }
};

wetterfuchs.init();
