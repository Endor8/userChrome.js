/*
// ==UserScript==
// @name           extras_config_menu.uc.js
// @compatibility  Firefox 153*.*
// @include        main
// @version        1.0.20260814
// @edit           @aborix 7/21 CSS Dateien als Untermenü eingefügt
// @edit           @2002Andreas 8/21 Shadow CSS Dateien als Untermenü + Ordner eingefügt
// @edit           @BrokenHeart 1/25 Anpass. wg. Änderung der Sicherheitsrichtlinien bei 'inlineEvents'
// @edit           @Mira 8/26 Anpassung für security.allow_unsafe_dangerous_privileged_evil_eval = false
// @edit           @Mira 8/26 Anpassung für Userscripte im Unterordner "chrome/scripts", Expliziter Ausschluss von "userChromeShadow.uc.js"
// @edit           @Mira 8/26 Anpassung für "Skriptliste in Zwischenablage"
// ==/UserScript==
*/

var uProfMenu = {
  // --- KONFIGURATION (unchanged) ---
  TextOpenExe: 'C:\\Program Files\\Notepad++\\notepad++.exe',
  vFileManager: '',
  warpmenuto: 'helpMenu',
  sortScripts: 0,
  gmOrdner: 0,
  cssOrdner: 1,
  abouts: ['about:about','about:addons','about:cache','about:config','about:crashes',
           'about:downloads','about:home','about:logins','about:memory','about:support',
           'about:preferences','about:performance','about:profiles'
          ],
  showNormalPrefs: 1,
  enableScriptsToClip: 2,
  enableRestart: 1,

  // --- INIT (ANGEPASST) ---
  init: function() {
    if (this.warpmenuto.toLowerCase() == 'menu') {
      var zielmenu = document.getElementById('menu_ToolsPopup');
      if (zielmenu == null) {
        userChrome.log("extras_config_menu.uc.js findet Zielmenue nicht, evtl. weil ein anderes Fenster als das Hauptfenster geoeffnet wurde.");
        return;
      }
      var menu = zielmenu.appendChild(this.createME("menu", "Config Men\u00FC", null, 0, "ExtraConfigMenu"));
      menu.setAttribute("class", "menu-iconic");
      // Ersetze ondblclick durch addEventListener
      menu.addEventListener('dblclick', function() {
        openTrustedLinkIn('about:config', 'tab');
      }, true);
    } else {
      if (window.__SSi == "window0") {
        CustomizableUI.createWidget({
          id: "ExtraConfigMenu-button",
          defaultArea: CustomizableUI.AREA_NAVBAR,
          label: "Extra Config Menü",
          tooltiptext: "Extra Config Menü\nMittelklick öffnet about:config"
        });
      }
      var menu = document.getElementById("ExtraConfigMenu-button");

      // KORREKTUR:
      if (!menu) {
        return;
      }

      menu.setAttribute("type", "menu");
      menu.addEventListener('click', function(event) {
        if (event.button == 1 && !this.open) {
          openTrustedLinkIn("about:config", "tab");
          event.preventDefault();
        }
      }, true);
    }

    // CSS-Styles (unchanged)
    var css = " \
      #ExtraConfigMenu, #ExtraConfigMenu-button { \
        list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACnElEQVR4Xm2RzYtbZRSHn/fr3pvJzTB3qiNM2k2pMBUGhEHaqsUqdeFGQalCobgREaFu/B/cqCtxVSjoQhBEQRBmIfWDKgNGJUPt0Nhah9JJ4iSd5E6+bu5972tAO4SS5/DjXZ1znsMrNiq1eikMQqYYJCmjxNH5+zdW777L0J5KKl9VPmnf+ut9KWkwhbheuzNcOVYOmGKc5iRO0r1ykeXCx0h7kt4fC3z5wfqbQnAJwQHa5S7jAZSRuJ0mkf81cheobhBXZa+ri1uptQjHAZoZCEC1PiPgDuwxCfwerBU7b73zXn//3usCcdt4HkZ7SGZg431U51NUCgwlO3cV/bVXhR/6p9ut+nP9QYeNn7/n8qUPZxvQ/Q6VVWHk4ZqWRvlJjpx9hcGfW2wO95N2q8m3618A2WwDt/0RplSAXsBed57eyossHl5GYdHacG3zGpADM06wjQ1UUIN+CLHPvfAxojPnKLiE+bDE1R9+5GatAmgPeGCAteQ7l5GBhGSyuROyd/gFouUyWkqEErR2mwXAAA8BRS0AgMQBjSra30ZkEeDzz9Dn4ZcvMO51SMcJcTdGChmA0ABA6cAgzyG3I8jLEBylV4fWoaeIc0V7t0Uv7pFbC+CA+28mp/8+SwXKnMVmz1O9HpE+eobMZdjcoY1GIHD/NwIdoH1fBaNguzlg88pVyoUi4vTbFI8eJxsNAIfSkrliESllH/L0v0jktNNomFGv1TFrL3Fo9QSMR3jaEEXzLC09gjaKp595No0WjyCEB4zRclICUMDxtRMce/wJ1MIi2SglXShhfI/cOjxPoZRmbq4gXzt/gVrtBrdvbiG+Wf+p/mvll1BpiVAGhCDPxuAUDotz4HKHlIJON6bRbL4hhPjcMx5mkn8BBLEUrsVZbq0AAAAASUVORK5CYII=);  \
        margin-top: 0px !important; \
        opacity: 1 !important; \
      } \
      #ExtraConfigMenu-button > dropmarker, #ExtraConfigMenu-button > hbox > .toolbarbutton-menu-dropmarker { \
        display: none !important; \
      }";
    var sss = Cc['@mozilla.org/content/style-sheet-service;1'].getService(Ci.nsIStyleSheetService);
    var uri = makeURI('data:text/css;charset=UTF-8,' + encodeURIComponent(css));
    sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);

    // Menü-Popup erstellen
    var menupopup = menu.appendChild(this.createME("menupopup", null, null, 0, "ExtraConfigMenu-popup"));

    // Event-Listener für popupshowing (unchanged, aber sicher)
    menu.addEventListener('popupshowing', function(event) {
      uProfMenu.getScripts(0);
      uProfMenu.getCss(3);
      uProfMenu.getCss(4);
      uProfMenu.getCss(5);
    }, true);

    // --- UNTERMENÜS (unchanged) ---
    var submenu = menupopup.appendChild(this.createME("menu", "Meine Scripte", null, 0, "submenu-ucjs"));
    var submenupopup = submenu.appendChild(this.createME("menupopup", null, null, 0, "submenu-ucjs-items"));
    var submenu = menupopup.appendChild(this.createME("menu", "css", null, 0, "submenu-css"));
    var submenupopup = submenu.appendChild(this.createME("menupopup", null, null, 0, "submenu-css-items"));
    var submenu = menupopup.appendChild(this.createME("menu", "CSSShadow", null, 0, "submenu-CSSShadow"));
    var submenupopup = submenu.appendChild(this.createME("menupopup", null, null, 0, "submenu-CSSShadow-items"));
    var submenu = menupopup.appendChild(this.createME("menu", "cssweb", null, 0, "submenu-cssweb"));
    var submenupopup = submenu.appendChild(this.createME("menupopup", null, null, 0, "submenu-cssweb-items"));

    // Skriptliste in Zwischenablage (ANGEPASST: sCommand als Funktion)
    if (this.enableScriptsToClip) {
      menupopup.appendChild(this.createME(
        "menuitem",
        "Skriptliste in Zwischenablage",
        function() { uProfMenu.getScripts(1); },
        "uProfMenu_clipboard",
        0
      ));
    }

    menupopup.appendChild(document.createXULElement('menuseparator'));

    // --- KONFIGDATEIEN (ANGEPASST: sCommand als Funktion) ---
    menupopup.appendChild(this.createME(
      "menuitem", "Bild Url",
      function() { uProfMenu.edit(0, 'Bild Url.css'); },
      "uProfMenu_edit", 0
    ));
    menupopup.appendChild(this.createME(
      "menuitem", "config Einträge.css",
      function() { uProfMenu.edit(0, 'config Einträge.css'); },
      "uProfMenu_edit", 0
    ));
    menupopup.appendChild(this.createME(
      "menuitem", "userChrome.css",
      function() { uProfMenu.edit(0, 'userChrome.css'); },
      "uProfMenu_edit", 0
    ));
    menupopup.appendChild(this.createME(
      "menuitem", "userChromeShadow.css",
      function() { uProfMenu.edit(0, 'userChromeShadow.css'); },
      "uProfMenu_edit", 0
    ));
    menupopup.appendChild(this.createME(
      "menuitem", "userContent.css",
      function() { uProfMenu.edit(0, 'userContent.css'); },
      "uProfMenu_edit", 0
    ));
    menupopup.appendChild(this.createME(
      "menuitem", "userChrome.js",
      function() { uProfMenu.edit(0, 'userChrome.js'); },
      "uProfMenu_edit", 0
    ));
    menupopup.appendChild(this.createME(
      "menuitem", "prefs.js",
      function() { uProfMenu.edit(1, 'prefs.js'); },
      "uProfMenu_edit", 0
    ));
    menupopup.appendChild(this.createME(
      "menuitem", "user.js",
      function() { uProfMenu.edit(1, 'user.js'); },
      "uProfMenu_edit", 0
    ));

    // --- ORDNER (ANGEPASST: sCommand als Funktion) ---
    menupopup.appendChild(document.createXULElement('menuseparator'));
    switch (this.gmOrdner) {
      case 1:
        menupopup.appendChild(this.createME(
          "menuitem", "GM-skripty",
          function() { uProfMenu.dirOpen(uProfMenu.getPrefDirectoryPath('ProfD') + uProfMenu.getDirSep() + 'gm_scripts'); },
          "uProfMenu_folder", 0
        ));
        break;
      case 2:
        menupopup.appendChild(this.createME(
          "menuitem", "USL-skripty",
          function() { uProfMenu.dirOpen(uProfMenu.getPrefDirectoryPath('UChrm') + uProfMenu.getDirSep() + 'UserScriptLoader'); },
          "uProfMenu_folder", 0
        ));
        break;
      case 3:
        menupopup.appendChild(this.createME(
          "menuitem", "Skripty Scriptish",
          function() { uProfMenu.dirOpen(uProfMenu.getPrefDirectoryPath('ProfD') + uProfMenu.getDirSep() + 'scriptish_scripts'); },
          "uProfMenu_folder", 0
        ));
        break;
    }

    menupopup.appendChild(this.createME(
      "menuitem", "CSS-Ordner",
      function() { uProfMenu.dirOpen(uProfMenu.getPrefDirectoryPath('UChrm') + uProfMenu.getDirSep() + 'css'); },
      "uProfMenu_folder", 0
    ));
    menupopup.appendChild(this.createME(
      "menuitem", "CSSShadow-Ordner",
      function() { uProfMenu.dirOpen(uProfMenu.getPrefDirectoryPath('UChrm') + uProfMenu.getDirSep() + 'CSSShadow'); },
      "uProfMenu_folder", 0
    ));
    menupopup.appendChild(this.createME(
      "menuitem", "CSSWeb-Ordner",
      function() { uProfMenu.dirOpen(uProfMenu.getPrefDirectoryPath('UChrm') + uProfMenu.getDirSep() + 'CSSWeb'); },
      "uProfMenu_folder", 0
    ));
    menupopup.appendChild(this.createME(
      "menuitem", "Chromeordner",
      function() { uProfMenu.prefDirOpen('UChrm'); },
      "uProfMenu_folder", 0
    ));
    menupopup.appendChild(this.createME(
      "menuitem", "Profilordner",
      function() { uProfMenu.prefDirOpen('ProfD'); },
      "uProfMenu_folder", 0
    ));
    menupopup.appendChild(this.createME(
      "menuitem", "Icons-Ordner",
      function() { uProfMenu.dirOpen(uProfMenu.getPrefDirectoryPath('UChrm') + uProfMenu.getDirSep() + 'Icons'); },
      "uProfMenu_folder", 0
    ));
    menupopup.appendChild(this.createME(
      "menuitem", "Installationsordner",
      function() { uProfMenu.prefDirOpen('CurProcD'); },
      "uProfMenu_folder", 0
    ));
    menupopup.appendChild(this.createME(
      "menuitem", "Addonordner",
      function() { uProfMenu.dirOpen(uProfMenu.getPrefDirectoryPath('ProfD') + uProfMenu.getDirSep() + 'extensions'); },
      "uProfMenu_folder", 0
    ));
    menupopup.appendChild(this.createME(
      "menuitem", "Startup-Cacheordner",
      function() { uProfMenu.dirOpen(uProfMenu.getPrefDirectoryPath('ProfLD') + uProfMenu.getDirSep() + 'startupCache'); },
      "uProfMenu_folder", 0
    ));

    // --- ABOUT-SEITEN (ANGEPASST: Closure-Problem gelöst) ---
    if (this.abouts.length > 0) {
      menupopup.appendChild(document.createXULElement('menuseparator'));
      if (this.abouts[0] == '0') {
        for (var i = 1; i < this.abouts.length; i++) {
          (function(index) {
            var about = uProfMenu.abouts[index];
            menupopup.appendChild(uProfMenu.createME(
              "menuitem", about,
              function() { openTrustedLinkIn(about, 'tab'); },
              "uProfMenu_about", 0
            ));
          })(i);
        }
      } else {
        var submenu = menupopup.appendChild(this.createME("menu", "uc.js", null, 0, "submenu-about"));
        var submenupopup = submenu.appendChild(this.createME("menupopup", null, null, 0, "submenu-about-items"));
        this.fillMenu("submenu-about", "submenu-about-items", "about:", this.abouts, "uProfMenu_about", 1);
      }
    }

    // --- EINSTELLUNGEN & NEUSTART (ANGEPASST) ---
    if (this.abouts.length == 0 && (this.showNormalPrefs || typeof(ToolRstartMod) != "undefined")) {
      menupopup.appendChild(document.createXULElement('menuseparator'));
    }
    if (this.showNormalPrefs) {
      menupopup.appendChild(this.createME(
        "menuitem", "Einstellungen",
        function() { try { openOptionsDialog(); } catch(e) { openPreferences(); } },
        "uProfMenu_prefs", 0
      ));
    }
    if (this.enableRestart) {
      menupopup.appendChild(this.createME(
        "menuitem", "Neustart",
        function() {
          Services.appinfo.invalidateCachesOnRestart();
          Services.startup.quit(Ci.nsIAppStartup.eRestart | Ci.nsIAppStartup.eAttemptQuit, 0);
        },
        0, 0
      ));
    }
  },

  // --- HILFSFUNKTIONEN (unchanged) ---
  getDirSep: function() {
    var osString = Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULRuntime).OS;
    var dirsep = "/";
    switch(osString) {
      case "WINNT": dirsep = "\\"; break;
      case "Linux": dirsep = "/"; break;
      case "Darwin": dirsep = "/"; break;
    }
    return dirsep;
  },

  // --- EDIT (changed by Mira) --- 
  edit: function(OpenMode, Filename) {
    var Path = "";
    var dSep = this.getDirSep();

    // --- Pfad-Handling für chrome/scripts/ ---
    if (Filename.includes("/") || Filename.includes("\\")) {
      Path = this.getPrefDirectoryPath("ProfD") + dSep + Filename;
    } else {
      // Original-Logik
      switch (OpenMode) {
        case 0: Path = this.getPrefDirectoryPath("UChrm") + dSep + Filename; break;
        case 1: Path = this.getPrefDirectoryPath("ProfD") + dSep + Filename; break;
        case 2: Path = Filename; break;
        case 3: Path = this.getPrefDirectoryPath("UChrm") + dSep + "CSS" + dSep + Filename; break;
        case 4: Path = this.getPrefDirectoryPath("UChrm") + dSep + "CSSWeb" + dSep + Filename; break;
        case 5: Path = this.getPrefDirectoryPath("UChrm") + dSep + "CSSShadow" + dSep + Filename; break;
      }
    }
    this.launch(this.TextOpenExe, Path);
  },

  dirOpen: function(Path) {
    if (this.vFileManager.length != 0) {
      var file = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsIFile);
      var process = Cc['@mozilla.org/process/util;1'].createInstance(Ci.nsIProcess);
      var args = [Path];
      file.initWithPath(this.vFileManager);
      process.init(file);
      process.run(false, args, args.length);
    } else {
      var dir = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsIFile);
      dir.initWithPath(Path);
      dir.launch();
    }
  },

  prefDirOpen: function(prefDir) {
    var Path = this.getPrefDirectoryPath(prefDir);
    this.dirOpen(Path);
  },

  getPrefDirectoryPath: function(str) {
    var file = Components.classes["@mozilla.org/file/directory_service;1"]
      .getService(Components.interfaces.nsIProperties)
      .get(str, Components.interfaces.nsIFile);
    if (str == 'CurProcD') file = file.parent;
    return file.path;
  },

  launch: function(RanPath, OpenPath) {
    var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsIFile);
    var proc = Components.classes["@mozilla.org/process/util;1"].createInstance(Components.interfaces.nsIProcess);
    var args = [OpenPath];
    file.initWithPath(RanPath);
    if (!file.exists()) {
      var pref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
      RanPath = pref.getCharPref("view_source.editor.path");
      file.initWithPath(RanPath);
    }
    proc.init(file);
    proc.run(false, args, args.length);
  },

  stringComparison: function(a, b) {
    a = a.toLowerCase().replace(/ä/g,"a").replace(/ö/g,"o").replace(/ü/g,"u").replace(/ß/g,"s");
    b = b.toLowerCase().replace(/ä/g,"a").replace(/ö/g,"o").replace(/ü/g,"u").replace(/ß/g,"s");
    return (a == b) ? 0 : (a > b) ? 1 : -1;
  },

  // --- GETSCRIPTS (changed by Mira) ---
  getScripts: function(iType) {
    let ucJsScripts = [];
    let extjs = /\.uc\.js$/i;

    // --- 1. Standard-UChrm-Ordner durchsuchen (ohne userChromeShadow.uc.js) ---
    let uchrmFolder = Services.dirsvc.get("UChrm", Ci.nsIFile);
    if (uchrmFolder.exists()) {
      let files = uchrmFolder.directoryEntries.QueryInterface(Ci.nsISimpleEnumerator);
      while (files.hasMoreElements()) {
        let file = files.getNext().QueryInterface(Ci.nsIFile);
        if (extjs.test(file.leafName) && file.leafName !== "userChromeShadow.uc.js") {
          ucJsScripts.push(file.leafName);
        }
      }
    }

    // --- 2. chrome/scripts-Ordner durchsuchen (falls vorhanden) ---
    let chromeScriptsFolder = Services.dirsvc.get("ProfD", Ci.nsIFile);
    chromeScriptsFolder.append("chrome");
    chromeScriptsFolder.append("scripts");
    if (chromeScriptsFolder.exists()) {
      let files = chromeScriptsFolder.directoryEntries.QueryInterface(Ci.nsISimpleEnumerator);
      while (files.hasMoreElements()) {
        let file = files.getNext().QueryInterface(Ci.nsIFile);
        if (extjs.test(file.leafName)) {
          ucJsScripts.push("chrome/scripts/" + file.leafName); // Pfad-Präfix für spätere Verarbeitung
        }
      }
    }

    if (this.sortScripts) ucJsScripts.sort(this.stringComparison);

    if (iType == 0) {
      this.fillMenu("submenu-ucjs", "submenu-ucjs-items", "Meine Scripte", ucJsScripts, "uProfMenu_ucjs", 0);
    } else {
      // Für Zwischenablage: Nur Dateinamen (ohne Pfad) verwenden
      var simpleNames = ucJsScripts.map(f => f.split(/[\\/]/).pop());
      var result = this.fillClipboardValue(simpleNames, []);
      Components.classes["@mozilla.org/widget/clipboardhelper;1"].getService(Components.interfaces.nsIClipboardHelper).copyString(result);
    }
  },

  // --- GETCSS (unchanged) ---
  getCss: function(iType) {
    let cssFiles = [];
    let extcss = /\.css$/i;
    let aFolder = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsIFile);
    if (iType == 3) aFolder.initWithPath(Services.dirsvc.get("UChrm", Ci.nsIFile).path + this.getDirSep() + "CSS");
    else if (iType == 4) aFolder.initWithPath(Services.dirsvc.get("UChrm", Ci.nsIFile).path + this.getDirSep() + "CSSWeb");
    else if (iType == 5) aFolder.initWithPath(Services.dirsvc.get("UChrm", Ci.nsIFile).path + this.getDirSep() + "CSSShadow");
    let files = aFolder.directoryEntries.QueryInterface(Ci.nsISimpleEnumerator);
    while (files.hasMoreElements()) {
      let file = files.getNext().QueryInterface(Ci.nsIFile);
      if (extcss.test(file.leafName)) cssFiles.push(file.leafName);
    }
    if (this.sortScripts) cssFiles.sort(this.stringComparison);
    if (iType == 3) this.fillMenu("submenu-css", "submenu-css-items", "Meine CSS-Dateien", cssFiles, "uProfMenu_css", 3);
    else if (iType == 4) this.fillMenu("submenu-cssweb", "submenu-cssweb-items", "Meine CSSWeb-Dateien", cssFiles, "uProfMenu_css", 4);
    else if (iType == 5) this.fillMenu("submenu-CSSShadow", "submenu-CSSShadow-items", "Meine CSSShadow-Dateien", cssFiles, "uProfMenu_css", 5);
  },

  // --- FILLMENU (ANGEPASST: Closure-Problem gelöst + Event-Handler korrigiert) ---
  fillMenu: function(whichsubmenu, whichsubmenuitems, strlabel, scriptArray, sClass, sTyp) {
    var e = document.getElementById(whichsubmenu);
    e.setAttribute('label', strlabel + ' (' + scriptArray.length + ')');
    var popup = document.getElementById(whichsubmenuitems);
    while (popup.hasChildNodes()) popup.removeChild(popup.firstChild);

    var uProfMenu = this; // Für Closure
    for (var i = scriptArray.length - 1; i > -1; i--) {
      (function(index) {
        var fileName = scriptArray[index];
        var mitem;

        // Korrektur durch Mira
        if (sTyp == 0) {
          mitem = uProfMenu.createME("menuitem", fileName, null, sClass, 0);
          // Extrahiere Dateinamen für Anzeige (z. B. "chrome/scripts/test.uc.js" → "test.uc.js")
          var displayName = fileName.split(/[\\/]/).pop();
          mitem.setAttribute('label', displayName);
          mitem.addEventListener('command', function() {
            uProfMenu.edit(0, fileName); // Original-Pfad (mit Präfix) an edit() übergeben
          }, true);
          mitem.addEventListener('click', function(event) {
            uProfMenu.openAtGithub(event, displayName);
          }, true);
          mitem.setAttribute("tooltiptext", "Linksklick: Bearbeiten,\nMittelklick: https://github.com/.../" + uProfMenu.cleanFileName(displayName) + " öffnen,\nRechtsklick: Suche auf GitHub");
        }
        // Korrektur ENDE
        else if (sTyp == 1) {
          mitem = uProfMenu.createME("menuitem", fileName, function() {
            openTrustedLinkIn(fileName, 'tab');
          }, sClass, 0);
        }
        else if (sTyp == 3) {
          mitem = uProfMenu.createME("menuitem", fileName, function() {
            uProfMenu.edit(3, fileName);
          }, sClass, 0);
        }
        else if (sTyp == 4) {
          mitem = uProfMenu.createME("menuitem", fileName, function() {
            uProfMenu.edit(4, fileName);
          }, sClass, 0);
        }
        else if (sTyp == 5) {
          mitem = uProfMenu.createME("menuitem", fileName, function() {
            uProfMenu.edit(5, fileName);
          }, sClass, 0);
        }
        popup.insertBefore(mitem, popup.firstChild);
      })(i);
    }
  },

  // --- FILLCLIPBOARDVALUE (changed by Mira) ---
  fillClipboardValue: function(sArray) {
    var retValue = "Meine Skripte (" + sArray.length + "):\n------------------------";
    for (var i = 0; i < sArray.length; i++) {
      retValue += "\n" + (i + 1) + ". " + sArray[i];
    }
    return retValue;
  },

  // --- CREATEME (ANGEPASST: sCommand als Funktion) ---
  createME: function(sTyp, sLabel, sCommand, sClass, sId) {
    const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
    var m = document.createElementNS(XUL_NS, sTyp);
    switch (sTyp) {
      case "menuitem":
        m.setAttribute('label', sLabel);
        m.setAttribute('class', sClass);
        if (sCommand && typeof sCommand === 'function') {
          m.addEventListener('command', sCommand, true);
        }
        break;
      case "menu":
        m.setAttribute('label', sLabel);
        m.setAttribute('id', sId);
        break;
      case "menupopup":
        m.setAttribute('id', sId);
        break;
    }
    return m;
  },

  // --- OPENATGITHUB (unchanged) ---
  openAtGithub: function(e, sScript) {
    if (e.button == 1) {
      var sUrl = "https://github.com/ardiman/userChrome.js/tree/master/" + this.cleanFileName(sScript);
      openWebLinkIn(sUrl, 'tab');
    }
    if (e.button == 2) {
      e.preventDefault();
      var sUrl = "https://github.com/search?langOverride=&language=&q=" + sScript + "&repo=&start_value=1&type=Code";
      openWebLinkIn(sUrl, 'tab');
    }
  },

  // --- CLEANFILENAME (unchanged) ---
  cleanFileName: function(sName) {
    sName = sName.toLowerCase();
    var regs = [/\.uc\.js$/, /\.uc\.xul$/, /^ucjs_/, /_\d.+/, /_fx\d+/, /[-+\.]/g, /_v\d+/];
    for (var i = 0; i < regs.length; i++) {
      sName = sName.replace(regs[i], "");
    }
    return sName;
  }
};

// Initialisierung
uProfMenu.init();
