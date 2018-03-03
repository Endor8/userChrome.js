   
#### Mehrzeilige Tableiste für Firefox 57+

Das Script gehört wie üblich in den Chrome Ordner,
die CSS Datei mus über die userChrome.css geladen oder importiert werden.
Fragen oder Problme bitte im Thread stellen:

https://www.camp-firefox.de/forum/viewtopic.php?p=1064933#p1064933


#### Anpassungen für CSS Code   
Tabbreite anpassen:  

Anpassungen für css Code:   

.tabbrowser-tab:not([pinned]) {  
    flex-grow: 1 !important;  
    display: -webkit-box !important;  
    min-height: 32px !important;  
}   
obiges so ändern:   
.tabbrowser-tab:not([pinned]) {   
    flex-grow: 1 !important;  
    display: -webkit-box !important;  
    min-height: 32px !important;  
    min-width: 150px !important; /* Minimal Wert standardmäßig  76px */  
    max-width: 150px !important; /* Maximal Wert standardmäßig 225px */  
}  
Werte mit Vorischt ändern, bzw. hinzufügen  
Stellen Sie sicher, dass beide Zahlen identisch sind  

#### Gewünschtes kopieren und der userChrome.css Datei hinzufügen  

/* --- Tabs Schriftfarbe --- */  

/* Aktiver Tab */  
.tabbrowser-tab[selected="true"] .tab-label {  
    color: rgba(50, 205, 50, 1.0) !important; /* limegreen */  
    text-shadow: 1px 1px 1px #aaa !important;  
}  
  
/* Inaktiver Tab */  
.tabbrowser-tab:not([visuallyselected=true]) .tab-label {  
    color: rgba(65, 105, 225, 1.0) !important; /* RoyalBlue */  
    text-shadow: 1px 1px 1px #666 !important;  
}  
  
/* Geladen aber nicht ausgewählter Tab */  
.tabbrowser-tab:not([selected="true"])[unread] .tab-label {  
    color: rgba(255, 0, 0, 1.0) !important; /* red */  
    text-shadow: 1px 1px 1px #999 !important;  
}  
  
/* Nicht neugeladen aber besuchter Tab */   
.tabbrowser-tab:not([selected="true"])[pending] .tab-label,  
.tabbrowser-tab:not([selected="true"])[visited] .tab-label {  
    color: rgba(0, 0, 0, 0.7) !important; /* black */  
    text-shadow: 1px 1px 1px #bbb !important;  
    font-weight: 900;  
    font-size: 120%;  
}  
  
/* Ladender Tab */   
.tabbrowser-tab[busy] .tab-text.tab-label {  
    color: rgba(0, 191, 255, 1.0) !important; /* deepskyblue */  
    text-shadow: 1px 1px 1px #999 !important;  
}  
  
  
