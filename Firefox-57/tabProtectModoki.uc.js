// ==UserScript==
// @name		tabProtectModoki.uc.js
// @description		Tab schützen Funktion, (zum Deaktivieren auf Tabschutz aufheben klicken)
// @charset		UTF-8
// @include      	main
// @note		タブの保護状態復元はセッションではなく自前のファイルの読み書きによる
// @note		タブバー上にファイルをドロップされた場合にタブを保護する機能はない
// @note		代わりに保護タブを自動で巻き戻し、ファイル（のURL）を新規タブで開き直す
// ==/UserScript==
(function(){

// config 

//タブの保護状態を次回起動時に引き継ぐ（再起動含む） true or false
//終了時に表示したページの履歴を削除する設定の場合、再起動時のみ引き継ぐ
const RECOVER = true
//Kontextmenü Eintrag abzeigen true oder false
const CONTEXT = true
//Bei aktiviertem Tabschutz Hintergrundfarbe und Textfarbe ändern true or false
const STYLE = true
//Hintergrundfarbe eines geschützten Tabs
const BACKGROUND_COLOR = 'Navy'
//Textfarbe eines  geschützten Tabs
const FONT_COLOR = 'Purple'

// config Ende

const HISTORY = Services.prefs.getBoolPref('privacy.clearOnShutdown.history');
const PRIVATE = PrivateBrowsingUtils.isWindowPrivate(window);

//コンテキストメニューを作成
   if(CONTEXT) makeMenu();
   function makeMenu(){
	let pinTab = document.getElementById('context_pinTab');
	let menu = document.createElement('menuitem');
	menu.setAttribute('id', 'context_protectTab');
	menu.setAttribute('oncommand', 'gBrowser.toggle_protectTab(TabContextMenu.contextTab)');
	pinTab.parentNode.insertBefore(menu, pinTab);
//ラベルの切り替え	
	pinTab.parentNode.addEventListener('popupshowing', function (){
		let tab = TabContextMenu.contextTab;
		let label = tab.hasAttribute('tabProtect')? 'Tabschutz aufheben' : 'Tab schützen';
		menu.setAttribute('label', label);
	},false);
   }
   
//CSS
   if(STYLE){
  	let style = '@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);';
  		style = style + '.tabbrowser-tab[tabProtect]{background-color:' + BACKGROUND_COLOR + '!important}';
  		style = style + '.tabbrowser-tab[tabProtect][selected]{color:' + FONT_COLOR + '!important}';
  	let sspi = document.createProcessingInstruction(
    	'xml-stylesheet',
    	'type="text/css" href="data:text/css,' + encodeURIComponent(style) + '"'
  		);
  	document.insertBefore(sspi, document.documentElement);
  	sspi.getAttribute = function(name) {
    	return document.documentElement.getAttribute(name);
  	};
   }
   
//コマンドの追加・書き換え	
  gBrowser.protectTab = function(aTab) {
  	if (aTab.localName != 'tab') aTab = this.selectedTab;
    if (aTab.hasAttribute('tabProtect'))
      return;
    if (aTab.hidden)
      this.showTab(aTab);
    aTab.setAttribute('tabProtect', 'true');
  }
  
  gBrowser.unprotectTab = function(aTab) {
  	if (aTab.localName != 'tab') aTab = this.selectedTab;
    if (!aTab.hasAttribute('tabProtect'))
      return;
    aTab.removeAttribute('tabProtect');
  }

  gBrowser.toggle_protectTab = function(aTab) {
  	if (aTab.localName != 'tab') aTab = this.selectedTab;
    if (!aTab.hasAttribute('tabProtect')){
    	aTab.setAttribute('tabProtect', 'true');
    	}else{
     	aTab.removeAttribute('tabProtect');
     	}
  }
  
  gBrowser.REMOVE_TAB = gBrowser.removeTab;
  gBrowser.removeTab = function(aTab, aParams){
    if(aTab.hasAttribute('tabProtect')) return;
    gBrowser.REMOVE_TAB(aTab, aParams);
  }

//ドロップされたファイルなどを新規タブに開く
  gBrowser.tabpanels.addEventListener('drop', rewind, false);
  gBrowser.tabContainer.addEventListener('drop', rewind, false);

  function rewind(e){
	let data = e.dataTransfer.getData('text/x-moz-url').split(/\r\n|\n/)[0];
	let tab = (e.target.localName == 'tab')? e.target : gBrowser.selectedTab;
	let delay = (e.target.localName == 'tab')? 2000 : 0;
	if(!!tab.hasAttribute('tabProtect')){
		setTimeout(function(){
			if(delay == 2000) document.getElementById('Browser:Back').doCommand();
			if(e.target.localName !== 'tabs') gBrowser.selectedTab = gBrowser.addTab(data);
		},delay);
	}
  }

//終了・再起動の書き換え 
  if (typeof BrowserTryToCloseWindow !== 'undefined' && RECOVER && !HISTORY && !PRIVATE) {
     let CloseCommand = BrowserTryToCloseWindow;
     BrowserTryToCloseWindow = function(){
        let tabs = gBrowser.visibleTabs;
        let tab = tabs.map(x => Number(!x.hasAttribute('tabProtect')));
        saveFile(tab);
		CloseCommand()
     }
  }
 
  if (typeof BrowserUtils.restartApplication !== 'undefined' && RECOVER && !PRIVATE) {
     let RestartCommand = BrowserUtils.restartApplication;
     BrowserUtils.restartApplication = function(){
        let tabs = gBrowser.visibleTabs;
        let tab = tabs.map(x => Number(!x.hasAttribute('tabProtect')));
        saveFile(tab);
		RestartCommand()
     }
  }

//記録の読み書き
　if(!!RECOVER) window.addEventListener('SSTabRestored', LOAD, {once : true});
  
  function LOAD(){
	let data = loadFile().toString().replace(/,/g,'');  
	if(data[0] == '5') return;
	let tabs = gBrowser.visibleTabs;
	let i = 0;
	while(i<tabs.length){
		if(data[i] && data[i] == '0') tabs[i].setAttribute('tabProtect', true);
		i++;
	}
	saveFile('5')
  }
  
//from SimpleSessionManager.uc.js
  function saveFile(data) {
     var file = Services.dirsvc.get('UChrm', Ci.nsIFile);
     file.append('tabProtectModoki.json');

     var suConverter = Cc['@mozilla.org/intl/scriptableunicodeconverter'].createInstance(Ci.nsIScriptableUnicodeConverter);
     suConverter.charset = 'UTF-8';
     data = suConverter.ConvertFromUnicode(data);

     var foStream = Cc['@mozilla.org/network/file-output-stream;1'].createInstance(Ci.nsIFileOutputStream);
         foStream.init(file, 0x02 | 0x08 | 0x20, 0664, 0);
         foStream.write(data, data.length);
         foStream.close();
    }
    
  function loadFile() {
     var file = Services.dirsvc.get('UChrm', Ci.nsIFile);
         file.append('tabProtectModoki.json');
     if (file.exists() === false) return false;
     var fstream = Cc['@mozilla.org/network/file-input-stream;1'].createInstance(Ci.nsIFileInputStream);
     var sstream = Cc['@mozilla.org/scriptableinputstream;1'].createInstance(Ci.nsIScriptableInputStream);
         fstream.init(file, -1, 0, 0);
         sstream.init(fstream);

     var data = sstream.read(sstream.available());
     try {
            data = decodeURIComponent(escape(data));
         } catch (e) {}
         sstream.close();
         fstream.close();
     if (data === 'undefined') return false;
     return data;
  }
  
})()
