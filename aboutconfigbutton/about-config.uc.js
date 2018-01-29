  
  //  aboutconfig-button.uc.js
  
  (function() {

   if (location != 'chrome://browser/content/browser.xul') return;
	
	try {
		CustomizableUI.createWidget({
			id: 'aboutconfig-ToolBarButton',
			type: 'custom',
			defaultArea: CustomizableUI.AREA_NAVBAR,
			onBuild: function(aDocument) {			
				var toolbaritem = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
				var props = {
					id: 'aboutconfig-ToolBarButton',
					class: 'toolbarbutton-1 chromeclass-toolbar-additional',
					label: 'About:Config',
					tooltiptext: 'About:Config',
					style: 'list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAABmJLR0QA%2FwD%2FAP%2BgvaeTAAAACXBIWXMAACcPAAAnDwGrs%2B%2FJAAAAB3RJTUUH1AwRDyUGYuIbjQAAAwRJREFUOMuFkV1rWwUAhp%2BTnnNyPpOsbjVZsSC6sVHY1hXZ1RiIon%2FAC7%2BmF16Jv2RjwnDTXfiBoHUoanQLrDpvhMKgiHajq7NN89E0aU6bpM35zDnJOV5YpmMXPnfvzcPL%2BwoAFy9%2BPh4nPB3HcT6Oh4U4Jm%2FoSkHTtbyiyAVZlvOSLOYdx3V%2BujX%2F2tzc1dvsI1y%2B%2FNV7x6afeT%2BbMSVFVdDUNIqiMIpHhGFEGIYMwoixVIqG43Ll65uN%2B1370nZ57Vqw8E0g3Cgt9E%2FNHDdr9SbBICQMI6IoIkl4hPstC236CAefyLO49CfFYrFU%2B%2FLSK6m0LJqO4xEEIfVala3WJrqmYegaVrvJtSsXWL67SM12mDhUwB9EjOKEzPihl0mNnUulhARVkdF0jbkvPuZW6XsUJY2ma%2Bz2djhz5jQvvXiWqYkD%2FHZvlXsra1TrG3St1oB4NC4igKKkMXQDSRRRNQ1VVZEkGV03mDlxhEqlwrBapqNO8nt9i85W02%2F%2FemMBuCNG0RAhJaLrGrphYJomuq4hSTJpWeKTTz%2Fj2PGTvHH%2BHXIZgzfPv11bunn9AjAPrIuDcISQGkPXVQQgk8lgGBqiKJHNZZl4cpITJ2cwDB0vCEmGowgoAk2AVBAMIIkxNYmppw7T2Wkhjf2TTT1NLmOQyyiYmoTtOAxHw0feET0%2FIApD5GyaQiHP7Ows3%2F7wHTsHpqh3XTpDjeclEVkWsPsuw%2BFjAh%2FH9TBNheXlFYIgoDc5zQtnn%2BOw5bGo6hSXNzl9KqJvO48LfM%2FHdnyyXsirr7%2BF67r8aEW0dny6uzau51Hd3KbXc%2Bh0domiMAGSfwV%2BgG17eEHEs0enASgVb7P4xwq247Be3eBgHDH%2Fyx3Kq38l9Vp5A%2FAfClzPGz5YrYjt7Q6eH%2BC6HnnX5uelu%2FQTkqDd9MWg53xQut5rtxtrltX4ENh7KKitlz9ybOdd294Lt62mY7Wbvf5et9Xv71Z6PetBGA7WK1Dfv60DuP%2FdQABk4ByQAxrAJtDdrznif%2FgbTgGEQikOjI8AAAAASUVORK5CYII%3D)',
					onclick: 'if (event.button == 0) { \
										openUILinkIn("about:config", "tab");\
								 }; '
				};
				for (var p in props)
					toolbaritem.setAttribute(p, props[p]);
				return toolbaritem;
			}
		});
	} catch(e) { };
   
})();
