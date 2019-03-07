### Mehrzeilige Tableiste für Firefox 60esr ###

Es stehen 4 verschiedene Scripte dazu zur Verfügung.

* Skript 1:  Mehrzeilige Tableiste als (CSS Code) Unbegrenzte Anzahl von Zeilen,   
Tabs ziehen und verschieben, sowie notwendige Symbolleistensymbol-Anpassung   

* Skript 2: Mehrzeilige Tableiste als (CSS Code) Begrenzte Anzahl von Zeilen,   
Tabs ziehen und verschieben, sowie notwendige Symbolleistensymbol-Anpassung   

* Skript 3: Mehrzeilige Tableiste als (CSS Code) Anzahl der Tabzeilen auf 5 begrenzt,    
kann aber im Script in Zeile 56 gändert werden.    
Tabs ziehen und verschieben, Symbolleisten Sortierung (Tableiste unter Adressleiste und    
Lesezeichen verschieben) und Fehlerbehebung für Titelleistenschaltflächen "- □ ×"    

* Skript 4: Mehrzeilige Tableiste als (CSS Code) Anzahl der Tabzeilen auf 5 begrenzt,    
kann aber im Script in Zeile 60 gändert werden.    
Tabs ziehen und verschieben, Symbolleisten Sortierung (Tableiste unter Adressleiste und     
Lesezeichen verschieben) und Fehlerbehebung für Titelleistenschaltflächen "- □ ×"      
Anpassung der vertikalen Breite der Symbolleiste.    

#### Kleiner CSS Code für userChrome.css: #### 

```css
@charset "UTF-8";
@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);
toolbarbutton#alltabs-button{-moz-binding: url("userChrome.xml#js");}
```

Wenn die Anzahl der Tab-Zeilen höher als im Script angegeben, ist,    
wird mit folgendem CSS Code, die Scrollleiste in der Tableiste angezeigt.  
↓ Wenn nicht benötigt, diesen CSS Code entfernen, bzw. nicht verwenden.    

```css
#tabbrowser-tabs .tabbrowser-arrowscrollbox {
    -moz-binding: url("chrome://global/content/bindings/scrollbox.xml#arrowscrollbox") !important;
}
```

MultiRowTabLiteforFx.uc.js

Fixieren der Tabbreite:   

```css
tabs tab:not([pinned]){flex-grow:1;}
```

↑Mit obigem CSS Code:

```css
tabs tab:not([pinned]) {
    flex-grow: 1 !important;
    min-width: 100px !important;/* Minimale Tabbreite  76px */
    max-width: 100px !important;/* Maximale Tabbreite 225px */
}
```
Werte mit Vorsicht verändern.

Oder CSS Code in userChrome.css einfügen
  
```css  
tabs tab:not([pinned]) {
    min-width: 100px !important;/* Minimale Tabbreite  76px */
    max-width: 100px !important;/* Maximale Tabbreite 225px */
}
```
Mit gleichen Werten bei, min-width und max-width, wird die Tabbreite fixiert.

## Installation
Kopiere die uc.js-Datei in den Chromeordner des Profils.
