// ==UserScript==
// @name           gTranslator.uc.js
// @description    Dannylee angepasste Skript- Version vom google_translator.UC.js-Skript
// @author         Dannylee
// @namespace      lidanny2012@gmail.com
// @include        main
// @license        MIT License
// @compatibility  Firefox 4
// @charset        UTF-8
// @version        v2014.05.04 by defpt
// @note           2014-05-04，更新了翻译的api，修复链接不到谷歌的情况
// @note           2014-02-25，随原脚本更新部分代码，并完善正则
// @note           左键点击按钮直接翻译，如果有选中文字就翻译文字，否则翻译网页
// @note           右键弹出设置菜单
// @note           不勾选弹窗显示则直接替换原文本，否则弹窗显示翻译结果
// @note           不勾选对比显示则只显示翻译结果，否则对比显示翻译结果
// @homepageURL    https://github.com/defpt/userChromeJs/blob/master/Translator
// @reviewURL      http://bbs.kafan.cn/thread-1690445-1-1.html
// ==/UserScript==

var gTranslator = {
	_prefs : null,
	_targetlang : "de-DE",
	_showpopuptext : true,
	_showoritext : false,
	_timer : null,

	onLoad : function () {
		this._prefs = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefService)
			.getBranch("uc.gTranslator.");
		this._prefs.QueryInterface(Components.interfaces.nsIPrefBranch2);
		
		if (!this._prefs.prefHasUserValue("targetlang")) {
			this._prefs.setCharPref("targetlang", this._targetlang);
		} else {
			this._targetlang = this._prefs.getCharPref("targetlang");
		}
		if (!this._prefs.prefHasUserValue("showpopuptext")) {
			this._prefs.setBoolPref("showpopuptext", this._showpopuptext);
		} else {
			this._showpopuptext = this._prefs.getBoolPref("showpopuptext");
		}
		if (!this._prefs.prefHasUserValue("showoritext")) {
			this._prefs.setBoolPref("showoritext", this._showoritext);
		} else {
			this._showoritext = this._prefs.getBoolPref("showoritext");
		}
		var overlay = '\
		<overlay xmlns="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul" \
				xmlns:html="http://www.w3.org/1999/xhtml"> \
			<toolbarpalette id="urlbar-icons">\
				<toolbarbutton id="gTranslator" label="Übersetzen" \
						context="gTranslator-contextmenu"\
						tooltiptext = "Links | rechts-Übersetzung im Menü" \
					    onclick="if(event.button === 0) gTranslator.ToolBarTranslatorClick(event);" >\
					<menupopup id="gTranslator-contextmenu" \
                            onpopupshowing="gTranslator.showStatbarContextMenu(event);">\
						<menuitem id="translateselected-gTranslator" \
							label="Ausgewählten Text übersetzen" \
							onclick="gTranslator.selectionTranslation(event);"/> \
						<menuitem id="translatepage-gTranslator" \
							label="Seite übersetzen" \
							onclick="gTranslator.pageTranslation(event);"/> \
						<menuseparator/> \
						<menuitem label="Sprache" \
							id="trtid1" \
							type="checkbox" \
							value="de-DE" \
							onclick = "gTranslator.settargetlang(event);" /> \
						<menuitem label="Zielsprache"  \
							id="trtid2" \
							type="checkbox" \
							value="de" \
							onclick = "gTranslator.settargetlang(event);" /> \
						<menuitem label="Übersetzung ins Deutsche" \
							id="trtid3" \
							type="checkbox" \
							value="de" \
							onclick = "gTranslator.settargetlang(event);" /> \
						<menuseparator/> \
						<menuitem id="showsreplaced" \
							label="Popup-Fenster zeigt Übersetzungsergebnisse" \
							tooltiptext = "Übersetzung im Popup-Fenster oder direkt in der original Seite anzeigen" \
							type="checkbox" \
							value="' + this._showpopuptext + '" \
							onclick = "gTranslator.setshowmode(event);"/> \
						<menuitem id="showoritext" \
							label="Übersetzungsergebnisse" \
							tooltiptext = "Wählen Sie die Übersetzung mit dem ursprünglichen Text oder nur anzeigen: Ja" \
							value="' + this._showoritext + '" \
							type="checkbox" \
							onclick = "gTranslator.setoridisplay(event);"/> \
					</menupopup>\
				</toolbarbutton>\
			</toolbarpalette>\
			<popup id="contentAreaContextMenu">\
				<menuitem id="context-translator" label="Text übersetzen" \
					class="menuitem-iconic" \
image="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFCSURBVDhPnZExSwNBEEZPESStP8PKP2Fnr1hYiI2dkEoQJKWCnVXEIpDGQsRGJGKhFsKBHpEIFokJ4VQkpFMLm5E3OsvcmRBx4XG3e/u9md2LGB9vPfH0e+3A6/OD6KZhIx+u1Y5kb383I3h5uh8uIURgfaOoLC0vKjaHtNv4m8AHvWikAK7jCw0kjVgDq6UtWYslMH8pMnf2LjMnIlMHn4oK/IVZRTravumPFKjEC7hAaz0fPm+mCpKBgsfWbebshAy6sb/Bu4UL5VQiPnDuiWJT74EumFvLQGXbR6FfAsIGFwicFRBQ+TBOtDoC1girwIcNAiYghHDzNNEgAmRBwPBh5mMLx6FN+60EDdamKx2Z3Kl/C8ZXrjTMExCArzhbvVPoBAHPjCAfNhAQtJaBy4YgYAySsAF82NaMn/h/RxR9Ab4TXij6pKP0AAAAAElFTkSuQmCC" \
					oncommand="gTranslator.selectionTranslation(event);"/> \
				<menuitem id="context-page-translator" label="Aktuelle Seite übersetzen" \
					class="menuitem-iconic" \
image="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFCSURBVDhPnZExSwNBEEZPESStP8PKP2Fnr1hYiI2dkEoQJKWCnVXEIpDGQsRGJGKhFsKBHpEIFokJ4VQkpFMLm5E3OsvcmRBx4XG3e/u9md2LGB9vPfH0e+3A6/OD6KZhIx+u1Y5kb383I3h5uh8uIURgfaOoLC0vKjaHtNv4m8AHvWikAK7jCw0kjVgDq6UtWYslMH8pMnf2LjMnIlMHn4oK/IVZRTravumPFKjEC7hAaz0fPm+mCpKBgsfWbebshAy6sb/Bu4UL5VQiPnDuiWJT74EumFvLQGXbR6FfAsIGFwicFRBQ+TBOtDoC1girwIcNAiYghHDzNNEgAmRBwPBh5mMLx6FN+60EDdamKx2Z3Kl/C8ZXrjTMExCArzhbvVPoBAHPjCAfNhAQtJaBy4YgYAySsAF82NaMn/h/RxR9Ab4TXij6pKP0AAAAAElFTkSuQmCC" \
					oncommand="gTranslator.pageTranslation(event);"/> \
			</popup>\
		</overlay>';
		overlay = "data:application/vnd.mozilla.xul+xml;charset=utf-8," + encodeURI(overlay);
		window.userChrome_js.loadOverlay(overlay, gTranslator);
		var css = '\
			#gTranslator {\
				list-style-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFCSURBVDhPnZExSwNBEEZPESStP8PKP2Fnr1hYiI2dkEoQJKWCnVXEIpDGQsRGJGKhFsKBHpEIFokJ4VQkpFMLm5E3OsvcmRBx4XG3e/u9md2LGB9vPfH0e+3A6/OD6KZhIx+u1Y5kb383I3h5uh8uIURgfaOoLC0vKjaHtNv4m8AHvWikAK7jCw0kjVgDq6UtWYslMH8pMnf2LjMnIlMHn4oK/IVZRTravumPFKjEC7hAaz0fPm+mCpKBgsfWbebshAy6sb/Bu4UL5VQiPnDuiWJT74EumFvLQGXbR6FfAsIGFwicFRBQ+TBOtDoC1girwIcNAiYghHDzNNEgAmRBwPBh5mMLx6FN+60EDdamKx2Z3Kl/C8ZXrjTMExCArzhbvVPoBAHPjCAfNhAQtJaBy4YgYAySsAF82NaMn/h/RxR9Ab4TXij6pKP0AAAAAElFTkSuQmCC");\
				-moz-appearance: none !important;\
				box-shadow: none !important;\
				border: none !important;\
				min-width: 18px !important;\
				min-height: 18px !important;\
				margin-right: -5px !important;\
				-moz-box-align: center !important;\
				-moz-box-pack: center !important;\
			}\
		'.replace(/[\r\n\t]/g, '');
        function addStyle(css) {
        	var pi = document.createProcessingInstruction(
        			'xml-stylesheet',
        			'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(css) + '"');
        	return document.insertBefore(pi, document.documentElement);
        }
		gTranslator.style = addStyle(css);

		var xmltt = '\
			        <tooltip id="translationResult"	style="-moz-appearance: none;display:-moz-popup;font:message-box;background-color:InfoBackground;color:InfoText;border: 1px solid InfoText;width:450px;">\
			      			<vbox id="translationResultPopupBox">\
			        			<label id="translationResultPopupLabel" flex="1" onclick="gTranslator.copyToClipboard(event,this.textContent);" tooltiptext="Linksklick Übersetzung in Zwischenablage kopieren / Rechtsklick zum Ausblenden"/>\
			      			</vbox>\
			    		</tooltip>\
			    	';
		var rangett = document.createRange();
		rangett.selectNodeContents(document.getElementById('mainPopupSet'));
		rangett.collapse(false);
		rangett.insertNode(rangett.createContextualFragment(xmltt.replace(/\n|\r/g, ''))); //.replace(/\n/g, '')
		rangett.detach();

	},

	observe : function (aSubject, aTopic, aData) {
		if (aTopic == "xul-overlay-merged") {
			//	Application.console.log("GoogleTranslator Schnittstelle wird geladen！");
			document.getElementById("contentAreaContextMenu").addEventListener("popupshowing", this.showContextMenu, false);
			window.addEventListener("unload", this, false);
		}
	},

	uninit : function () {
		if (this._timer)
			clearTimeout(this._timer);
		var i = document.getElementById("gTranslator");
		if (i)
			i.parentNode.removeChild(i);
		var i = document.getElementById("gTranslator-contextmenu");
		if (i)
			i.parentNode.removeChild(i);
		document.getElementById("contentAreaContextMenu").removeEventListener("popupshowing", this.showContextMenu, false);
		var i = document.getElementById("context-translator");
		if (i)
			i.parentNode.removeChild(i);
		var i = document.getElementById("context-page-translator");
		if (i)
			i.parentNode.removeChild(i);
		var i = document.getElementById("translationResult");
		if (i)
			i.parentNode.removeChild(i);
		window.removeEventListener("unload", this, false);
	},

	handleEvent : function (event) {
		switch (event.type) {
		case "unload":
			this.uninit();
			break;
		}
	},

	settargetlang : function (event) {
		if (event.button != 0)
			return;
		this._targetlang = event.target.value;
		this._prefs.setCharPref("targetlang", this._targetlang);
		this.settargetlangshow();
	},

	settargetlangshow : function () {
		document.getElementById("trtid1").setAttribute('checked', ((document.getElementById("trtid1").value != this._targetlang) ? false : true));
		document.getElementById("trtid2").setAttribute('checked', ((document.getElementById("trtid2").value != this._targetlang) ? false : true));
		document.getElementById("trtid3").setAttribute('checked', ((document.getElementById("trtid3").value != this._targetlang) ? false : true));
	},

	setshowmode : function (event) {
		if (event.button != 0)
			return;
		this._showpopuptext = !this._showpopuptext;
		this._prefs.setBoolPref("showpopuptext", this._showpopuptext);
		this.showmodeshow();
	},

	setoridisplay : function (event) {
		if (event.button != 0) return;
		this._showoritext = !this._showoritext;
		this._prefs.setBoolPref("showoritext", this._showoritext);
		this.showmodeshow();
	},

	showmodeshow : function (event) {
		document.getElementById("showsreplaced").setAttribute('checked', this._showpopuptext);
		document.getElementById("showoritext").setAttribute('checked', this._showoritext);
	},

	showContextMenu : function () {
		document.getElementById("context-translator").hidden = !(gContextMenu.isTextSelected);
		document.getElementById("context-page-translator").hidden = (gContextMenu.isTextSelected);
	},

	showStatbarContextMenu : function () {
		if (document.getElementById("translateselected-gTranslator")) {
			document.getElementById("translateselected-gTranslator").disabled = !(this.isValidTextLength(this.getSelectedText()));
		}
		this.settargetlangshow();
		this.showmodeshow();
	},

	getFocusedWindow: function(){
        var focusedWindow = document.commandDispatcher.focusedWindow;
        if (!focusedWindow || focusedWindow == window)
          return window.content;
        else
          return focusedWindow;
    },

	getSelectedText: function(e) {
    	var focusedWindow = this.getFocusedWindow();
		var selectedsel = focusedWindow.getSelection();
		if (selectedsel && !selectedsel.toString()) {
			var node = document.commandDispatcher.focusedElement;
			if (node &&
				node.ownerDocument.defaultView == focusedWindow &&
				(node.type == "text" || node.type == "textarea") &&
				'selectionStart' in node &&
				node.selectionStart != node.selectionEnd) {
				var offsetStart = Math.min(node.selectionStart, node.selectionEnd);
				var offsetEnd  = Math.max(node.selectionStart, node.selectionEnd);
				var selectedText = node.value.substr(offsetStart, offsetEnd-offsetStart);
				return selectedText;
			}
		}
		var selectedText = selectedsel ? selectedsel.toString() : "";
		return selectedText;
    },

	isValidTextLength : function (selectedtext) {
		if (selectedtext.length > 0 && selectedtext.length <= 38000) {
			return true;
		} else {
			return false;
		}
	},

	ToolBarTranslatorClick : function (e) {
		// var tbt = document.getElementById("gTranslator");
		// if (e.target != tbt)
			// return;
		var selectedText = this.getSelectedText();
		if (this.isValidTextLength(selectedText)) {
			this.selectionTranslation(e);
		} else {
			this.pageTranslation();
		}
	},

	selectionTranslation : function (event) {
		var selectedText = this.getSelectedText();
		this.refreshInformation(selectedText);
	},

	pageTranslation : function (e) {
		var cel = this._targetlang;
		var docurl = content.location.href;
		if (docurl.match(/^about/)) {
            return;
        } else if(docurl.match(/^https/)) {
			docurl = docurl.replace(/https/i, "http");
		}
		var fordUrl = "http://translate.google.com/translate?hl=" + cel + "&sl=auto&tl=" + cel + "&u=" + encodeURIComponent(docurl);
		gBrowser.selectedTab = gBrowser.addTab(fordUrl);
	},

	refreshInformation : function (whatToTranslate) {
		if (this.isValidTextLength(whatToTranslate)) {
			var cel = this._targetlang;
			var httpRequest = null;
			var fullUrl = "http://translate.google.com/translate_t?text="+whatToTranslate+"&hl="+cel+"&langpair=auto|"+cel+"&tbb=1" ;

			function removeHTMLTags(mitkell) {
				var strTagStrippedText = mitkell.replace(/<br>/ig, "\n").replace(/<\/span>/ig, "");
				if (gTranslator._showoritext == false) {
					strTagStrippedText = strTagStrippedText.replace(/onmouseout=[^>]+>/ig, "∮")
						.replace(/<span title="[^∮]+∮/ig, "")
						.replace(/\s*\n+/ig, "\n");
				} else {
					strTagStrippedText = strTagStrippedText.replace(/<span title=\"/ig, "")
						.replace(/\"\sonmouseover[^>]+>/ig, "\n")
						.replace(/\s*\n+/ig, "\n");
				}
				return strTagStrippedText;
			}

			function infoReceived() {
				var output = httpRequest.responseText;
				if (whatToTranslate[0] == " ") {
					var kezdospace = " ";
				} else {
					var kezdospace = "";
				}
				if (whatToTranslate[whatToTranslate.length - 1] == " ") {
					var vegespace = " ";
				} else {
					var vegespace = "";
				}
				if (output.length) {
					output = output.replace(/&quot;/gi, '"');
					output = output.replace(/&lt;/gi, '<');
					output = output.replace(/&gt;/gi, '>');
					output = output.replace(/&amp;/gi, '&');
					output = output.replace(/&#39;/gi, "'");
					var fieldArray = output.split('</head>');
					if (fieldArray[1].search('class="short_text"') != -1) {
						var tempResz = fieldArray[1].split('<span id=result_box class="short_text">');
					} else if (fieldArray[1].search('class="medium_text"') != -1) {
						var tempResz = fieldArray[1].split('<span id=result_box class="medium_text">');
					} else {
						var tempResz = fieldArray[1].split('<span id=result_box class="long_text">');
					}
					var kimenet = tempResz[1].split('</span></div>');
					if (gTranslator._showpopuptext === false) {
						var focusedWindow = document.commandDispatcher.focusedWindow;
						var range = focusedWindow.getSelection().getRangeAt(0);
						range.deleteContents();
						range.insertNode(document.createTextNode(kezdospace + removeHTMLTags(kimenet[0]) + vegespace));
					} else {
						gTranslator.show(kezdospace + removeHTMLTags(kimenet[0]) + vegespace);
					}
				}
			}

			httpRequest = new XMLHttpRequest();
			httpRequest.open("GET", fullUrl, true);
			httpRequest.onload = infoReceived;
			httpRequest.send(null);
			if (gTranslator._showpopuptext === true)
				this.show("Übersetzung, bitte warten...");
			else
           	    XULBrowserWindow.statusTextField.label="Übersetzen..., bitte warten...";
				
		} else { //ha a kijelolt szoveg hossza <=0 vagy >38000
			var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
				.getService(Components.interfaces.nsIPromptService);
			prompts.alert(null, "Google Translator", "Der markierte Text darf 38.000 Zeichen nicht überschreiten！");
		}
	},

	show : function (res) {
		var popup = document.getElementById("translationResult");
		this.setValue(res);
		this.sizeChange();
		var node = document.getElementById("content");
		if (!node) {
			node = document.getElementById("messagepane");
		}
		if (this._timer)
			clearTimeout(this._timer);

		if (typeof popup.openPopup != 'undefined')
			popup.openPopup(node, "overlap", 0, 0, true, false);
		else
			popup.showPopup(node, -1, -1, "popup", null, null);
		setTimeout(function () {
			gTranslator.sizeChange();
		}, 0);
		this._timer = setTimeout(function () {
				popup.hidePopup();
			}, 15000); //显示时间15秒
	},

	setValue : function (val) {
		var label = document.getElementById("translationResultPopupLabel");
		while (label.firstChild) {
			label.removeChild(label.firstChild);
		}
		if (val != "")
			label.appendChild(document.createTextNode(val));
	},

	sizeChange : function () {
		var popup = document.getElementById("translationResult");
		var box = document.getElementById("translationResultPopupBox");
		popup.sizeTo(450, Math.max(box.boxObject.height * 1.0 + 15, 23));
	},

	copyToClipboard : function (e, aValue) {
		if (e.button == 0) {
			var clipid = Components.interfaces.nsIClipboard;
			var clip = Components.classes['@mozilla.org/widget/clipboard;1'].getService(clipid);
			if (!clip) {
				return;
			}
			var trans = Components.classes['@mozilla.org/widget/transferable;1'].
				createInstance(Components.interfaces.nsITransferable);
			if (!trans) {
				return;
			}
			var str = Components.classes['@mozilla.org/supports-string;1'].
				createInstance(Components.interfaces.nsISupportsString);
			str.data = aValue;
			trans.setTransferData("text/unicode", str, aValue.length * 2);
			clip.setData(trans, null, clipid.kGlobalClipboard);
		} else if (e.button == 2) {
			var popup = document.getElementById("translationResult");
			clearTimeout(this._timer);
			popup.hidePopup();
		}
	}
};
gTranslator.onLoad();