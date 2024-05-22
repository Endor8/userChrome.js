### Scripte frür Firefox 126 und neuer 

Hier wird eine Liste von Scripten erstellt die für Firefox 126 und neuer angepasst sind.

Verschiedene Änderungen die ab Firefox 126 benötigt werden:     
**BrowserReload();** muss in **BrowserCommands.reload();** geändert werde.      
**BrowserStop();** muss in **BrowserCommands.stop();** geändert werde.    
usw.     

aber auch:     
**fp.init(window, "json",	Ci.nsIFilePicker.modeSave);**    
muss zu    
**fp.init(BrowsingContext.getFromWindow(window), 'Select a File', Ci.nsIFilePicker.modeSave);**    
geändert werden    

oder:    
**Components.utils.import("resource:///modules/CustomizableUI.jsm");**     
muss man so ändern:    
**ChromeUtils.importESModule("resource:///modules/CustomizableUI.sys.mjs");**     
