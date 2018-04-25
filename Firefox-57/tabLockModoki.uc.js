// ==UserScript==
// @name		tabLockModoki.uc.js
// @description		Tabs sperren
// @charset		UTF-8
// @include      	main
// @note		実際の処理部分はopenLinkByLongPress.uc.jsに完全に依存
// @note		拡張機能によるページでは動作しない（ようにしている）
// ==/UserScript==
/*
■事前にopenLinkByLongPress.uc.js(ver.0.0.1)に以下の記述を施す
・19行目 WAITを0に指定
・41行目　if (!url || /^\s*(javascript:|data:|moz-extension:)/.test(url) || /(\x23$)/.test(url)) return;
・101行目　function(message) { gBrowser.selectedTab.hasAttribute('tabLock')?
・106行目　}) : gBrowser.loadURI(message.data);
*/
(function(){

// config 

//Bei gesperrten Tab, kann Vorwärts/Zurück Taste verwendet werden, 
//true: Normalbetrieb, false: In neuem Tab Öffnen
const BrowserBack_Forward = false
//Kontextmenü Eintrag abzeigen true oder false
const CONTEXT = true
//Hintergrundfarbe und Schriftfarbe eines gesperrten Tabs ändern true oder false 
//Hinweis: bei Verwendung des Scripts tabProtectModoki.uc.js hat dieses Vorrang, 
//wenn es beim selben Tab ausgeführt wird!
const STYLE = true
//Hintergrundfarbe eines gesperrten Tabs
const BACKGROUND_COLOR = 'Purple'
//Textfarbe eines gesperrten Tabs
const FONT_COLOR = 'Green'

// config終わり

//コンテキストメニューを作成
   if(CONTEXT) makeMenu();
   function makeMenu(){
	let pos = document.getElementById('context_protectTab')? 
				document.getElementById('context_protectTab') : document.getElementById('context_pinTab');
	let menu = document.createElement('menuitem');
	menu.setAttribute('id', 'context_lockTab');
	menu.setAttribute('oncommand', 'gBrowser.toggle_lockTab(TabContextMenu.contextTab,' + BrowserBack_Forward + ')');
	pos.parentNode.insertBefore(menu, pos);
//ラベルの切り替え	
	pos.parentNode.addEventListener('popupshowing', function (){
		let tab = TabContextMenu.contextTab;
		let label = tab.hasAttribute('tabLock')? 'Tab entsperren' : 'Tab sperren';
		menu.setAttribute('label', label);
	},false);
   }

//CSS
   if(STYLE){
  	let style = '@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);';
  		style = style + '.tabbrowser-tab[tabLock]{background-color:' + BACKGROUND_COLOR + '!important}';
  		style = style + '.tabbrowser-tab[tabLock][selected]{color:' + FONT_COLOR + '!important}';
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
  gBrowser.toggle_lockTab = function(aTab, mode) {
  	if (aTab.localName != 'tab') aTab = this.selectedTab;
    if (!aTab.hasAttribute('tabLock')){
    		aTab.setAttribute('tabLock', 'true');
    		if(!mode) aTab.setAttribute('BFmode', 'true');
    	}else{
     		aTab.removeAttribute('tabLock');
     		if(!mode) aTab.removeAttribute('BFmode');
     	}
  }
  
  if (typeof BrowserForward !== 'undefined') {
        let str = BrowserForward.toString();
            str = str.replace('whereToOpenLink(aEvent, false, true);', 'gBrowser.selectedTab.hasAttribute("BFmode")? "tab" : "current";');
        (new Function('BrowserForward = ' + str)());
  }
  
  if (typeof BrowserBack !== 'undefined') {
        let str = BrowserBack.toString();
            str = str.replace('whereToOpenLink(aEvent, false, true);', 'gBrowser.selectedTab.hasAttribute("BFmode")? "tab" : "current";');
        (new Function('BrowserBack = ' + str)());
  }
  
})()
