// Neuen Tab öffnen, bei Hover über Neue Tab Schaltfäche
// open new tab by hovering over tabs-newtab-button

(function() {

  if (!window.gBrowser)
    return;

  let delay = 800; //Zeitverzögerung in Millisekunden
  let multi = false; //Mehrere Neue Tabs öffnen, true = ja, false = nein.
  let timeoutID;
  let done = false;

  let hasTabMixPlus = !!window.Tabmix;

  let newTabURL = (function() {
    if (hasTabMixPlus) {
      switch (Services.prefs.getIntPref('extensions.tabmix.loadOnNewTab.type')) {
        case 0:
          return 'about:blank';
        case 1:
          return 'about:home';
        case 2: //Aktuelle Seite
        case 3: //Kopieren einer Seite
          return gBrowser.currentURI.spec;
        case 4: //Benutzerdefinierte Webseite
        default:
          return BROWSER_NEW_TAB_URL;
      }
    } else {
      return BROWSER_NEW_TAB_URL;
    }
  })();

  let params = {
    triggeringPrincipal: newTabURL.startsWith('http') ?
      Services.scriptSecurityManager.createNullPrincipal({}) :
      Services.scriptSecurityManager.getSystemPrincipal()
  };

  let listener = function() {
    if (multi) {
      timeoutID = setInterval(function() {
        openTrustedLinkIn(newTabURL, 'tab', params);
      }, delay);
    } else {
      if (done)
        return;
      timeoutID = setTimeout(function() {
        openTrustedLinkIn(newTabURL, 'tab', params);
        done = true;
        setTimeout(function() {
          done = false;
        }, 100);
      }, delay);
    };
  };

  let newTabButtons = [
    document.getElementById('tabs-newtab-button'),
    document.getElementById('new-tab-button')
  ];

  for (let btn of newTabButtons) {
    btn.addEventListener('mouseover', listener, false);
    btn.addEventListener('mouseout', function() {
      if (multi)
        clearInterval(timeoutID)
      else
        clearTimeout(timeoutID);
    }, false);
  };

})();