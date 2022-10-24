(function(){

    var css =` @-moz-document url-prefix("chrome://browser/content/browser.xul") {
    #toolbar-menubar { -moz-box-ordinal-group: 1 !important; }
    #nav-bar { -moz-box-ordinal-group: 2 !important; }
    #PersonalToolbar { -moz-box-ordinal-group: 3 !important; }
    #main-window[inFullscreen="true"] #window-controls { display: block; }
    #main-window:not([tabsintitlebar="true"]) .tab-background { border-top-style: none !important; }
    } `;
    var sss = Cc['@mozilla.org/content/style-sheet-service;1'].getService(Ci.nsIStyleSheetService);
    var uri = makeURI('data:text/css;charset=UTF=8,' + encodeURIComponent(css));
    sss.loadAndRegisterSheet(uri, sss.USER_SHEET);

    try {
    var vbox = document.createXULElement('vbox');
    document.getElementById("navigator-toolbox").appendChild(
    document.getElementById("toolbar-menubar"));
    document.getElementById("navigator-toolbox").parentNode.insertBefore(
    vbox, document.getElementById("browser-bottombox"));
    vbox.appendChild(document.getElementById("titlebar"));
    } catch(e) {}

})();
