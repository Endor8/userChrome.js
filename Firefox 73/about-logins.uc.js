(function() {


   if (location != 'chrome://browser/content/browser.xhtml') return;


    try {
             CustomizableUI.createWidget({
             id: 'viewpasswordtab',
             type: 'custom',
             defaultArea: CustomizableUI.AREA_NAVBAR,
             onBuild: function(aDocument) {         
                var toolbaritem = aDocument.createXULElement('toolbarbutton');
                var props = {
                   id: 'viewpasswordtab',
                   class: 'toolbarbutton-1 chromeclass-toolbar-additional',
                   removable: true,
                   label: 'Passwörter zeigen',
                   tooltiptext: 'Passwörter zeigen',
                   style: 'background: 2px 10px url("file:///C:/Users/Lenovo M58/AppData/Roaming/Mozilla/Firefox/Profiles/n8ilmaz4.testnightly69-5/chrome/icons/passwort.png") no-repeat',          
                   oncommand: "gBrowser.selectedTab = gBrowser.addTrustedTab('about:logins');"
                };            
                for (var p in props)
                   toolbaritem.setAttribute(p, props[p]);            
                return toolbaritem;
             }      
          });
    } catch(e) { };


})();
