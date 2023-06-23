// ==UserScript==
// @name           AutoPopup.uc.js
// @description    Auto popup menulist/menupopup
// @compatibility  Firefox 72
// @author         GOLF-AT, modified by gsf & aborix
// @version        2019.11.22
// ==UserScript==

(function() {

    const showDelay = 200;   // delay of showing popups
    const hideDelay = 500;   // delay of hiding popups
    const alwaysPop = false; // show popups also when window is not focused

    var overElt = null;
    var PopElt = null;
    var PopTimer = null;
    var HideTimer = null;

    // elements are CSS selector strings
    var blackIDs = [];

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
        id: 'usercssloader-menu',
        popMemu: 'usercssloader-menupopup',
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

    const popupPos = ['after_start', 'end_before', 'before_start', 'start_before'];
    const searchBar = window.BrowserSearch ? BrowserSearch.searchBar : null;

    function IsButton(elt) {
        return elt && (elt.localName == 'toolbarbutton' || elt.localName == 'button');
    }

    function IsWidgetBtn(elt) {
        return IsButton(elt) &&
               ((elt.hasAttribute('widget-id') && elt.getAttribute('widget-type') == 'view')
                || elt.id == 'fxa-toolbar-menu-button' || elt.id == 'library-button'
                || elt.id == 'alltabs-button');
    }

    function IsSearchBtn(elt) {
        return (elt && elt.className == 'searchbar-search-button') || whitesInx == 0;
    }

    function IsAppMenuBtn(elt) {
        return elt && elt.id == 'button-appmenu';
    }
	
	function IsPanelMenuBtn(elt) {
        return elt && elt.id == 'PanelUI-menu-button';
    }

    function IsDownloadBtn(elt) {
        return elt && elt.id == 'downloads-button';
    }

    function IsMenuBtn(elt) {
        return IsPanelMenuBtn(elt) || IsDownloadBtn(elt) || IsWidgetBtn(elt)
               || (IsButton(elt) && getPopupMenu(elt));
    }

    function IsOverflowBtn(elt) {
        return elt && elt.id == 'nav-bar-overflow-button';
    }

    function IsUrlbarDropmarker(elt) {
        return elt && elt.classList && elt.classList.contains('urlbar-history-dropmarker');
    }

    function IsCustomizationBtn(elt) {
        return IsButton(elt) && elt.className == 'customizationmode-button';
    }

    function IsAutoComplete(elt) {
        try {
            return elt.getAttribute('type').substring(0, 12) == 'autocomplete';
        } catch(e) {
            return false;
        }
    }

    function isBlackNode(elt) {
        return blackIDs.some(function(css) {
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

        if (IsSearchBtn(node) || IsOverflowBtn(node) || node.id == 'sidebar-switcher-target')
            return node;

        var elt, isPop, s;

        for (; node != null; node = node.parentNode) {
            if (node == PopElt)
                return node;

            isPop = false; // node isn't popup node
            s = node.localName;
            if (s == 'menupopup' || s == 'popup' || s == 'menulist'
                || IsAutoComplete(node) || IsMenuBtn(node) || IsUrlbarDropmarker(node)) {
                isPop = true;
            } else if (s == 'dropmarker' && node.getAttribute('type') == 'menu'
                       && node.parentNode.firstChild.localName == 'menupopup') {
                isPop = true;
            } else if (s == 'menu') {
                isPop = (node.parentNode.localName == 'menubar');
            } else if (IsButton(node)) {
                for (elt = node; (elt = elt.nextSibling) != null;) {
                    if (elt.localName == 'dropmarker' && elt.width > 0 && elt.height > 0)
                        break;
                }
                if (elt)
                    break;
            }
            if (isPop)
                break;
        }
        if (PopElt && node) {
            // whether node is child of PopElt
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

        var nodes = elt ? elt.childNodes : null;
        if (nodes) {
            for (let node of nodes) {
                if (node.localName == 'menupopup' || node.localName == 'panel')
                    return node;
            }
        }

        var s = elt.getAttribute('popup');
        return s ? document.getElementById(s) : null;
    }

    function getPopupPos(elt) {
        if (elt.id == 'bookmarks-menu-button')
            return null;

        var x, y, pos, i;
        for (pos = 0, x = elt.screenX, y = elt.screenY;
             elt != null; elt = elt.parentNode)
        {
            if (elt.localName == 'window' || !elt.parentNode)
                break;
            else if (elt.localName != 'toolbar' && elt.localName != 'hbox'
                     && elt.localName != 'vbox');
            else if (elt.height >= 3 * elt.width) {
                if (elt.height >= 45) {
                    pos = 9;
                    break;
                }
            } else if (elt.width >= 3 * elt.height) {
                if (elt.width >= 45) {
                    pos = 8;
                    break;
                }
            }
        }
        try {
            i = (pos & 1) ?   // is pos odd?
                (x <= elt.width / 2 + elt.screenX ? 1 : 3) :
                (y <= elt.height / 2 + elt.screenY ? 0 : 2);
        } catch(e) {
            i = 0;
        }
        return popupPos[i];
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
            PopElt.showPopup();
        } else if (overElt.localName == 'menulist') {
            overElt.open = true;
        } else if (IsPanelMenuBtn(overElt)) {
            PopElt = document.getElementById('appMenu-popup');
            PanelUI.show();
        } else if (IsWidgetBtn(overElt)) {
            PopElt = document.getElementById('customizationui-widget-panel');
            if (overElt.hasAttribute('onmousedown'))
                overElt.dispatchEvent(new MouseEvent('mousedown'));
            else
                overElt.dispatchEvent(new UIEvent('command'));
        } else if (IsDownloadBtn(overElt)) {
            PopElt = document.getElementById('downloadsPanel');
            DownloadsPanel.showPanel();
        } else if (IsSearchBtn(overElt)) {
            searchBar.openSuggestionsPanel();
        } else if (IsOverflowBtn(overElt)) {
            PopElt = document.getElementById('widget-overflow');
            if (!overElt.open)
                overElt.click();
        } else if (overElt.id == 'sidebar-switcher-target') {
            PopElt = document.getElementById('sidebarMenu-popup');
            if (!overElt.classList.contains('active'))
                SidebarUI.toggleSwitcherPanel();
        } else if (IsUrlbarDropmarker(overElt)) {
            PopElt = gURLBar.panel;
            if (!gURLBar.textbox.hasAttribute('open'))
                overElt.click();
        } else {
            PopElt = getPopupMenu(overElt);
            if (IsCustomizationBtn(overElt))
                overElt.open = true;
            else {
                try {
                    let Pos = getPopupPos(overElt);
                    PopElt.removeAttribute('hidden');
                    PopElt.openPopup(overElt, Pos, 0, 0, false, false, null);
                } catch(e) {
                    PopElt = null;
                }
            }
        }
    }

    function HidePopup() {
        try {
            if (overElt.localName == 'dropmarker') {
                try {
                    PopElt.parentNode.closePopup();
                } catch(e) {
                    try {
                        PopElt.hidePopup();
                    } catch(e) { }
                }
            } else if (overElt.localName == 'menulist')
                PopElt.open = false;
            else if (PopElt.hidePopup)
                PopElt.hidePopup();
            else if (PopElt.popupBoxObject)
                PopElt.popupBoxObject.hidePopup();
            else if (IsSearchBtn(overElt))
                searchBar.textbox.closePopup();
            else if (IsPanelMenuBtn(overElt))
                PanelUI.hide();
            else if (IsUrlbarDropmarker(overElt))
                if (gURLBar.textbox.hasAttribute('open'))
                    overElt.click();
        } catch(e) { }

        HideTimer = null;
        overElt = PopElt = null;
    }

    function MouseOver(e) {
        if (!alwaysPop && !document.hasFocus())
            return;
        var popNode, n = e.originalTarget;

        whitesInx = -1;
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
            clearTimeout(HideTimer);
            HideTimer = null;
        }
        try {
            if (IsAutoComplete(popNode)) {
                return;
            };
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
            clearTimeout(PopTimer);
            PopTimer = null;
        }
        if (!HideTimer && PopElt)
            HideTimer = setTimeout(HidePopup, hideDelay);
    }

    window.addEventListener('mouseover', MouseOver, false);

})();