// ==UserScript==
// @name           extras_config_menu.uc.js
// @compatibility  Firefox 154*.*
// @include        main
// @version        1.0.20260826
// @edit           @aborix 7/21 CSS Dateien als Untermenü eingefügt
// @edit           @2002Andreas 8/21 Shadow CSS Dateien als Untermenü + Ordner eingefügt
// @edit           @BrokenHeart 1/25 Anpass. wg. Änderung der Sicherheitsrichtlinien bei 'inlineEvents'
// @edit           @Mira 8/26 Anpass. f. security.allow_unsafe_dangerous_privileged_evil_eval = false
// @edit           @Mira 8/26 Anpass. f. Userscripte im Unterordner "chrome/scripts", Expliziter Ausschluss von "userChromeShadow.uc.js"
// @edit           @Mira 8/26 Anpass. zum Ausschluss von "userChromeShadow.uc.js", lässt sich auswählen
// @edit           @Mira 8/26 Anpass. f. "Skriptliste in Zwischenablage"
// @edit           @Mira 8/26 1. Altlast "warpmenuto: 'helpMenu'" ersetzt durch die Auswahl, ob ein Button oder ein Menü erstellt werden soll.
// @edit           @Mira 8/26 2. Das komplette CSS entsorgt! Code für Button ergänzt.
// @edit           @Mira 8/26 Skript entrümpelt! Code für "Bild Url" & "config Einträge.css" sowie "Einbindung GM-Skripte-Ordner" entfernt.
// @edit           @Mira 8/26 Anpass. f. den Button. Auswahl für flexibles SVG-Icon oder festes Base64-PNG-Icon hinzugefügt
// @edit           @Mira 8/26 Anpass. f. den Skriptordner. Ordner kann jetzt ausgewählt, bzw. benannt werden.
// @Source         https://www.camp-firefox.de/forum/thema/140829/?postID=1293269#post1293269

// ==/UserScript==

/* ----------------------------------------------------------------------------------- */
/*     Zu beachten ist, dass die Grafiken sich im richtigen Ordner befinden müssen     */
/*            %appdata%\Mozilla\Firefox\Profiles\"Profilname"\chrome\icons             */
/* ----------------------------------------------------------------------------------- */

/* ----------------------------------------------------------------------------------- */
/*  IMPORTANT!         This script was edited and modified using AI.                   */
/* ----------------------------------------------------------------------------------- */

var uProfMenu = {
  // ■■ START UserConfiguration ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  // Hier kann der Pfad zum einem Texteditor eintragen werden 
  // (unter Ubuntu 10.04 z.B.: '/usr/bin/gedit'). Bei Fehleintrag wird view_source.editor.path ausgelesen:
  //TextOpenExe: 'C:\\Program Files (x86)\\Notepad++\\notepad++.exe',
  TextOpenExe: 'C:\\Program Files\\Microsoft VS Code\\Code.exe',
  // Falls gewuenscht, kann hier ein Dateimanager eintragen (komplett leer lassen fuer Dateimanager des Systems) Beispiele:
  // vFileManager: 'E:\\Total Commander\\Totalcmd.exe',
  // vFileManager: 'C:\\Program Files (x86)\\FreeCommander\\FreeCommander.exe'
  vFileManager: '',
  // In der folgenden Zeile kann festgelegt werden, ob ein verschiebbarer Button erstellt wird:
  showAsButton: 1,  // 1: ja / Button wird erstellt, 0: nein / Menue unter "Extras"0: nein / Menue unter "Extras"
  // Unter Linux sollte/kann versucht werden, die userChromeJS-Skripte zu sortieren, unter Windows ist das evtl. nicht noetig (die Sortierung wird Gross- und Kleinschreibung *nicht* beruecksichtigen - dazu wird die sort()-Funktion entsprechend mit einer Vergleichsfunktion aufgerufen)
  sortScripts: 0,   // 1 zum Erzwingen der Sortierung
  // Zeigt die Datei userChromeShadow.uc.js falls vorhanden in der Skriptliste an (1: ja, 0: nein):
  showuCS: 0,  // Default => 0
  // Einbindung CSS-Ordner (0: nein, 1: UserCSSLoader-Ordner im Chrome-Verzeichnis):
  cssOrdner: 1,
  // Falls Javacripte sich nicht nur im chrome-Verzeichnis, sondern auch in einem Unterverzeichnis befinden, 
  // hier den Ordnernamen des Unterverzeichnises eintragen.
  // Sonst: '' , es werden dann nur die Skripte aus dem chrome-Verzeichnis angezeigt
  jsSubfolder: 'scripts',
  // Nachfolgend gueltige about:Adressen eintragen, die ebenfalls aufgerufen werden sollen oder
  // zum Ausblenden: abouts: [],
  // Damit die about:-Seiten nicht als Untermenue, sondern direkt als Menuepunkte aufgefuehrt werden, muss das erste Element '0' sein:
  // Zum Beispiel so: abouts: ['0','about:about','about:addons','about:cache','about:config','about:support'],
  abouts: ['about:about','about:addons','about:cache','about:config','about:crashes',
           'about:downloads','about:home','about:logins','about:memory','about:support',
           'about:preferences','about:performance','about:profiles'
          ],
  // Die normalen Firefox-Einstellungen auch zur Verfuegung stellen (0: nein, 1: ja):          
  showNormalPrefs: 1,
  // Stellt "Skriptliste in Zwischenablage" zur Verfuegung (1: ja, 2: mit getrennter Nummerierung, 3: mit gemeinsamer Nummerierung) oder nicht (0):
  enableScriptsToClip: 2,
  // Um den Eintrag "Neustart" zu erzwingen (falls z.B. das andere Skript zu spaet eingebunden und nicht erkannt wird), auf 1 setzen:
  enableRestart: 1,
  // Button-Aussehen (1: flexibles SVG-Icon aus Icon-Ordner, 0: festes Base64-PNG-Icon):
  buttonStyle: 1,  // Default => 0
  // Symbol (Icon) nur fuer Button:
        icon: 'edit.svg',         // [Name.Dateiendung] des Symbols
  iconColour: '#FF00FF',        // Farbe fuer das SVG-Icon setzen (leer fuer Originalfarbe)
    iconPath: '/chrome/icons/',   // Pfad zum Ordner der das Icon beinhaltet

  // ■■ END UserConfiguration ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■


  // --- INIT (ANGEPASST) ---
  init: function() {
    // Profil-URI und Icon-URL einmalig bereitstellen
    var curProfDir = PathUtils.toFileURI(PathUtils.join(PathUtils.profileDir));
    var iconUrl = curProfDir + this.iconPath + this.icon;
    var iconColour = this.iconColour;
    var buttonStyle = this.buttonStyle;

    if (this.showAsButton) {
      // als verschiebbaren Button anlegen
      if (window.__SSi == "window0") {
        CustomizableUI.createWidget({
          id: "ExtraConfigMenu-button",
          defaultArea: CustomizableUI.AREA_NAVBAR,
          label: "Extra Config Menü",
          tooltiptext: "Extra Config Menü\nRechtsklick öffnet about:config",

          onCreated: function(button) {
            // Optik direkt am Button-Element setzen
            if (buttonStyle) {
              // flexibles SVG-Icon aus dem Icon-Ordner
              button.style.MozContextProperties = 'fill, stroke, fill-opacity';
              button.style.listStyleImage = 'url("' + iconUrl + '")';
              if (iconColour) {
                button.style.color = iconColour;
              }
            } else {
              // festes Base64-PNG-Icon
              button.style.listStyleImage = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACnElEQVR4Xm2RzYtbZRSHn/fr3pvJzTB3qiNM2k2pMBUGhEHaqsUqdeFGQalCobgREaFu/B/cqCtxVSjoQhBEQRBmIfWDKgNGJUPt0Nhah9JJ4iSd5E6+bu5972tAO4SS5/DjXZ1znsMrNiq1eikMQqYYJCmjxNH5+zdW777L0J5KKl9VPmnf+ut9KWkwhbheuzNcOVYOmGKc5iRO0r1ykeXCx0h7kt4fC3z5wfqbQnAJwQHa5S7jAZSRuJ0mkf81cheobhBXZa+ri1uptQjHAZoZCEC1PiPgDuwxCfwerBU7b73zXn//3usCcdt4HkZ7SGZg431U51NUCgwlO3cV/bVXhR/6p9ut+nP9QYeNn7/n8qUPZxvQ/Q6VVWHk4ZqWRvlJjpx9hcGfW2wO95N2q8m3618A2WwDt/0RplSAXsBed57eyossHl5GYdHacG3zGpADM06wjQ1UUIN+CLHPvfAxojPnKLiE+bDE1R9+5GatAmgPeGCAteQ7l5GBhGSyuROyd/gFouUyWkqEErR2mwXAAA8BRS0AgMQBjSra30ZkEeDzz9Dn4ZcvMO51SMcJcTdGChmA0ABA6cAgzyG3I8jLEBylV4fWoaeIc0V7t0Uv7pFbC+CA+28mp/8+SwXKnMVmz1O9HpE+eobMZdjcoY1GIHD/NwIdoH1fBaNguzlg88pVyoUi4vTbFI8eJxsNAIfSkrliESllH/L0v0jktNNomFGv1TFrL3Fo9QSMR3jaEEXzLC09gjaKp595No0WjyCEB4zRclICUMDxtRMce/wJ1MIi2SglXShhfI/cOjxPoZRmbq4gXzt/gVrtBrdvbiG+Wf+p/mvll1BpiVAGhCDPxuAUDotz4HKHlIJON6bRbL4hhPjcMx5mkn8BBLEUrsVZbq0AAAAASUVORK5CYII=)';
            }
          }


        });
      }
      var menu = document.getElementById("ExtraConfigMenu-button");

      // KORREKTUR:
      if (!menu) {
        return;
      }

      menu.setAttribute("type", "menu");
      // Dropmarker ausblenden (ersetzt ehemaliges CSS-Stylesheet)
      menu.querySelectorAll("dropmarker, .toolbarbutton-menu-dropmarker").forEach(function(d) {
        d.style.display = "none";
      });
      menu.addEventListener('click', function(event) {
        if (event.button == 2 && !this.open) {
          openTrustedLinkIn("about:config", "tab");
          event.preventDefault();
        }
      }, true);
    } else {
      var zielmenu = document.getElementById('menu_ToolsPopup');
      // da showAsButton nicht gesetzt ist, als Untermenue von Extras anlegen
      if (zielmenu == null) {
        userChrome.log("extras_config_menu.uc.js findet Zielmenue nicht, evtl. weil ein anderes Fenster als das Hauptfenster geoeffnet wurde.");
        return;
      }
      var menu = zielmenu.appendChild(this.createME("menu", "Extra Config Men\u00FC", null, 0, "ExtraConfigMenu"));
      menu.setAttribute("class", "menu-iconic"); 

      // Ersetze ondblclick durch addEventListener
      menu.addEventListener('dblclick', function() {
        openTrustedLinkIn('about:config', 'tab');
      }, true);
    }
/*
    let sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);       
    let uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent(`

		/*--------------------------------------------------------------------------*/	
		/*------------------- Einige Menüeinträge ausgeblendet ---------------------*/
		/*--------------------------------------------------------------------------*/
/*
    #submenu-CSSShadow,
    #submenu-cssweb,
    menuitem.uProfMenu_folder[label="CSSShadow-Ordner"],
    menuitem.uProfMenu_folder[label="CSSWeb-Ordner"]  {
      display: none !important;
    }
      `), null, null);
      sss.loadAndRegisterSheet(uri, sss.AUTHOR_SHEET);
*/
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
    // Anlegen von Untermenues fuer userChromeJS-Skripte und CSS-Dateien (befuellen spaeter)
    var submenupopup = submenu.appendChild(this.createME("menupopup", null, null, 0, "submenu-ucjs-items"));
    var submenu = menupopup.appendChild(this.createME("menu", "css", null, 0, "submenu-css"));
    var submenupopup = submenu.appendChild(this.createME("menupopup", null, null, 0, "submenu-css-items"));
    var submenu = menupopup.appendChild(this.createME("menu", "CSSShadow", null, 0, "submenu-CSSShadow"));
    var submenupopup = submenu.appendChild(this.createME("menupopup", null, null, 0, "submenu-CSSShadow-items"));
    var submenu = menupopup.appendChild(this.createME("menu", "cssweb", null, 0, "submenu-cssweb"));
    var submenupopup = submenu.appendChild(this.createME("menupopup", null, null, 0, "submenu-cssweb-items"));
    // Ende Anlegen von Untermenues

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
    // Einbindung von Konfigdateien

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
    // Ende Einbindung von Konfigdateien
    
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
    // Ende Einbindung von Ordnern

    // --- ABOUT-SEITEN (ANGEPASST: Closure-Problem gelöst) ---
    // Einbindung von abouts
    if (this.abouts.length > 0) {
      menupopup.appendChild(document.createXULElement('menuseparator'));
      // falls der erste Eintrag des Arrays = '0' ist, dann kein Untermenue anlegen, sondern direkt als Menuepunkte einbinden
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
        // der erste Eintrag des arrays ist ungleich '0', deshalb als Untermenue einrichten
        var submenu = menupopup.appendChild(this.createME("menu", "uc.js", null, 0, "submenu-about"));
        var submenupopup = submenu.appendChild(this.createME("menupopup", null, null, 0, "submenu-about-items"));
        this.fillMenu("submenu-about", "submenu-about-items", "about:", this.abouts, "uProfMenu_about", 1);
      }
    }
    // Ende Einbindung von abouts
    // Separator, falls dieser nicht schon durch abouts generiert wurde und weitere Menuepunkte folgen werden
    // --- EINSTELLUNGEN & NEUSTART (ANGEPASST) ---
    if (this.abouts.length == 0 && (this.showNormalPrefs || typeof(ToolRstartMod) != "undefined")) {
      menupopup.appendChild(document.createXULElement('menuseparator'));
    }
    // Falls gewuenscht (s. Konfigurationsabschnitt), Zugriff auf die normalen Einstellungen
    if (this.showNormalPrefs) {
      menupopup.appendChild(this.createME(
        "menuitem", "Einstellungen",
        function() { try { openOptionsDialog(); } catch(e) { openPreferences(); } },
        "uProfMenu_prefs", 0
      ));
    }
    // Falls addRestartButton installiert ist, Neustart zur Verfuegung stellen (addRestartButton 1.0.20120105mod erforderlich)
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
  // Betriebssystem nach https://developer.mozilla.org/en/Code_snippets/Miscellaneous ermitteln
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
    var dSep = this.getDirSep();  // die Trennzeichen zwischen Ordnern abhaengig vom Betriebssystem machen

    // --- Pfad-Handling für chrome/scripts/ ---
    if (Filename.includes("/") || Filename.includes("\\")) {
      Path = this.getPrefDirectoryPath("ProfD") + dSep + Filename;
    } else {
      // Original-Logik
      switch (OpenMode) {
        //Current is Chrome Directory
        case 0: Path = this.getPrefDirectoryPath("UChrm") + dSep + Filename; break;
        //Current is Profile Directory
        case 1: Path = this.getPrefDirectoryPath("ProfD") + dSep + Filename; break;
        //Current is Root
        case 2: Path = Filename; break;
        //Current is CSS folder
        case 3: Path = this.getPrefDirectoryPath("UChrm") + dSep + "CSS" + dSep + Filename; break;
        //Current is CSSWeb folder
        case 4: Path = this.getPrefDirectoryPath("UChrm") + dSep + "CSSWeb" + dSep + Filename; break;
        //Current is CSSShadow folder
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
      // Verzeichnis mit anderem Dateimanager oeffnen
      process.run(false, args, args.length);
    } else {
      // Verzeichnis mit Dateimanager des Systems oeffnen
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
    // get profile directory
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
    // falls der im Konfigurationsabschnitt definierte Editor nicht gefunden wird, auf Einstellung in about:config ausweichen:
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
    // Array nimmt Namen der gefundenen Skripte auf
    let ucJsScripts = [];
    // Suchmuster, also die Dateierweiterungen uc.js
    let extjs = /\.uc\.js$/i;

    // --- 1. Standard-UChrm-Ordner durchsuchen (ohne userChromeShadow.uc.js) ---
    let uchrmFolder = Services.dirsvc.get("UChrm", Ci.nsIFile);
    if (uchrmFolder.exists()) {
      // files mit Eintraegen im Chrome-Ordner befuellen
      let files = uchrmFolder.directoryEntries.QueryInterface(Ci.nsISimpleEnumerator);
      // Ordner bzw. files durchlaufen und kontrollieren, ob gesuchte Dateien dabei sind
      while (files.hasMoreElements()) {
        let file = files.getNext().QueryInterface(Ci.nsIFile);
        // uc.js gefunden -> im Array ablegen
        if (extjs.test(file.leafName)) {
          // userChromeShadow.uc.js nur ausblenden, wenn showuCS nicht gesetzt (0) ist
          if (file.leafName === "userChromeShadow.uc.js" && !this.showuCS) {
            continue;
          }
          ucJsScripts.push(file.leafName);
        }
      }
    }

    // --- 2. chrome/scripts-Ordner durchsuchen (falls vorhanden) ---
    let chromeScriptsFolder = Services.dirsvc.get("ProfD", Ci.nsIFile);
    chromeScriptsFolder.append("chrome");
    chromeScriptsFolder.append(this.jsSubfolder);
    if (this.jsSubfolder && chromeScriptsFolder.exists()) {
      // files mit Eintraegen im Scripts-Ordner befuellen
      let files = chromeScriptsFolder.directoryEntries.QueryInterface(Ci.nsISimpleEnumerator);
      // Ordner bzw. files durchlaufen und kontrollieren, ob gesuchte Dateien dabei sind
      while (files.hasMoreElements()) {
        let file = files.getNext().QueryInterface(Ci.nsIFile);
        // uc.js gefunden -> im Array ablegen
        if (extjs.test(file.leafName)) {
          ucJsScripts.push("chrome/" + this.jsSubfolder + "/" + file.leafName); // Pfad-Präfix für spätere Verarbeitung
        }
      }
    }

    if (this.sortScripts) ucJsScripts.sort(this.stringComparison);

    // Aufruf der naechsten Methoden um die beiden Untermenues oder die Zwischenablage zu befuellen
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
    // Array nimmt Namen der gefundenen css-Dateien auf
    let cssFiles = [];
    // Suchmuster, also die Dateierweiterung css
    let extcss = /\.css$/i;
    let aFolder = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsIFile);
    if (iType == 3) aFolder.initWithPath(Services.dirsvc.get("UChrm", Ci.nsIFile).path + this.getDirSep() + "CSS");
    else if (iType == 4) aFolder.initWithPath(Services.dirsvc.get("UChrm", Ci.nsIFile).path + this.getDirSep() + "CSSWeb");
    else if (iType == 5) aFolder.initWithPath(Services.dirsvc.get("UChrm", Ci.nsIFile).path + this.getDirSep() + "CSSShadow");
    // files mit Eintraegen im CSS- bzw. CSSWeb-Ordner befuellen
    let files = aFolder.directoryEntries.QueryInterface(Ci.nsISimpleEnumerator);
    // Ordner bzw. files durchlaufen und kontrollieren, ob gesuchte Dateien dabei sind
    while (files.hasMoreElements()) {
      let file = files.getNext().QueryInterface(Ci.nsIFile);
      // css gefunden -> im Array ablegen
      if (extcss.test(file.leafName)) cssFiles.push(file.leafName);
    }
    if (this.sortScripts) cssFiles.sort(this.stringComparison);
    // Untermenue befuellen
    if (iType == 3) this.fillMenu("submenu-css", "submenu-css-items", "Meine CSS-Dateien", cssFiles, "uProfMenu_css", 3);
    else if (iType == 4) this.fillMenu("submenu-cssweb", "submenu-cssweb-items", "Meine CSSWeb-Dateien", cssFiles, "uProfMenu_css", 4);
    else if (iType == 5) this.fillMenu("submenu-CSSShadow", "submenu-CSSShadow-items", "Meine CSSShadow-Dateien", cssFiles, "uProfMenu_css", 5);
  },

  // --- FILLMENU (ANGEPASST: Closure-Problem gelöst + Event-Handler korrigiert) ---
  fillMenu: function(whichsubmenu, whichsubmenuitems, strlabel, scriptArray, sClass, sTyp) {
    // Beschriftung des Untermenues mit Anzahl der gefundenen Dateien ergaenzen
    var e = document.getElementById(whichsubmenu);
    e.setAttribute('label', strlabel + ' (' + scriptArray.length + ')');
    var popup = document.getElementById(whichsubmenuitems);
    // zunaechst Untermenue zuruecksetzen
    while (popup.hasChildNodes()) popup.removeChild(popup.firstChild);

    var uProfMenu = this; // Für Closure
    // Untermenue endlich befuellen
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

  // --- FILLCLIPBOARDVALUE (changed by Mira) --- ganz neu !!
  fillClipboardValue: function(sArray) {
    var retValue = "Meine Skripte (" + sArray.length + "):\n------------------------";
    for (var i = 0; i < sArray.length; i++) {
      retValue += "\n" + (i + 1) + ". " + sArray[i];
    }
    return retValue;
  },
  
  // --- CREATEME (ANGEPASST: sCommand als Funktion) ---
  createME: function(sTyp, sLabel, sCommand, sClass, sId) {
    // Anlegen von menuitem, menu oder menupop - fuer bestimmte Typen nicht eingesetzte Parameter werden als 0 uebergeben
    const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
    var m = document.createElementNS(XUL_NS, sTyp);
    switch (sTyp) {
      case "menuitem":
        // this.createME("menuitem","Label des Items","ZuzuweisenderCodeFueroncommand","GewuenschteKlasseDesItems",0)
        m.setAttribute('label', sLabel);
        m.setAttribute('class', sClass);
        if (sCommand && typeof sCommand === 'function') {
          m.addEventListener('command', sCommand, true);
        }
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

  // --- OPENATGITHUB (unchanged) ---
  openAtGithub: function(e, sScript) {
    if (e.button == 1) {
      // Mittelklick - Seite auf GitHub oeffnen (funktioniert nur, wenn Ordner- und bereinigter Dateiname [ohne Erweiterung] uebereinstimmen):
      var sUrl = "https://github.com/ardiman/userChrome.js/tree/master/" + this.cleanFileName(sScript);
      openWebLinkIn(sUrl, 'tab');
    }
    if (e.button == 2) {
      // Rechtsklick - Suche auf GitHub starten (funktioniert nur, wenn der Dateiname im Code hinterlegt ist):
      e.preventDefault();
      var sUrl = "https://github.com/search?langOverride=&language=&q=" + sScript + "&repo=&start_value=1&type=Code";
      openWebLinkIn(sUrl, 'tab');
    }
  },

  // --- CLEANFILENAME (unchanged) ---
  cleanFileName: function(sName) {
    /* Das folgende Array enthaelt regulaere Ausdruecke, um ungueltige Zeichenfolgen entfernen:
    /Datei-Erweiterungen am Ende/, /"ucjs_" am Anfang/, /"_"gefolgtVonZahlUndDanachBeliebigenZeichen/
    / "_fx"gefolgtVonZahl(en)/, /"-" oder "+" oder "."/, /"_v"gefolgtVonZahlen
    */
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
