// ==Userscript==
// @name Open Profile Directory
// @include *
// ==/Userscript==
 
(function(win){
    Components.utils.import("resource://gre/modules/Services.jsm");
 
    function openProfileDirectory() {
      // Get the profile directory.
      let currProfD = Services.dirsvc.get("ProfD", Ci.nsIFile);
      let profileDir = currProfD.path;
 
      // Show the profile directory.
      let nsLocalFile = Components.Constructor("@mozilla.org/file/local;1","nsIFile", "initWithPath");
      new nsLocalFile(profileDir).reveal();
    }
     
    if (typeof win.openProfileDirectory == 'undefined') {
        win.openProfileDirectory = openProfileDirectory;
        win.addEventListener('keydown', function(e) {
            if (e.altKey == true && e.keyCode == 80) {
                e.preventDefault();
                openProfileDirectory();
            }    
        }, false);
    }
     
})(window);