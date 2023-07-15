Verschiedene Scripte Für Thunderbird 102.11.0

# AddonLister
Dieses Skript füllt ein wenig die Lücke, die die Erweiterung "InfoLister" hinterlassen hat und schreibt die Konfiguration von Thunderbird (möglich sind: 
Useragent, Erweiterungen, Themes, Plugins, Wörterbücher, Dienste, Stylish-Einträge, Greasemonkey- und userChromeJS-Skripte) in eine Datei.

Nach Installation des Skriptes gibt es einen Button, der über das "Anpassen"-Fenster frei positioniert werden kann. Standardmässig erstellt ein **Linksklick** eine 
Text-Datei im BBCode-Format, die im Editor angezeigt wird. Ein **Mittelklick** zeigt die erstellte Datei direkt im Browser - tatsächlich wird nur beim HTML-Format 
die Datei direkt angezeigt, bei anderen Formaten wird auf einen data-uri ausgewichen, weil auch hier ein charset mitgegeben werden kann. Mit einem **Rechtsklick** wird 
die Datei erstellt, aber nicht angezeigt.

Zusätzlich zum Button wird noch ein Menü unter **Extras** erstellt. Unterhalb von **Add-ons** sollte der Eintrag **AddonLister** zu finden sein. In den 3 Untermenüs 
kann unabhängig vom gewählten `FORMAT` ein Export vorgenommen werden. Die Einträge, die ohne weitere Verzweigung aufgerufen werden können, richten sich nach dem 
konfigurierten `FORMAT`. Als Standard ist "bbcode" für Beiträge in Foren eingestellt (s. oben).

Es können im Konfigurationsabschnitt 2 weitere Formate gewählt werden. Dazu bitte den Wert `FORMAT` auf `html` oder `custom` stellen. Alle weiteren 
Konfigurationen sind im Skript ebenfalls mit Kommentar versehen, sodass hier weitestgehend nicht näher darauf eingegangen wird.

Passe auf jeden Fall den Wert `EXPORTPATH` an.

`GITHUBBLACKLIST` enthält zur Zeit ein leeres Array und somit wird versucht in dieser Einstellung die Skripte in/mit/von ;) diesem Repository zu verknüpfen 
(nur für userChrome.js-Skripte). Mit `["*"]` kann eingestellt werden, dass gar keine Verlinkung probiert wird, ansonsten können hier gezielt Skriptnamen eingetragen 
werden, die in diesem Repository nicht enthalten sind (Namen jeweils in Anführungszeichen und durch Komma getrennt). 

Ganz grobe Fehler in der Konfiguration werden seit der Version vom 11.03.2015 durch das Skript gemeldet.

## Expertenkonfiguration ##
In der Expertenkonfiguration wird unter anderem das Icon festgelegt, welches vom Button und beim Menü verwendet wird (`ICON_URL`).

Der größte Anteil entfällt aber auf die 3 vorgefertigten Formate, die im Auslieferungszustand benutzt werden können. Die einzelnen Vorgaben enthalten z.T. feste 
Zeichenfolgen, andere enthalten Platzhalter, die aber nur dort auch im weiteren Verlauf ersetzt werden.

Das Ergebnis eines Exports wird in folgender Reihenfolge zusammengesetzt:
```
intro
	tpllastupd (sofern Ausgabe mittels SHOWDATE: true aktiviert)
	tpluseragent (sofern Ausgabe mittels SHOWUSERAGENT: true aktiviert)
	tpladdongrp_title (Überschrift und Container je Add-on-Typ. Mgl. Platzhalter %%countactive%%, %%countinactive%%, %%count%%)
		tpladdongrp_intro (weitere Info zum Add-on-Typ vor der eigentlichen Liste)
			tpladdongrp_list_intro (z.B. <ul> oder [list])
				tpladdon (mgl. Platzhalter %%class%%, %%homepageURL%%, %%name%%, %%version%%, %%description%%, %%disabled%%)
			  oder:
				tpladdon_without_url (mgl. Platzhalter %%class%%, %%name%%, %%version%%, %%description%%, %%disabled%%)
			tpladdongrp_list_outro (z.B. </ul> oder [/list])
	tpladdongrp_outro (z.B. </div> oder '\n')
outro
```

Ein Template enthält noch weitere Angaben zu:
```
fileext - Dateiendung der erstellten Datei
opendatauri - Bei Templates, bei denen kein charset mitgegeben werden kann (also ungleich html) festlegen, dass das
              Ergebnis im Browser als data-uri geöffnet werden soll.
activeclass - HTML-Klasse für aktive Add-ons
inactiveclass - HTML-Klasse für deaktivierte Add-ons
disabledtext - Text, der in der Liste nach deaktivierten Add-ons erscheinen soll
```

Ganz einfaches Beispiel: Wenn man also möchte, dass im BBCode-Format der Text "deaktiviert" in rot erscheinen soll, dann ändert man die entsprechende Zeile von 
```
			'disabledtext':' [deaktiviert]',
```
in
```
			'disabledtext':' [color=red][deaktiviert][/color]',
```

Das **Ergebnis des Skripts**:

![Screenshot AddonLister](https://github.com/Endor8/userChrome.js/raw/master/thunderbird/Screenshots/scr_addonlister.png)

![Screenshot Menü AddonLister](https://github.com/Endor8/userChrome.js/raw/master/thunderbird/Screenshots/scr_addonlister_menu.png)

## Installation
Kopiere die uc.js-Datei in den Chromeordner des Profils und ziehe den Button an die gewünschte Stelle. 
