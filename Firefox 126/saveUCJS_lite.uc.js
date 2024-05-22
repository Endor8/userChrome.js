// ==UserScript==
// @name        saveUCJS_lite.uc.js
// @description GitHub Scripte Downloaden und Installieren
// @charset	UTF-8
// @include     main
// @note	userChrome.js Update-Funktion entfernen
// ==/UserScript==
(function(){
	"use strict";
//  config Anfang true = ja  / false = nein
	const skipDialogCxt = true // Speichern Dialog nicht anzeigen - übergehen
	const urgeRestart = true   // Firefox Neustarten Aufforderung nach dem Runterladen anzeigen
//	config Ende
	const areaMenu = document.getElementById('contentAreaContextMenu');
	const saveLink = document.getElementById('context-savelink');
	const github = 'https://github.com/';
	const sep = navigator.platform.indexOf('Win') != -1? '\\' : '/';
	
	
	areaMenu.addEventListener('popupshowing', function(){
		const _areaMenu = document.getElementById('ucjs_getUCJS_areamenu');
		if(_areaMenu) this.removeChild(_areaMenu);
		if(!gBrowser.currentURI.spec.startsWith(github)) return;
		if((gBrowser.currentURI.spec + gContextMenu.linkURL).indexOf('blob') == -1) return;
		createMenu(gContextMenu.onLink? gContextMenu.linkURL : gBrowser.currentURI.spec);
	}, false);
	
	function createMenu(file){
		const url = file.replace('/blob/', '/raw/');
		const menu = document.createXULElement('menuitem');
		menu.setAttribute('id', 'ucjs_getUCJS_areamenu');
		menu.setAttribute('label',(gContextMenu.onLink? 'Link' : 'Seite') + ' als uc.js Script' + ' speichern');
		menu.setAttribute('tooltiptext', 'als uc.js speichern');
		menu.addEventListener('command', function(){getFile(url)}, false);
		areaMenu.insertBefore(menu, saveLink? saveLink : areaMenu.firstChild);
	}

	function getFile(url){
		const title = url.split(/\//)[url.split(/\//).length -1]
		const date = new Date();
		const stamp = '?' + date.getTime();
		const xhr = new XMLHttpRequest();
			xhr.responseType = '';
			xhr.open('GET', url + stamp);
			xhr.send();
			xhr.onload  = function(){
				saveUCJS(xhr.responseText, title)
			}
	}

	function saveUCJS(string, title){
	  if(!skipDialogCxt){
    	const fp =Cc["@mozilla.org/filepicker;1"].createInstance(Ci.nsIFilePicker);
		fp.init(BrowsingContext.getFromWindow(window), 'Select a File', Ci.nsIFilePicker.modeSave);
    		fp.appendFilter('userChrome.js', '*.uc.js');
    		fp.displayDirectory = Services.dirsvc.get('UChrm', Ci.nsIFile);
    		fp.defaultExtension = 'uc.js';
    		fp.defaultString = (title == 'userChrome.js.uc.js')? 'userChrome.js' : title;
    	const result = fp.open(_saveUCJS);
    	function _saveUCJS(result){
    		if (result == Ci.nsIFilePicker.returnOK || result == Ci.nsIFilePicker.returnReplace){
        		writeFile(fp.file, string)
        	}
		}
	  }else{
      	const aFile = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsIFile);
      	const dir = Services.dirsvc.get('UChrm', Ci.nsIFile).path;
        const path = dir + sep +((title == 'userChrome.js.uc.js')? 'userChrome.js' : title);
		aFile.initWithPath(path);
      	writeFile(aFile, string);
	  }
  	}
  	
  	function writeFile(file, string){
        const charset = 'UTF-8';
        const fileStream = Cc['@mozilla.org/network/file-output-stream;1']
        					.createInstance(Ci.nsIFileOutputStream);
        fileStream.init(file, 0x02 | 0x08 | 0x20, -1, 0);
        const converterStream = Cc['@mozilla.org/intl/converter-output-stream;1']
        					.createInstance(Ci.nsIConverterOutputStream);
        converterStream.init(
        	fileStream, 
        	charset, 
        	string.length,
        	Ci.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER
        );
        converterStream.writeString(string);
        converterStream.close();
        fileStream.close();
        setTimeout(function(){
         	if(urgeRestart && window.confirm('Downladen abgeschlossen. Möchten Sie Firefox sofort neu starten？')) Services.appinfo.invalidateCachesOnRestart() || Services.startup.quit(Ci.nsIAppStartup.eRestart | Ci.nsIAppStartup.eAttemptQuit);
        },100);
	}
})()
