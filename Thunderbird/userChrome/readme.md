### userChrome Scripte -  Verwendung in Thunderbird   

##### Herunterladen und Entpacken der ZIP-Datei: Thunderbird-Anpassungen.zip

#### Das Archiv enthält folgendes:   

  #### 1. Unterverzeichnis userChromeJS mit den Dateien   
   * main.js
   * utilities.js
   * Readme.txt

  #### 2. Unterverzeichnis chrome mit der Datei     
   * userChrome.js

  #### 3. Datei config.js   

  #### 4. Datei config-prefs.js  

  #### Hinweis:
  Damit diese Methode ab Thunderbird 62 funktioniert, muss das mit Thunderbird 62 eingeführte    
  Sandboxing der AutoConfig deaktiviert werden. Dazu musste in der Datei config-prefs.js    
  folgende Zeile eingefügt werden:  
  ```CSS
  pref("general.config.sandbox_enabled", false);
  ``` 
## $\textcolor{red}{\textsf{Achtung!}}$     
  **Jedem sollte aber klar sein, dass die Verwendung der Scripte tendenziell unsicher(er) ist!**    
  **Verwendung immer nur auf eigene Gefahr - eigenes Risiko!**    
  **Es wird keinerlei Haftung übernommen!**    
  
#### Direkter Download: **⇒** [Thunderbird-Anpassungen.zip](https://raw.githubusercontent.com/Endor8/userChrome.js/master/Thunderbird/userChrome/Dateien/Thunderbird-Anpassungen.zip)

#### Ab Thunderbird 113 **⇒** [Thunderbird-Anpassungen-neu.zip](https://raw.githubusercontent.com/Endor8/userChrome.js/master/Thunderbird/userChrome/Dateien/Thunderbird-Anpassungen-neu.zip)

##### Wo müssen die Dateien hin

Die Datei **config.js** und der Ordner **userChromeJS** müssen in den **Thunderbird Installationsordner**
      
![Screenshot](https://github.com/Endor8/userChrome.js/blob/master/Thunderbird/userChrome/images/Screenshot4-400px.png?raw=true)  
[vergrößern](https://github.com/Endor8/userChrome.js/blob/master/Thunderbird/userChrome/images/Screenshot4-600px.png?raw=true)

Die Datei **config-prefs.js** muss in den **Thunderbird Installationsordner\defaults\pref**

![Screenshot](https://github.com/Endor8/userChrome.js/blob/master/Thunderbird/userChrome/images/Screenshot5-400px.png?raw=true)     
[vergrößern](https://github.com/Endor8/userChrome.js/blob/master/Thunderbird/userChrome/images/Screenshot5-600px.png?raw=true)

##### Wo finde ich den Thunderbird Installationsordner

Unter **C:\Program Files\Mozilla Thunderbird (bei 64bit)**

oder 
**C:\Program Files (x86)\Mozilla Thunderbird (bei 32bit)**

oder 
**Portable_Thunderbird\Thunderbird** beim portablen Thunderbird

In den **Profilordner\chrome** gehört die Datei:
**userChrome.js**

![Screenshot](https://github.com/Endor8/userChrome.js/blob/master/Thunderbird/userChrome/images/Screenshot2-400px.png?raw=true)   
[vergrößern](https://github.com/Endor8/userChrome.js/blob/master/Thunderbird/userChrome/images/Screenshot2-600px.png?raw=true)

![Screenshot](https://github.com/Endor8/userChrome.js/blob/master/Thunderbird/userChrome/images/Screenshot1-400px.png?raw=true)      
[vergrößern](https://github.com/Endor8/userChrome.js/blob/master/Thunderbird/userChrome/images/Screenshot1-600px.png?raw=true)

**Der Profilordner ist gewöhnlich zu finden unter:**

**%appdata%\Mozilla\Thunderbird\Profiles\xxx.default-release**                                     
(xxx steht für eine zufällige Zeichenfolge und ist bei jedem anders)

oder
**Portable_Thunderbird\Profilordner** beim portablen Thunderbird
   
###### Datei ist hier auch zum Herunterladen verfügbar:
[Dateien](https://github.com/Endor8/userChrome.js/tree/master/Thunderbird/userChrome/Dateien)

###### Informationen und Hilfe siehe hier:
https://www.camp-firefox.de/forum/viewtopic.php?f=16&t=112673

