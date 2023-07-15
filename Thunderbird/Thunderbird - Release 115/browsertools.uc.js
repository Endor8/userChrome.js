//    Button für Browserwerkzeuge
//    browsertoolbox.uc.js von Endor von hier:
//    https://www.camp-firefox.de/forum/thema/129954-symbole-zu-kontextmen%C3%BCs-mit-javascript-und-css-hinzuf%C3%BCgen/?postID=1138524#post1138524
//    2021-11-02 Von milupo für Thunderbird angepasst
//    200214: Einbau
//    200215: berechneter Path mit "werkzeuge.png"

(function() {

    if (location != 'chrome://messenger/content/messenger.xhtml')
        return;

    var toolbarbutton = document.createXULElement('toolbarbutton');        
                var currentProfileDirectory = Services.dirsvc.get("ProfD", Ci.nsIFile).path.replace(/\\/g, "/");
                var buttonicon = "werkzeugkasten.png"
                var props = {
                    id: 'browser-toolbox-button',
                    class: 'toolbarbutton-1',
                    label: '',
                    tooltiptext: 'Browser-Werkzeuge',
                    style: 'list-style-image: url("' + ("file:" + currentProfileDirectory + "/chrome/icons/" + buttonicon) + '");',
                    oncommand: '(' + onCommand.toString() + ')()'
                };
               for (var p in props) toolbarbutton.setAttribute(p, props[p]);

    var position = document.getElementById('unifiedToolbarContent');    
    position.parentNode.insertBefore(toolbarbutton, position.nextSibling);
               
    function onCommand() {
        var document = event.target.ownerDocument;
        if (!document.getElementById('devtoolsToolbox')) {
            let { require } = Cu.import("resource://devtools/shared/Loader.jsm", {});
            require("devtools/client/framework/devtools-browser");
        };
        document.getElementById('devtoolsToolbox').click();
    };

})();