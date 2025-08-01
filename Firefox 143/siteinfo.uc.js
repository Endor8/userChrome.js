  
  //  Siteinfo-Button.uc.js
  
  (function() {

       if (location != 'chrome://browser/content/browser.xhtml') return;

       try {
          CustomizableUI.createWidget({
             id: 'context-viewinfos-button',
             type: 'custom',
             defaultArea: CustomizableUI.AREA_NAVBAR,
             onBuild: function(aDocument) {         
                var toolbaritem = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
                var props = {
                   id: 'context-viewinfos-button',
                   class: 'toolbarbutton-1 chromeclass-toolbar-additional',
                   removable: true,
                   label: 'Seiteninformationen',
				   accesskey: 'i',
                   tooltiptext: 'Seiteninformationen anzeigen',
                   style: 'list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACp0lEQVQ4jV2TPW9cVRCGn3fOuffu9Xo3TnCEkANYQotB2WJpUqWwJSqIUuQPRKKlsAUFpeUmEpXXEv+ACClFitQowmUIMmxASowIkjuQk9jr/fDd7F3fQ7HWdcxI04zmfc47RzPif9G4cXdR0iqy5flL9VYRAoe9rCNpG9nW7v1be2/2qxR+/v0c0vp7C/NrV5euMCkijoYTXucnEALDYcaLwx7DLGsjbTy7d7NbAk7FP12/ttSq1uZ48vyYLA/UZhwg+qMCZ5A6GGVDesODDtLK0x8+69rUh9avX1tqWVzn0dMhWR4A8eDOxzy48xEyEWQcB4O0Tlq73JK5dQBr3Li7+P7C/NpsbY4nf2dTTxKYyhnNG/KGeQfeEVXrRJXqWvP2w0UvafXq0rv8+vz4TCwhJz795s/p62ZlHQkJ4uoFTnqvVj2y5UnwZOP8XNPj75rlTze/3MV5YU4IoQCJS5Bzy3b5rXrraDgBQQEMRgUH/QmNL/4oAXHiiSueJPUkM554JmK2FlGppC1fBBjnBeNJ4HAwQWZEicN7KwFRxeHjaU1mSDCbBIZ9jx0cHXfyyQkvD3NCAHPCnOEid85BUvEkMxGV6jQvzkVk45OOSdp+dTDAOZDpFCCcK3cMnziiiidJp+JaPcZZgZzfNmRbR4MBl2aENE0zIXc2go8cUeKJU0+lGvPhlYh/9kfI3Jbt3r+1N85ftykyUkcJ6Ww2SsCPX7+Nc4aPHY2FiH5vzL8vx+2dzeaeP93Ejfykv+zMtwKzAHzy1V8kaVTOXavFfDAP3f0BP+8cdGS2AWAAz+7d7CKtSL22D11U5MQBqha4GAfeqQYuKOP33/Z59PhFmxBWfvm2cXZMb0bz9sNFma3K+eUkSVs+dozyoiPnt2Vua2ezee6c/wN/E94boB6vcgAAAABJRU5ErkJggg==)',
                };            
                for (var p in props)
                    toolbaritem.setAttribute(p, props[p]);      
					toolbaritem.addEventListener('click', event => {
					if (event.button == 0) { 
					event.target.ownerGlobal.BrowserCommands.pageInfo(null, 'mediaTab')
                    }
				});					
                return toolbaritem;
             }      
          });
       } catch(e) { };
	   
	   let menuitem = document.createXULElement('menuitem');
	   menuitem.id = 'context-open-siteinfo';
	   menuitem.setAttribute('label', 'Seiteninformationen');
	   menuitem.setAttribute('tooltiptext', 'Seiteninformationen anzeigen ');
	   menuitem.addEventListener('command', function(event) {BrowserCommands.pageInfo(null, 'mediaTab');}, true);
	   menuitem.classList.add('menuitem-iconic');
	   menuitem.style.setProperty('--menuitem-icon', 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACp0lEQVQ4jV2TPW9cVRCGn3fOuffu9Xo3TnCEkANYQotB2WJpUqWwJSqIUuQPRKKlsAUFpeUmEpXXEv+ACClFitQowmUIMmxASowIkjuQk9jr/fDd7F3fQ7HWdcxI04zmfc47RzPif9G4cXdR0iqy5flL9VYRAoe9rCNpG9nW7v1be2/2qxR+/v0c0vp7C/NrV5euMCkijoYTXucnEALDYcaLwx7DLGsjbTy7d7NbAk7FP12/ttSq1uZ48vyYLA/UZhwg+qMCZ5A6GGVDesODDtLK0x8+69rUh9avX1tqWVzn0dMhWR4A8eDOxzy48xEyEWQcB4O0Tlq73JK5dQBr3Li7+P7C/NpsbY4nf2dTTxKYyhnNG/KGeQfeEVXrRJXqWvP2w0UvafXq0rv8+vz4TCwhJz795s/p62ZlHQkJ4uoFTnqvVj2y5UnwZOP8XNPj75rlTze/3MV5YU4IoQCJS5Bzy3b5rXrraDgBQQEMRgUH/QmNL/4oAXHiiSueJPUkM554JmK2FlGppC1fBBjnBeNJ4HAwQWZEicN7KwFRxeHjaU1mSDCbBIZ9jx0cHXfyyQkvD3NCAHPCnOEid85BUvEkMxGV6jQvzkVk45OOSdp+dTDAOZDpFCCcK3cMnziiiidJp+JaPcZZgZzfNmRbR4MBl2aENE0zIXc2go8cUeKJU0+lGvPhlYh/9kfI3Jbt3r+1N85ftykyUkcJ6Ww2SsCPX7+Nc4aPHY2FiH5vzL8vx+2dzeaeP93Ejfykv+zMtwKzAHzy1V8kaVTOXavFfDAP3f0BP+8cdGS2AWAAz+7d7CKtSL22D11U5MQBqha4GAfeqQYuKOP33/Z59PhFmxBWfvm2cXZMb0bz9sNFma3K+eUkSVs+dozyoiPnt2Vua2ezee6c/wN/E94boB6vcgAAAABJRU5ErkJggg==")');
	   let refItem = document.getElementById('context-inspect');
	   refItem.parentNode.insertBefore(menuitem, refItem);
	     
       }) ();