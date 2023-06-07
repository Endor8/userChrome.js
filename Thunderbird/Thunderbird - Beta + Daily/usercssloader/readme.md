# User CSS Loader
Das Skript ist in der Lage, die userChrome.css, die userContent.css und das Add-on "Stylish" zusammen zu ersetzen.     
Über eine neue Schaltfäche mit Menü in der Tableiste werden CSS Styles neu erstellt, geladen, sofort getestet,       
aus-/eingeschaltet etc.

Das **Ergebnis des Skripts**:

![Screenshot User CSS Loader](https://raw.githubusercontent.com/Endor8/userChrome.js/master/Thunderbird/Thunderbird%20-%20Release/usercssloader/usercssloader.png)

## Installation
Kopiere die uc.js-Datei in den Chromeordner des Profils.  
Evtl. muss über `about:config` noch der externe Editor definiert (Wert für `view_source.editor.path` eintragen) werden.     
Bei Bedarf kann in Zeile 45 ein anderer Dateimanager zum Öffnen des CSS-Ordners eingetragen werden -     
ein Beispiel für den Eintrag von `vFileManager` ist in der Zeile darüber zu sehen.     
    
Das Symbol der Symbolleistenschaltfläche muss dann per CSS Code eingefügt werden.    
CSS Code siehe → [Symbol usercssloader.uc.js](https://github.com/Endor8/userChrome.js/blob/master/Thunderbird/Thunderbird%20-%20Release/usercssloader/CSS-Symbol.css)     
Beispiel. s. (https://www.camp-firefox.de/forum/viewtopic.php?p=856804#p856804).

## Icons für Kontextmenü
Wer möchte kann mit dem CSS Code: [usercssloader.css](https://github.com/Endor8/userChrome.js/blob/master/Thunderbird/Thunderbird%20-%20Release/usercssloader/usercssloader.css)    
Symbole für das Kontextmenü einfügen.    
Sieht dann so aus:     
![Screenshot User CSS Loader](https://raw.githubusercontent.com/Endor8/userChrome.js/master/Thunderbird/Thunderbird%20-%20Release/usercssloader/usercssloader2.png)

