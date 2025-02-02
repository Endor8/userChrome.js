// ==UserScript==
// @name           UserCSSLoader
// @description    CSS-Codes - Styles laden und verwalten
// @namespace      http://d.hatena.ne.jp/Griever/
// @author         Griever
// @include        main
// @license        MIT License
// @compatibility  Firefox 116*
// @charset        UTF-8
// @version        0.0.4K+
// @note           Aktualisierungen von BrokenHeart und Speravir - www.camp-firefox.de
// @note           BrokenHearts Änderung: https://www.camp-firefox.de/forum/thema/138792/?postID=1263814#post1263814
// @note           Fx92: getURLSpecFromFile() -> getURLSpecFromActualFile()
// @note           AUTHOR_SHEET-Unterstützung hinzugefügt, wichtig: Dateiendung muss .author.css sein!
// @note           Version 0.0.4.g ermöglicht "Styles importieren" per Mittelklick und Verwendung
// @note           eines anderen Dateimanagers (siehe in Konfiguration), ergänzt um einen
// @note           Parameter für den Dateimanager (vFMParameter in der Konfiguration) von aborix
// @note           Frei verschiebbare Schaltfläche eingebaut von aborix
// @note           0.0.4 Remove E4X
// @note           CSSEntry-Klasse erstellt
// @note           Style-Test-Funktion überarbeitet (später entfernt)
// @note           Wenn die Datei gelöscht wurde, CSS beim Neu-Erstellen und Löschen des Menüs abbrechen
// @note           uc einlesen .uc.css temporäre Korrespondenz zum erneuten Lesen
// ==/UserScript==
/****** Bedienungsanleitung ******
CSS-Ordner im Chrome-Ordner erstellen, CSS-Dateien dort ablegen und speichern.
Diejenigen, deren Dateiname mit "xul-" beginnen, diejenigen, die mit ".as.css" enden, sind AGENT_SHEET, 
alle anderen außer USER_SHEET werden gelesen. Da der Inhalt der Datei nicht überprüft wird,
darauf achten, die Angabe von @namespace nicht zu vergessen!
CSS-Menü wird zur Menüleiste hinzugefügt.
Linksklick auf Stil, zum Aktivieren/Deaktivieren,
Mittelklick auf Stil zum Aktivieren/Deaktivieren, ohne Menü zu schließen,
Rechtsklick auf Stil zum Öffnen im Editor,
Strg+Linksklick zum Anzeigen im Dateimanager.
Die Tastenkombinationen können im Menü eingeblendet werden (bzw. in einem Fall ausgeblendet),
dazu nach "acceltext" suchen und den Zeilenkommentar "//" entfernen bzw. einfügen.
Verwenden des in "view_source.editor.path" angegebenen Editors.
Dateiordner kann in Konfiguration geändert werden.
**** Anleitung Ende ****/
(function(){
/* Konfiguration */
// Position: als Menü anzeigen = 1, als frei verschiebbare-Schaltfläche = 0
let position = 1;
// alternativer Dateimanager, Bsp.:
// let filemanager = "C:\\Programme\\totalcmd\\TOTALCMD.EXE";
let filemanager = "";
// eventuelle Parameter für den alternativen Dateimanager, sonst filemanagerParam = "";
//let filemanagerParam = "/O /T";//Totalcommander
let filemanagerParam = "";
// Unterordner für die CSS-Dateien:
let cssFolder = "CSS";
// zusätzlich Chrome-Ordner im Untermenü anzeigen: 1 = ja, 0 = nein
let showChrome = 1;
/* Ende Konfiguration */
ChromeUtils.importESModule("resource://gre/modules/AppConstants.sys.mjs");
let { classes: Cc, interfaces: Ci, utils: Cu, results: Cr } = Components;
// Wenn beim Start ein anderes Fenster angezeigt wird (das zweite Fenster), wird es beendet
let list = Services.wm.getEnumerator("navigator:browser");
while(list.hasMoreElements()){ if(list.getNext() != window) return; }
if (window.UCL) {
    window.UCL.destroy();
    delete window.UCL;
}
window.UCL = {
    vFileManager: filemanager,
    vFMParameter: filemanagerParam,
    USE_UC: "UC" in window,
    AGENT_SHEET: Ci.nsIStyleSheetService.AGENT_SHEET,
    USER_SHEET : Ci.nsIStyleSheetService.USER_SHEET,
    AUTHOR_SHEET: Ci.nsIStyleSheetService.AUTHOR_SHEET,
    readCSS : {},
    get disabled_list() {
        let obj = [];
        try {
                obj = this.prefs.getCharPref("disabled_list").split("|");
        } catch(e) {}
        delete this.disabled_list;
        return this.disabled_list = obj;
    },
    get prefs() {
            delete this.prefs;
            return this.prefs = Services.prefs.getBranch("UserCSSLoader.")
    },
    get styleSheetServices(){
            delete this.styleSheetServices;
            return this.styleSheetServices = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService);
    },
    get FOLDER() {
        let aFolder;
        try {
            // UserCSSLoader.FOLDER verwenden
            let folderPath = this.prefs.getCharPref("FOLDER");
            aFolder = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsIFile);
            aFolder.initWithPath(folderPath);
        } catch (e) {
            aFolder = Services.dirsvc.get("UChrm", Ci.nsIFile);
            aFolder.appendRelativePath(cssFolder);
        }
        if (!aFolder.exists() || !aFolder.isDirectory()) {
            aFolder.create(Ci.nsIFile.DIRECTORY_TYPE, 0664);
        }
        delete this.FOLDER;
        return this.FOLDER = aFolder;
    },
    get CHRMFOLDER() {
        let bFolder;
        try {
            // UserCSSLoader.CHRMFOLDER verwenden
            let CHRMfolderPath = this.prefs.getCharPref("CHRMFOLDER");
            bFolder = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsIFile);
            bFolder.initWithPath(CHRMfolderPath);
        } catch (e) {
            bFolder = Services.dirsvc.get("UChrm", Ci.nsIFile);
        }
        if (!bFolder.exists() || !bFolder.isDirectory()) {
            bFolder.create(Ci.nsIFile.DIRECTORY_TYPE, 0664);
        }
        delete this.CHRMFOLDER;
        return this.CHRMFOLDER = bFolder;
    },
    getFocusedWindow: function() {
        let win = document.commandDispatcher.focusedWindow;
        if (!win || win == window) win = content;
        return win;
    },
    init: function() {
        const cssmenu = $C("menu", {
            id: "usercssloader-menu",
            label: "CSS",
            tooltiptext: "UserCSSLoader\n\nLinksklick: Stylesheets anzeigen\nMittelklick: Styles importieren",
            accesskey: "S",
            //acceltext: "Alt + S",
            onclick: "if (event.button == 1) UCL.rebuild()"
        });
        const menupopup = $C("menupopup", {
            id: "usercssloader-menupopup"
        });
        cssmenu.appendChild(menupopup);
        let menu = $C("menu", {
            label: "Style-Loader-Menü",
            id: "style-loader-menu",
            accesskey: "M",
            //acceltext: "Alt + M"
        });
        menupopup.appendChild(menu);
        menupopup.appendChild($C("menuseparator"));
        let mp = $C("menupopup", { id: "usercssloader-submenupopup" });
        menu.appendChild(mp);
        mp.appendChild($C("menuitem", {
            label: "Styles importieren",
            accesskey: "I",
            //acceltext: "Alt + I",
            oncommand: "UCL.rebuild();"
        }));
        mp.appendChild($C("menuseparator"));
        mp.appendChild($C("menuitem", {
            label: "CSS-Datei erstellen",
            accesskey: "E",
            //acceltext: "Alt + E",
            oncommand: "UCL.create();"
        }));
        mp.appendChild($C("menuitem", {
            label: "CSS-Ordner öffnen",
            accesskey: "O",
            //acceltext: "Alt + O",
            oncommand: "UCL.openFolder();"
        }));
        if (showChrome === 1) {
            mp.appendChild($C("menuitem", {
                label: "Chrome-Ordner öffnen",
                accesskey: "X",
                acceltext: "Alt + X",
                oncommand: "UCL.openCHRMFolder();"
            }));
        }
        mp.appendChild($C('menuseparator'));
        mp.appendChild($C("menuitem", {
            label: "userChrome.css bearbeiten",
            hidden: false,
            oncommand: "UCL.editUserCSS('userChrome.css');"
        }));
        mp.appendChild($C("menuitem", {
            label: "userContent.css bearbeiten",
            hidden: false,
            oncommand: "UCL.editUserCSS('userContent.css');"
        }));
        menu = $C("menu", {
            label: ".uc.css",
            accesskey: "U",
            //acceltext: "Alt + U",
            hidden: !UCL.USE_UC
        });
        menupopup.appendChild(menu);
        mp = $C("menupopup", { id: "usercssloader-ucmenupopup" });
        menu.appendChild(mp);
        mp.appendChild($C("menuitem", {
            label: "Importieren(.uc.js)",
            oncommand: "UCL.UCrebuild();"
        }));
        mp.appendChild($C("menuseparator", { id: "usercssloader-ucseparator" }));
        CustomizableUI.createWidget({
            id: 'usercssloader-menu-item',
            type: 'custom',
            defaultArea: CustomizableUI.AREA_NAVBAR,
            onBuild: function(aDocument) {
                let toolbaritem = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbaritem');
                toolbaritem.id = 'usercssloader-menu-item';
                toolbaritem.className = 'chromeclass-toolbar-additional';
                return toolbaritem;
            }
        });
        $('usercssloader-menu-item').appendChild(cssmenu);
        if (position === 1) {
            let refNode = $('helpMenu');
            refNode.parentNode.insertBefore(cssmenu, refNode.nextSibling);
        }
        
        $("mainKeyset").appendChild($C("key", {
            id: "usercssloader-rebuild-key",
            oncommand: "UCL.rebuild();",
            key: "R",
            modifiers: "alt",
        }));
        
        this.rebuild();
        this.initialized = true;
        if (UCL.USE_UC) {
            setTimeout(function() {
                UCL.UCcreateMenuitem();
            }, 1000);
        }
        window.addEventListener("unload", this, false);
    },
    uninit: function() {
        const dis = [];
        for (let x of Object.keys(this.readCSS)) {
            if (!this.readCSS[x].enabled)
                dis.push(x);
        }
        this.prefs.setCharPref("disabled_list", dis.join("|"));
        window.removeEventListener("unload", this, false);
    },
    destroy: function() {
        var i = document.getElementById("usercssloader-menu");
        if (i) i.parentNode.removeChild(i);
        var i = document.getElementById("usercssloader-rebuild-key");
        if (i) i.parentNode.removeChild(i);
        this.uninit();
    },
    handleEvent: function(event) {
        switch(event.type){
            case "unload": this.uninit(); break;
        }
    },
    rebuild: function() {
        let ext = /\.css$/i;
        let not = /\.uc\.css/i;
        let files = this.FOLDER.directoryEntries.QueryInterface(Ci.nsISimpleEnumerator);
        while (files.hasMoreElements()) {
            let file = files.getNext().QueryInterface(Ci.nsIFile);
            if (!ext.test(file.leafName) || not.test(file.leafName)) continue;
            let CSS = this.loadCSS(file);
            CSS.flag = true;
        }
        for (let leafName of Object.keys(this.readCSS)) {
            const CSS = this.readCSS[leafName];
            if (!CSS.flag) {
                CSS.enabled = false;
                delete this.readCSS[leafName];
            }
            delete CSS.flag;
            this.rebuildMenu(leafName);
        }
        if (this.initialized) {
            if (typeof(StatusPanel) !== "undefined")
                StatusPanel._label = "Styles importiert";
            else
                XULBrowserWindow.statusTextField.label = "Styles importieren";
        }
    },
    loadCSS: function(aFile) {
        let CSS = this.readCSS[aFile.leafName];
        if (!CSS) {
            CSS = this.readCSS[aFile.leafName] = new CSSEntry(aFile);
            if (this.disabled_list.indexOf(CSS.leafName) === -1) {
                CSS.enabled = true;
            }
        } else if (CSS.enabled) {
            CSS.enabled = true;
        }
        return CSS;
    },
    rebuildMenu: function(aLeafName) {
        let CSS = this.readCSS[aLeafName];
        let menuitem = document.getElementById("usercssloader-" + aLeafName);
        if (!CSS) {
            if (menuitem)
                menuitem.parentNode.removeChild(menuitem);
            return;
        }
        if (!menuitem) {
            menuitem = $C("menuitem", {
                label : aLeafName,
                id : "usercssloader-" + aLeafName,
                class : "usercssloader-item " + (CSS.SHEET == this.AGENT_SHEET? "AGENT_SHEET" : CSS.SHEET == this.AUTHOR_SHEET? "AUTHOR_SHEET": "USER_SHEET"),
                type : "checkbox",
                autocheck : "false",
                oncommand : "UCL.toggle('"+ aLeafName +"');",
                onclick : "UCL.itemClick(event);",
                onmouseup : "if (event.button == 1) event.preventDefault();",
                tooltiptext : "Linksklick: an/aus, Menü schließt\nMittelklick: an/aus, Menü bleibt offen\nRechtsklick: bearbeiten\nStrg+Linksklick: im Dateimanager anzeigen"
                });
            document.getElementById("usercssloader-menupopup").appendChild(menuitem);
        }
        menuitem.setAttribute("checked", CSS.enabled);
    },
    toggle: function(aLeafName) {
        let CSS = this.readCSS[aLeafName];
        if (!CSS || event.ctrlKey) return;
        CSS.enabled = !CSS.enabled;
        this.rebuildMenu(aLeafName);
    },
    itemClick: function(event) {
        let label = event.currentTarget.getAttribute("label");
        if (event.button === 0) {
            if (event.ctrlKey) {
                event.preventDefault();
                event.stopPropagation();
                UCL.openFolder(label);
            } else {return;}
        }
                event.preventDefault();
                event.stopPropagation();
        if (event.button === 1) {
            this.toggle(label);
        }
        else if (event.button === 2) {
            closeMenus(event.target);
            this.edit(this.getFileFromLeafName(label));
        }
    },
    getFileFromLeafName: function(aLeafName) {
        let f = this.FOLDER.clone();
        f.QueryInterface(Ci.nsIFile); // use appendRelativePath
        f.appendRelativePath(aLeafName);
        return f;
    },
    openFolder:function(label){
        const PathSep = AppConstants.platform === "win" ? "\\" : "/";
        let target= this.FOLDER.path + PathSep + label;
        if (this.vFileManager.length !== 0) {
            let file = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsIFile);
            let process = Cc['@mozilla.org/process/util;1'].createInstance(Ci.nsIProcess);
            let args = [this.vFMParameter,target];
            file.initWithPath(this.vFileManager);
            process.init(file);
            // Verzeichnis mit anderem Dateimanager öffnen
            process.run(false, args, args.length);
        } else {
            // Verzeichnis mit Dateimanager des Systems öffnen
            this.FOLDER.launch();
        }
    },
    openCHRMFolder:function(){
        if (this.vFileManager.length !== 0) {
            let file = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsIFile);
            let process = Cc['@mozilla.org/process/util;1'].createInstance(Ci.nsIProcess);
            let args = [this.vFMParameter,this.CHRMFOLDER.path];
            file.initWithPath(this.vFileManager);
            process.init(file);
            // Verzeichnis mit anderem Dateimanager öffnen
            process.run(false, args, args.length);
        } else {
            // Verzeichnis mit Dateimanager des Systems öffnen
            this.CHRMFOLDER.launch();
        }
    },
    editUserCSS: function(aLeafName) {
        let file = Services.dirsvc.get("UChrm", Ci.nsIFile);
        file.appendRelativePath(aLeafName);
        this.edit(file);
    },
    edit: function(aFile) {
        let editor = Services.prefs.getCharPref("view_source.editor.path");
        if (!editor) return alert("Unter about:config den vorhandenen Schalter:\n view_source.editor.path mit dem Editorpfad ergänzen");
        try {
            let UI = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
            UI.charset = window.navigator.platform.toLowerCase().indexOf("win") >= 0? "Shift_JIS": "UTF-8";
            let path = UI.ConvertFromUnicode(aFile.path);
            let app = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsIFile);
            app.initWithPath(editor);
            let process = Components.classes["@mozilla.org/process/util;1"].createInstance(Components.interfaces.nsIProcess);
            process.init(app);
            process.run(false, [path], 1);
        } catch (e) {}
    },
    create: function(aLeafName) {
        if (!aLeafName) aLeafName = prompt("Name des Styles", dateFormat(new Date(), "%Y_%m%d_%H%M%S"));
        if (aLeafName) aLeafName = aLeafName.replace(/\s+/g, " ").replace(/[\\/:*?\"<>|]/g, "");
        if (!aLeafName || !/\S/.test(aLeafName)) return;
        if (!/\.css$/.test(aLeafName)) aLeafName += ".css";
        let file = this.getFileFromLeafName(aLeafName);
        this.edit(file);
    },
    UCrebuild: function() {
        let re = /^file:.*\.uc\.css(?:\?\d+)?$/i;
        let query = "?" + new Date().getTime();
        Array.slice(document.styleSheets).forEach(function(css){
            if (!re.test(css.href)) return;
            if (css.ownerNode) {
                css.ownerNode.parentNode.removeChild(css.ownerNode);
            }
            let pi = document.createProcessingInstruction('xml-stylesheet','type="text/css" href="'+ css.href.replace(/\?.*/, '') + query +'"');
            document.insertBefore(pi, document.documentElement);
        });
        UCL.UCcreateMenuitem();
    },
    UCcreateMenuitem: function() {
        let sep = $("usercssloader-ucseparator");
        let popup = sep.parentNode;
        if (sep.nextSibling) {
            let range = document.createRange();
            range.setStartAfter(sep);
            range.setEndAfter(popup.lastChild);
            range.deleteContents();
            range.detach();
        }
        let re = /^file:.*\.uc\.css(?:\?\d+)?$/i;
        Array.slice(document.styleSheets).forEach(function(css) {
            if (!re.test(css.href)) return;
            let fileURL = decodeURIComponent(css.href).split("?")[0];
            let aLeafName = fileURL.split("/").pop();
            let m = $C("menuitem", {
                label : aLeafName,
                tooltiptext : fileURL,
                id : "usercssloader-" + aLeafName,
                type : "checkbox",
                autocheck : "false",
                checked : "true",
                oncommand : "if (!event.ctrlKey) {this.setAttribute('checked', !(this.css.disabled = !this.css.disabled));}",
                onmouseup : "if(event.button === 1) event.preventDefault();",
                onclick : "UCL.UCItemClick(event);"
            });
            m.css = css;
            popup.appendChild(m);
        });
    },
    UCItemClick: function(event) {
        if (event.button === 0) return;
        event.preventDefault();
        event.stopPropagation();
        if (event.button === 1) {
            event.target.doCommand();
        }
        else if (event.button === 2) {
            closeMenus(event.target);
            let fileURL = event.currentTarget.getAttribute("tooltiptext");
            let file = Services.io.getProtocolHandler("file").QueryInterface(Components.interfaces.nsIFileProtocolHandler).getURLSpecFromActualFile(fileURL);
            this.edit(file);
        }
    },
};
function CSSEntry(aFile) {
    this.path = aFile.path;
    this.leafName = aFile.leafName;
    this.lastModifiedTime = 1;
    this.SHEET = /^xul-|\.as\.css$/i.test(this.leafName) ? 
        Ci.nsIStyleSheetService.AGENT_SHEET:
        /\.author\.css$/i.test(this.leafName)?
        Ci.nsIStyleSheetService.AUTHOR_SHEET:
        Ci.nsIStyleSheetService.USER_SHEET;
}
CSSEntry.prototype = {
    sss: Components.classes["@mozilla.org/content/style-sheet-service;1"]
            .getService(Components.interfaces.nsIStyleSheetService),
    _enabled: false,
    get enabled() {
        return this._enabled;
    },
    set enabled(isEnable) {
        let aFile = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsIFile)
        aFile.initWithPath(this.path);
        let isExists = aFile.exists(); // true, wenn die Datei existiert
        let lastModifiedTime = isExists ? aFile.lastModifiedTime : 0;
        let isForced = this.lastModifiedTime != lastModifiedTime; // true, wenn es eine Änderung in der Datei gibt
        let fileURL = Services.io.getProtocolHandler("file").QueryInterface(Components.interfaces.nsIFileProtocolHandler).getURLSpecFromActualFile(aFile);
        let uri = Services.io.newURI(fileURL, null, null);
        if (this.sss.sheetRegistered(uri, this.SHEET)) {
            // Wenn diese Datei bereits gelesen wurde
            if (!isEnable || !isExists) {
                this.sss.unregisterSheet(uri, this.SHEET);
            }
            else if (isForced) {
                // Nach Stornierung erneut einlesen
                this.sss.unregisterSheet(uri, this.SHEET);
                this.sss.loadAndRegisterSheet(uri, this.SHEET);
            }
        } else {
            // Datei wurde nicht gelesen
            if (isEnable && isExists) {
                this.sss.loadAndRegisterSheet(uri, this.SHEET);
            }
        }
        if (this.lastModifiedTime !== 1 && isEnable && isForced) {
            log(this.leafName + " wurde aktualisiert");
        }
        this.lastModifiedTime = lastModifiedTime;
        return this._enabled = isEnable;
    },
};
UCL.init();
function $(id) { return document.getElementById(id); }
function $A(arr) { return Array.slice(arr); }
function $C(name, attr) {
    let el = document.createXULElement(name);
    if (attr) Object.keys(attr).forEach(function(n) {
        if(n === "oncommand") {
            el.addEventListener('command', function(event) { Function(attr[n])(); });
        }
        else if(n === "onclick") {
            el.addEventListener('click', function(event) { Function(attr[n])(); });
        }
        else if(n === "onmouseup") {
            el.addEventListener('mouseup', function(event) { Function(attr[n])(); });
        }
        else {
            el.setAttribute(n, attr[n]); 
        }
    });
    return el;
}
function dateFormat(date, format) {
    format = format.replace("%Y", ("000" + date.getFullYear()).substr(-4));
    format = format.replace("%m", ("0" + (date.getMonth()+1)).substr(-2));
    format = format.replace("%d", ("0" + date.getDay()).substr(-2));
    format = format.replace("%H", ("0" + date.getHours()).substr(-2));
    format = format.replace("%M", ("0" + date.getMinutes()).substr(-2));
    format = format.replace("%S", ("0" + date.getSeconds()).substr(-2));
    return format;
}
function log() { Application.console.log(Array.slice(arguments)); }
})();
