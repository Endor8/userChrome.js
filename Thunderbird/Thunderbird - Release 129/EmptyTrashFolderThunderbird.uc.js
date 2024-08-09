// EmptyTrashFolderThunderbird.uc.js   Erstellt von Thoams s.
// https://www.thunderbird-mail.de/forum/thread/82717-funktion-f%C3%BCr-script-gesucht-userbutton-f%C3%BCr-ordner-leeren-erstellen/
// geändert von EDV-Oldie für TB ab Version 91 am 24.11.2021
// aktualisiert von milupo für Thunderbird 115 am 27.05.2023

"use strict";
(function() {

    if (location != 'chrome://messenger/content/messenger.xhtml') return;

    // toolbox
    var toolbarbutton = document.createXULElement('toolbarbutton');
    var currentProfileDirectory = Services.dirsvc.get("ProfD", Ci.nsIFile).path.replace(/\\/g, "/");
        var props = {
        id: 'EmptyTrashFolder-button',
        label: 'Papierkorb leeren',
        tooltiptext: 'Papierkorb leeren',

        style: 'list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABwElEQVQ4jZWR3UsUYRTGzx/QZX9AV9F4WXZbem23SUFQQV74QbIiElsYFptgEiybmJ/J6qqlhYoEspAgW0uTMURboinJKps0ojvsDmxl/rzYmdFxZ5UOPBfn5X1+73nOK+JRPn+Ag/K6U7R8/gBpcwfdyKEbOdLmzvGQwy8epwLz/5SWWHJDfP4A29m/LK/rfF1JoS2sEv+8yKyaYCamMRGNMzz1lp7RaYJ9L2nvihQCGprbWPq+wuDIK/oj43SHX9DRG+FJ53Nagz20tHdyv62D8Ngb7j4KesS41wpAXFvAzP1mY9ukd3iKxR8povEETwfGmIy+Zyam0dTyuHChdU0PAIh9TGBksqzrBt1DE3xbTpL8uenkT6Z03n34VAiobmj2BGwZGdjdRVUEVREHZPcO4NbtO54A+zLzwPy+8WAvIiI3ahqLAkIi8PBUXpbR7kNiAa5V1RePYEPqTrrkmEVErtysPRKgKgKXTrjk2kHl9WoA5tQvpDNZ1n6leRZ+7d6BInDOknXmQK5aEwDk/sGW+YfVDWN/fMsckrxsiCtGecVlTp+9wJnSiyilZZScL2N0fNKBhCT/jSIidi8isgd86l0CBi5HXQAAAABJRU5ErkJggg==) ',

        class: 'toolbarbutton-1',
        onclick:
        'if (event.button == 0 || event.button == 1) { \
            goDoCommand("cmd_emptyTrash"); \
        };'
    };

    for (var p in props) toolbarbutton.setAttribute(p, props[p]);

    var toolbox = document.getElementById("mail-toolbox");
    toolbox.palette.appendChild(toolbarbutton);

    var toolbar = document.getElementById("tabbar-toolbar");
    toolbar.insertItem("EmptyTrashFolder-button", toolbar.lastChild);

})();
