// ==UserScript==
// @name           AutoPopup.uc.js
// @description    Auto popup menulist/menupopup
// @compatibility  Firefox 30.0+
// @author         GOLF-AT, modified by gsf & aborix
// @version        2019.05.05
// ==UserScript==

(function() {

	const showDelay = 200;
	const hideDelay = 500;
	var overElt = null;
	var PopElt = null;
	var PopTimer = null;
	var HideTimer = null;
	var AlwaysPop = false;
	var searchBar = null;
	if (window.BrowserSearch)
		searchBar = BrowserSearch.searchBar;

	// Fx support all of CSS syntax: # indicates id, . represents class, or [id='demo']
	var BlackIDs = [];

	// whitelist, and trigger action
	var whiteIDs = [
	{
		id: 'omnibar-defaultEngine',
		popMemu: 'omnibar-engine-menu',
		run: function(overElem) {
			document.getElementById('omnibar-in-urlbar').click(0);
		}
	},
	{
		id: 'ucjs_zoom_statuslabel',
		popMemu: 'ucjs_zoom-context',
		run: null
	},
	{
		id: 'UserScriptLoader-icon',
		popMemu: 'UserScriptLoader-popup',
		run: null
	},
	{
		id: 'readLater',
		popMemu: 'readLater-popup',
		run: null
		//function(overElem) {PopElt.popup();}
	},
	{
		id: 'foxyproxy-toolbar-icon',
		popMemu: 'foxyproxy-toolbarbutton-popup',
		run: null
	}
	];
	var whitesInx = -1;

	var popupPos = ['after_start', 'end_before', 'before_start', 'start_before'];

	var menuPanelID = 'appMenu-popup';
	var downPanelID = 'downloadsPanel';
	var widgetPanelID = 'customizationui-widget-panel';

	var overflowPanel = document.getElementById('widget-overflow');
	if (overflowPanel) {
		overflowPanel.addEventListener('popupshowing', function() {
			this.open = true;
		});
		overflowPanel.addEventListener('popuphiding', function() {
			this.open = false;
		});
	}

	function IsWidgetBtn(elt) {
		try {
			return elt.hasAttribute('widget-id') && elt.getAttribute('widget-type') == 'view';
		} catch(e) {
			return false;
		}
	}

	function IsSearchBtn(elt) {
		return (elt && elt.className == 'searchbar-search-button') || whitesInx == 0;
	}

	function IsPanelMenuBtn(elt) {
		return elt && elt.id == 'PanelUI-menu-button';
	}

	function IsDownloadBtn(elt) {
		return elt && elt.localName == 'toolbarbutton' && elt.id == 'downloads-button';
	}

	function IsButton(elt) {
		return elt && (elt.localName == 'button' || elt.localName == 'toolbarbutton');
	}

	function IsMenuButton(elt) {
		return IsPanelMenuBtn(elt) || IsDownloadBtn(elt) || IsWidgetBtn(elt)
		       || (IsButton(elt) && getPopupMenu(elt));
	}

	function IsOverflowButton(elt) {
		return elt && elt == document.getElementById('nav-bar-overflow-button');
	}

	function IsUrlbarDropmarker(elt) {
		try {
			return elt.getAttribute('anonid') == 'historydropmarker';
		} catch(e) {
			return false;
		}
	}

	function IsAutoComplete(elt) {
		try {
			return elt.getAttribute('type').substr(0, 12) == 'autocomplete';
		} catch(e) {
			return false;
		}
	}

	function isBlackNode(elt) {
		return BlackIDs.some(function(css) {
			try {
				var nodes = document.querySelectorAll(css);
			} catch(e) {
				return false;
			}
			for (var node of nodes) {
				if (node == elt)
					return true;
			}
			return false;
		})
	}

	function getPopupNode(node) {
		if (whitesInx > -1 && PopElt)
			return PopElt;
		if (IsSearchBtn(node))
			return node;
		if (IsOverflowButton(node))
			return node;

		var elt, isPop, s;

		for (; node != null; node = node.parentNode) {
			if (node == PopElt)
				return node;

			isPop = false; // Node isn't Popup node
			s = node.localName;
			if (s == 'menupopup' || s == 'popup' || s == 'menulist'
			    || IsAutoComplete(node) || IsMenuButton(node)) {
				isPop = true;
			} else if (s == 'dropmarker') {
				if (node.getAttribute('type') == 'menu') {
					elt = node.parentNode;
					if (elt.firstChild.localName == 'menupopup')
						isPop = true;
				} else if (IsUrlbarDropmarker(node))
					isPop = true;
			} else if (s == 'menu') {
				isPop = (node.parentNode.localName == 'menubar');
			} else if (IsButton(node)) {
				for (elt = node; (elt = elt.nextSibling) != null;) {
					if (elt.localName == 'dropmarker' && elt.boxObject.width > 0
					    && elt.boxObject.height > 0)
						break;
				}
				if (elt)
					break;
			}
			if (isPop)
				break;
		}
		if (PopElt && node) {
			// Whether node is child of PopElt
			for (elt = node.parentNode; elt != null; elt = elt.parentNode) {
				if (elt == PopElt)
					return PopElt;
			}
		}

		return isPop ? node : null;
	}

	function getPopupMenu(elt) {
		if (whitesInx > -1 && PopElt)
			return PopElt;

		var nodes = elt ? elt.ownerDocument.getAnonymousNodes(elt) || elt.childNodes : null;
		if (nodes) {
			for (let node of nodes) {
				if (node.localName == 'menupopup')
					return node;
			}
		}

		var s = elt.getAttribute('popup');
		return s ? document.getElementById(s) : null;
	}

	function getPopupPos(elt) {
		var x, y, pos, box;

		for (pos = 0, x = elt.boxObject.screenX, y = elt.boxObject.screenY;
		     elt != null; elt = elt.parentNode)
		{
			if (elt.localName == 'window' || !elt.parentNode)
				break;
			else if (elt.localName != 'toolbar' && elt.localName != 'hbox'
			         && elt.localName != 'vbox');
			else if (elt.boxObject.height >= 3 * elt.boxObject.width) {
				if (elt.boxObject.height >= 45) {
					pos = 9;
					break;
				}
			} else if (elt.boxObject.width >= 3 * elt.boxObject.height) {
				if (elt.boxObject.width >= 45) {
					pos = 8;
					break;
				}
			}
		}
		try {
			box = elt.boxObject;
			x = (pos & 1) ? (x <= box.width / 2 + box.screenX ? 1 : 3) :
			                (y <= box.height / 2 + box.screenY ? 0 : 2);
		} catch(e) {
			x = 0;
		}
		return popupPos[x];
	}

	function AutoPopup() {
		PopTimer = null;
		if (!overElt)
			return;

		if (whitesInx > -1 && PopElt && whiteIDs[whitesInx].run) {
			whiteIDs[whitesInx].run(overElt);
			return;
		}
		if (!PopElt)
			PopElt = overElt;
		if (overElt.localName == 'dropmarker') {
			if (IsUrlbarDropmarker(overElt))
				overElt.click();
			else
				PopElt.showPopup();
		} else if (overElt.localName == 'menulist') {
			overElt.open = true;
		} else if (IsPanelMenuBtn(overElt)) {
			PanelUI.show();
			PopElt = document.getElementById(menuPanelID);
		} else if (IsWidgetBtn(overElt)) {
			var cmdEvent = document.createEvent('xulcommandevent');
			cmdEvent.initCommandEvent('command', true, true, window, 0,
			                          false, false, false, false, null);
			overElt.dispatchEvent(cmdEvent);
			PopElt = document.getElementById(widgetPanelID);
		} else if (IsDownloadBtn(overElt)) {
			PopElt = document.getElementById(downPanelID);
			DownloadsPanel.showPanel();
		} else if (IsSearchBtn(overElt)) {
			searchBar.openSuggestionsPanel();
		} else if (IsOverflowButton(overElt)) {
				if (!overflowPanel.open) {
					overElt.click();
					PopElt = overflowPanel;
				}
		} else {
			PopElt = getPopupMenu(overElt);
			try {
				let Pos = getPopupPos(overElt);
				PopElt.removeAttribute('hidden');
				PopElt.openPopup(overElt, Pos, 0, 0, false, false, null);
			} catch(e) {
				PopElt = null;
			}
		}
	}

	function HidePopup() {
		try {
			if (overElt.localName == 'dropmarker') {
				try {
					PopElt.parentNode.closePopup();
				} catch(e) { }
			} else if (overElt.localName == 'menulist')
				PopElt.open = false;
			else if (IsDownloadBtn(overElt))
				DownloadsPanel.hidePanel();
			//else if (IsPanelMenuBtn(overElt) || IsWidgetBtn(overElt))
			else if (PopElt && PopElt.hidePopup)
				PopElt.hidePopup();
			else if (PopElt.popupBoxObject)
				PopElt.popupBoxObject.hidePopup();
			else if (IsSearchBtn(overElt))
				searchBar.textbox.closePopup();
			else if (IsPanelMenuBtn(overElt))
				PanelUI.hide();
		} catch(e) { }

		HideTimer = null;
		overElt = PopElt = null;
	}

	function MouseOver(e) {
		if (!AlwaysPop && !document.hasFocus())
			return;
		var popNode, n = e.originalTarget;

		whitesInx = -1;
		// gsf ：some,forEach,filter等数组遍历方法接受第二个参数，表作用域this，可不用call了
		if (n.hasAttribute('id') && whiteIDs.some(function(k,i,me) {
			if (k.id == n.id) {
				overElt = n;
				whitesInx = i;
				PopElt = document.getElementById(k.popMemu);
				PopTimer = setTimeout(AutoPopup, showDelay);
				return true;
			}
		}))
			return;

		popNode = getPopupNode(e.originalTarget);
		if (!popNode || (popNode && popNode.disabled) || isBlackNode(popNode)) {
			MouseOut();
			return;
		}

		if (HideTimer) {
			window.clearTimeout(HideTimer);
			HideTimer = null;
		}

		try {
			if (IsAutoComplete(popNode))
				return;
			for (var elt = popNode; elt != null; elt = elt.parentNode) {
				if (elt.localName == 'menupopup' || elt.localName == 'popup')
					return;
			}
		} catch(e) { }
		if (PopElt && popNode == PopElt && PopElt != overElt)
			return;
		if (overElt && popNode != overElt)
			HidePopup();
		overElt = popNode;
		PopElt = null;
		PopTimer = setTimeout(AutoPopup, showDelay);
	}

	function MouseOut() {
		if (PopTimer) {
			window.clearTimeout(PopTimer);
			PopTimer = null;
		}
		if (!HideTimer && PopElt)
			HideTimer = window.setTimeout(HidePopup, hideDelay);
	}

	window.addEventListener('mouseover', MouseOver, false);

})();
