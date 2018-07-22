// ==UserScript==
// @name         no_Limit_Result_SearchBar_History.uc.js
// @description  Suchleisten-Chronik auf unbegrenzte Anzahl stellen
// @charset      UTF-8
// @include      main
// @version      2018-07-21 fix at startup
// @version      2018-07-20
// ==/UserScript==
const no_Limit_Result_SearchBar_History = {
  init: function() {
    window.addEventListener('unload', this, false);
    window.addEventListener('aftercustomization', this, false);
    Services.prefs.addObserver('browser.search.widget.inNavBar', this, false);
    this.patch();
  },

  uninit: function() {
    window.removeEventListener('unload', this, false);
    window.removeEventListener('aftercustomization', this, false);
    Services.prefs.removeObserver('browser.search.widget.inNavBar', this);
  },

  patch: function() {
    const bar = BrowserSearch.searchBar;
    const box = bar._textbox;
    box.popup.setAttribute('nomaxresults', 'true');
  },

  observe(aSubject, aTopic, aPrefstring) {
      if (aTopic == 'nsPref:changed') {
        // Verarbeitung bei Änderung der Einstellungen
        setTimeout(function(){no_Limit_Result_SearchBar_History.patch();}, 0);
      }
  },

  handleEvent: function(event) {
    switch(event.type) {
      case "aftercustomization":
        this.patch();
        break;
      case "unload":
        this.uninit();
        break;
    }
  }
}

no_Limit_Result_SearchBar_History.init();
