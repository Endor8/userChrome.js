(function() {
   if (location != 'chrome://browser/content/browser.xul')
      return;

   try {
      CustomizableUI.createWidget({
         id: 'ucjs_PanelUI-menu-button',
         type: 'custom',
         defaultArea: CustomizableUI.AREA_NAVBAR,
         onBuild: function(aDocument) {
            var button = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
            var attributes = {
               id: 'ucjs_PanelUI-menu-button',
               class: 'toolbarbutton-1 chromeclass-toolbar-additional',
               type: 'menu',
               removable: 'true',
               label: 'Firefox Anpassen',
               tooltiptext: 'Firefox Anpassen + Panel',
               onclick: 'if (event.button == 0) event.target.ownerGlobal.PanelUI.toggle(event)',
               style: 'list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAJElEQVQ4jWNgGEzgAgMDw38i8XlKDbhAO38MKBgNRCqAkRqIANHrRYKU+i0FAAAAAElFTkSuQmCC)'
            };
            for (var a in attributes) {
               button.setAttribute(a, attributes[a]);
            };
            return button;
         }
      });

      var css = '\
         @-moz-document url("chrome://browser/content/browser.xul") { \
            #PanelUI-button {display: none} \
            #ucjs_PanelUI-menu-button > dropmarker {display: none}\
         }';
      var uri = makeURI('data:text/css,' + encodeURIComponent(css));
      var SSS = Cc['@mozilla.org/content/style-sheet-service;1'].getService(Ci.nsIStyleSheetService);
      SSS.loadAndRegisterSheet(uri, SSS.AUTHOR_SHEET);

   } catch(e) { };

}());
