    //      OpenDownloadFolderButtonM.uc.js

    (function() {

       if (location != 'chrome://browser/content/browser.xul') return;   
       
       DownloadFolderToolbarButton = {

          onToolbarButtonCommand: function(e) {
             DownloadFolderToolbarButton.openDownloadFolder();
          },
       
          openDownloadFolder: function() {
             var pref = Components.classes["@mozilla.org/preferences-service;1"].
                getService(Components.interfaces.nsIPrefBranch);         
             var dirService = Components.classes["@mozilla.org/file/directory_service;1"].
                getService(Components.interfaces.nsIProperties);   
             
             if (pref.getBoolPref("browser.download.useDownloadDir")) {
                // Firefox is going to check where to save by file according to the folderList
                switch (pref.getIntPref("browser.download.folderList")) {
                   case 0: // the desktop
                      var desktop = dirService.get("Desk", Components.interfaces.nsIFile);
                      folder = desktop;
                      break;
                   case 1: // the downloads folder
                      var dm = Components.classes["@mozilla.org/download-manager;1"].
                         getService(Components.interfaces.nsIDownloadManager);
                      folder = dm.userDownloadsDirectory;               
                      break;
                   case 2: // the last folder specified for a download
                      folder = pref.getComplexValue("browser.download.dir", Components.interfaces.
                         nsIFile);
                      break;
                }
             
             } else {
                // Users are manually pointing out a directory to save to
                folder = pref.getComplexValue("browser.download.lastDir", Components.interfaces.
                   nsIFile);
             };
             
             if (folder) {
                try {
                   folder.reveal();
                } catch (ex) {
                   // if nsILocalFile::Reveal failed (eg it currently just returns an
                   // error on unix), just open the folder in a browser window
                   alert(ex);
                }
             } else {
                alert("Ordner kann nicht geöffnet werden!");
             }
          }
       };

       try {
          CustomizableUI.createWidget({
             id: 'downloadfolder-toolbar-button',
             type: 'custom',
             defaultArea: CustomizableUI.AREA_MENUBAR,
             onBuild: function(aDocument) {         
                var toolbaritem = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
                var props = {
                   id: 'downloadfolder-toolbar-button',
                   class: 'toolbarbutton-1 chromeclass-toolbar-additional',
                   removable: true,
                   label: 'Open download folder',
                   tooltiptext: 'Download Ordner öffnen',
                   style: 'list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAA7DAAAOwwHHb6hkAAACgUlEQVR4nNVTS08TURg9d+6ddqYtM6WdlqGdaekLTKyRiBogxIgRN8YQ3KgL458wrnHlxn/gjqUYV25cEdGdhMQQH20REh4FBZQ2lE7beXiLLI0bV97k3Pttzvc457vAf39I9xoApLGrEy+y+aznedB101AoFWSZQdD0uPOtuk/yQ0OWQIWNpmVV176U9xYeP3k0Dzism2DsyuidyamJm/F+HRvrZTT2VpDWA4iG44j2SMiMxFCzDhHRs4UzxQto3biO79Xthflnc6+EboJcLnVtqGDia+kDksEahgc1pFIGIrE4/EEFUkBFyjShhQNYrZTgl2UMj45Ndbm/EwzEi2kjDMdpQlVkhNRe+APKKdQTSKdx23YAD+g3kuNdLn099zCoStJTI6mxlJHA4lIZmhaF2qtBCoZ5B5zMAVFGaW0Tg4UMKKPw+Vi09mn1OZ2+fP5BJpuYkXwEkkgwfLYAQQxgpbKN2pGFH7UjbG5VEVN8SCdioAKF5zqQJR/b261uMtv2bkUiPaemeHCdDheOYXIkC4GKIBwCZfztoH18AMGq85jbI4hIGLFx9n75Y+ZzubLfsmxfLpck/LiMsQYRyInHnusy1+WFeeXq7k/RNPssx+nUDw7qtN1x8mziklGoLC1KOp9ZYT2I6lx93VS1RBpRI4u3b97BbjdgtxrQsyZsq6Z0jq24GHKxtX64SJ1mu3j3/r1iXzoPLZGBGtMRCKmQFQVUUrgObTAmgol+3o3Nh/R4+wIsYmOrtLNMZi6em5YDzduEMNFzWnEukPz33SVtgck7nmd3msfyy5NVnp2d5e4jBEpVx/MUELf/j2RP2KGE1PnC1JrAEefV//ErAb8ArurYhq3m6u4AAAAASUVORK5CYII=)',
                   oncommand: 'DownloadFolderToolbarButton.onToolbarButtonCommand()'
                };            
                for (var p in props)
                   toolbaritem.setAttribute(p, props[p]);            
                return toolbaritem;
             }      
          });
       } catch(e) { };
	   
	   setTimeout(function() {      
          var extApps = document.getElementById('menubar-items').nextSibling;
          var dlfButton = document.getElementById('downloadfolder-toolbar-button');
          var rstButton = document.getElementById('restart-button');
          extApps.parentElement.insertBefore(rstButton, extApps);
          extApps.parentElement.insertBefore(dlfButton, rstButton);
       }, 100);

    }) ();

