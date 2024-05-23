### Scripte frür Firefox 126 und neuer 

Hier wird eine Script-Liste erstellt, die ab Firefox 126.0 angepasst wurden.     

Verschiedene Änderungen, die ab Firefox 126.0 Standard sind:      
**BrowserReload();** muss in **BrowserCommands.reload();** geändert werde.      
**BrowserStop();** muss in **BrowserCommands.stop();** geändert werde.    
usw.     

aber auch:     
**fp.init(window, "json",	Ci.nsIFilePicker.modeSave);**    
muss zu    
**fp.init(BrowsingContext.getFromWindow(window), Ci.nsIFilePicker.modeSave);**    
geändert werden    

oder:    
**Components.utils.import("resource:///modules/CustomizableUI.jsm");**     
muss man so ändern:    
**ChromeUtils.importESModule("resource:///modules/CustomizableUI.sys.mjs");**     
