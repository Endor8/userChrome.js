### Mehrzeilige Tableiste ###

Es stehen je nach Firefox Version verschiedene Scriptversionen dazu zur Verfügung.     
Siehe dazu jeweils in den entsprechenden Ordner.

[Firefox 60esr](https://github.com/Endor8/userChrome.js/tree/master/Mutirowtabs/Firefox-60esr)     
[Firefox 65](https://github.com/Endor8/userChrome.js/tree/master/Mutirowtabs/Firefox-65)     
[Firefox 66](https://github.com/Endor8/userChrome.js/tree/master/Mutirowtabs/Firefox-66)     
[Firefox 67](https://github.com/Endor8/userChrome.js/tree/master/Mutirowtabs/Firefox-67) 

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
