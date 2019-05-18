### Mehrzeilige Tableiste für Firefox 67 ###

Es stehen 6 verschiedene Scripte dazu zur Verfügung.

* Skript 1:  Mehrzeilige Tableiste (CSS) Unbegrenzte Anzahl von Tabzeilen,    
Tabs ziehen und ablegen möglich, sowie Anpassungen für Symbolleisten.         

* Skript 2: Mehrzeilige Tableiste als (CSS Code) Anzahl der Tabzeilen auf 5 begrenzt,    
kann aber im Script in Zeile 22 geändert werden.     
Tabs ziehen und ablegen möglich, sowie Anpassungen für Symbolleisten.
     
* Skript 3: Mehrzeilige Tableiste als (CSS Code) Unbegrenzte Anzahl von Tabzeilen,     
Tabs ziehen und ablegen möglich, Tableiste unter Adressleiste verschieben,     
sowie Anpassungen für Symbolleisten.         

* Skript 4: Mehrzeilige Tableiste als (CSS Code) Anzahl der Tabzeilen auf 5 begrenzt,    
kann aber im Script in Zeile 45 geändert werden.      
Tabs ziehen und ablegen möglich, sowie Anpassungen für Symbolleisten.           

* Skript 5: Mehrzeilige Tableiste als (CSS Code) Unbegrenzte Anzahl von Tabzeilen,     
Tabs ziehen und ablegen möglich, Tableiste unter Adressleiste verschieben,     
Erstellen eines Menüleistenbereiches über der Symbolleiste um das Menü nach oben      
zu verschieben, sowie Anpassungen für Symbolleisten.    

* Skript 6: Mehrzeilige Tableiste als (CSS Code) Anzahl der Tabzeilen auf 5 begrenzt,   
kann aber im Script in Zeile 44 geändert werden.     
Tabs ziehen und ablegen möglich, Tableiste unter Adressleiste verschieben,    
Erstellen eines Menüleistenbereiches über der Symbolleiste um das Menü nach oben      
zu verschieben, sowie Anpassungen für Symbolleisten.    

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
tabs tab[fadein]:not([pinned]){flex-grow:1;}
```

↑Mit obigem CSS Code:

```css
tabs tab[fadein]:not([pinned]) {
    flex-grow: 1 !important;
    min-width: 100px !important;/* Minimale Tabbreite  76px */
    max-width: 100px !important;/* Maximale Tabbreite 225px */
}
```
Werte mit Vorsicht verändern.

Oder CSS Code in userChrome.css einfügen
  
```css  
tabs tab[fadein]:not([pinned]) {
    min-width: 100px !important;/* Minimale Tabbreite  76px */
    max-width: 100px !important;/* Maximale Tabbreite 225px */
}
```
Mit gleichen Werten bei, min-width und max-width, wird die Tabbreite fixiert.

   #### Theme Hell ####
   Hintergrundfarbe der Tableiste bei aktivem Fenster
   Windows 10 → Persönliche Einstellungen →   
   Farbe → selbe Farbe wie die Titelleiste.
   Farbe weiß bei nicht aktiven Firefox Fenster verwenden 
```css    
[lwthemetextcolor="dark"]:root[tabsintitlebar]:not(:-moz-window-inactive) {
     background-color: rgb(227, 228, 230) !important;
     color: rgb(24, 25, 26) !important;
}
```
  #### Theme Dunkel ####
   Hintergrundfarbe der Tableiste bei aktivem Fenster
   Windows 10 → Persönliche Einstellungen →     
   Farbe → selbe Farbe wie die Titelleiste.
   Dunkle Farbe bei nicht aktiven Firefox Fenster verwenden
```css 
[lwthemetextcolor="bright"]:root[tabsintitlebar]:not(:-moz-window-inactive) {
   background-color: rgb(12, 12, 13) !important;
}
```
## Installation
Kopiere die uc.js-Datei in den Chromeordner des Profils.
