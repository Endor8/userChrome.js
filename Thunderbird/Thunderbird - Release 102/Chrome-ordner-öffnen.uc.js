 // Chromeordner
        // Unicode-Konvertierung → label: 'Chromeordner', tooltiptext: 'Chromeordner öffnen',
        
        (function() {

    if (location != 'chrome://messenger/content/messenger.xhtml') return;
        var toolbarbutton = document.createXULElement('toolbarbutton');
		
	   
    var props = {
            id: 'chromefolder-ToolBarButton',
            class: 'toolbarbutton-1',
            label: 'Chrome-Ordner',
            tooltiptext: 'Chromeordner öffnen',
            style: 'list-style-image: url("file:///F:/Adaten/Downloads/Firefox/Thunderbird/Thunderbird Setup 102.0.3/thunderbird-114.0a1.de.win64/Profilordner/chrome/icons/Chrome-Ordner.png")',
            onclick: 'if (event.button == 0) { \
Services.dirsvc.get("UChrm", Ci.nsIFile).launch(); \
}; '
                };
                for (var p in props) toolbarbutton.setAttribute(p, props[p]);

    var toolbox = document.getElementById("mail-toolbox");
    toolbox.palette.appendChild(toolbarbutton);    

    var toolbar = document.getElementById("tabbar-toolbar");
    toolbar.insertItem("chromefolder-ToolBarButton", toolbar.lastChild);
        })();