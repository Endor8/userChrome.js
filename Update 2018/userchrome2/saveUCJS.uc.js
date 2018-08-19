// ==UserScript==
// @name        saveUCJS.uc.js
// @description    GitHubのファイルを保存する
// @charset			UTF-8
// @include     main
// @note		Nightlyで使っているSaveUserChromeJS.uc.jsが60で動かなかったので作成
// ==/UserScript==
(function(){
	"use strict";
// config
	const addToolMenu = true	// ツールメニューにサブスクリプトローダー更新用メニューを追加する
	const skipDialogTool = true		// ツールメニューからの更新で名前を付けて保存ダイアログを表示しない
	const addCxtMenu = true	// contentAreaContextMenuにメニューを追加する = 
	const skipDialogCxt = false	// contentAreaContextMenuからの保存で名前を付けて保存ダイアログを表示しない
	const urgeRestart = true	//ダウンロード終了後、OKを選ぶと再起動する選択ウィンドウを表示する
//	config ここまで
	const subloader = 'https://github.com/alice0775/userChrome.js/blob/master/userChrome.js';
	const areaMenu = document.getElementById('contentAreaContextMenu');
	const toolMenu = document.getElementById('menu_ToolsPopup');
	const saveLink = document.getElementById('context-savelink');
	const github = 'https://github.com/';
	Cu.import('resource://gre/modules/osfile.jsm');
	let PresentVer = xPref.get('userChrome.subloader.version');
	if(PresentVer == null){
		PresentVer = verCheck();
		xPref.set('userChrome.subloader.version', PresentVer);
	}	
	let file;
	
	if(addCxtMenu){
		areaMenu.addEventListener('popupshowing', function(){
			const _areaMenu = document.getElementById('ucjs_getUCJS_areamenu');
			if(_areaMenu) this.removeChild(_areaMenu);
			if(!gBrowser.currentURI.spec.startsWith(github)) return;
			createMenu(false, gContextMenu.linkURL);
		}, false);
	}
	
	if(addToolMenu){
		const _toolMenu = document.getElementById('ucjs_getUCJS_toolmenu');
		if(_toolMenu) toolMenu.removeChild(_toolMenu);
		createMenu(true);
	}
	
	function createMenu(tool, file){
		const parentMenu = tool? toolMenu : areaMenu;
		const skip = tool? skipDialogTool : skipDialogCxt;
		const check = tool? true : false;
		let url = file? file : tool? subloader : gBrowser.currentURI.spec;
			url = url.replace('/blob/', '/raw/');
		const menu = document.createElement('menuitem');
			menu.setAttribute('hidden', (url.split(/\./).pop() != 'js')? 'true' : 'false');
			menu.setAttribute('id', tool? 'ucjs_getUCJS_toolmenu' : 'ucjs_getUCJS_areamenu');
			menu.setAttribute('label', tool? 'userChrome.js aktualisieren' : 'uc.js wie' + (file? 'Ziel verknüpfen ':' Seite') + 'Speichern');
			menu.setAttribute('tooltiptext', tool? 'Save Subscript Loader von Alice 0775 ' : 'Speichern als uc.js');
			menu.addEventListener('click', function(){getFile(skip, url, check)}, false);
		tool? parentMenu.appendChild(menu) : parentMenu.insertBefore(menu, saveLink? saveLink : parentMenu.firstChild);
	}

	function getFile(skip, url, check){
		const title = url.split(/\//)[url.split(/\//).length -1]
		const date = new Date();
		const stamp = '?' + date.getTime();
		const xhr = new XMLHttpRequest();
			xhr.responseType = '';
			xhr.open('GET', url + stamp);
			xhr.send();
			xhr.onload  = function(){
				if(check){
					const version = xhr.responseText.split(/\r\n/)[0].match(/(\d+\.\d+\.\d{2})/)[0]
					if(PresentVer == version){
						alert('Ist neueste Version');
						return;
					}else{
						xPref.set('userChrome.subloader.version', version);
					}
				}
				saveUCJS(skip, xhr.responseText, title)
			}
	}

	function saveUCJS(skip, str, title){
	  	const string = str.replace(new RegExp('\r\n', 'g'), '\n').replace(new RegExp('\n', 'g'), `\r\n`);
	  if(!skip){
    	const nsIFilePicker = Components.interfaces.nsIFilePicker;
    	const fp = Components.classes['@mozilla.org/filepicker;1'].createInstance(nsIFilePicker);
    		fp.init(window, 'Select a File', Components.interfaces.nsIFilePicker.modeSave);
    		fp.appendFilter('userChrome.js', '*.uc.js');
    		fp.displayDirectory = Services.dirsvc.get('UChrm', Ci.nsIFile);
    		fp.defaultExtension = 'uc.js';
    		fp.defaultString = (title == 'userChrome.js.uc.js')? 'userChrome.js' : title;
    	const result = fp.open(_saveUCJS);
    	function _saveUCJS(result){
    		if (result == nsIFilePicker.returnOK || result == Ci.nsIFilePicker.returnReplace){
    			file = fp.file;
        		writeFile(file, string)
        	}
		}
	  }else{
		  	file = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsIFile);
        	let path = OS.Constants.Path.profileDir + '/chrome/' +((title == 'userChrome.js.uc.js')? 'userChrome.js' : title);
				path = path.replace(/\//g, '\\');
        		file.initWithPath(path);
        		writeFile(file, string)
	  }
  	}
  	
  	function writeFile(file, string){
        const charset = 'UTF-8';
        const fileStream = Components.classes['@mozilla.org/network/file-output-stream;1']
        					.createInstance(Components.interfaces.nsIFileOutputStream);
        fileStream.init(file, 0x02 | 0x08 | 0x20, -1, 0);
        const converterStream = Components.classes['@mozilla.org/intl/converter-output-stream;1']
        					.createInstance(Components.interfaces.nsIConverterOutputStream);
        converterStream.init(
        	fileStream, 
        	charset, 
        	string.length,
        	Components.interfaces.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER
        );
        converterStream.writeString(string);
        converterStream.close();
        fileStream.close();
        setTimeout(function(){
         	if(urgeRestart && window.confirm('DL-Abschluss. Möchtest du Firefox sofort neu starten?')) BrowserUtils.restartApplication();
        },100);
	}
	
	function verCheck() {
     	const file = Services.dirsvc.get('UChrm', Ci.nsIFile);
        	 file.append('userChrome.js');
     	if (file.exists() === false) return false;
     	const fstream = Cc['@mozilla.org/network/file-input-stream;1'].createInstance(Ci.nsIFileInputStream);
     	const sstream = Cc['@mozilla.org/scriptableinputstream;1'].createInstance(Ci.nsIScriptableInputStream);
         	fstream.init(file, -1, 0, 0);
         	sstream.init(fstream);

     	let data = sstream.read(sstream.available());
     	try {
            data = decodeURIComponent(escape(data));
        } catch (e) {}
        sstream.close();
        fstream.close();
     	if (data === 'undefined') return false;
     	data = data.toString().split(/\r\n/)[0].match(/(\d+\.\d+\.\d{2})/)[0]
     	return data;
  	}
})()