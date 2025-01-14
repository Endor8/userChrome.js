// buttonCloseTab.uc.js - Button > Firefox Tabs schliessen
  
  (function() {
      
  if (!window.gBrowser) return;
    
    try {
        CustomizableUI.createWidget({
            id: 'fp-closetabss',
            type: 'custom',
            defaultArea: CustomizableUI.AREA_NAVBAR,
            onBuild: function(aDocument) {            
                var toolbaritem = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
                var props = {
                    id: 'fp-closetabss',
                    class: 'toolbarbutton-1 chromeclass-toolbar-additional',
                    label: 'Aktuellen Tab schließen',
                    tooltiptext: 'Aktuellen Tab schließen',
                    style: 'list-style-image: url(\'data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 22 22"><path fill="currentColor" fill-opacity="context-fill-opacity" d="M9.414 8l5.293-5.293a1 1 0 0 0-1.414-1.414L8 6.586 2.707 1.293a1 1 0 0 0-1.414 1.414L6.586 8l-5.293 5.293a1 1 0 1 0 1.414 1.414L8 9.414l5.293 5.293a1 1 0 0 0 1.414-1.414z"></path></svg>\')',
                    }; 
                for (var p in props)
                    toolbaritem.setAttribute(p, props[p]);
					toolbaritem.addEventListener('click', event => {
					if (event.button == 0) { 
                            BrowserCommands.closeTabOrWindow();
                                 }
  });
                return toolbaritem;
            }
        });
    } catch(e) { };
   
})();