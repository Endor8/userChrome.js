  (function() {
	if (location != 'chrome://browser/content/browser.xhtml')
      return;

	try {
		ChromeUtils.importESModule("resource:///modules/CustomizableUI.sys.mjs");
		CustomizableUI.createWidget({
			id: "Open-Profile-Folderbutton",
			defaultArea: CustomizableUI.AREA_NAVBAR,
			removable: true,
			label: "Profilordner öffen",
			tooltiptext: "Open-Profile-Folderbutton",
			onClick: function() {
			
				var dir = Services.dirsvc.get('ProfD', Ci.nsIFile);
				dir.launch();
	
			},
			onCreated: function(aNode) {
				aNode.style.listStyleImage = 'url(data:image/gif;base64,R0lGODlhEAAQAOZMAP/////MAF06AJhlAJNgAP//AP/lAP/UAJViAP/JANShAJRhAP/OAJRgAOy5AMaSAP/nAMyZAP/IAP/NAOazAP/RAMmVALaAAH5TAJNfAM2aAP/dT//XOv/KAOPOkMeRAP/nhOSxAOu4AP3KAOrTkv/nrv//1c6bAKdyAP/TAP/bPdWsMr6LA7iCALqGALiEAJNeAMCMAP/gcv/eYdGdAP/TEP/mgv/2y//gg/3JAP/ila97AP/aKsWPAJFbAJZgALeBAMiVAPC9AP/rOum2AHlQAP/4zP//z//jPpNdAP/LANixNP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAEwALAAAAAAQABAAAAefgEyCg4SFhoeFDQ0LjIiCCyU5IwEBBAiXCAOEBDohFBREIg6jQgibODQKqgonDz0fPkkwDQMEMhYRERpBMUsAv8C1Mw8uLUAXKwA2EgkJDJoEGy8swAAgCZQMz0wEKigkN8wJHZQBFZrcPDsAHErllBMT6AQ1HkYVKQf6++hMGUgAhhgYSBAChH4/TBwpwLAhw35MMAiYSLFiEUcYmQQCADs=)';
				return aNode;
			}
		});
	} catch (e) {
		Components.utils.reportError(e);
	};

})();
