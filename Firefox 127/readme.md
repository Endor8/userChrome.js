## Scripte für Firefox 127 und neuer ###    

**Hier wird eine Script-Liste erstellt, die ab Firefox 127.0 angepasst wurden.**    
     
Verschiedene Änderungen, die ab Firefox 127.0 Standard sind:
       
alt:    
**let where = window.whereToOpenLink(aEvent, false, true);**    
neu:    
**let where = window.BrowserUtils.whereToOpenLink(aEvent, false, true);**    
    
alt:    
**let historyPopup = document.getElementById('goPopup');**    
neu:     
**let historyPopup = document.getElementById('historyMenuPopup');**    
  
