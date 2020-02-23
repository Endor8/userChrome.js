### CSS Codes für Mehrzeilige Tableiste und Änderung der Reihenfolge der Leisten

Es stehen 4 verschiedenen CSS Codes zur Verfügung:
Alle vier, ermöglichen eine Mehrzeilige Tableiste.
2 Css Codes verschieben die Tableiste zusätzlich unter die
Adressleiste - bzw. Lesezeichenleiste.


 


Tabbreite anpassen - fixieren

Über userChrome.css Datei unten stehenden Code↓ laden lassen.     

    tabs tab[fadein]:not([pinned]) {
		 min-width: 100px !important;/* Minimale Tabbreite  76px */
		 max-width: 100px !important;/* Maximale Tabbreite 225px */
    }
	
Wenn man bei beiden Werten den selben Wert angibt wird die Tabbreite fixiert.


Mit CSS Code 3-5 sieht es dann ungefähr so aus:
![Screenshot](Zwischenablage01a.png)
