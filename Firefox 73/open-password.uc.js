// ==UserScript==
// @name    open-password.uc.js
// @charset UTF-8
// Date     2023/04/14 Dritte Version
// @note    Symbolleistenschaltfläche zum Öffnen der Passwörter in einem Fenster
// ==/UserScript==

(function() {

  if (window.__SSi != 'window0')
    return;

  CustomizableUI.createWidget({
    id: 'Passwort-Button',
    label: 'about:logins',
    tooltiptext: 'about:logins',
    defaultArea: CustomizableUI.AREA_NAVBAR,
    onCreated: button => button.style.listStyleImage = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAs5JREFUeNp0U11IU2EYfs5+canzF8ufICmvTJOTpWg/CrnIi6BQ+tUuFC/CupHqIokYRnnvhWIIRSQ6hX4RNOeFFUyXbS2GgXNh6tJtbPNvO+dsp+87U5mhHzzn/d7vvO/7ve/zfi8jiiKGHiqgkoORyZAPoJwgE9G1QDAeicDGhSFil6XYlIwQQXXS/ryawyU15aJam8ttrEAMehx/vg+V+FyOfmLzgUDcNUCIFwtSs45cOVbdct081mufnTYNhyMCMrMPZp88daluarRf7l10zpFkLf8HkNFPkENlQVWjzmrqdTjmhw3Q+uvlyWv1roDdYLO8dRwtO6+jNiGeXrYTUgbrHA4lJKanLXgm5hQa6MiRbuuGv6tOPxunyKU2e3KwHhJXQlwwqKtqLwoLAny+ZayteKBRCYhXi+A4Pkht9gwQ5PHl2+dhXdGJSjYUCMDrWkDAN4+UBAZxGemwTk3/pDYMsZ1JVUqQ6OTFbRJHjO8Nue6lpVBh8ek8tWZfWpygBQ/BPTZm+mW32noZBiOz6Sp0l2qjzoRRrEXA0Hfw5BoDIQwl2dI3cLvxvv6yZ9GBwRc9A0TvIM7jcxlKvrs8iTQcOwLIYsohnMJIoKSKXCkJ+jE6U4hzmZbqncR5UpKxbeSFaMBYXvqfd30kopU4o6c4gdQp0prZhnO3WColfSsAdY4BTRI3mu9VkP1TZ7KCptwJQZxEKAJ/2A8qJZ2cS7c9NgBXS4GcFCmo1K6uZ+3viGjjgyJ1YCsuVbL03C24UXHhrLQ3Do5uzwJefwUuFgIHtAhS/c6j1tq2Fn2I+yHUISdiNr4akezyawtZW5/FHJ0gmLeHiRL2xgL1TRZqOpYPmvR9v30YmJgh/fwUuEv+c9DHm7xhL7BBSlAyx6Fgom1kGIZyoSFILMrEmbxUNNiX8dLqwsRmSQGCVTSrOkjtLHE0EzQhS41/AgwAEXpPSomMNg0AAAAASUVORK5CYII=)',
    onCommand: onCommand
  });

  function onCommand(event) {
    let loginWindow = event.target.ownerGlobal
      .open(AppConstants.BROWSER_CHROME_URL, '_blank', 'chrome,resizable');
    loginWindow.addEventListener('load', function() {
      this.openTrustedLinkIn('about:logins', 'current');
    }, {once: true});
  }

})();
