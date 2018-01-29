// buttonCloseTab.uc.js - Button > Firefox Tabs schliessen
(function() {
	if (location != 'chrome://browser/content/browser.xul')
      return;

try {
	Components.utils.import("resource:///modules/CustomizableUI.jsm");
	CustomizableUI.createWidget({
		id: "fp-closetab",
		defaultArea: CustomizableUI.AREA_NAVBAR,
		removable: true,
		label: "Aktuellen Tab schließen",
		tooltiptext: "Aktuellen Tab schließen",
		onClick: function() {
			BrowserCloseTabOrWindow();
		},
		onCreated: function(aNode) {
			aNode.style.listStyleImage = 'url(\'data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 16 16"><path fill="currentColor" fill-opacity="context-fill-opacity" d="M9.414 8l5.293-5.293a1 1 0 0 0-1.414-1.414L8 6.586 2.707 1.293a1 1 0 0 0-1.414 1.414L6.586 8l-5.293 5.293a1 1 0 1 0 1.414 1.414L8 9.414l5.293 5.293a1 1 0 0 0 1.414-1.414z"></path></svg>\')';
			return aNode;
		}
	});
} catch (e) {
	Components.utils.reportError(e);
};

})();