  
  //  open-profilfolder.uc.js
  
  (function() {

       if (location != 'chrome://browser/content/browser.xul') return;
	    
       function buttonFunction() {
          '(new FileUtils.File(OS.Constants.Path.profileDir)).launch();'
       };   

       try {
          CustomizableUI.createWidget({
             id: 'Open-Profile-Folderbutton',
             type: 'custom',
             defaultArea: CustomizableUI.AREA_NAVBAR,
             onBuild: function(aDocument) {         
                var toolbaritem = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
                var props = {
                   id: 'Open-Profile-Folderbutton',
                   class: 'toolbarbutton-1 chromeclass-toolbar-additional',
                   removable: true,
                   label: 'Profilordner öffnen',
                   tooltiptext: 'Profilordner öffnen',
                   style: 'list-style-image: url(data:image/gif;base64,R0lGODlhEAAQAOZMAP/////MAF06AJhlAJNgAP//AP/lAP/UAJViAP/JANShAJRhAP/OAJRgAOy5AMaSAP/nAMyZAP/IAP/NAOazAP/RAMmVALaAAH5TAJNfAM2aAP/dT//XOv/KAOPOkMeRAP/nhOSxAOu4AP3KAOrTkv/nrv//1c6bAKdyAP/TAP/bPdWsMr6LA7iCALqGALiEAJNeAMCMAP/gcv/eYdGdAP/TEP/mgv/2y//gg/3JAP/ila97AP/aKsWPAJFbAJZgALeBAMiVAPC9AP/rOum2AHlQAP/4zP//z//jPpNdAP/LANixNP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAEwALAAAAAAQABAAAAefgEyCg4SFhoeFDQ0LjIiCCyU5IwEBBAiXCAOEBDohFBREIg6jQgibODQKqgonDz0fPkkwDQMEMhYRERpBMUsAv8C1Mw8uLUAXKwA2EgkJDJoEGy8swAAgCZQMz0wEKigkN8wJHZQBFZrcPDsAHErllBMT6AQ1HkYVKQf6++hMGUgAhhgYSBAChH4/TBwpwLAhw35MMAiYSLFiEUcYmQQCADs=)',
                   oncommand: '(new FileUtils.File(OS.Constants.Path.profileDir)).launch();'
                };            
                for (var p in props)
                   toolbaritem.setAttribute(p, props[p]);            
                return toolbaritem;
             }      
          });
       } catch(e) { };
       }) ();