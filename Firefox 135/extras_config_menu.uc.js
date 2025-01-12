/*
// ==UserScript==
// @name           extras_config_menu.uc.js
// @compatibility  Firefox 135*.*
// @include        main
// @version        1.0.20250112
// @edit           @aborix 7/21 CSS Dateien als Untermenü eingefügt 
// @edit           @2002Andreas 8/21 Shadow CSS Dateien als Untermenü + Ordner eingefügt
// @edit 	   @BrokenHeart	1/25 Anpass. wg. Änderung der Sicherheitsrichtlinien bei 'inlineEvents'
// ==/UserScript==
*/
var uProfMenu = {
  // Beginn der Konfiguration
  // In der folgenden Zeile (11) den Pfad zum Texteditor eintragen (unter Ubuntu 10.04 z.B.: '/usr/bin/gedit'). Bei Fehleintrag wird view_source.editor.path ausgelesen:
  //TextOpenExe: 'C:\\Program Files (x86)\\Notepad++\\notepad++.exe',
  TextOpenExe: 'C:\\Program Files\\Notepad++\\notepad++.exe',
  // Falls gewuenscht, in Zeile 15 einen Dateimanager eintragen (komplett leer lassen fuer Dateimanager des Systems) Beispiele:
  // vFileManager: 'E:\\Total Commander\\Totalcmd.exe',
  // vFileManager: 'C:\\Program Files (x86)\\FreeCommander\\FreeCommander.exe'
  vFileManager: '',
  // In der folgenden Zeile (19) 'menu' eintragen, damit es unter "Extras" als Menue erscheint, sonst die id des gewuenschten
  // Elements *nach* dem der Button erscheinen soll (z.B. 'urlbar', 'searchbar', 'undoclosetab-button','abp-toolbarbutton')
  // Bitte nicht so etwas wie die Menue- oder Navigationsleiste (sondern einen Menuepunkt oder einen Button mit id auf diesen Leisten) eintragen:
  warpmenuto: 'helpMenu',
  // Unter Linux sollte/kann versucht werden, die userChromeJS-Skripte zu sortieren, unter Windows ist das evtl. nicht noetig (die Sortierung wird Gross- und Kleinschreibung *nicht* beruecksichtigen - dazu wird die sort()-Funktion entsprechend mit einer Vergleichsfunktion aufgerufen)
  sortScripts: 0,   // 1 zum Erzwingen der Sortierung
  // Einbindung GM-Skripte-Ordner (0: nein, 1: Greasemonkey [Profil-Verzeichnis], 2: UserScriptLoader [Chrome-Verzeichnis], 3: Scriptish [Profil-Verzeichnis]):
  gmOrdner: 0,
  // Einbindung CSS-Ordner (0: nein, 1: UserCSSLoader-Ordner im Chrome-Verzeichnis):
  cssOrdner: 1,
  // In Zeile 30 gueltige about:Adressen eintragen, die ebenfalls aufgerufen werden sollen.
  // - Zum Ausblenden: abouts: [],
  // - Damit die about:-Seiten nicht als Untermenue, sondern direkt als Menuepunkte aufgefuehrt werden, muss das erste Element '0' sein:
  // abouts: ['0','about:about','about:addons','about:cache','about:config','about:support'],
  abouts: ['about:about','about:addons','about:cache','about:config','about:crashes','about:downloads','about:home','about:logins','about:memory','about:support','about:preferences','about:performance','about:profiles'],
  // Die normalen Firefox-Einstellungen auch zur Verfuegung stellen (0: nein, 1: ja):
  showNormalPrefs: 1,
  // Stellt "Skriptliste in Zwischenablage" zur Verfuegung (1: ja, 2: mit getrennter Nummerierung, 3: mit gemeinsamer Nummerierung) oder nicht (0):
  enableScriptsToClip: 2,
  // Um den Eintrag "Neustart" zu erzwingen (falls z.B. das andere Skript zu spaet eingebunden und nicht erkannt wird), auf 1 setzen:
  enableRestart: 0,
  // Ende der Konfiguration

  init: function() {
    if (this.warpmenuto.toLowerCase() == 'menu') {
      // aufgrund des gewaehlten warpmenuto als Untermenue von Extras anlegen
      var zielmenu = document.getElementById('menu_ToolsPopup');
      if (zielmenu==null) {
        userChrome.log("extras_config_menu.uc.js findet Zielmenue nicht, evtl. weil ein anderes Fenster als das Hauptfenster " +
                       "geoeffnet wurde. Falls dieser Fehler auch im Hauptfenster auftritt, bitte die vorgehende Definition " +
                       "von 'zielmenu' kontrollieren.");
       return
      }
      var menu = zielmenu.appendChild(this.createME("menu","Config Men\u00FC",0,0,"ExtraConfigMenu"));
      menu.setAttribute("class","menu-iconic");
      menu.setAttribute("ondblclick","openTrustedLinkIn('about:config', 'tab');");
     } else {
		 
	 // als verschiebbaren Button anlegen
      if (window.__SSi == "window0") {
        CustomizableUI.createWidget({
          id: "ExtraConfigMenu-button",
          defaultArea: CustomizableUI.AREA_NAVBAR,
          label: "Extra Config Menü",
          tooltiptext: "Extra Config Menü\nRechtsklick \öffnet about:config"
        });
		
      }
      var menu = document.getElementById("ExtraConfigMenu-button");
      menu.setAttribute("type", "menu");
	  menu.addEventListener('click', function(event) {
			if (event.button == 2 && !this.open) { 
				openTrustedLinkIn("about:config", "tab");
				event.preventDefault();
			};
	 },true);
	  
    }
	
    //ab hier ist alles gleich, egal ob Button oder Menue
    var css = " \
      #ExtraConfigMenu, #ExtraConfigMenu-button { \
        list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACnElEQVR4Xm2RzYtbZRSHn/fr3pvJzTB3qiNM2k2pMBUGhEHaqsUqdeFGQalCobgREaFu/B/cqCtxVSjoQhBEQRBmIfWDKgNGJUPt0Nhah9JJ4iSd5E6+bu5972tAO4SS5/DjXZ1znsMrNiq1eikMQqYYJCmjxNH5+zdW777L0J5KKl9VPmnf+ut9KWkwhbheuzNcOVYOmGKc5iRO0r1ykeXCx0h7kt4fC3z5wfqbQnAJwQHa5S7jAZSRuJ0mkf81cheobhBXZa+ri1uptQjHAZoZCEC1PiPgDuwxCfwerBU7b73zXn//3usCcdt4HkZ7SGZg431U51NUCgwlO3cV/bVXhR/6p9ut+nP9QYeNn7/n8qUPZxvQ/Q6VVWHk4ZqWRvlJjpx9hcGfW2wO95N2q8m3618A2WwDt/0RplSAXsBed57eyossHl5GYdHacG3zGpADM06wjQ1UUIN+CLHPvfAxojPnKLiE+bDE1R9+5GatAmgPeGCAteQ7l5GBhGSyuROyd/gFouUyWkqEErR2mwXAAA8BRS0AgMQBjSra30ZkEeDzz9Dn4ZcvMO51SMcJcTdGChmA0ABA6cAgzyG3I8jLEBylV4fWoaeIc0V7t0Uv7pFbC+CA+28mp/8+SwXKnMVmz1O9HpE+eobMZdjcoY1GIHD/NwIdoH1fBaNguzlg88pVyoUi4vTbFI8eJxsNAIfSkrliESllH/L0v0jktNNomFGv1TFrL3Fo9QSMR3jaEEXzLC09gjaKp595No0WjyCEB4zRclICUMDxtRMce/wJ1MIi2SglXShhfI/cOjxPoZRmbq4gXzt/gVrtBrdvbiG+Wf+p/mvll1BpiVAGhCDPxuAUDotz4HKHlIJON6bRbL4hhPjcMx5mkn8BBLEUrsVZbq0AAAAASUVORK5CYII=);  \
		 margin-top: 0px !important; \);  \
		 margin-top: 0px !important; \
		 opacity: 1 !important;\
      } \
      #ExtraConfigMenu-button > dropmarker, #ExtraConfigMenu-button > hbox > .toolbarbutton-menu-dropmarker { \
        display: none !important; \
      }";
    var sss = Cc['@mozilla.org/content/style-sheet-service;1'].getService(Ci.nsIStyleSheetService);
    var uri = makeURI('data:text/css;charset=UTF=8,' + encodeURIComponent(css));
    sss.loadAndRegisterSheet(uri,sss.AGENT_SHEET);
	menu.addEventListener('popupshowing', function(event) {
			uProfMenu.getScripts(0);
			uProfMenu.getCss(3);
			uProfMenu.getCss(4);
			uProfMenu.getCss(5);
	 },true);
	
    var menupopup = menu.appendChild(this.createME("menupopup",0,0,0,"ExtraConfigMenu-popup"));
    // Anlegen von Untermenues fuer userChromeJS-Skripte und CSS-Dateien (befuellen spaeter)
    var submenu = menupopup.appendChild(this.createME("menu","Meine Scripte",0,0,"submenu-ucjs"));
    var submenupopup = submenu.appendChild(this.createME("menupopup",0,0,0,"submenu-ucjs-items"));
    // var submenu = menupopup.appendChild(this.createME("menu","uc.xul",0,0,"submenu-ucxul"));
    // var submenupopup = submenu.appendChild(this.createME("menupopup",0,0,0,"submenu-ucxul-items"));
    var submenu = menupopup.appendChild(this.createME("menu","css",0,0,"submenu-css"));
    var submenupopup = submenu.appendChild(this.createME("menupopup",0,0,0,"submenu-css-items"));
	var submenu = menupopup.appendChild(this.createME("menu","CSSShadow",0,0,"submenu-CSSShadow"));
    var submenupopup = submenu.appendChild(this.createME("menupopup",0,0,0,"submenu-CSSShadow-items"));
    var submenu = menupopup.appendChild(this.createME("menu","cssweb",0,0,"submenu-cssweb"));
    var submenupopup = submenu.appendChild(this.createME("menupopup",0,0,0,"submenu-cssweb-items"));
    if (this.enableScriptsToClip) menupopup.appendChild(this.createME("menuitem","Skriptliste in Zwischenablage","uProfMenu.getScripts(1)","uProfMenu_clipboard",0));
    // Ende Anlegen von Untermenues
    menupopup.appendChild(document.createXULElement('menuseparator'));
    // Einbindung von Konfigdateien
    menupopup.appendChild(this.createME("menuitem","Bild Url","uProfMenu.edit(0,'Bild Url.css');","uProfMenu_edit",0));
    menupopup.appendChild(this.createME("menuitem","config Einträge.css","uProfMenu.edit(0,'config Einträge.css');","uProfMenu_edit",0));
    menupopup.appendChild(this.createME("menuitem","userChrome.css","uProfMenu.edit(0,'userChrome.css');","uProfMenu_edit",0));
    menupopup.appendChild(this.createME("menuitem","userChromeShadow.css","uProfMenu.edit(0,'userChromeShadow.css');","uProfMenu_edit",0));
    menupopup.appendChild(this.createME("menuitem","userContent.css","uProfMenu.edit(0,'userContent.css');","uProfMenu_edit",0));
    menupopup.appendChild(this.createME("menuitem","userChrome.js","uProfMenu.edit(0,'userChrome.js');","uProfMenu_edit",0));
    menupopup.appendChild(this.createME("menuitem","prefs.js","uProfMenu.edit(1,'prefs.js');","uProfMenu_edit",0));
    menupopup.appendChild(this.createME("menuitem","user.js","uProfMenu.edit(1,'user.js');","uProfMenu_edit"),0);

    // Ende Einbindung von Konfigdateien
    menupopup.appendChild(document.createXULElement('menuseparator'));
    // Einbindung von Ordnern
    switch (this.gmOrdner) {
      case 1:
        menupopup.appendChild(this.createME("menuitem","GM-skripty","uProfMenu.dirOpen(uProfMenu.getPrefDirectoryPath('ProfD')+uProfMenu.getDirSep()+'gm_scripts');","uProfMenu_folder"),0);
        break;
      case 2:
        menupopup.appendChild(this.createME("menuitem","USL-skripty","uProfMenu.dirOpen(uProfMenu.getPrefDirectoryPath('UChrm')+uProfMenu.getDirSep()+'UserScriptLoader');","uProfMenu_folder"),0);
        break;
      case 3:
        menupopup.appendChild(this.createME("menuitem","Skripty Scriptish","uProfMenu.dirOpen(uProfMenu.getPrefDirectoryPath('ProfD')+uProfMenu.getDirSep()+'scriptish_scripts');","uProfMenu_folder"),0);
        break;
    }

    menupopup.appendChild(this.createME("menuitem","CSS-Ordner ","uProfMenu.dirOpen(uProfMenu.getPrefDirectoryPath('UChrm')+uProfMenu.getDirSep()+'css');","uProfMenu_folder"),0);
    menupopup.appendChild(this.createME("menuitem","CSSShadow-Ordner","uProfMenu.dirOpen(uProfMenu.getPrefDirectoryPath('UChrm')+uProfMenu.getDirSep()+'CSSShadow');","uProfMenu_folder"),0);
    menupopup.appendChild(this.createME("menuitem","CSSWeb-Ordner","uProfMenu.dirOpen(uProfMenu.getPrefDirectoryPath('UChrm')+uProfMenu.getDirSep()+'CSSWeb');","uProfMenu_folder"),0);
    menupopup.appendChild(this.createME("menuitem","Chromeordner","uProfMenu.prefDirOpen('UChrm');","uProfMenu_folder"),0);
    menupopup.appendChild(this.createME("menuitem","Profilordner","uProfMenu.prefDirOpen('ProfD');","uProfMenu_folder"),0);
    menupopup.appendChild(this.createME("menuitem","Icons-Ordner","uProfMenu.dirOpen(uProfMenu.getPrefDirectoryPath('UChrm')+uProfMenu.getDirSep()+'Icons');","uProfMenu_folder"),0);
    menupopup.appendChild(this.createME("menuitem","Installationsordner","uProfMenu.prefDirOpen('CurProcD');","uProfMenu_folder"),0);
    menupopup.appendChild(this.createME("menuitem","Addonordner","uProfMenu.dirOpen(uProfMenu.getPrefDirectoryPath('ProfD')+uProfMenu.getDirSep()+'extensions');","uProfMenu_folder"),0);
    menupopup.appendChild(this.createME("menuitem","Startup-Cacheordner","uProfMenu.dirOpen(uProfMenu.getPrefDirectoryPath('ProfLD')+uProfMenu.getDirSep()+'startupCache');","uProfMenu_folder"),0);
  /*   menupopup.appendChild(this.createME("menuitem","Ordner about","uProfMenu.dirOpen(uProfMenu.getPrefDirectoryPath('UChrm')+uProfMenu.getDirSep()+'about');","uProfMenu_folder"),0); */
    // Ende Einbindung von Ordnern
    // Einbindung von abouts
    if (this.abouts.length>0) {
      menupopup.appendChild(document.createXULElement('menuseparator'));
      // falls der erste Eintrag des Arrays = '0' ist, dann kein Untermenue anlegen, sondern direkt als Menuepunkte einbinden
      if (this.abouts[0]=='0') {
        for (var i = 1; i < this.abouts.length; i++) {
        menupopup.appendChild(this.createME("menuitem",this.abouts[i],"openTrustedLinkIn('"+this.abouts[i]+"','tab')","uProfMenu_about"),0);
        }
       } else {
        // der erste Eintrag des arrays ist ungleich '0', deshalb als Untermenue einrichten
        var submenu = menupopup.appendChild(this.createME("menu","uc.js",0,0,"submenu-about"));
        var submenupopup = submenu.appendChild(this.createME("menupopup",0,0,0,"submenu-about-items"));
        this.fillMenu("submenu-about","submenu-about-items", "about:",this.abouts,"uProfMenu_about",1);
      }
    }
    // Ende Einbindung von abouts
    // Separator, falls dieser nicht schon durch abouts generiert wurde und weitere Menuepunkte folgen werden
    if (this.abouts.length==0 && (this.showNormalPrefs || typeof(ToolRstartMod) != "undefined")) menupopup.appendChild(document.createXULElement('menuseparator'));
    // Falls gewuenscht (s. Konfigurationsabschnitt), Zugriff auf die normalen Einstellungen
    if (this.showNormalPrefs) menupopup.appendChild(this.createME("menuitem","Einstellungen","try{openOptionsDialog();}catch(e){openPreferences();}","uProfMenu_prefs"),0);
    // Falls addRestartButton installiert ist, Neustart zur Verfuegung stellen (addRestartButton 1.0.20120105mod erforderlich)
    if(typeof(ToolRstartMod) != "undefined" || this.enableRestart) menupopup.appendChild(this.createME("menuitem","Neustart",
    "try{ToolRstartMod.restartApp(false);} catch(e){alert(e);}","uProfMenu_restart"),0);
  },

  getDirSep:function() {
    // Betriebssystem nach https://developer.mozilla.org/en/Code_snippets/Miscellaneous ermitteln
    var osString = Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULRuntime).OS;
    var dirsep = "/";
    switch(osString) {
      case "WINNT":
        dirsep = "\\";
        break;
      case "Linux":
        dirsep = "/";
        break;
      case "Darwin":
        dirsep = "/";
        break;
    }
    return dirsep;
  },

  edit:function(OpenMode,Filename){
    var Path = "";
    var dSep = this.getDirSep();  // die Trennzeichen zwischen Ordnern abhaengig vom Betriebssystem machen
    switch (OpenMode){
      //Current is Chrome Directory
      case 0:
        var Path = this.getPrefDirectoryPath("UChrm") + dSep + Filename;
        break;
      //Current is Profile Directory
      case 1:
        var Path = this.getPrefDirectoryPath("ProfD") + dSep + Filename;
        break;
      //Current is Root
      case 2:
        var Path = Filename;
        break;
      //Current is CSS folder
      case 3:
        var Path = this.getPrefDirectoryPath("UChrm") + dSep + "CSS" + dSep + Filename;
        break;
      //Current is CSSWeb folder
      case 4:
        var Path = this.getPrefDirectoryPath("UChrm") + dSep + "CSSWeb" + dSep + Filename;
        break;
		//Current is CSSShadow folder
      case 5:
        var Path = this.getPrefDirectoryPath("UChrm") + dSep + "CSSShadow" + dSep + Filename;
        break;
    }
    this.launch(this.TextOpenExe,Path);
  },

  dirOpen:function(Path){
    if (this.vFileManager.length != 0) {
      var file = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsIFile);
      var process = Cc['@mozilla.org/process/util;1'].createInstance(Ci.nsIProcess);
      var args = [Path];
      file.initWithPath(this.vFileManager);
      process.init(file);
      // Verzeichnis mit anderem Dateimanager oeffnen
      process.run(false, args, args.length);
     } else {
      // Verzeichnis mit Dateimanager des Systems oeffnen
      var dir = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsIFile);
      dir.initWithPath(Path);
      dir.launch();
    }
  },

  prefDirOpen:function(prefDir){
    Path = this.getPrefDirectoryPath(prefDir);
    this.dirOpen(Path);
  },

  getPrefDirectoryPath:function(str){
    // get profile directory
    var file = Components.classes["@mozilla.org/file/directory_service;1"]
      .getService(Components.interfaces.nsIProperties)
      .get(str, Components.interfaces.nsIFile);
    if (str == 'CurProcD') {
      file = file.parent;
    };
    return file.path;
  },

  launch:function(RanPath,OpenPath){
    var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsIFile);
    var proc = Components.classes["@mozilla.org/process/util;1"].createInstance(Components.interfaces.nsIProcess);
    var args = [OpenPath];
    file.initWithPath(RanPath);
    // falls der im Konfigurationsabschnitt definierte Editor nicht gefunden wird, auf Einstellung in about:config ausweichen:
    if (!file.exists()) {
      var pref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
      RanPath = pref.getCharPref("view_source.editor.path");
      file.initWithPath(RanPath);
    }
    proc.init(file);
    proc.run(false, args, args.length);
  },

  stringComparison:function(a, b){
    a = a.toLowerCase();
    a = a.replace(/ä/g,"a");
    a = a.replace(/ö/g,"o");
    a = a.replace(/ü/g,"u");
    a = a.replace(/ß/g,"s");
    b = b.toLowerCase();
    b = b.replace(/ä/g,"a");
    b = b.replace(/ö/g,"o");
    b = b.replace(/ü/g,"u");
    b = b.replace(/ß/g,"s");
    return(a==b)?0:(a>b)?1:-1;
  },

  getScripts:function(iType) {
    // Arrays (jeweils ein Array fuer uc.js und uc.xul) nehmen Namen der gefundenen Skripte auf
    let ucJsScripts = [];
    let ucXulScripts = [];
    // Suchmuster, also die Dateierweiterungen uc.js und uc.xul
    let extjs = /\.uc\.js$/i;
    //let extxul = /\.uc\.xul$/i;
    let aFolder = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsIFile);
    aFolder.initWithPath(Services.dirsvc.get("UChrm", Ci.nsIFile).path);
    // files mit Eintraegen im Chrome-Ordner befuellen
    let files = aFolder.directoryEntries.QueryInterface(Ci.nsISimpleEnumerator);
    // Ordner bzw. files durchlaufen und kontrollieren, ob gesuchte Dateien dabei sind
    while (files.hasMoreElements()) {
      let file = files.getNext().QueryInterface(Ci.nsIFile);
      // keine gewuenschte Datei, deshalb continue
      //if (!extjs.test(file.leafName) && !extxul.test(file.leafName)) continue;
      // uc.js gefunden -> im Array ablegen
      if (extjs.test(file.leafName)) ucJsScripts.push(file.leafName);
      // uc.xul gefunden -> im Array ablegen
      //if (extxul.test(file.leafName)) ucXulScripts.push(file.leafName);
    }
    if (this.sortScripts) {
      ucJsScripts.sort(this.stringComparison);
      //ucXulScripts.sort(this.stringComparison);
    }
    // Aufruf der naechsten Methoden um die beiden Untermenues oder die Zwischenablage zu befuellen
    if (iType==0) {
      this.fillMenu("submenu-ucjs","submenu-ucjs-items", "Meine Scripte",ucJsScripts,"uProfMenu_ucjs",0);
      //this.fillMenu("submenu-ucxul","submenu-ucxul-items", "uc.xul",ucXulScripts,"uProfMenu_ucxul",0);
     } else {
      var result = this.fillClipboardValue(ucJsScripts,ucXulScripts);
      Components.classes["@mozilla.org/widget/clipboardhelper;1"].getService(Components.interfaces.nsIClipboardHelper).copyString(result);
    }
  },

  getCss:function(iType) {
    // Array nimmt Namen der gefundenen css-Dateien auf
    let cssFiles = [];
    // Suchmuster, also die Dateierweiterung css
    let extcss = /\.css$/i;
    let aFolder = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsIFile);
    if (iType==3) {
      aFolder.initWithPath(Services.dirsvc.get("UChrm", Ci.nsIFile).path+this.getDirSep()+"CSS");
     } else if (iType==4) {
      aFolder.initWithPath(Services.dirsvc.get("UChrm", Ci.nsIFile).path+this.getDirSep()+"CSSWeb");
    }  else if (iType==5) {
      aFolder.initWithPath(Services.dirsvc.get("UChrm", Ci.nsIFile).path+this.getDirSep()+"CSSShadow");
    }
    // files mit Eintraegen im CSS- bzw. CSSWeb-Ordner befuellen
    let files = aFolder.directoryEntries.QueryInterface(Ci.nsISimpleEnumerator);
    // Ordner bzw. files durchlaufen und kontrollieren, ob gesuchte Dateien dabei sind
    while (files.hasMoreElements()) {
      let file = files.getNext().QueryInterface(Ci.nsIFile);
      // css gefunden -> im Array ablegen
      if (extcss.test(file.leafName)) cssFiles.push(file.leafName);
    }
    if (this.sortScripts) {
      cssFiles.sort(this.stringComparison);
    }
    // Untermenue befuellen
    if (iType==3) {
      this.fillMenu("submenu-css","submenu-css-items","Meine CSS-Dateien",cssFiles,"uProfMenu_css",3);
     } else if (iType==4) {
      this.fillMenu("submenu-cssweb","submenu-cssweb-items","Meine CSSWeb-Dateien",cssFiles,"uProfMenu_css",4);
    }  else if (iType==5) {
      this.fillMenu("submenu-CSSShadow","submenu-CSSShadow-items","Meine CSSShadow-Dateien",cssFiles,"uProfMenu_css",5);
    }
  },

  fillMenu:function(whichsubmenu, whichsubmenuitems, strlabel, scriptArray,sClass,sTyp) {
    // Beschriftung des Untermenues mit Anzahl der gefundenen Dateien ergaenzen
    var e = document.getElementById(whichsubmenu);
    e.setAttribute('label',strlabel + ' (' + scriptArray.length + ')');
    var popup = document.getElementById(whichsubmenuitems);
    // zunaechst Untermenue zuruecksetzen
    while(popup.hasChildNodes()){
      popup.removeChild(popup.firstChild);
    }
    // Untermenue endlich befuellen
    for (var i = scriptArray.length-1; i > -1; i--) {
      // Typunterscheidung (userChromeJS-Skript oder about: oder css)
      if (sTyp==0){
        var mitem = this.createME("menuitem",scriptArray[i],"uProfMenu.edit(0,'"+scriptArray[i]+"')",sClass,0);
		mitem.addEventListener('click', function(event) {
			uProfMenu.openAtGithub(event,'"+scriptArray[i]+"');
			event.preventDefault();
		},true);
		
        mitem.setAttribute("tooltiptext"," Linksklick: Bearbeiten,\n Mittelklick: https://github.com/.../"+this.cleanFileName(scriptArray[i])+" oeffnen,\n Rechtsklick: Suche auf GitHub");
       } else if (sTyp==1){
        var mitem = this.createME("menuitem",scriptArray[i],"openTrustedLinkIn('"+scriptArray[i]+"','tab')",sClass,0);
       } else if (sTyp==3){
        var mitem = this.createME("menuitem",scriptArray[i],"uProfMenu.edit(3,'"+scriptArray[i]+"')",sClass,0);
       } else if (sTyp==4){
        var mitem = this.createME("menuitem",scriptArray[i],"uProfMenu.edit(4,'"+scriptArray[i]+"')",sClass,0);
      }
	  else if (sTyp==5){
        var mitem = this.createME("menuitem",scriptArray[i],"uProfMenu.edit(5,'"+scriptArray[i]+"')",sClass,0);
      }
      popup.insertBefore(mitem, popup.firstChild);
    }
  },

  fillClipboardValue:function(sArray,xArray) {
    var retValue;
    var s = 0;
    var x = 0;
    s = sArray.length;
    x = xArray.length;
    switch(this.enableScriptsToClip) {
      case 1:
        retValue = "userChromeJS/uc.js ("+s+"):\n------------------------\n"+sArray.join("\n")+
                   "\n\nuserChromeJS/uc.xul ("+x+"):\n-------------------------\n"+xArray.join("\n");
        break;
      default:
        retValue = "userChromeJS/uc.js ("+s+"):\n------------------------";
        for (var i = 0; i < s ; i++) {
          j = i + 1;
          retValue = retValue + "\n" + j + ". " + sArray[i];
        }
        retValue = retValue + "\n\nuserChromeJS/uc.xul ("+x+"):\n-------------------------";
        if (this.enableScriptsToClip==2) s = 0;
        for (var i = 0; i < x ; i++) {
          j = i + s + 1;
          retValue = retValue + "\n" + j + ". " + xArray[i];
        }
        break;
    }
    return retValue;
  },

  createME:function(sTyp,sLabel,sCommand,sClass,sId) {
    // Anlegen von menuitem, menu oder menupop - fuer bestimmte Typen nicht eingesetzte Parameter werden als 0 uebergeben
    const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
    var m = document.createElementNS(XUL_NS, sTyp);
    switch (sTyp) {
      case "menuitem":
        // this.createME("menuitem","Label des Items","ZuzuweisenderCodeFueroncommand","GewuenschteKlasseDesItems",0)
        m.setAttribute('label', sLabel);
        m.setAttribute('class',sClass);
		m.addEventListener('command', function(event) {
			Function(sCommand)();
		}, true);
		
        break;
      case "menu":
        // this.createME("menu","Label des Menues",0,0,"GewuenschteIdDesMenues")
        m.setAttribute('label', sLabel);
        m.setAttribute('id', sId);
        break;
      case "menupopup":
        //this.createME("menupopup",0,0,0,"GewuenschteIdDesMenupopups");
        m.setAttribute('id', sId);
        break;
    }
    return m;
  },

  openAtGithub:function(e,sScript) {
    if (e.button==1){
      // Mittelklick - Seite auf GitHub oeffnen (funktioniert nur, wenn Ordner- und bereinigter Dateiname [ohne Erweiterung] uebereinstimmen):
      var sUrl = "https://github.com/ardiman/userChrome.js/tree/master/"+this.cleanFileName(sScript);
      openWebLinkIn(sUrl, 'tab');
    }
    if (e.button==2){
      // Rechtsklick - Suche auf GitHub starten (funktioniert nur, wenn der Dateiname im Code hinterlegt ist):
      e.preventDefault();
      var sUrl = "https://github.com/search?langOverride=&language=&q="+sScript+"&repo=&start_value=1&type=Code";
      openWebLinkIn(sUrl, 'tab');
    }
  },

  cleanFileName:function(sName) {
    sName = sName.toLowerCase();
    /* Das folgende Array enthaelt regulaere Ausdruecke, um ungueltige Zeichenfolgen entfernen:
    /Datei-Erweiterungen am Ende/, /"ucjs_" am Anfang/, /"_"gefolgtVonZahlUndDanachBeliebigenZeichen/
    / "_fx"gefolgtVonZahl(en)/, /"-" oder "+" oder "."/, /"_v"gefolgtVonZahlen
    */
    var regs = [/\.uc\.js$/,/\.uc\.xul$/,/^ucjs_/,/_\d.+/,/_fx\d+/,/[-+\.]/g,/_v\d+/];
    for (var i = 0; i < regs.length; i++) {
      sName = sName.replace(regs[i],"");
    }
    return sName;
  }

};

uProfMenu.init();
