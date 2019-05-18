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

```css   
/ * Breite der Tableiste * /
    [sizemode = "fullscreen"] #TabsToolbar> # window-controls> toolbarbutton {
    
/ * Vollbild * /
    padding: 6px 12px! important; / * Standardbreite 6px 12px Mehrstufige Standardbreite 8px 12px * /
    }
    # toolbar-menubar [autohide = "false"] .titlebar-buttonbox> .titlebar-button {
        / * Menüleiste * /
        padding: 8px 17px! important; / * Standardbreite 8px 17px * /
    }
    # toolbar-menubar [autohide = "true"]: not ([inactive = "true"]) .titlebar-buttonbox> .titlebar-button {
        / * Menüleiste (ALT) * /
        padding: 8px 17px! important; / * Standardbreite 8px 17px * /
    }
    #TabsToolbar .titlebar-buttonbox> .titlebar-button {
        / * Tab Bar * /
        padding: 8px 17px! important; / * Standardbreite 8px 17px Mehrstufige Standardbreite 10px 17px * /
    }
```
Sie können das Auf und Ab mit der linken Zahl einstellen. Sie können links und rechts mit der richtigen Zahl einstellen.

Wenn Sie Zahlen wie Auffüllen schreiben: 6px 12px 6px 12px! Wichtig: Sie können von links nach oben, rechts, unten und links einstellen.

Ich denke, dass es einfach zu verstehen ist, wenn Sie die Polstergröße anpassen: 0px 0px! Important;

Wenn Sie ein Skript von 03 bis 06 verwenden und die Breite anpassen möchten, wird es im Skript geschrieben
Möglicherweise möchten Sie das ↓ -Kabel gemeinsam einstellen.

03 und 04

```css 
/ * Ordnen Sie auf der rechten Seite Platz für die Schaltflächen der Titelleiste zu,     
    damit die Schaltflächen der Titelleiste und der Hauptsymbolleiste nicht verdeckt werden * /      
    [tabsintitlebar = "true"]: not ([sizemode = "fullscreen"]) # nav-bar {padding-right: 139 px! important;}
    [sizemode = "fullscreen"] # nav-bar {padding-right: 109 px! important;}
```

05 und 06
```css 
/ * Ordnen Sie auf der rechten Seite Platz für die Schaltflächen der Titelleiste zu, damit die     
Schaltflächen der Titelleiste und der Hauptsymbolleiste nicht verdeckt werden * /
    [sizemode = "fullscreen"] # nav-bar {padding-right: 109 px! important;}    
```

03 und 04 sind Code für normalen Bildschirm und Vollbild
05 und 06 haben Code für den Vollbildmodus.


Vertikale Breiteneinstellung der Menüleisten 05 und 06

Ich denke, dass Sie die vertikale Breite der Menüleiste dünner oder dicker machen können, indem Sie die vertikale Breite anderer Symbole als des Vollbilds und des im Skript geschriebenen ↓ -Codes anpassen.

```css 
/ * Platz für Menüleiste oberhalb der Symbolleiste zuweisen * /
    [sizemode = "maximized"]: not ([tabsintitlebar = "true"]) # navigator-toolbox,
    [sizemode = "normal"] # navigator-toolbox {padding-top: 28px! important;}
    [sizemode = "maximiert"] # navigator-toolbox {padding-top: 36 px! important;}
```

## Installation
Kopiere die uc.js-Datei in den Chromeordner des Profils.
