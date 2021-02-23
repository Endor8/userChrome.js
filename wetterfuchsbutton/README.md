# Wetterfuchsbutton
Dieses Skript ist auf jeden Fall nicht für Anfänger gedacht, da einige Zeilen anzupassen sind und das optische Ergebnis durch 
Einbinden einer CSS-Datei verschönert werden muss.

Im Groben funktioniert das Skript folgendermassen: Mit einem Linksklick auf den Button öffnet sich ein Menü mit Untermenüs mit einigen deutschen 
und europäischen Wetterkarten, sowie detaillierten aktuellen deutschen Wetterdaten und einer deutschen Wetterdatenkarte in 6 Tage-Vorschau usw. 
Sobald ein Panel angezeigt wird, öffnet ein Mittelklick darauf die Adresse in einem extra Tab.

Das **Ergebnis des Skripts** (mit Bildern für Berlin- bzw. Brandenburg-Vorschau) mit ausgeblendetem Dropmarker (s. unten):

![Screenshot Wetterfuchsbutton Menue](https://github.com/Endor8/userChrome.js/raw/master/wetterfuchsbutton/scr_wfb_Menu.png)

Mit einem **Links-Doppelklick** auf den Button öffnet ein Panel, in dem **lokale Wetterinfos** erscheinen. 

![Screenshot Wetterfuchsbutton Doppel-Linksklick](https://github.com/Endor8/userChrome.js/raw/master/wetterfuchsbutton/scr_wfb_panel_linksdoppelklick.png)

Über den **Rechtsklick** gibt es einige Wetterinfos mit der zusätzlichen Möglichkeit über die Suchleiste, temporär auch andere 
Städte jeweils anzuzeigen.

![Screenshot Wetterfuchsbutton Rechtsklick](https://github.com/Endor8/userChrome.js/raw/master/wetterfuchsbutton/scr_wfb_panel_rechtsklick.png)

Mit dem **Mittelklick** auf dem Button erscheint ein Panel mit den Wetterdaten seines **Wunschortes** mit einer Vorschau bis zu 14 Tage, außerdem 
können hier weitere Orte zur Verfügung gestellt werden (am besten Cookies für diese Seite zulassen!):

![Screenshot Wetterfuchsbutton Mittelklick](https://github.com/Endor8/userChrome.js/raw/master/wetterfuchsbutton/scr_wfb_panel_mittelklick.png)

In allen geöffneten Wetterfenstern kann mit den Pfeiltasten der Tastatur gescrollt werden. Bei installierten Erweiterungen wie z.B. 
"Smooth Wheel" oder "Yet Another Smooth Scrolling" klappt das Scrollen auch mit dem Mausrad.

## Installation
Kopiere die uc.js-Datei in den Chromeordner des Profils und füge den Button zur gewünschten Symbolleiste hinzu, indem du ihn per 
**Anpassen** an die gewünschte Stelle ziehst. Der Throbber kann durch Änderung von `wfthrobber` eingestellt werden.

Die zu öffnenden Seiten werden im Objekt `urlobj` ab **Zeile 10** angegeben. Neben dem Bezeichner werden die Adresse (url), Breite (width) und 
Höhe (width) eingetragen. Anhand des Bezeichners ist zu erkennen, welche Aktion bzw. welcher Menüpunkt definiert wird. Es folgt eine Auswahl der 
Bezeichner, die angepasst werden sollten.

### Für den Rechtsklick (Wetter.net Lokalwetter)
Als Erstes geht man auf https://www.wetter.net , sucht über die Wettersuche-Searchbar dort nach einem "Wunschort". Nach deren Auswahl die URL 
kopieren und im Objekt `urlobj` den Bezeichner `MO_Rechtsklick` suchen, anschliessend die Adresse zwischen den `""` hinter `url:` einfügen.

### Für den Doppel-Linksklick (MSN Lokalwetter)
Die gleiche Vorgehensweise für die zweite Wetterstation bei https://wetter.msn.com/sitemap.aspx . Nach der Wunschortauswahl wird die kopierte URL für 
den Bezeichner `MO_Doppelklick` eingetragen.

### Für den Mittelklick (DasWetter.com Städtewetter)
Für den eigenen Wohnort sucht man auf https://www.daswetter.com/ und kopiert die Adresse genau auf die gleiche Art und Weise, wie die beiden 
ersten, dieses Mal verändert man den Eintrag des Bezeichners `MO_Mittelklick`. Lässt man für diese Seite Cookies zu, können 2 weitere Orte 
im Panel zur Verfügung gestellt werden.

### Regionales Wetter
Hier lauten die Bezeichner `RE_AktuellVorhersage`, `RE_Unwetterwarnung`, `RE_RegenradarAktuell` und `RE_RegenradarPrognose`.

## Das Aussehen der Wetterfenster
Zum Skript gehört die Datei `wetterfuchsbutton.css`, die am einfachsten entweder über das "UserCSSLoader" Skript oder die userChrome.css in den 
Firefox eingebunden werden kann. Falls die Erweiterung "Stylish" eingesetzt wird, muss die `namespace`-Zeile entfernt werden.
  
## Ausblenden des Dropmarkers
Wer den Menüdropmarker am Button nicht haben möchte, muss ihn mit einem separaten CSS Code ausblenden:

    @namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);
    @-moz-document url(chrome://browser/content/browser.xhtml) {
      #wetterfuchs-toolbarbutton > dropmarker {
        display: none;
      }
    }

## Weitere Anpassungen des Menüs
![Screenshot Wetterfuchsbutton Menue](https://github.com/Endor8/userChrome.js/raw/master/wetterfuchsbutton/scr_wfb_Menu2.png)      

**Symbole für Kontextmenü des Wetterfuchs**     
Um die Menüeinträge mit Symbolen zu verschönern, kann man die **Wetterfuchs-Kontextmenu-Symbole.css** verwenden.           
https://github.com/Endor8/userChrome.js/blob/master/wetterfuchsbutton/Wetterfux-Kontextmenu-Symbole.css
