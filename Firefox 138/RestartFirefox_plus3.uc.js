    // RestartFirefox_plus3.uc.js  
    // Erstellt einen verschiebbaren Button für die Menüleiste	
    // Erstellt einen Eintrag + Icon im Menü: Datei
	// Erstellt einen Eintrag + Icon im Hamburger Menü
	// In Zeile 22, 49 und 68 kann ein eigenes Icon durch Pfadangabe genutzt werden
	
    (function() { 
       
       try {
          CustomizableUI.createWidget({
             type: 'custom',
			 id: 'restart-button',
             defaultArea: CustomizableUI.AREA_NAVBAR,
             onBuild: function(aDocument) {         
                var toolbaritem = aDocument.createXULElement('toolbarbutton');
                let props = {
                   id: 'restart-button',
                   class: 'toolbarbutton-1 chromeclass-toolbar-additional',
                   removable: true,
                   label: 'Neustart',
                   tooltiptext: 'Links-Klick für Neustart\nRechts-Klick oder Rad-Klick für Neustart mit userChrome.js-Cache leeren',
                   style: 'list-style-image: url(chrome://browser/skin/forget.svg)',
                   
                };            
                for (var p in props)
                   toolbaritem.setAttribute(p, props[p]);
			   
                toolbaritem.addEventListener('click', event => {
                    if (event.button == 1) {
                      Services.startup.quit(Ci.nsIAppStartup.eRestart | Ci.nsIAppStartup.eAttemptQuit);
                    }
                
                    if (event.button == 0 || event.button == 2) {
                      event.preventDefault();
                      Services.appinfo.invalidateCachesOnRestart();
                      Services.startup.quit(Ci.nsIAppStartup.eRestart | Ci.nsIAppStartup.eAttemptQuit);
                    }
                  });			   
                return toolbaritem;
             }      
            });
       } catch(e) { };   
	         
       var menuitem = document.createXULElement('toolbarbutton');
    menuitem.id = 'restartfirefox-fileMenu';
    menuitem.classList.add('subviewbutton', 'subviewbutton-iconic');
    menuitem.setAttribute('label' , 'Neustart');
    menuitem.setAttribute('tooltiptext' , 'Neustart');
    menuitem.style.listStyleImage= 'url(chrome://browser/skin/forget.svg)';
    menuitem.addEventListener('click', event => {
				    if (event.button == 1) { 
                      Services.startup.quit(Ci.nsIAppStartup.eRestart | Ci.nsIAppStartup.eAttemptQuit); 
                    }
                    if (event.button == 0 || event.button == 2) { 
                       Services.appinfo.invalidateCachesOnRestart(); 
                       Services.startup.quit(Ci.nsIAppStartup.eRestart | Ci.nsIAppStartup.eAttemptQuit);
                    }							  
	        });
    var refItem = document.getElementById('goOfflineMenuitem');
    refItem.parentNode.insertBefore(menuitem, refItem);							  
	

      var menuitem = document.createXULElement('toolbarbutton');
    menuitem.id = 'restartfirefox-appMenu';
    menuitem.classList.add('subviewbutton', 'subviewbutton-iconic');
    menuitem.setAttribute('label' , 'Neustart');
    menuitem.setAttribute('tooltiptext' , 'Neustart');
    menuitem.style.listStyleImage= 'url(chrome://browser/skin/forget.svg)';
    menuitem.addEventListener('click', event => {
					if (event.button == 0) { 
                      Services.startup.quit(Ci.nsIAppStartup.eRestart | Ci.nsIAppStartup.eAttemptQuit); 
                    }
                    if (event.button == 1 || event.button == 2) { 
                      Services.appinfo.invalidateCachesOnRestart(); 
                      Services.startup.quit(Ci.nsIAppStartup.eRestart | Ci.nsIAppStartup.eAttemptQuit);
                    }							  
		    });
    var refItem = document.getElementById('appMenu-viewCache').content.getElementById('appMenu-quit-button2');
    refItem.parentNode.insertBefore(menuitem, refItem);
	
    })();
