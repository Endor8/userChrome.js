// ==UserScript==
// @name         sort_Result_SearchBar_History.uc.js
// @description  Verlaufsanzeige ändern
// @charset      UTF-8
// @include      main
// @version      2018-07-20
// ==/UserScript==
const sort_Result_SearchBar_History = {
  /*
    0: Standard
    1: Eingabereihenfolge neuester zuerst
    2: Eingabereihenfolge
    3: Eingabereihenfolge neuster zuletzt
  */
  SORT_ORDER: 1,

  init: function() {
    switch(this.SORT_ORDER) {
      case 1:
        Services.prefs.setIntPref('browser.formfill.bucketSize', -1);
        Services.prefs.setIntPref('browser.formfill.maxTimeGroupings', -1);
        Services.prefs.setIntPref('browser.formfill.timeGroupingSize', -1);
        break;
      case 2:
        Services.prefs.setIntPref('browser.formfill.bucketSize', 1);
        Services.prefs.setIntPref('browser.formfill.maxTimeGroupings', -1);
        Services.prefs.setIntPref('browser.formfill.timeGroupingSize', -1);
        break;
      case 3:
        Services.prefs.setIntPref("browser.formfill.bucketSize", 99999999);
        Services.prefs.clearUserPref('browser.formfill.maxTimeGroupings');
        Services.prefs.clearUserPref('browser.formfill.timeGroupingSize');
        break;
      default:
        Services.prefs.clearUserPref('browser.formfill.bucketSize');
        Services.prefs.clearUserPref('browser.formfill.maxTimeGroupings');
        Services.prefs.clearUserPref('browser.formfill.timeGroupingSize');
    }
  }
}

sort_Result_SearchBar_History.init();
