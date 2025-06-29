// ==Userscript==
// @name Open Chrome Directory
// Dieses Skript öffnet mit dem Hotkey "Alt + c" oder "AltGr + c" direkt den Chromeordner.
// @include *
// ==/Userscript==

(function(win){

    function openChromeDirectory() {
      // Get the chrome directory.
      let currUChrm = Services.dirsvc.get("UChrm", Ci.nsIFile);
      let chromeDir = currUChrm.path;

      // Show the chrome directory.
      let nsLocalFile = Components.Constructor("@mozilla.org/file/local;1","nsIFile", "initWithPath");
      new nsLocalFile(chromeDir).reveal();
    }

    if (typeof win.openChromeDirectory == 'undefined') {
        win.openChromeDirectory = openChromeDirectory;
        win.addEventListener('keydown', function(e) {
            if (e.altKey == true && e.keyCode == 67) {
                e.preventDefault();
                openChromeDirectory();
            }
        }, false);
    }

})(window);
