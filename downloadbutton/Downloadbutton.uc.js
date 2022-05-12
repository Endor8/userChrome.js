//  Downloadbutton.uc.js

(function() {

  if (window.__SSi != 'window0')
    return;

  CustomizableUI.createWidget({
    id: 'Download-button',
    type: 'custom',
    defaultArea: CustomizableUI.AREA_NAVBAR,
    onBuild: function(aDocument) {
      var toolbaritem = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
      var props = {
        id: 'Download-button',
        class: 'toolbarbutton-1 chromeclass-toolbar-additional',
        removable: true,
        label: 'Download Fenster öffnen',
        accesskey: 'D',
        tooltiptext: 'Download Fenster öffnen',
        style: 'list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAFo9M/3AAAACXBIWXMAAAsTAAALEwEAmpwYAAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAC7klEQVR42mJgAIL3K2X+AwQQy9VMzf+cIooMAAHE8H6i2n+QKEAAsbCrSjJ8vST4HyCAQByG13Mc/n+/D5EBCCAWsMByBQa2bz/BkgABxAAz5f1aYbAKgAACo6+XJP///OQFFgAIIJbvd23//z/NyPD/NQPDg8uS/wECiIlT+TDjr5/sDK9ZrjMo6D5nBAgguLYPC13/f7nN+v/bQ7H/P77awM0DCCAWGOPLp58MfE80GFiE+RiYOCXhGgECiAlE3PZI/i8iL8bAchMocV2C4d/+fwyPj2qBTQEIIBR02S7+/4N1AigSAAHECPcLyB9/OBkY/rMxMLxkYRDMvwWWAwggJpgCDidZBlazzwzsVg8ZGAXU4SYABBDckYy/2BmYvgsyMLLxMPz+g7AFIIAQCr6zA+0B+oCLn+HHV0Q4AgQQ48MTUv8FvwszsLwUhHhLlIeBkQ+oT+IXw8Pa3wwAAcQkb/GM8f2fbwwMr4CO+8ABDBABBua3wgzP8qQY1BbsZQQIILAj5V3vMj6Tv8Dw8/VbBqZ/nxjuT2BiUFw/D+wLgABCQXeX8v+/5pyAEg4AAYSh6v0il/+cMeIM/9+/YGBgZmNgZOSGKOSTYvi25A6DYOw2FD0AAcSCbsCfX38Y/n+4x/D37R0GZiY2hn/sQN//+8LAzGgClGPCcBVAAGEa8O8/A9MnVoZ/77gZ/gH5zHwCDP//czAwcnID5T5jGAAQQCx3o0L/s/znBXP+/fvD8E/sGgPjJ14GxrdCDAxszMBwBQYrAz8DAx8TA7P8d4anaXH/mf8yMfz/y87w6/9zBoAAYoSlJrbiAwzi7wwY/r38CNSIcCqTFB+E/wvonu//GVj4+Rie855k+NtjzaCwfjYjQAChBMhNt5T/7IV7GaTf6jD8fAZx7h9xXgZ2RmYGVjFBsMYfzZYMqjvmwvUBBBBWBIqqW2t5/n+eo/X/6zKj//d38v4HuRKbWoAAwouOher8Pxmtg1cjQIABAFbt8Z32Ai5RAAAAAElFTkSuQmCC)',
        oncommand: "window.open('chrome://browser/content/downloads/contentAreaDownloadsView.xhtml', 'Downloads', 'chrome,resizable=yes,width=600,height=750,left=1220,top=100');"
      };
      for (var p in props)
        toolbaritem.setAttribute(p, props[p]);
      return toolbaritem;
    }
  });

  Downloads.getList(Downloads.ALL)
    .then(list => list.addView({
      onDownloadAdded: () =>
        Services.wm.getMostRecentBrowserWindow().document.getElementById('Download-button').click()
    }));

})();
