  
  //  bookmarksmanager.uc.js
  
  (function() {

       if (location != 'chrome://browser/content/browser.xhtml') return;
	    
       try {
          CustomizableUI.createWidget({
             id: 'bookmarks-manager-button',
             type: 'custom',
             defaultArea: CustomizableUI.AREA_NAVBAR,
             onBuild: function(aDocument) {         
                var toolbaritem = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
                var props = {
                   id: 'bookmarks-manager-button',
                   class: 'toolbarbutton-1 chromeclass-toolbar-additional',
                   removable: true,
                   label: 'Lesezeichen Manager',
				   accesskey: 'e',
                   tooltiptext: 'Lesezeichen Manager öffnen',
                   style: 'list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACnklEQVQ4y6XTPYgVVxTA8f/ce2fu7Mx7vuf6srsa425cxFWEiDwCgpXpErELIVYWVolYWGmdKoVdLGwUGwXFJggWwq42hpBmiUaW1f2I7Pfs+p6773Pm3jspXtwEIhLwNIdTnB/nHDjwgeGNXrhz2JfysPC8/9fgrLAmez7105lnAOpAZejxwYGBiud5QA78N3cyRymSLG6kHBmJ+G1ueX0KPgJQ8ytppbXZ/tt/N5Aax9gnEUndUm84Xm/aytuJVBxZzn3VT0lbjMkoFIskawmDQ4MALC8ts3vPx9STJcKoSK3r8/CP9vZKqhhJjh/sZyB2ZFlGuVxmYSFleLgHzBaa7N8/SDJxlXj3SZZ0lesT8h/Aw1Kr1dAGjDEYY+h2uyRJAkCapiTzk4TpS7orIbUdo3jYbUD4SqJ1gNaaMAzRWhMEvVprjQ588pVHxJ+eQDRnCESGr/41QeALCnFEHAustcRxTNZcIepOkdsO0eZLivYZQh2lsKtEafUmJ8p93LldOZ21my3lkdNoNChKhXMOYwx27QnmzXVk3y524qEKZTCzyD7H3uwpl6ot8u7wXVbnppX2JYU4Jo57QBAEtPZ9CYsvoPWAoOCBWAMrgBwVtbGdOp3X6+M27fyglPRQvsL3fZxz+L6PHxbRY5fJFg9g1r9DFTKgB+TOMvnnCMNbW9+7jHlVb6Zr1x5OC19CnoMQHtZZpFBIPlMXR2VZ7ehC6noGMN0eMtWz87MAaiZ583UcBkIJsX3ZABOkqLQa3j+mj7euEIBdpeEFKLGH8ItDv7fe+zA3btyr/vrkl32dcXHeJWxlk0y0fubzzgNOmSmemle02/c5AqDeBUgpyzNzy9+M7B3b6F94/qPd4FZ0mlmAdJwFUeJbIXu9fwFVCBajMWIWPQAAAABJRU5ErkJggg==)',
                  
                };            
                for (var p in props)
                   toolbaritem.setAttribute(p, props[p]);  
                   toolbaritem.addEventListener('click', event => {
					if (event.button == 0) { 
                            PlacesCommandHook.showPlacesOrganizer('AllBookmarks');
                                 }
  });			   
                return toolbaritem;
             }      
          });
       } catch(e) { };
       }) ();