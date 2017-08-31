### userChrome Verwendung auch in Firefox 57

##### Folgende Dateien werden zur Verwendung von userChrome Scripten benötigt
 
1. config.js
2. userChromeJS.js
3. config-prefs.js
4. userChrome.js

##### Wo müssen die Dateien hin

Die Dateien **config.js** und **userChromeJS.js** müssen in den **Firefox Installationsordner**

![Screenshot](Screenshot4-600px.png)

![Screenshot](Screenshot3-600px.png)

Die Datei **config-prefs.js** muss in den **Firefox Installationsordner\defaults\pref**

![Screenshot](Screenshot5-600px.png)

##### Wo finde ich den Firefox Installationsordner

unter **C:\Program Files\Mozilla Firefox (bei 64bit)**

oder 
**C:\Program Files (x86)\Mozilla Firefox (bei 32bit)**

oder 
**Portable_Firefox\Firefox** beim portablen Firefox von [hier](https://mozhelp.dynvpn.de/dateien/index.php?path=Programme/)

In den **Profilordner\chrome** gehört die Datei:
**userChrome.js**

![Screenshot](Screenshot1-600px.png)

![Screenshot](Screenshot2-600px.png)

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

