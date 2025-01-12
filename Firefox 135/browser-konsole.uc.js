//  browserkonsole.uc.js

(function() {

    if (location != 'chrome://browser/content/browser.xhtml')
        return;

    try {
        CustomizableUI.createWidget({
            id: 'browser-konsole-button',
            type: 'custom',
            defaultArea: CustomizableUI.AREA_NAVBAR,
            onBuild: function(aDocument) {
                var toolbaritem = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
                var props = {
                    id: 'browser-konsole-button',
                    class: 'toolbarbutton-1 chromeclass-toolbar-additional',
                    label: 'Browser-Konsole',
                    tooltiptext: 'Browser-Konsole öffnen',
                    style: 'list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAADaSURBVHjaYvz//z8DJYAJn+SFuYy+IEyWAUCN0/iEGDaBMIhNkgFQDZlK2gwMIAxi4zIElwsyDWwRHCg7kygD8DkXmxwTVtsdeBgYmFExWAyLK5iw2sAqCMZZvbEMAcXOcD42VzBh2O5lBFQsCsbPnz9nePLkCZwPlkNzBROm7SJw/PjxY4YfP36giKG7ghGWEoGC/w2Cw4lKfRfWrmQwSP7PCHcB3ES0gNO2vsyganoWQxxZD9gFYNvDkknKAxdWzQW7gomBQsACpacDTcwkUe90lEAkFwAEGACHlFPNBrHqNAAAAABJRU5ErkJggg==)',			   
                };
                for (var p in props)
                    toolbaritem.setAttribute(p, props[p]);
					toolbaritem.addEventListener('command', event => {				   
					document.getElementById("menu_browserConsole").click();
			   });
                return toolbaritem;
            }
        });
        CustomizableUI.registerToolbarNode(tb);
       } catch(e) { };  

    function onCommand() {
        var document = event.target.ownerDocument;
        if (!document.getElementById('menu_browserConsole')) {
            let { require } = ChromeUtils.importESModule("resource://devtools/shared/loader/Loader.sys.mjs", {});
            require("resource://devtools/client/webconsole/browser-console-manager");
        };
        document.getElementById('menu_browserConsole').click();
    };

})();