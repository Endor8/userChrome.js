// ==Userscript==
// @name Open Profile Directory
// @include *
// ==/Userscript==

(function(win){
    function openProfileDirectory() {
        Components.classes["@mozilla.org/file/directory_service;1"]
              .getService(Components.interfaces.nsIProperties)
              .get("ProfD", Components.interfaces.nsIFile)
              .launch();
    }
    if(typeof win.openProfileDirectory == 'undefined') {
        win.openProfileDirectory = openProfileDirectory;
        win.addEventListener('keydown', function(e) {
            if (e.altKey == true && e.keyCode == 80) {
                e.preventDefault();
                openProfileDirectory();
            }
        }, false);
    }
})(window);
