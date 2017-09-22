(function() {
  if (location != 'chrome://browser/content/browser.xul')
    return;  
  var menuButton = document.getElementById('PanelUI-menu-button');
 
  if (!CustomizableUI.getPlacementOfWidget('ucjs_PanelUI-button')) { 
    try {
      CustomizableUI.createWidget({
        id: 'ucjs_PanelUI-button',
        type: 'custom',
        defaultArea: CustomizableUI.AREA_NAVBAR,
        onBuild: function(aDocument) {
          var toolbaritem = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbaritem');
          toolbaritem.id = 'ucjs_PanelUI-button';
          toolbaritem.className = 'chromeclass-toolbar-additional';          
          toolbaritem.setAttribute('label', 'Firefox Anpassen');          
          return toolbaritem;            
        }
      });
      if (!CustomizableUI.getPlacementOfWidget('ucjs_PanelUI-button')) {     
        menuButton.style.display = 'none';
        return; 
      };        
    } catch(e) {        
      menuButton.style.display = 'none';
      return;      
    };    
  };

  setTimeout(function() { 
    document.getElementById('ucjs_PanelUI-button').appendChild(menuButton);       
    menuButton.setAttribute('consumeanchor', 'ucjs_PanelUI-button');
    menuButton.setAttribute('label', 'Firefox Anpassen');
    menuButton.setAttribute('tooltiptext', 'Firefox Anpassen + Panel');        
  }, 0);

}());
