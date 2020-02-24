
### CSS Codes für Mehrzeilige Tableiste und Änderung der Reihenfolge der Leisten     

Es stehen **4** verschiedenen CSS Codes zur Verfügung. Alle **4** Codes, ermöglichen eine Mehrzeilige Tableiste.     
**2** Css Codes verschieben die Tableiste zusätzlich unter die Adressleiste - bzw. Lesezeichenleiste.    
Verwendung mit und ohne Titelleiste möglich. In CSS Code **2** und **4** ist die Anzahl der Tabzeilen auf **5** begrenzt.    
Bei mehr Zeilen wird eine Scrollbar eingeblendet. Die Anzahl der Zeilen kann im CSS Code angepasst werden.    

- **01-Mehrzeilige-Tableiste.css Tabs Oben + Mehrzeilige Tableiste**      

- **02-Mehrzeilige-Tableiste.css Tabs Oben + Mehrzeilige Tableiste + verschiedene Anpassungen +**    
     **Tabzeilen Anzahlbegrenzung. Standard ist 5 Zeilen, kann in Zeile 16 geändert werden.**    
 
- **03-Mehrzeilige-Tableiste.css Tabs unter Adress -bzw. Lesezeichenleiste + Mehrzeilige Tableiste**   

- **04-Mehrzeilige-Tableiste.css Tabs unter Adress -bzw. Lesezeichenleiste + Mehrzeilige Tableiste +**     
     **Anpassungen + Tabzeilen Anzahlbegrenzung. Standard ist 5 Zeilen, kann in Zeile 34 geändert werden.**    

Css Code **05-Mehrzeilige-Tableiste.css** ist eine modifizierte Version von CSS Code **04-Mehrzeilige-Tableiste.css**    
mit fixierter Tabbreite, Anpassung verschiedener Abstände der Leisten und Tabzeilenbegrenzug auf **2**    
Bei mehr als **2** Tabreihen, wird dann eine Scrollbar angezeigt.   
   
### Mit CSS Code 1-2 sieht es so aus:

![Screenshot](https://raw.githubusercontent.com/Endor8/userChrome.js/master/Mutirowtabs/CSS/Mehrzeilig%20obena.png)
Tabs oben mehrzeilige Tableiste
<br />
<br />
<br />
![Screenshot](https://raw.githubusercontent.com/Endor8/userChrome.js/master/Mutirowtabs/CSS/X%20nur%20auf%20aktiven%20Tab%20bei%20100pxa.png)
Tabs oben, mehrzeilige Tableiste, Tabbreite auf 100px fixiert.    
Schließenkreuz nur bei aktivem Tab sichtbar
<br />
<br />
<br />
![Screenshot](https://raw.githubusercontent.com/Endor8/userChrome.js/master/Mutirowtabs/CSS/Feste%20Breite%20mit%20Schlie%C3%9Fenkreuza.png)
Tabs oben, mehrzeilige Tableiste, Tabbreite auf 150px fixiiert.    
Schließenkreuz bei allen Tab sichtbar
<br />
<br />
<br />
### Mit CSS Code 3-5 sieht es dann ungefähr so aus:    

![Screenshot](https://raw.githubusercontent.com/Endor8/userChrome.js/master/Mutirowtabs/CSS/ohne%20Breite%2C%20Tabs%20schmaler%2C%20x%20vorhandena.png)
Tabs unten mehrzeilige Tableiste
<br />
<br />
<br />
![Screenshot](https://raw.githubusercontent.com/Endor8/userChrome.js/master/Mutirowtabs/CSS/Breite%20100%2C%20x%20nur%20auf%20aktiven%20Taba.png)
Tabs unten, mehrzeilige Tableiste, Tabbreite auf 100px fixiert.    
Schließenkreuz nur bei aktivem Tab sichtbar
<br />
<br />
<br />
![Screenshot](Zwischenablage01b.png)
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

