### Mehrzeilige Tableiste für Firefox 100+ ###

Es stehen 6 verschiedene Scripte dazu zur Verfügung.

### Hinweis:
Skript **1 + 2** Mehrzeilige Tableiste Tabs ganz oben    
Skript **3 + 4** Mehrzeilige Tableiste Tabs unter Adress und Lesezeichenleiste    
Skript **5 + 6** Mehrzeilige Tableiste Tabs ganz unten am unteren Rand des Fensters 

* Skript 1:  Mehrzeilige Tableiste (CSS) Unbegrenzte Anzahl von Tabzeilen,    
Tabs ziehen und ablegen möglich, sowie Anpassungen für Symbolleisten.         

* Skript 2: Mehrzeilige Tableiste als (CSS Code) Anzahl der Tabzeilen auf 5 begrenzt,    
kann aber im Script in **Zeile 36**  geändert werden.     
Tabs ziehen und ablegen möglich, sowie Anpassungen für Symbolleisten.
     
* Skript 3: Mehrzeilige Tableiste als (CSS Code) Unbegrenzte Anzahl von Tabzeilen,     
Tabs ziehen und ablegen möglich, Tableiste unter Adressleiste verschieben,     
sowie Anpassungen für Symbolleisten.         

* Skript 4: Mehrzeilige Tableiste als (CSS Code) Anzahl der Tabzeilen auf 5 begrenzt,    
kann aber im Script in **Zeile 36** geändert werden.      
Tabs ziehen und ablegen möglich, sowie Anpassungen für Symbolleisten.           

* Skript 5: Mehrzeilige Tableiste als (CSS Code) Unbegrenzte Anzahl von Tabzeilen,     
Tabs ziehen und ablegen möglich, Tableiste ganz nach unten, unter den Fensterinhalt,    
verschieben, Erstellen eines Menüleistenbereiches über der Symbolleiste um das Menü    
nach oben zu verschieben, sowie Anpassungen für Symbolleisten.   

* Skript 6: Mehrzeilige Tableiste als (CSS Code) Anzahl der Tabzeilen auf 5 begrenzt,   
kann aber im Script in **Zeile 41** und **Zeile 44** geändert werden.     
Tabs ziehen und ablegen möglich, Tableiste ganz nach unten, unter den Fensterinhalt,    
verschieben, Erstellen eines Menüleistenbereiches über der Symbolleiste um das Menü     
nach oben zu verschieben, sowie Anpassungen für Symbolleisten.   

#### Kleiner CSS Code für userChrome.css: #### 

```css
@charset "UTF-8";
@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);
toolbarbutton#alltabs-button{-moz-binding: url("userChrome.xml#js");}
```

Wenn die Anzahl der Tab-Zeilen höher als im Script angegeben, ist,    
wird mit folgendem CSS Code, die Scrollleiste in der Tableiste angezeigt.  
↓ Wenn nicht benötigt, diesen CSS Code entfernen, bzw. nicht verwenden.    
