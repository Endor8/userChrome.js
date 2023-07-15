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
                    label: '',
                    tooltiptext: 'Fehlerkonsole öffnen',
                    style: 'list-style-image: url("' + ("file:" + currentProfileDirectory + "/chrome/icons/" + buttonicon) + '");',
                    oncommand: 'toJavaScriptConsole();'
                };
               for (var p in props) toolbarbutton.setAttribute(p, props[p]);

    var position = document.getElementById('unifiedToolbarContent');    
    position.parentNode.insertBefore(toolbarbutton, position.nextSibling);
               
    function onCommand() {
        var document = event.target.ownerDocument;
        if (!document.getElementById('devtoolsToolbox')) {
            let { require } = Cu.import("resource://devtools/shared/Loader.sys.mjs", {});
            require("devtools/client/framework/devtools-browser");
        };
        document.getElementById('devtoolsToolbox').click();
    };

})();