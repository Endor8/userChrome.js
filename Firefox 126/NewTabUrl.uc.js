// ==UserScript==
// @name          NewTabUrl.uc.js
// @namespace     https://egg.5ch.net/test/read.cgi/software/1710343177/
// @description   Neuer Tab Adresse
// @include       main
// @author        Mozilla Firefox
// @compatibility 126
// @version       2024/05/27 22:00
// ==/UserScript==
(function() {
  let func = BrowserCommands.openTab.toString();

  func = func.replace(
  'url ??= BROWSER_NEW_TAB_URL;',
  'url ??= "https://www.camp-firefox.de/forum";'  //Gewünschte URL für Neuen Tab festlegen
  );

  BrowserCommands.openTab = new Function(
    func.match(/\(([^)]*)/)[1],
    func.replace(/[^)]*/, '').replace(/[^{]*/, '').replace(/^{/, '').replace(/}\s*$/, '')
  );
})();
