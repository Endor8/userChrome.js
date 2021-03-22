# Einleitung
Hier entsteht eine Sammlung für die Firefox-Erweiterung userChromeJS.

Fast alle Skripte wurden im deutschen Firefox-Forum vorgestellt bzw. dort angepasst.

Für GitHub werden die Skripte in Unterordnern mit entsprechenden README-Dateien abgelegt. Es handelt sich dabei um 
Textdateien im markdown-Format mit der Dateiendung `md`. Screenshots bis zum 30.09.2011 wurden im Firefox 6 erstellt. 
Die Ergebnisse der für neuere Firefox-Versionen aktualisierten Skripte sehen vielleicht ein wenig anders aus. Die Screenshots 
werden nur bei extremen Unterschieden aktualisiert. 

# Testumgebung/Historie
- Win 7 64bit SP 1/ Firefox 37 (ab 31.03.2015)
- Win 7 64bit SP 1/ Firefox 36 (ab 25.02.2015)
- Win 7 64bit SP 1/ Firefox 35 (ab 15.01.2015)
- Win 7 64bit SP 1/ Firefox 34 (ab 02.12.2014)
- Win 7 64bit SP 1/ Firefox 33 (ab 14.10.2014)
- Win 7 64bit SP 1/ Firefox 32 (ab 03.09.2014)
- Win 7 64bit SP 1/ Firefox 31 (ab 23.07.2014)
- Win 7 64bit SP 1/ Firefox 30 (ab 11.06.2014)
- Win 7 64bit SP 1/ Firefox 29 (ab 29.04.2014)
- Win 7 64bit SP 1/ Firefox 28 (ab 18.03.2014)
- Win 7 64bit SP 1/ Firefox 27 (ab 04.02.2014)
- Win 7 64bit SP 1/ Firefox 26 (ab 11.12.2013)
- Win 7 64bit SP 1/ Firefox 25 (ab 30.10.2013)
- Win 7 64bit SP 1/ Firefox 24 (ab 18.09.2013)
- Win 7 64bit SP 1/ Firefox 23 (ab 07.08.2013)
- Win 7 64bit SP 1/ Firefox 22 (ab 29.06.2013)
- Win XP SP 3/ Firefox 21 (ab 14.05.2013)
- Win XP SP 3/ Firefox 20 (ab 03.04.2013)
- Win XP SP 3/ Firefox 19 (ab 20.02.2013)
- Win XP SP 3/ Firefox 18 (ab 08.01.2013)
- Win XP SP 3/ Firefox 17 (ab 20.11.2012)
- Win XP SP 3/ Firefox 16 (ab 10.10.2012)
- Win XP SP 3/ Firefox 15 (ab 29.08.2012)
- Win XP SP 3/ Firefox 14 (ab 18.07.2012)
- Win XP SP 3/ Firefox 13 (ab 06.06.2012)
- Win XP SP 3/ Firefox 12 (ab 24.04.2012)
- Win XP SP 3/ Firefox 11 (ab 14.03.2012)
- Win XP SP 3/ Firefox 10 (ab 31.01.2012)
- Win XP SP 3/ Firefox 9 (ab 27.12.2011)
- Win XP SP 3/ Firefox 8 (ab 10.11.2011)
- Win XP SP 3/ Firefox 7 (ab 01.10.2011)
- Win XP SP 3/ Firefox 6 (bis 30.09.2011)

Sollte ein Skript nicht funktionieren, bitte im Quelltext nachschauen, was in der jeweiligen Firefoxversion angepasst 
werden muss bzw. in der Historie des Skriptes stöbern.

# Installation
Zur Aktivierung der Skripte im Firefox muss 

- die **Erweiterung userChromeJS** installiert und lauffähig sein
- eine **Datei namens userChrome.js** für den Import der Skripte sorgen (weiter unten dazu mehr)
- das jeweilige Skript in den Chrome-Ordner des Profils kopiert werden. Die Skripte sollten am besten in der Ansicht des Skriptes über den **Raw-Button oberhalb des Quelltextes** runtergeladen werden.

Das Einbinden der `uc.js`- und `uc.xul`-Dateien geschieht mit der beigelegten userChrome.js. Diese Datei (bitte nicht mit 
der Erweiterung verwechseln) muss ebenfalls in den Chrome-Ordner des Profils eingefügt werden. Die Zeile

    userChrome.import("*", "UChrm");

darin sorgt für den Import aller userChrome-Skripte.

# Downloads
- die benötigte **Erweiterung** userChromeJS: http://userchromejs.mozdev.org/
- eine beispielhafte **Datei** userChrome.js: https://github.com/ardiman/userChrome.js/blob/master/userChrome.js

# Hinweise
## Skriptcache
Seit Firefox 8.0 gibt es eine Art Skriptcache. Dies führt dazu, dass Änderungen von Skripten (Konfiguration/Texte usw.) nach 
einem "normalen" Neustart nicht aktiv werden. Es gibt Skripte, die dieses Problem durch Löschen des Skriptcaches lösen können:

- https://github.com/ardiman/userChrome.js/tree/master/addrestartbutton
- https://github.com/ardiman/userChrome.js/tree/master/restartfirefox
- https://github.com/ardiman/userChrome.js/tree/master/restartfirefoxbutton

Andere Methoden werden auf der [Seite Skriptcache im Wiki](https://github.com/ardiman/userChrome.js/wiki/Skriptcache) erläutert.

## Umlaute
Ab userChromeJS 1.5 werden Umlaute in den uc.js-Dateien anders behandelt. Am Anfang des Aufbaus dieser Sammlung war userChromeJS 1.4 aktuell 
, deshalb kann es Probleme mit der Darstellung von Sonderzeichen geben (s. [Thread im deutschen Firefoxforum](http://www.camp-firefox.de/forum/viewtopic.php?p=832387#p832387)).

Mögliche Lösungen:

- das Skript wird in z.B. Notepad++ als "UTF8 ohne BOM" gespeichert
- die Umlaute werden mit dem Notepad++-Plugin "HTML Tag" konvertiert

# Quellen
- https://www.camp-firefox.de/forum/viewtopic.php?f=16&t=100898
- https://github.com/ardiman/userChrome.js
- https://github.com/alice0775/userChrome.js
- https://github.com/sdavidg/firefoxChromeScripts
- https://u6.getuploader.com/script/
