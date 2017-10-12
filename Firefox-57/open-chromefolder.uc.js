  
  //  open-chromefolder.uc.js
  
  (function() {

       if (location != 'chrome://browser/content/browser.xul') return;
	    
       function buttonFunction() {
          'Services.dirsvc.get("UChrm", Ci.nsIFile).launch();'
       };   

       try {
          CustomizableUI.createWidget({
             id: 'open-chromefolder',
             type: 'custom',
             defaultArea: CustomizableUI.AREA_NAVBAR,
             onBuild: function(aDocument) {         
                var toolbaritem = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
                var props = {
                   id: 'open-chromefolder',
                   class: 'toolbarbutton-1 chromeclass-toolbar-additional',
                   removable: true,
                   label: 'Chrome Ordner öffnen',
                   tooltiptext: 'Chrome Ordner öffnen',
                   style: 'list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABc0lEQVR42mNkoBAwUmxAw7LHC/nYfsWhS2zYfIDp0MLk/wQNKJtz639ptArDmSc/4IJ//vxluH31FU5NZy7dZV/W5PYLboCyujjDj5+sKIrEhRHs33+gBv9lYHj69CPD7eu3pBbW2D+3i5/Lylg6++Z/cRl+hm9f/jF8fPeOoJ+ZWVkZzp04nfjr58/HQO4toAE3/guKcDG8f/cdrKAmVo3h2MPvRAVge8tyP8aSWTf+MzH/ZPj7h5lBV1+B4c17guEGBh/fv//15OEjU6AB1////PmRQUtTieHLT3aGf8TpZ3jy4OHxyTl6VowlM6////jxBYOltRHDi9f/iNL888cPhqePHqXPKTOfxVg889p/GSkeht8MvMCYIM761y+evZqcoyMOjkaQAfr6UgzPXvxjYGVjIqj5/79/DLdv3Fs1s8QkHGyAd9rEWH0rjwUfP/0iyvY/v3//3bmgxPLB5X1nwQYAsQVxwYYBTsAMoAhQbAAAAjCiCL9JqqgAAAAASUVORK5CYII=)',
                   oncommand: 'Services.dirsvc.get("UChrm", Ci.nsIFile).launch();'
                };            
                for (var p in props)
                   toolbaritem.setAttribute(p, props[p]);            
                return toolbaritem;
             }      
          });
       } catch(e) { };
       }) ();
