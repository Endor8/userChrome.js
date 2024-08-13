(function() {
  // Überprüfen, ob gBrowser verfügbar ist
  if (!window.gBrowser)
    return;

  // Funktion zum Anzeigen der Grafik im aktuellen Tab
  function viewMedia(event) {
    // Standardverhalten und Event-Propagation unterdrücken
    event.stopPropagation();
    event.preventDefault();

    // Definiere, wo der Link geöffnet werden soll (im aktuellen Tab)
    let where = 'current';
    let referrerInfo = gContextMenu.contentData.referrerInfo;
    let systemPrincipal = Services.scriptSecurityManager.getSystemPrincipal();

    if (gContextMenu.onCanvas) {
      // Behandlung für Canvas-Elemente
      gContextMenu._canvasToBlobURL(gContextMenu.targetIdentifier).then(function(blobURL) {
        openTrustedLinkIn(blobURL, where, {
          referrerInfo,
          triggeringPrincipal: systemPrincipal,
        });
      }, Cu.reportError);
    } else {
      // Sicherheitsüberprüfung der URL
      urlSecurityCheck(
        gContextMenu.mediaURL,
        gContextMenu.principal,
        Ci.nsIScriptSecurityManager.DISALLOW_SCRIPT
      );
      // Öffnen des Links im aktuellen Tab
      openTrustedLinkIn(gContextMenu.mediaURL, where, {
        referrerInfo,
        forceAllowDataURI: true,
        triggeringPrincipal: gContextMenu.principal,
        csp: gContextMenu.csp,
      });
    }
  }

  // Zugriff auf den Menüeintrag "Grafik anzeigen"
  let item = document.getElementById('context-viewimage');
  if (item) {
    // Entfernen des bestehenden "command"-Attributs, um das Standardverhalten zu unterdrücken
    item.removeAttribute('command');
    
    // Hinzufügen des eigenen Event-Listeners für das "command"-Event
    item.addEventListener('command', viewMedia, true);
    
    // Optional: Anpassung des Labels (falls gewünscht)
    item.label = 'Grafik anzeigen';
  }

})();
