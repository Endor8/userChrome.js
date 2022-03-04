(function() {
  if (location != 'chrome://browser/content/browser.xhtml')
    return;  
  var urlbar = document.getElementById('urlbar-container');
 
  if (!CustomizableUI.getPlacementOfWidget('ucjs_urlbar-container')) { 
    try {
      CustomizableUI.createWidget({
        id: 'ucjs_urlbar-container',
        type: 'custom',
        defaultArea: CustomizableUI.AREA_NAVBAR,
        onBuild: function(aDocument) {
          var toolbaritem = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbaritem');
          toolbaritem.id = 'ucjs_urlbar-container';
          toolbaritem.className = 'chromeclass-toolbar-additional';          
          return toolbaritem;            
        }
      });
      if (!CustomizableUI.getPlacementOfWidget('ucjs_urlbar-container')) {     
        urlbar.style.display = 'none';
        return; 
      };        
    } catch(e) {        
      urlbar.style.display = 'none';
      return;      
    };    
  };

  setTimeout(function() { 
    document.getElementById('ucjs_urlbar-container').appendChild(urlbar);       
    urlbar.setAttribute('consumeanchor', 'ucjs_PanelUI-button');     
  }, 0);

}());
