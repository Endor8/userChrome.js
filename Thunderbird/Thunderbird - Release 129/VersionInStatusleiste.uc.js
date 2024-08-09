// ==UserScript==
// @name           VersionInStatusleiste.uc.js
// @description    Versionsnummer in der Status- oder einer anderen Leiste anzeigen
// @include        main
// @charset        UTF-8
// @note           Basiert auf dem Script MemoryMonitorMod.uc.js und der Erweiterung "Version in Statusbar"
// @note           Bit-Version aus https://www.camp-firefox.de/forum/thema/135247-anwendungsname-und-version-in-der-men%C3%BCleiste/
// @note           In Zeilen 17 u. 18 die Toolbar und die Position (hinter welchem Element) auf der Toolbar anpassen.
// @note           Ein Klick auf den Button öffnet das Fenster "Über Thunderbird".
// ==/UserScript==

        setTimeout(function() {

var ucjsVN = {

    init : function () {
        var Toolbar = 'status-bar'
        var Position = 'status-status'
        var info = Components.classes['@mozilla.org/xre/app-info;1'].getService(Components.interfaces.nsIXULAppInfo);
        var bit = (Services.appinfo.is64Bit ? 64 : 32);
        var versionPanel = document.createXULElement('toolbaritem');
        versionPanel.id = 'VersionDisplay';
        versionPanel.setAttribute('tooltiptext', 'Versions-Nummer. Klick öffnet "Über ' + info.vendor + ' ' + info.name + '"');
        versionPanel.setAttribute('onclick', "openAboutDialog();");
        versionPanel.style.paddingTop = '4px';
        var label = document.createXULElement('label');
        label.setAttribute('value', "v" + info.version + " (" + bit + "bit)");
        versionPanel.appendChild(label);
        document.getElementById(Toolbar).insertBefore(versionPanel, document.getElementById(Position).nextSibling);
    },
}
ucjsVN.init();
                     }, 3000);