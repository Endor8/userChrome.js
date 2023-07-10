// ==UserScript==
// @name           BookmarkCount.uc.js
// @namespace      https://www.camp-firefox.de/forum/thema/136572/?postID=1229696#post1229696
// @description    Zeigt bei Menü - Lesezeichen, Lesezeichen Symbolleiste, bei Ordnern die Anzahl 
// @description    der enthaltenen Unterordner und Lesezeichen an.
// @compatibility  Firefox 115
// @author         BrokenHeart

(function() {

    if (!window.gBrowser)
        return;
    
    setTimeout(function() {
        setFunction();
    },50);

    function setFunction() {

        const css =`
            .countClass::after {
                content: attr(data-value); 
                color: red;
                font-size: 14px;         /* Schriftgröße */
                font-weight: 600;        /* Schriftstärke */
                padding-right: 15px;     /* Abstand nach rechts */
            }
        `;

        const sss = Cc['@mozilla.org/content/style-sheet-service;1'].getService(Ci.nsIStyleSheetService);
        const uri = Services.io.newURI('data:text/css,' + encodeURIComponent(css));
        sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);

        let bmbMenu = document.getElementById('bookmarks-menu-button');
        let bookMenu = document.getElementById('bookmarksMenu');
        let persToolBar = document.getElementById('PersonalToolbar');
        
        if(bmbMenu)
            bmbMenu.addEventListener('popupshowing', onPopupShowing ); 
        if(bookMenu)
            bookMenu.addEventListener('popupshowing', onPopupShowing ); 
        if(persToolBar)
            persToolBar.addEventListener('popupshowing', onPopupShowing ); 
    }
    
    function onPopupShowing(aEvent) {
        
        let popup = aEvent.originalTarget;

        for (let item of popup.children) {
            if (item.localName != 'menu' || item.id?.startsWith('history'))
                continue;
            setTimeout(() => {
              let itemPopup = item.menupopup;
              itemPopup.hidden = true;
              itemPopup.collapsed = true;
              itemPopup.openPopup();
              itemPopup.hidePopup();
              let menuitemCount = 0;
              let menuCount = 0;
              for (let subitem of itemPopup.children) {
                if (subitem.classList.contains('bookmark-item') && !subitem.disabled && !subitem.hidden) {
                  if (subitem.localName == 'menuitem') {
                    menuitemCount++;
                  } else if (subitem.localName == 'menu') {
                    menuCount++;
                  }
                }
              }
              itemPopup.hidden = false;
              itemPopup.collapsed = false;
              
              let label = item.childNodes[3]; //[1]=Linksbündig ausrichten
  
              label.classList.add('countClass');
              let strCountOut = "  (" + menuCount + "/" + menuitemCount + ")"
              label.setAttribute('data-value', strCountOut);

            }, 100);
        }
    }
    
})();
