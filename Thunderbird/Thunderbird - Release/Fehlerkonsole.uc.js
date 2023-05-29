//    Button zum öffnen der Fehlerkonsole
//    Erstellt am 28.05.2023 von Endor

(function() {

    if (location != 'chrome://messenger/content/messenger.xhtml')
        return;

    var toolbarbutton = document.createXULElement('toolbarbutton');        
                var currentProfileDirectory = Services.dirsvc.get("ProfD", Ci.nsIFile).path.replace(/\\/g, "/");
                var buttonicon = "Fehler.png"
                var props = {
                    id: 'Fehlerkonsole-button',
                    class: 'toolbarbutton-1',
                    label: 'Fehlerkonsole öffnen',
                    tooltiptext: 'Fehlerkonsole öffnen',
                    style: 'list-style-image: url("' + ("file:" + currentProfileDirectory + "/chrome/icons/" + buttonicon) + '");',
                    oncommand: 'toJavaScriptConsole();'
                };
               for (var p in props) toolbarbutton.setAttribute(p, props[p]);

    var toolbox = document.getElementById("mail-toolbox");
    toolbox.palette.appendChild(toolbarbutton);    

    var toolbar = document.getElementById("tabbar-toolbar");
    toolbar.insertItem("Fehlerkonsole-button");
               
    function onCommand() {
        var document = event.target.ownerDocument;
        if (!document.getElementById('devtoolsToolbox')) {
            let { require } = Cu.import("resource://devtools/shared/Loader.jsm", {});
            require("devtools/client/framework/devtools-browser");
        };
        document.getElementById('devtoolsToolbox').click();
    };

})();
