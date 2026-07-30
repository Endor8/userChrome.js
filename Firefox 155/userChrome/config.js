// config.js

try {
  Cu.importGlobalProperties(['PathUtils']);

  if (!Services.appinfo.inSafeMode) {
    let path = PathUtils.parent(PathUtils.xulLibraryPath);
    if (Services.appinfo.OS == 'Darwin') { // macOS
      path = PathUtils.join(PathUtils.parent(path), 'Resources');
    }
    var ucjsDirPath = PathUtils.join(path, 'userChromeJS');
    path = PathUtils.join(ucjsDirPath, 'main.js');
    const mainFileURI = PathUtils.toFileURI(path);
    /* Services.scriptloader.loadSubScript(mainFileURI, this, 'UTF-8'); */
	Services.scriptloader.loadSubScriptWithOptions(mainFileURI, {
  target: this,
  charset: 'UTF-8',
  allowUnsafeURL: true
});

  }
}
catch(e) {
  Cu.reportError(e);
}