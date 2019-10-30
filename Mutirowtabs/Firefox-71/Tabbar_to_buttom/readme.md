
Angepasste Version des Originalscripts


01_Move_Tabbar_to_Bottom_of_Window.uc.js
Tab-Leiste an den unteren Rand des Fensters verschieben

02_Move_Tabbar_to_Bottom_of_Window.uc.js
Tab-Leiste an den unteren Rand des Fensters verschieben,
Titelleisten-Schaltflächen in der Tableiste,
in der Menüleiste und im Vollbildmodus ausblenden.

Gewünschte Scriptversion im Chromeordner abspeichern.


MultiRowTabLiteforFx.uc.js： Script 03～06
02_Move_Tabbar_to_Bottom_of_Window.uc.js Bei Verwendung dieser Version, werden 
andere Titelleisten-Schaltflächen, als im Vollbildmodus ausgeblendet.

01_Move_Tabbar_to_Bottom_of_Window.uc.js empfohlene Version

Vollbild-CSS-Code, der die Titelleistenschaltflächen nach oben verschiebt, oder für CSS-Code, 
der die Titelleistenschaltflächen beim Überfahren mit der Maus, anzeigt

Da die # Titelleiste (Tab-Leiste) von der # Navigator-Toolbox in das # Hauptfenster> vbox verschoben wurden, funktioniert dies nicht.

↓Original-Script

(function(){
    try {
    var vbox = document.createXULElement('vbox');
    document.getElementById("navigator-toolbox").parentNode.insertBefore(
    vbox, document.getElementById("browser-bottombox"));
    vbox.appendChild(document.getElementById("TabsToolbar"));
    } catch(e) {} 
})();
