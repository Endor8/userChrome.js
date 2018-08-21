### userChrome Verwendung ab Firefox 57 und neuer

##### Herunterladen und Entpacken der ZIP-Datei: firefox-anpassungen.zip

#### Das Archiv enthält folgendes:   

  #### 1. Unterverzeichnis userChromeJS mit den Dateien   
   * main.js
   * utilities.js
   * Readme.txt

  #### 2. Unterverzeichnis chrome mit den Dateien   
   * userChrome.js
   * userChrome.css
   * userContent.css

  #### 3. Datei config.js   

  #### 4. Datei config-prefs.js  

  #### Hinweis:
  Damit diese Methode ab Firefox 62 funktioniert, muss das mit Firefox 62 eingeführte    
  Sandboxing der AutoConfig deaktiviert werden. Dazu musste in der Datei config-prefs.js    
  folgende Zeile eingefügt werden:  
  ```CSS
  pref("general.config.sandbox_enabled", false);
  ``` 
    
![Screenshot](https://github.com/Endor8/userChrome.js/blob/master/userChrome/images/Warnung.png?raw=true)     
  **Es muss jedem aber klar sein, dass die Verwendung der Scripte tendenziell unsicher(er) ist!**    
  **Verwendung immer nur auf eigene Gefahr - eigenes Risiko! Es wird keinerlei Haftung übernommen!**    
  
###### (Zum runterladen rechtsklick hier: [firefox-anpassungen.zip](https://raw.githubusercontent.com/Endor8/userChrome.js/master/userChrome/Dateien/firefox-anpassungen.zip) und Ziel Speichern unter.)

##### Wo müssen die Dateien hin

Die Datei **config.js** und der Ordner **userChromeJS** müssen in den **Firefox Installationsordner**

![Screenshot](https://github.com/Endor8/userChrome.js/blob/master/userChrome/images/Screenshot4-400px.png?raw=true)  
[vergrößern](https://github.com/Endor8/userChrome.js/blob/master/userChrome/images/Screenshot4-600px.png?raw=true)

Die Datei **config-prefs.js** muss in den **Firefox Installationsordner\defaults\pref**

![Screenshot](https://github.com/Endor8/userChrome.js/blob/master/userChrome/images/Screenshot5-400px.png?raw=true)     
[vergrößern](https://github.com/Endor8/userChrome.js/blob/master/userChrome/images/Screenshot5-600px.png?raw=true)

##### Wo finde ich den Firefox Installationsordner

Unter **C:\Program Files\Mozilla Firefox (bei 64bit)**

oder 
**C:\Program Files (x86)\Mozilla Firefox (bei 32bit)**

oder 
**Portable_Firefox\Firefox** beim portablen Firefox von [hier](https://mozhelp.dynvpn.de/dateien/index.php?path=Programme/)

In den **Profilordner\chrome** gehört die Datei:
**userChrome.js**

![Screenshot](https://github.com/Endor8/userChrome.js/blob/master/userChrome/images/Screenshot2-400px.png?raw=true)   
[vergrößern](https://github.com/Endor8/userChrome.js/blob/master/userChrome/images/Screenshot2-600px.png?raw=true)

![Screenshot](https://github.com/Endor8/userChrome.js/blob/master/userChrome/images/Screenshot1-400px.png?raw=true)      
[vergrößern](https://github.com/Endor8/userChrome.js/blob/master/userChrome/images/Screenshot1-600px.png?raw=true)

**Der Profilordner ist gewöhnlich zu finden unter:**

**%appdata%\Mozilla\Firefox\Profiles\xxx.default**                                     
(xxx steht für eine zufällige Zeichenfolge und ist bei jedem anders)

oder
**Portable_Firefox\Profilordner** beim portablen Firefox von [hier](https://mozhelp.dynvpn.de/dateien/index.php?path=Programme/)
   
###### Datei ist hier auch zum Herunterladen verfügbar:
https://github.com/Endor8/userChrome.js/tree/master/userChrome/Dateien

###### Eine aktuelle Sammlung von Scripten gibt es hier:
https://github.com/ardiman/userChrome.js

###### Informationen und Hilfe siehe hier:
https://www.camp-firefox.de/forum/viewtopic.php?f=16&t=112673

