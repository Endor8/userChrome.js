// ==UserScript==
// @name           allowTab.uc.js
// @description    Erlauben / verbieten von Bilder, Plugins, Javascript über das Tabkontextmenü 
// @namespace      http://d.hatena.ne.jp/Griever/
// @author         Griever
// @include        main
// @compatibility  Firefox 44
// @charset        UTF-8
// @version        0.0.3
// @note           0.0.3 e10s Kompatibilität
// ==/UserScript==

"use strict";
var allowTab = {
	list : ["allowImages", "allowJavascript", "allowMetaRedirects", "allowPlugins", "allowSubframes"],
	init: function(){
		this.popup = document.getElementById('tabContextMenu') || 
		             document.getAnonymousElementByAttribute(gBrowser, "anonid", "tabContextMenu");
		this.separator = this.popup.appendChild(document.createElement('menuseparator'));

		this.menuitems = this.list.map(function(type){
			var menuitem = document.createElement('menuitem');
			menuitem.setAttribute("type", "checkbox");
			//menuitem.setAttribute("autocheck", "false");
			menuitem.setAttribute("checked", "true");
			menuitem.setAttribute("label", type);
			menuitem.setAttribute("id", type);
			//menuitem.setAttribute("closemenu", "none");
			menuitem.setAttribute("onclick", "allowTab.onClick(event);");
			menuitem.setAttribute("oncommand", "allowTab.onCommand(event);");
			return this.popup.appendChild(menuitem);
		}, this);

		this.popup.addEventListener('popupshowing', this, false);
		window.addEventListener('unload', this, false);
	},
	uninit: function(){
		this.popup.removeEventListener('popupshowing', this, false);
		window.removeEventListener('unload', this, false);
	},
	destroy: function() {
		this.uninit();
		this.separator.parentNode.removeChild(this.separator);
		this.menuitems.forEach(function(e){ e.parentNode.removeChild(e); });
	},
	handleEvent : function(event){
		switch(event.type){
			case 'popupshowing':
				if (event.target != event.currentTarget) return;

				var tab = document.popupNode || this.popup.triggerNode;
				if (tab.localName != 'tab')
					tab = gBrowser.mCurrentTab;

				var bmm = tab.linkedBrowser.messageManager;
				var listener = (message) => {
					bmm.removeMessageListener('allowTab:ResponseState', listener);
					for (let m of this.menuitems) {
						m.setAttribute('checked', message.data[m.id]);
					}
				};
				bmm.addMessageListener('allowTab:ResponseState', listener);
				bmm.loadFrameScript('data:text/javascript;charset=utf-8,' + encodeURIComponent(
`
sendAsyncMessage('allowTab:ResponseState', {
	allowImages: this.docShell.allowImages,
	allowJavascript: this.docShell.allowJavascript,
	allowMetaRedirects: this.docShell.allowMetaRedirects,
	allowPlugins: this.docShell.allowPlugins,
	allowSubframes: this.docShell.allowSubframes
});
`
				), true);
				break;
			case 'unload':
				this.uninit();
				break;
		}
	},
	onCommand: function(event) {
		var command = event.currentTarget.id;
		var tab = document.popupNode || this.popup.triggerNode;
		if (tab.localName != 'tab')
			tab = gBrowser.mCurrentTab;

		var bmm = tab.linkedBrowser.messageManager;
		bmm.loadFrameScript('data:text/javascript;charset=utf-8,' + encodeURIComponent(
`
this.docShell.${ command } = !this.docShell.${ command }
`
		), true);
	},
	onClick: function(event) {
		if (event.button != 1) return;
		allowTab.onCommand(event);
		event.target.setAttribute("checked", event.target.getAttribute("checked") != "true");
	},
}

allowTab.init();
