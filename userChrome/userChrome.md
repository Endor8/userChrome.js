### userChrome Verwendung auch in Firefox 57

##### Folgende Dateien werden zur Verwendung von userChrome Scripten benotigt
 
1. config.js
2. userChromeJS.js
3. config-prefs.js
4. userChrome.js

##### Wo müssen die Dateien hin

Die Dateien **config.js** und **userChromeJS.js** müssen in den **Firefox Installationsordner**

Die Dateien **config-prefs.js** muss in den **Firefox Installationsordner\defaults\pref**

#### Wo finde ich den Firefox Installationsordner

unter **C:\Program Files\Mozilla Firefox (bei 64bit)**

oder 
**C:\Program Files (x86)\Mozilla Firefox (bei 32bit)**

oder 
**Portable_Firefox\Firefox** beim portablen Firefox von [hier](https://mozhelp.dynvpn.de/dateien/index.php?path=Programme/)

In den **Profilordner\chrome** gehört die Datei:
**userChrome.js**

**Der Profilordner ist gewöhnlich zu finden unter:**

**%appdata%\Mozilla\Firefox\Profiles\xxx.default** (xxx steht für eine zufällige Zeichenfolge und ist bei jedem anders)
oder
**Portable_Firefox\Profilordner** beim portablen Firefox von [hier](https://mozhelp.dynvpn.de/dateien/index.php?path=Programme/)

#### Inhalt der Dateien:
**config.js**
```js
//
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is the userChrome.js component.
 *
 * The Initial Developer of the Original Code is
 * Simon Bünzli <zeniko@gmail.com>
 *
 * Portions created by the Initial Developer are Copyright (C) 2007
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 * alta88 <alta88@gmail.com>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

try {

/*Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");
*/
Components.utils.import("resource://gre/modules/osfile.jsm");

function UserChrome_js() {
  var os = Components.classes["@mozilla.org/observer-service;1"]
                     .getService(Components.interfaces.nsIObserverService);
  os.addObserver(this, "final-ui-startup", false);
};

UserChrome_js.prototype = {
/*// Properties required for XPCOM registration:
  classDescription: "userChromeJS Loading Component",
  classID         : Components.ID("{8DEB3B5E-7585-4029-B6D0-4733CE8DED50}"),
  contractID      : "@userChromeJS;1",

  _xpcom_categories: [{
    category: "app-startup",
    service: true
  }],
*/
/* ........ QueryInterface .................................................. */
/*
  QueryInterface: XPCOMUtils.generateQI([Components.interfaces.nsISupports,
                                         Components.interfaces.nsIObserver,
                                         Components.interfaces.nsIModule,
                                         Components.interfaces.nsIFactory,
                                         Components.interfaces.nsIDOMEventListener]),
*/
/* ........ nsIObserver ..................................................... */

  observe: function(aSubject, aTopic, aData) {
    var os = Components.classes["@mozilla.org/observer-service;1"]
                       .getService(Components.interfaces.nsIObserverService);

    switch (aTopic) {
/*  case "app-startup":
    case "profile-after-change":
      os.addObserver(this, "final-ui-startup", false);
      break;
*/  case "final-ui-startup":
      var file = Components.classes["@mozilla.org/file/directory_service;1"]
                           .getService(Components.interfaces.nsIProperties)
                           .get("UChrm", Components.interfaces.nsIFile);
      file.append("userChrome.js");
/*
      if (!file.exists()) {
        var componentFile = __LOCATION__;
        var componentsDir = componentFile.parent;
        var extensionDir = componentsDir.parent;
        extensionDir.append("README.txt");
        if (extensionDir.exists())
          extensionDir.copyTo(file.parent, "userChrome.js");
      }
*/
      if (file.exists() && file.isFile() &&
          !Components.classes["@mozilla.org/xre/app-info;1"]
                     .getService(Components.interfaces.nsIXULRuntime)
                     .inSafeMode) {
        this.mFileURL = Components.classes["@mozilla.org/network/io-service;1"]
                                  .getService(Components.interfaces.nsIIOService)
                                  .getProtocolHandler("file")
                                  .QueryInterface(Components.interfaces.nsIFileProtocolHandler)
                                  .getURLSpecFromFile(file);
        var path = OS.Constants.Path.libDir;
        path = OS.Path.join(path, "userChromeJS.js");
        this.uCFileURI = OS.Path.toFileURI(path);

        os.addObserver(this, "domwindowopened", false);
      }
      break;
    case "domwindowopened":
      aSubject.addEventListener("load", this, true);
      break;
    }
  },

/* ........ nsIDOMEventListener ............................................. */

  handleEvent: function(aEvent) {
    var document = aEvent.originalTarget;
    if (document.location && document.location.protocol == "chrome:") {
      try {
        let loader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"]
                               .getService(Components.interfaces.mozIJSSubScriptLoader);
/*
        loader.loadSubScript("chrome://userChromeJS/content/userChromeJS.js",
                             document.defaultView,
                             "UTF-8");
*/
        loader.loadSubScript(this.uCFileURI,
                             document.defaultView,
                             "UTF-8");

        loader.loadSubScript(this.mFileURL,
                             document.defaultView,
                             "UTF-8");
      }
      catch (ex) {
        // script execution can be stopped with |throw "stop";|
        if (ex !== "stop") {
          Components.utils.reportError(ex);
        }
      }
    }
  }

};

/**
 * The following line is what XPCOM uses to create components. Each component
 * prototype must have a .classID which is used to create it.
 *
 * XPCOMUtils.generateNSGetFactory was introduced in Mozilla 2 (Firefox 4).
 */
/*var NSGetFactory = XPCOMUtils.generateNSGetFactory([UserChrome_js]);
*/
new UserChrome_js();

} catch(ex) {
  Components.utils.reportError(ex);
};

```

**userChromeJS.js**
```js
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is the userChromeJS utilities.
 *
 * The Initial Developer of the Original Code is
 * alta88 <alta88@gmail.com>
 *
 * Portions created by the Initial Developer are Copyright (C) 2014
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

var EXPORTED_SYMBOLS = ["userChrome"];

/* ........ Utility functions ............................................... */

var userChrome = {
  path: null,
  dirToken: null,

  get loadOverlayDelay () {
    if (!this._loadOverlayDelay)
      this._loadOverlayDelay = 500;
    return this._loadOverlayDelay;
  },

  set loadOverlayDelay(delay) {
    this._loadOverlayDelay = delay;
  },

  get loadOverlayDelayIncr() {
    if (!this._loadOverlayDelayIncr)
      this._loadOverlayDelayIncr = 1600;
    return this._loadOverlayDelayIncr;
  },

  set loadOverlayDelayIncr(delay) {
    this._loadOverlayDelayIncr = delay;
  },

  import: function(aPath, aRelDirToken) {
    let file;
    this.path = aPath;
    this.dirToken = aRelDirToken;

    if (aRelDirToken) {
      // Relative file
      let absDir = this.getAbsoluteFile(aRelDirToken);
      if (!absDir)
        return;
      let pathSep = absDir.path.match(/[\/\\]/)[0];
      file = absDir.path + (aPath == "*" ?
          "" : pathSep + aPath.replace(/[\/\\]/g, pathSep));
    }
    else
      // Absolute file
      file = aPath;

    file = this.getFile(file);
    if (!file)
      return;
    if (file.isFile()) {
      if (/\.js$/i.test(file.leafName))
        this.loadScript(file, aRelDirToken, null);
      else if (/\.xul$/i.test(file.leafName)) {
        let xul_files = [];
        xul_files.push(file);
        this.loadOverlay(xul_files, this.dirToken, null, this.loadOverlayDelay);
//        this.loadOverlayDelay = this.loadOverlayDelay + this.loadOverlayDelayIncr;
      }
      else
        this.log("File '" + this.path +
                 "' does not have a valid .js or .xul extension.", "userChrome.import");
    }
    else if (file.isDirectory())
      this.importFolder(file);
    else
      this.log("File '" + this.path +
               "' is neither a file nor a directory.", "userChrome.import");
  },

  loadScript: function(aFile, aFolder, aRelDirToken) {
    setTimeout(function() {
      Components.classes["@mozilla.org/moz/jssubscript-loader;1"]
                .getService(Components.interfaces.mozIJSSubScriptLoader)
                .loadSubScript(userChrome.getURLSpecFromFile(aFile),
                               null, // defaults to the global object of the caller.
                               userChrome.charSet);
      // log it
      userChrome.log(aRelDirToken ? ("[" + aRelDirToken + "]/" +
          (aFolder && aFolder != "*" ? aFolder + "/" : "") + aFile.leafName) :
          aFile.path, "userChrome.loadScript");
    }, 0);
  },

  // XXX: Due to bug 330458, an overlay must finish before another can be
  // called, otherwise neither are successful.  Implementing an observer to
  // serialize is better left as a fix in the core bug.  Here, settimout values
  // are set to minimize but there is no quarantee; overlay cdata (if any)
  // needs to consider overlay completions and logging does not strictly mean
  // an overlay has completed, rather that the overlay file has been invoked.
  loadOverlay: function(aFiles, aRelDirToken, aFolder, aDelay) {
//userChrome.log(aDelay+" multiple import delay", userChrome.loadOverlay);
    // Increment multiple import delay
    this.loadOverlayDelay = this.loadOverlayDelay + this.loadOverlayDelayIncr;
    setTimeout(function() {
      if (aFiles.length > 0) {
//userChrome.log(userChrome.loadOverlayDelay+" inter folder delay", userChrome.loadOverlay);
        // log it
        userChrome.log(aRelDirToken ? ("[" + aRelDirToken + "]/" +
            (aFolder && aFolder != "*" ? aFolder + "/" : "") + aFiles[0].leafName) :
            aFiles[0].path, "userChrome.loadOverlay");
        document.loadOverlay(userChrome.getURLSpecFromFile(aFiles.shift()), null);
        setTimeout(arguments.callee, userChrome.loadOverlayDelay);
      }
    }, aDelay);
  },

  // Include all files ending in .js and .xul from passed folder
  importFolder: function(aFolder) {
    let files = aFolder.directoryEntries
                       .QueryInterface(Components.interfaces.nsISimpleEnumerator);
    let xul_files = [];

    while (files.hasMoreElements()) {
      let file = files.getNext().QueryInterface(Components.interfaces.nsIFile);
      if (/\.js$/i.test(file.leafName) && file.leafName != "userChrome.js")
        this.loadScript(file, this.path, this.dirToken);
      else if (/\.xul$/i.test(file.leafName)) {
        xul_files.push(file);
      }
    }

    if (xul_files.length > 0)
      this.loadOverlay(xul_files, this.dirToken, this.path);
  },

  getFile: function(aPath, aRelDirToken) {
      try {
        let file = Components.classes["@mozilla.org/file/local;1"]
                             .createInstance(Components.interfaces.nsIFile);
        file.initWithPath(aPath);
        // Bad file doesn't throw on initWithPath, need to test
        if (file.exists())
          return file;
        this.log("Invalid file '" + this.path + (this.dirToken ?
            ("' or file not found in directory with token '" + this.dirToken) :
            "") + "' or other access error.", "userChrome.getFile");
      }
      catch (e) {
        // Bad folder throws on initWithPath
        this.log("Invalid folder '" + this.path + (this.dirToken ?
            ("' or folder not found in directory with token '" + this.dirToken) :
            "") + "' or other access error.", "userChrome.getFile");
      }

    return null;
  },

  getAbsoluteFile: function(aRelDirToken) {
    try {
      let absDir = Components.classes["@mozilla.org/file/directory_service;1"]
                             .getService(Components.interfaces.nsIProperties)
                             .get(aRelDirToken, Components.interfaces.nsIFile);
      return absDir;
    }
    catch (e) {
      this.log("Invalid directory name token '" + this.dirToken +
               "' or directory cannot be accessed.", "userChrome.getAbsoluteFile");
      return null;
    }
  },

  getURLSpecFromFile: Components.classes["@mozilla.org/network/io-service;1"]
                                .getService(Components.interfaces.nsIIOService)
                                .getProtocolHandler("file")
                                .QueryInterface(Components.interfaces.nsIFileProtocolHandler)
                                .getURLSpecFromFile,

  /* Console logger */
  log: function(aMsg, aCaller) {
    Components.classes["@mozilla.org/consoleservice;1"]
              .getService(Components.interfaces.nsIConsoleService)
              .logStringMessage(this.date + " userChromeJS " +
                                (aCaller ? aCaller +": " : "") + aMsg);
  },

  get dateFormat() {
    if (!this._dateFormat)
      this._dateFormat = "%Y-%m-%d %H:%M:%S";
    return this._dateFormat;
  },

  set dateFormat(format) {
    this._dateFormat = format;
  },

  get date() {
    let date = new Date();
    return date.toLocaleFormat(this.dateFormat);
  },

  set charSet(val) {
    this._charSet = val;
  },

  get charSet() {
    if (!this._charSet)
      this._charSet = "UTF-8"; // use "UTF-8". defaults to ascii if null.
    return this._charSet;
  }

};

```
**config-prefs.js**
```js
pref("general.config.obscure_value", 0);
pref("general.config.filename", "config.js");
```

**userChrome.js**
```js
userChrome.import("*", "UChrm");
```

###### Alle 4 Dateien sind hier auch zum Runterladen verfügbar:
(https://github.com/Endor8/userChrome.js/tree/master/userChrome)
