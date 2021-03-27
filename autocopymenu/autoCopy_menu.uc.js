// ==UserScript==
// @name           autoCopy_menu.uc.js
// @namespace      ithinc#mozine.cn
// @description    Automatisches kopieren, aktivieren/ deaktivieren über Menüeintrag unter Extras
// @include        main
// @compatibility  Firefox 3.0.x
// @author         ithinc, iwo
// @charset        UTF-8
// @version        LastMod 2014-08-31 by defpt
// @note           2014-08-31 修正一下某些输入框也复制的问题
// @note           2014-04-12 修改原脚本为自用版
// @Note           https://g.mozest.com/redirect.php?goto=findpost&pid=299093&ptid=42980
// @homepageURL    https://github.com/defpt/userChromeJs/tree/master/autoCopy
// ==/UserScript==

(function () {
	var lastSelection = "";
	var autocopyImages = ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsSAAALEgHS3X78AAADtElEQVQ4jQXBfWjUdRwH8Pfn+/ves7u73blH3E031x6c2zQcw52NQJGIsakVVNiDsyAJyQYFZaBZYQWB2T8FCTIZQkJIjdYDoa2ZtIfMsbbmRpvNbXe3dbvb3e9+9/v9vt9vrxct1NeTyueVMxzeHOruttfdnnUjm6ZKj1Mt/jaK5Qdr8JGNi/VV21ssVLYWVm8+WX3yx/eS15Idvd3gcduGIIIVj58r1LMFfc7Qmwtr8xVv1zTpk4+9vOlu7cGK1MpcJDjxU0fjwKU9ZduM4urI0hdZQb1QKsNJKWUTRd2gZ8QvQ/7GQ8dbJupeC51gBdwhZIBNJZzF6ys4MHwD1alVWTyzgcPlg10VLVX9IMdNDgB5KbVCt8vjfLCodv1wrWHjlb1khiT8Xk05Mmnb99EFVTd/m7n9YWamk6rtj+tF0mjoUJ3tQ0wRaR7Im1Nw9c75Cqlwckx0fXdePPuwSx4sz2Bn3xlee2/c4fYGNaZvyNmiKuqte3VyZGT+a0qtSi5II5/5H4a2P31ntKY2cWr44yLv4M/S3vo5W15dBV0fRCAUgkVA6pEovqo6hCGjLfuE9+oqCOAujaOECRRtrBWln3w+mI1qMM6co+CVKwgHA6CAH3pZKWTPMeDRfVjvn4XLsjgzTQ4FML8wKB7YhvHqA5GylRlHaHnR1rmDGAE8FoPZ2gr7s4twHDkCkclAmBaUFIp5PBKaBu4SeXvCVw+fpjfs+/INWHN31Ba3D7lcDgTAaxiwl1ZgFpfClAqWVJBGVvpaWxUCQXCde/wPrc/2vjty/mhISTCnl+edTpivn4I+PAz+zbfgS0vw9hyD2t0MQygoywYLeAlcA1uw7C6S4p0S7nBBEgyvh+zTp+E5+hzwwouI1dVBxWJQFz5Faf9VVLkldKWEMC0BpaB1+gO24lpXhRD+jfJSJc6eJbRHYSaTcEUiSAaDsH4fgc+2wKf+UrtdOkuVbEk3+ozvI207YtqJcDDlzm3UJbc27eIfvC8dzU3MyuhQRBB6Dr6GHUgLG46xMXC3lzyz02jHv+ECGPc3RaO3WNBfZF6uf+nGre4euCpDIhe7r/L6mtJTcZVOJdTqPzMyG90rZ1r3SKeRts2CAH0om6fv3p4eID2t+LrJMFDfVR5fmMX8pV8pa2kkBGAKBVMwGBbIlAysYD86g2m1Fozgcs3jybbERALCBs2N38PhT/58ShmJt/KKx4iYCWIGSNMBlSWiPMCyipDxkZXSXK5cPMf/7jteOxrdv9P6H00LytiG/sXgAAAAAElFTkSuQmCC", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsSAAALEgHS3X78AAADeUlEQVQ4jQXBSWicZRgH8P/zfu83S7aZzGSyTCZLY1IySdSDlkADHrzpoaAtCAUFIxQR8WqXU/HgTRB6VqhCe+lBa22LBEMQreLSkIjN5kzWcTLJ7DPf9r7v4+9He8ceLt7MgbXBXDZBQ+37XPh7CdnXrqIrnoYQAq3SNraWP58emDjnZeYXvTtLef3J22eKCzM9kDvOE8RGD9DZ4aE3cZ7DB5H+3r7UZDQSapIUXYGhEVdEx6zJN16pJsakV3ZjbZ/+OnWOrhWdgxpd/ulF9Ma0oOpZE2xeX+SKuuKHe8aN7CHNFNckQ9Q+QiI5Ch1qajd6x2rtnFubOvvsgkys5GWPGCToCudWX7Ja+ZHLC3O5+Uy6T3VHSHbahrujluqyU1zKrwkxXOPH7Udqor8xMxTOZGsqnZcaAdnCGITa6fEBxN5ZiCEernL/0LAxRhOBJIlO7Hc5+PbkIUJigPfUMpGa/YrboUUJQBAZE+jwaDwqR0YzaWhDVrWtBQAwDGwwcmYb/zo7oJAmVyu9Vnia9MqqSzBAxhBEyBtNxkwfg8GGiAgQBEgCHFXHj4V7iITDKPslJX1peXX/FgtzVwQNP6gVxeRgZv16dmbLMoE0DEMEQLOCpDAeHdxFQD4aqmqg2/J060xZuUNfyIgyolltTYWD+K10PDp3bD/WjnGFIAnNCp1WN9ZPf8Ozxh/whYtGUOTa7gBON97dMMFAEfAgvJpOmTZerrsN/Hq8JNYrT8AGkAjjqLmLpaN7EFLgxCsAhSii+2/CccaEIBdEFgQr/vnosPLRfq4MTzX5+/2vudDcRcur4bvd26hzGSXvEHRq4/XEFaA9CIYDggAASMtuolmd+NM6uZDv6PxyfNNdMw8Ob1PCGsCBt42aX4F7Qnhv+gYi7S64/i6IDZgZACAkkqifZuPPxRfSb41fQybI0g873+D3ygoqrSrsWjc+mLmJqb5peNqBrxTYKGMJi6UIQRbLFvzjS6n4ZD50fmQ2SIgP5cr+fd4urWFYTODV4UtsORJbuU0U/isbpckiZq66ZTSah6AHT5fx8We1qzOp1qfpuBdoDttGWyg2T9BhJ+EpQsNzYYxAoIx2tG2V6qFfbryfvDj/gl2Qz6fnAX64889eY3U1L4oM5RNZrm31tgPjtJjIk8JuMbgpyKp1RIQT6GBjsm+2NJ1M4X84vtmKnywkowAAAABJRU5ErkJggg=="];
	var autocopyTooltips = ["Auto Copy deaktiviert", "Auto Copy aktiviert"];
	var prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefBranch);
	if (!prefs.getPrefType("userChrome.autocopy.autocopyState"))
		prefs.setIntPref("userChrome.autocopy.autocopyState", 1);

	function autocopyStart(e) {
		lastSelection = getBrowserSelection();
	}

	function autocopyStop(e) {
		var prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefBranch);
		var autocopyState = prefs.getIntPref("userChrome.autocopy.autocopyState");
		var selection = getBrowserSelection();
		//增加判断是否在输入框或按下功能键
		var exceptTarget = (e.target.localName == "textarea" || e.target.type == "input" || e.target.type == "text" || e.target.type == "password" || e.target.type == "email" || e.target.contentEditable == "true");
		var exceptoriginalTarget = (!e.originalTarget.ownerDocument || e.originalTarget.ownerDocument.designMode == "off" || e.originalTarget.ownerDocument.designMode == "undefined");
		var exceptAlternativeKey = (e.ctrlKey || e.altKey);
		var except = (exceptTarget && exceptoriginalTarget && !exceptAlternativeKey);

		if (autocopyState > 0 && selection && selection != lastSelection && !except) {
			goDoCommand('cmd_copy');
		}
	}

	gBrowser.mPanelContainer.addEventListener("mousedown", autocopyStart, false);
	gBrowser.mPanelContainer.addEventListener("mouseup", autocopyStop, false);

	var menuitem = document.getElementById("menu_ToolsPopup").appendChild(document.createElement("menuitem")); ;
	menuitem.setAttribute("id", "autocopy-menuitem");
	menuitem.setAttribute("label", "Auto Copy");
	menuitem.setAttribute("class", "menuitem-iconic");
	menuitem.setAttribute("onclick", '\
		    if(event.button==0) {\
		      var prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefBranch);\
		      var autocopyState = prefs.getIntPref("userChrome.autocopy.autocopyState");\
		      prefs.setIntPref("userChrome.autocopy.autocopyState", (autocopyState+1)%2);\
		    }\
		  ');

	function refreshStatus() {
		var prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefBranch);
		var autocopyState = prefs.getIntPref("userChrome.autocopy.autocopyState");
		var menuitem = document.getElementById("autocopy-menuitem");

		menuitem.setAttribute("src", autocopyImages[autocopyState % 2]);
		menuitem.tooltipText = autocopyTooltips[autocopyState % 2];
	}
	refreshStatus();

	var observer = {
		observe : function (subject, topic, prefName) {
			refreshStatus();
		}
	};
	prefs.QueryInterface(Ci.nsIPrefBranchInternal).addObserver("userChrome.autocopy.autocopyState", observer, false);
})();
