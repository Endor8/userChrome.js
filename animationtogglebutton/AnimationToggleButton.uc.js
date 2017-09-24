//   AnimationToggleButton.uc.js
//   v. 0.4.2

(function() {

   if (location != 'chrome://browser/content/browser.xul')
      return;

   try {

      CustomizableUI.createWidget({

         id: 'animation-button',
         type: 'custom',
         defaultArea: CustomizableUI.AREA_NAVBAR,

         onBuild: function(aDocument) {

            var button = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
            var attributes = {
               id: 'animation-button',
               class: 'toolbarbutton-1 chromeclass-toolbar-additional',
               removable: 'true',
               label: 'Animation',
               tooltiptext: 'Linksklick: GIF-Animationen einschalten\nMittelklick: Animation einmal abspielen\nRechtsklick: Ausschalten',
               oncontextmenu: 'return false'
            };
            for (var a in attributes)
               button.setAttribute(a, attributes[a]);
            var animmode = Services.prefs.getCharPref('image.animation_mode');
            button.setAttribute('anim', animmode);
            button.IsOnce = (animmode == 'once');

            function onClick() {

               var button = document.getElementById('animation-button');
               function setPref(value) {
                  Services.prefs.setCharPref('image.animation_mode', value);
               };
               function getPref() {
                  return Services.prefs.getCharPref('image.animation_mode');
               };
               function setIsOnce(value) {
                  var windows = Services.wm.getEnumerator('navigator:browser');
                  while (windows.hasMoreElements()) {
                     windows.getNext().document.getElementById('animation-button').IsOnce = value;
                  };
               };

               switch (event.button) {

                  case 0:
                     var animmode = getPref();
                     setPref('normal');
                     if (button.IsOnce) {
                        BrowserReloadSkipCache();
                        setIsOnce(false);
                     } else {
                        if (animmode == 'normal')
                           BrowserReloadSkipCache()
                        else
                           BrowserReload();
                     };
                     break;

                  case 1:
                     setPref('once');
                     BrowserReloadSkipCache();
                     setIsOnce(true);
                     break;

                  case 2:
                     setPref('none');
                     BrowserStop();
                     break;
               };

               var windows = Services.wm.getEnumerator('navigator:browser');
               while (windows.hasMoreElements()) {
                  windows.getNext().document.getElementById('animation-button').setAttribute('anim', getPref());
               };
            };

            button.setAttribute('onclick', '(' + onClick.toString() + ')();');
            return button;
         }
      });

   } catch(e) { };

   var css =
      '#animation-button[anim="normal"] {list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABbElEQVR42sWTP6vBURjHfy9DdiarDAZZhBhs/iS/SWGQMlBkIKKUuyMSCwklgxTyFmwWZq/BR8+x3Fu6Nwz31Klvp/N8nuf7PR1Ne2EZjcYvm81GMpmk3W7z62WDwaBLQblcJpfLoes6x+ORzWaDy+Uin88/B1gsFiqVCtPplFAoxGq1Yr1e43Q6CQQC+Hy+n4VWqxW73U6r1eJ6vZJKpZCuUuhwOPjT13w+p1qt4vF4yGazmEwmXslFi8fjZDIZvF6v8ildZdREIoHb7SYYDCotDUTLhJJBLBbD7/ejpdNp+v0+hUKBy+VCs9lUGZxOJxqNBrVaTWmZsl6vcz6fKZVKdDoder0emtlsVonOZjP2+z3L5ZLJZMJut1N6PB6r88ViofThcEBsb7dbFbKyMRqNuN1uL2+xrwBi4R2AZPYRIBwOPwASxkeAbrf7z4DBYPAWIBKJPADFYlG98XA4fLolZHnq72fy2aLRKHfeRoLqwjwI3AAAAABJRU5ErkJggg==)} ' +
      '#animation-button[anim="once"] {list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABaElEQVR42p2TvYrCUBSE72OIvVa2ksIipBENWKRTQ0gqQVOIYKEgpIhYCIL7AAmx0EYRLcRCAip5BTsbrX0GR04s3PwsbDwwzQ3fnDsTLmMJJp1O/3Ach1arBWawt/6aVCqlEWCaJnq9HjRNw+Vygeu6HzjOIJfLYTgcYr1eo1arYb/f43A4QBAESJIUhEn5fB6FQgHT6RSPxwO6roO2EsjzfHBDGKbZbrcYjUYol8vodrvIZDLxueJgmkajgU6nA1EU/Zy0la7abDZRKpVQrVYj1y4Wi1BVFZVKBazdbmM2m2EwGOB+v2MymfgdXK9XjMfjCHy73WAYBizLguM4YNlsFv1+H5vNBufzGbvdDqvVCqfTKQIvl0t4ngeKfTwe/ZL9GIvFAs/nM6AwHP5Oovi+AUVICpOos4jBf2FSvV5/G1AZSeGAgW3bieGAwTfwx+BLmCTLctBgPp/HikqmX/37jB6boih4AcQgRNTa5HaFAAAAAElFTkSuQmCC)} ' +
      '#animation-button[anim="none"] {list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABbUlEQVR42p2TP6uCYBjF/RY32lqaWqOhQVyigoa2/iA6CdUgQUNB0FA0BEH3AxQ56FKIDdEQgopfoa2l5j6Dp/u8F+J69cK1B87i6+887zkixyWYdDr9WSgU0O12EXAc058vp1IpmYDpdIrhcAhZlnG5XGDb9guONcjlcpjNZjBNE81mE6fTCefzGYIgoF6vh2BmkM/nUSwWsVqt8Hg80Ov1QFsJ5Hk+tCEC0xwOB8znc1QqFQwGA2QymY+4SLEwjaIo6Pf7qFarLCdtpat2Oh2Uy2U0Go3ItUulEiRJQq1WA6eqKjRNw3g8xv1+x3K5ZB1cr1csFosIfLvdMJlMsF6vsd1uwWWzWYxGI1iWBc/zcDwesd/v4bpuBN7tdvB9HxTbcRxWMothGAaCIAjrFxw5/xLFZwYUISlMos6iBv+ESa1W69uAykgKhww2m01iOGTwDvwyeBcmtdvtsIGu67GikulT/3xGP5soingC1EBhpA0JGaMAAAAASUVORK5CYII=)}';
   var stylesheet = document.createProcessingInstruction('xml-stylesheet', 'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(css) + '"');
   document.insertBefore(stylesheet, document.documentElement);

})();
