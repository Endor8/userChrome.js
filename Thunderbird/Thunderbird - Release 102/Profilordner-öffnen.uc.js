 // Profilordner
        // Unicode-Konvertierung → label: 'Profilordner', tooltiptext: 'Profilordner öffnen',
        
        (function() {

    if (location != 'chrome://messenger/content/messenger.xhtml') return;
        var toolbarbutton = document.createXULElement('toolbarbutton');
    var props = {
            id: 'profilefolder-ToolBarButton',
            class: 'toolbarbutton-1',
            label: 'Profilordner',
            tooltiptext: 'Profilordner öffnen',
            style: 'list-style-image: url("file:///F:/Adaten/Downloads/Firefox/Thunderbird/Thunderbird Setup 102.0.3/Profilordner/chrome/icons/Profil-Folder.png")',
            onclick: 'if (event.button == 0) { \
Services.dirsvc.get("ProfD", Ci.nsIFile).launch(); \
}; '
                };
                for (var p in props) toolbarbutton.setAttribute(p, props[p]);

    var toolbox = document.getElementById("mail-toolbox");
    toolbox.palette.appendChild(toolbarbutton);    

    var toolbar = document.getElementById("tabbar-toolbar");
    toolbar.insertItem("profilefolder-ToolBarButton", toolbar.lastChild);
        })();