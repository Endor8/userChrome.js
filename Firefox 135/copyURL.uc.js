// copyURL.js
// Button in the url-bar for “copy url-bar link”
(async (url, pa = ChromeUtils.importESModule(url).PageActions) => pa.addAction(new pa.Action({
   title: "Copy link",
   tooltip: "Copy link",
   iconURL: "chrome://global/skin/icons/link.svg",
   id: "copyURL",
   pinnedToUrlbar: true,
   onCommand(e) {
       var MozXULElement = {insertFTLIfNeeded() {}};
       var document = {l10n: {setAttributes: msg => msg.textContent = "Copy to clipboard!"}};
       var show = eval(`(function ${e.view.ConfirmationHint.show})`);
       var helper = Cc["@mozilla.org/widget/clipboardhelper;1"].getService(Ci.nsIClipboardHelper);
       (this.onCommand = e => {
           var win = e.view;
           var uri = win.gBrowser.selectedBrowser.currentURI;
           helper.copyString(win.gURLBar.makeURIReadable(uri).displaySpec);
           var anchor = win.BrowserPageActions.panelAnchorNodeForAction(this, e);
           show.call(win.ConfirmationHint, anchor, "", {event: e, hideArrow: true});
       })(e);
   }
})))("resource:///modules/PageActions.sys.mjs");
