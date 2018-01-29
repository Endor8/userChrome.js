  
  //  about-plugins-button.uc.js
  
  (function() {

   if (location != 'chrome://browser/content/browser.xul') return;
	
	try {
		CustomizableUI.createWidget({
			id: 'aboutplugins-ToolBarButton',
			type: 'custom',
			defaultArea: CustomizableUI.AREA_NAVBAR,
			onBuild: function(aDocument) {			
				var toolbaritem = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
				var props = {
					id: 'aboutplugins-ToolBarButton',
					class: 'toolbarbutton-1 chromeclass-toolbar-additional',
					label: 'About:Plugins',
					tooltiptext: 'About:Plugins öffnen',
					style: 'list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAC/0lEQVR4XnXPXWwUVRjG8f85M7N22e52+WitFZspha2IYjVbatVEK02xQiDaGExJxQjohdrAhd+FK0yM12gMkTTGKtoQlMQYNCGtGFBCRW5QkVYpxBbb7Rfbj9kzZ85oZC/WJv6SJ+/V8+Z9xe79Pye07x2dnxn/wp+dPyADC7IaAxGtgpXCMldzvsp6yiOX81BaUUjG4okH44lojZkzX3rX5jBTGt83dzuO3VW9uvxkCIeMMUv4H9KJOPFFsUg8EsitQogOE5rOmrtuObntuYa21vb6pY9srH1SStmjfV2OYCHEC6/2l6DnPy8vizdOj05SV1dJw8NVaAOeB2EIZ89c5dhnfWenpq63G4KLFJAD/f3TV34bPJX5a4Itj9/Bhs1VEILRQAg6gNr0bbTteKyuvGJZt/aDCgrI4liCIqso2dLkcl9DKb4HUoDIBwFaQ/WqpbTt3JR2q5cfM8a45EkhxPqm5pXPNz/q4uUACdICW4Al81OAp2G5G6Nl071ppYKtQSj5J8hksujlLU/UOOQ58kZRWCAlCAmhBcXXfyD1xys43uUwxM4WOzPE7FlkICglGsMYsCUI8d8XhAUlYoLUpWeJjnfhXtg1s3vthwNfNb3B0cZOpJdT3uUhGMnky9aNkm2BZcPiOLhVJfwylyYbJKlrScSfqjn/FoYVUTtAjo2Ov9nzUe/wtbGA6VmQ5C+REA9HKYmFfNA9yPaPW7uHf8y8RGZ8lnX3p4naJwhYI8Mw7Dv93bmNXQe/GRweUeQ0SBtiF99h8elmzh18kd7D77+74ebDu5KL1AF+/bOdod8zJBMuIWWiaf17KJ3DV8HqO9eu+KRjT0vt7ambsI7Uw5IZspmAyfNX9laWevtRQAgE1CMoQ/L1vwt8rQBQSlesSt3a/cyOhxq/P358Zltkz1Dl5nvWMDEGZy68DexFoCkgKRCJ2MMDl0Za973+6aEjvXaHmuMBTvT1ULwMUu5rGLazgM0CjiMngZ3SVwgbUDzNt6c8ovY6LH5igb8BucA1WORtKKUAAAAASUVORK5CYII=)',
					onclick: 'if (event.button == 0) { \
										openUILinkIn("about:plugins", "tab");\
								 }; '
				};
				for (var p in props)
					toolbaritem.setAttribute(p, props[p]);
				return toolbaritem;
			}
		});
	} catch(e) { };
   
})();