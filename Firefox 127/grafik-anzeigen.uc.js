(function() {

  if (!window.gBrowser)
    return;

  function viewMedia(event) {
    let where = BrowserUtils.whereToOpenLink(event, false, false);
    let referrerInfo = gContextMenu.contentData.referrerInfo;
    let systemPrincipal = Services.scriptSecurityManager.getSystemPrincipal();
    if (gContextMenu.onCanvas) {
      gContextMenu._canvasToBlobURL(gContextMenu.targetIdentifier).then(function(blobURL) {
        openTrustedLinkIn(blobURL, where, {
          referrerInfo,
          triggeringPrincipal: systemPrincipal,
        });
      }, Cu.reportError);
    } else {
      urlSecurityCheck(
        gContextMenu.mediaURL,
        gContextMenu.principal,
        Ci.nsIScriptSecurityManager.DISALLOW_SCRIPT
      );
      openTrustedLinkIn(gContextMenu.mediaURL, where, {
        referrerInfo,
        forceAllowDataURI: true,
        triggeringPrincipal: gContextMenu.principal,
        csp: gContextMenu.csp,
      });
    }
  }

  let item = document.getElementById('context-viewimage');
  item.setAttribute('oncommand', '(' + viewMedia.toString() + ')(event);');
  item.label = 'Grafik anzeigen';

})();
