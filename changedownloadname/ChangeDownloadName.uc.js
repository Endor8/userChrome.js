// ==UserScript==
// @include chrome://mozapps/content/downloads/unknownContentType.xul
// ==/UserScript==
(function () {
        if (location != "chrome://mozapps/content/downloads/unknownContentType.xul") return;
        document.querySelector("#mode").addEventListener("select", function () {
                if (dialog.dialogElement("save").selected) {
                        if (!document.querySelector("#locationtext")) {
                                var locationtext = document.querySelector("#location").parentNode.insertBefore(document.createElement("textbox"), document.querySelector("#location"));
                                locationtext.id = "locationtext";
                                locationtext.setAttribute("style", "margin-top:-2px;margin-bottom:-3px");
                                locationtext.value = document.querySelector("#location").value;
                        }
                        document.querySelector("#location").hidden = true;
                        document.querySelector("#locationtext").hidden = false;
                } else {
                        document.querySelector("#locationtext").hidden = true;
                        document.querySelector("#location").hidden = false;
                }
        }, false)
        dialog.dialogElement("save").click();
        window.addEventListener("dialogaccept", function () {
                if ((document.querySelector("#locationtext").value != document.querySelector("#location").value) && dialog.dialogElement("save").selected) {
                        var mainwin = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator).getMostRecentWindow("navigator:browser");
                        mainwin.eval("(" + mainwin.internalSave.toString().replace("let ", "").replace("var fpParams", "fileInfo.fileExt=null;fileInfo.fileName=aDefaultFileName;var fpParams") + ")")(dialog.mLauncher.source.asciiSpec, null, document.querySelector("#locationtext").value, null, null, null, null, null, null, mainwin.document, Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch).getBoolPref("browser.download.useDownloadDir"), null);
                        document.documentElement.removeAttribute("ondialogaccept");
                }
        }, false);
})()
