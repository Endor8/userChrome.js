### Mehrzeilige Tableiste ###

Es stehen 4 verschiedene Scripte dazu zur Verfügung.

* Skript 1:  Mehrzeilige Tableiste als (CSS Code) Unbegrenzte Anzahl von Zeilen,
Tabs ziehen und verschieben, sowie notwendige Symbolleistensymbol-Anpassung

* Skript 2: Mehrzeilige Tableiste als (CSS Code) Begrenzte Anzahl von Zeilen,
Tabs ziehen und verschieben, sowie notwendige Symbolleistensymbol-Anpassung

* Skript 3: Mehrzeilige Tableiste als (CSS Code) Begrenzte Anzahl von Zeilen,
Tabs ziehen und verschieben, Symbolleisten Sortierung und Symbolleistensymbol-Anpassung

* Skript 4: Mehrzeilige Tableiste als (CSS Code) Begrenzte Anzahl von Zeilen,
Tabs ziehen und verschieben, Symbolleisten Sortierung und Symbolleistensymbol-Anpassung,
Anpassung der vertikalen Breite der Symbolleiste.

#### Kleiner CSS Code für userChrome.css: #### 

```css
/*AGENT_SHEET*/ @charset "UTF-8";
@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);
#tabbrowser-tabs .tabbrowser-arrowscrollbox {
    -moz-binding: url("chrome://global/content/bindings/scrollbox.xml#arrowscrollbox") !important;
}
```
## Installation
Kopiere die uc.js-Datei in den Chromeordner des Profils.
