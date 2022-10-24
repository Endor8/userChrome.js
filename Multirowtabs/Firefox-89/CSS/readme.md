
### CSS Codes für Mehrzeilige Tableiste und Änderung der Reihenfolge der Leisten     

Es stehen **6** verschiedenen CSS Codes zur Verfügung. Alle **6** Codes, ermöglichen eine Mehrzeilige Tableiste.     
**2** Css Codes verschieben die Tableiste zusätzlich unter die Adressleiste - bzw. Lesezeichenleiste.    
Verwendung mit und ohne Titelleiste möglich. In CSS Code **2** und **4** ist die Anzahl der Tabzeilen auf **5** begrenzt.    
Bei mehr Zeilen wird eine Scrollbar eingeblendet. Die Anzahl der Zeilen kann im CSS Code angepasst werden.    

- **[01-Mehrzeilige-Tableiste.css](https://github.com/Endor8/userChrome.js/blob/master/Mutirowtabs//Firefox-89/CSS/01-Mehrzeilige-Tableiste.css) Tabs Oben + Mehrzeilige Tableiste**      

- **[02-Mehrzeilige-Tableiste.css](https://github.com/Endor8/userChrome.js/blob/master/Mutirowtabs//Firefox-89/CSS/02-Mehrzeilige-Tableiste.css) Tabs Oben + Mehrzeilige Tableiste + verschiedene Anpassungen +**    
     **Tabzeilen Anzahlbegrenzung. Standard ist 5 Zeilen, kann in Zeile 23 und Zeile 26 geändert werden.**    
 
- **[03-Mehrzeilige-Tableiste.css](https://github.com/Endor8/userChrome.js/blob/master/Mutirowtabs//Firefox-89/CSS/03-Mehrzeilige-Tableiste.css) Tabs unter Adress -bzw. Lesezeichenleiste + Mehrzeilige Tableiste**   

- **[04-Mehrzeilige-Tableiste.css](https://github.com/Endor8/userChrome.js/blob/master/Mutirowtabs//Firefox-89/CSS/04-Mehrzeilige-Tableiste.css) Tabs unter Adress -bzw. Lesezeichenleiste + Mehrzeilige Tableiste +**     
     **Anpassungen + Tabzeilen Anzahlbegrenzung. Standard ist 5 Zeilen, kann in Zeile 40 und Zeile 43 geändert werden.**    
     
- **[05-Mehrzeilige-Tableiste.css](https://github.com/Endor8/userChrome.js/blob/master/Mutirowtabs//Firefox-89/CSS/05-Mehrzeilige-Tableiste.css) Tabs am unteren Fensterrand + Mehrzeilige Tableiste**   

- **[06-Mehrzeilige-Tableiste.css](https://github.com/Endor8/userChrome.js/blob/master/Mutirowtabs//Firefox-89/CSS/06-Mehrzeilige-Tableiste.css) Tabs am unteren Fensterrand + Mehrzeilige Tableiste +**     
     **Anpassungen + Tabzeilen Anzahlbegrenzung. Standard ist 5 Zeilen, kann in Zeile 52 und Zeile 55 geändert werden.**     
   
### Mit CSS Code 1-2 sieht es so aus:

![Screenshot](https://raw.githubusercontent.com/Endor8/userChrome.js/master/Mutirowtabs/CSS/Bilder/Mehrzeilig%20obena.png)
Tabs oben mehrzeilige Tableiste
<br />
<br />
<br />
![Screenshot](https://raw.githubusercontent.com/Endor8/userChrome.js/master/Mutirowtabs/CSS/Bilder/X%20nur%20auf%20aktiven%20Tab%20bei%20100pxa.png)
Tabs oben, mehrzeilige Tableiste, Tabbreite auf 100px fixiert.    
Schließenkreuz nur bei aktivem Tab sichtbar
<br />
<br />
<br />
![Screenshot](https://raw.githubusercontent.com/Endor8/userChrome.js/master/Mutirowtabs/CSS/Bilder/Feste%20Breite%20mit%20Schlie%C3%9Fenkreuza.png)
Tabs oben, mehrzeilige Tableiste, Tabbreite auf 150px fixiiert.    
Schließenkreuz bei allen Tab sichtbar
<br />
<br />
### Mit CSS Code 3-5 sieht es dann ungefähr so aus:    

![Screenshot](https://raw.githubusercontent.com/Endor8/userChrome.js/master/Mutirowtabs/CSS/Bilder/ohne%20Breite%2C%20Tabs%20schmaler%2C%20x%20vorhandena.png)
Tabs unten mehrzeilige Tableiste
<br />
<br />
<br />
![Screenshot](https://raw.githubusercontent.com/Endor8/userChrome.js/master/Mutirowtabs/CSS/Bilder/Breite%20100%2C%20x%20nur%20auf%20aktiven%20Taba.png)
Tabs unten, mehrzeilige Tableiste, Tabbreite auf 100px fixiert.    
Schließenkreuz nur bei aktivem Tab sichtbar
<br />
<br />
<br />
![Screenshot](https://raw.githubusercontent.com/Endor8/userChrome.js/master/Mutirowtabs/CSS/Bilder/Breite%20150%2C%20x%20vorhanden1.png)
Tabs unten, mehrzeilige Tableiste, Tabbreite auf 150px fixiert.    
Schließenkreuz bei allen Tab sichtbar 
<br />
<br />
### Anpassen - fixieren der Tabbreite 

**Zum Anpassen - fixieren der Tabbreite**    
folgende Zeilen in gewünschten CSS Code einfügen und anpassen     

    tabs tab[fadein]:not([pinned]) {
		 min-width: 100px !important;/* Minimale Tabbreite  76px */
		 max-width: 100px !important;/* Maximale Tabbreite 225px */
    }
	
Wenn man bei beiden Werten den selben Wert angibt wird die **Tabbreite fixiert.**
  
