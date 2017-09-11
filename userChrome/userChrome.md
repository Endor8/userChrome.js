### userChrome Verwendung auch in Firefox 57

##### Folgende Dateien werden zur Verwendung von userChrome Scripten benötigt, bzw. sind Voraussetzung:
 
[1. config.js](https://raw.githubusercontent.com/Endor8/userChrome.js/master/userChrome/config.js)       
[2. userChromeJS.js](https://raw.githubusercontent.com/Endor8/userChrome.js/master/userChrome/userChromeJS.js)     
[3. config-prefs.js](https://raw.githubusercontent.com/Endor8/userChrome.js/master/userChrome/config-prefs.js)        
[4. userChrome.js](https://raw.githubusercontent.com/Endor8/userChrome.js/master/userChrome/userChrome.js)      
(Zum runterladen oben rechtsklick und Ziel Speichern unter.)

##### Wo müssen die Dateien hin

Die Dateien **config.js** und **userChromeJS.js** müssen in den **Firefox Installationsordner**

![Screenshot](https://github.com/Endor8/userChrome.js/blob/master/userChrome/images/Screenshot4-400px.png?raw=true)  
[vergrößern](https://github.com/Endor8/userChrome.js/blob/master/userChrome/images/Screenshot4-600px.png?raw=true)

![Screenshot](https://github.com/Endor8/userChrome.js/blob/master/userChrome/images/Screenshot3-400px.png?raw=true)   
[vergrößern](https://github.com/Endor8/userChrome.js/blob/master/userChrome/images/Screenshot3-600px.png?raw=true)

Die Datei **config-prefs.js** muss in den **Firefox Installationsordner\defaults\pref**

![Screenshot](https://github.com/Endor8/userChrome.js/blob/master/userChrome/images/Screenshot5-400px.png?raw=true)     
[vergrößern](https://github.com/Endor8/userChrome.js/blob/master/userChrome/images/Screenshot5-600px.png?raw=true)

##### Wo finde ich den Firefox Installationsordner

unter **C:\Program Files\Mozilla Firefox (bei 64bit)**

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


##### Inhalt der Dateien:
  
**config.js** siehe [hier](https://github.com/Endor8/userChrome.js/blob/master/userChrome/config.js.md) 
     
**userChromeJS.js** siehe [hier](https://github.com/Endor8/userChrome.js/blob/master/userChrome/userChromeJS.js.md)
     
**config-prefs.js**
```js
pref("general.config.obscure_value", 0);
pref("general.config.filename", "config.js");
```

**userChrome.js**
```js
userChrome.import("*", "UChrm");
```

###### Alle 4 Dateien sind hier auch zum Herunterladen verfügbar:
https://github.com/Endor8/userChrome.js/tree/master/userChrome

###### Eine aktuelle Sammlung von Scripten gibt es hier:
https://github.com/ardiman/userChrome.js

###### Informationen und Hilfe siehe hier:
https://www.camp-firefox.de/forum/viewtopic.php?f=16&t=112673

