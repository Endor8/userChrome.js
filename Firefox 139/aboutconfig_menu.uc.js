/* Firefox userChrome script
 * Shortcut menu to modify about:config entries
 * Tested on Firefox 139+
 * Author: garywill (https://garywill.github.io)
 * 
 */

// ==UserScript==
// @include         main
// @onlyonce
// ==/UserScript==

console.log("aboutconfig_menu.uc.js");

(() => {
  

    const prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
    ChromeUtils.importESModule("resource:///modules/CustomizableUI.sys.mjs")
    const sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);
    // ---------------------------------------------------------------------------------------
    
    const button_label = "about:config Kontextmenü";
    const cssuri_icon = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent(`
            toolbarbutton#aboutconfig-button .toolbarbutton-icon {
                list-style-image: url("data:image/svg+xml;base64,PCEtLSBUaGlzIFNvdXJjZSBDb2RlIEZvcm0gaXMgc3ViamVjdCB0byB0aGUgdGVybXMgb2YgdGhlIE1vemlsbGEgUHVibGljCiAgIC0gTGljZW5zZSwgdi4gMi4wLiBJZiBhIGNvcHkgb2YgdGhlIE1QTCB3YXMgbm90IGRpc3RyaWJ1dGVkIHdpdGggdGhpcwogICAtIGZpbGUsIFlvdSBjYW4gb2J0YWluIG9uZSBhdCBodHRwOi8vbW96aWxsYS5vcmcvTVBMLzIuMC8uIC0tPgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiB2aWV3Qm94PSIwIDAgMTYgMTYiPjxwYXRoIGZpbGw9ImNvbnRleHQtZmlsbCIgZD0iTTEzLjkgOS44MWExLjIzIDEuMjMgMCAwIDAgMC0uMTd2LS4wOGE1LjY3IDUuNjcgMCAwIDAtMi40LTMuMzYgMS4xNyAxLjE3IDAgMCAxLS41Ni0uOTVWM2ExIDEgMCAwIDAtMS0xSDYuMDZhMSAxIDAgMCAwLTEgMXYyLjI1YTEuMTcgMS4xNyAwIDAgMS0uNTYgMSA1LjY2IDUuNjYgMCAwIDAtMi4zNSAzLjMzdi4xMmEuNTMuNTMgMCAwIDAgMCAuMTEgNS4zNSA1LjM1IDAgMCAwLS4xMSAxIDUuNjUgNS42NSAwIDAgMCAzLjI0IDUuMDkgMSAxIDAgMCAwIC40NC4xaDQuNTdhMSAxIDAgMCAwIC40NC0uMUE1LjY1IDUuNjUgMCAwIDAgMTQgMTAuODNhNS4zIDUuMyAwIDAgMC0uMS0xLjAyem0tOC4yNy0yYTMuMTggMy4xOCAwIDAgMCAxLjQzLTIuNlY0aDEuODh2MS4yNWEzLjE4IDMuMTggMCAwIDAgMS40MyAyLjYgMy42OCAzLjY4IDAgMCAxIDEuNTQgMi4yNHYuMjJhMi44MiAyLjgyIDAgMCAxLTMuNjgtLjU5QTMuNDggMy40OCAwIDAgMCA0LjU2IDlhMy43NiAzLjc2IDAgMCAxIDEuMDctMS4xNXoiPjwvcGF0aD48L3N2Zz4=");
            }
            toolbarbutton#aboutconfig-button .toolbarbutton-badge {
                background-color: #009f00;
                visibility: hidden; 
            }           
            `), null, null);
    const cssuri_warnbadge = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent(`
            toolbarbutton#aboutconfig-button .toolbarbutton-badge {
                background-color: red ;
                visibility: unset;
            } 
            `), null, null);
   
    sss.loadAndRegisterSheet(cssuri_icon, sss.USER_SHEET);
  
    
    var prefItems = [ 
    {
            name: "📼 Kein automatisches Popup beim Download",
            type: prefs.PREF_BOOL,
            pref: "browser.download.alwaysOpenPanel",
            possibleVals: [
                {  val: false },
                {  val: true },
            ]
        },
    {
            name: "🎞️ Beim Schließen vom letzten Tab den Browser nicht schließen",
            type: prefs.PREF_BOOL,
            pref: "browser.tabs.closeWindowWithLastTab",
            possibleVals: [
                {  val: false },
                {  val: true },
            ]
        },
        "seperator",
    {
            name: "🔎 Suche aus Suchleiste im neuen Tab öffnen",
            type: prefs.PREF_BOOL,
            pref: "browser.search.openintab",
            possibleVals: [
                {  val: false },
                {  val: true },
            ]
        },
    {
            name: "📖 Lesezeichen im neuen Tab öffnen",
            type: prefs.PREF_BOOL,
            pref: "browser.tabs.loadBookmarksInTabs",
            possibleVals: [
                {  val: false },
                {  val: true },
            ]
        },
    {
            name: "📖 Link aus Adressleiste im neuen Tab öffnen",
            type: prefs.PREF_BOOL,
            pref: "browser.urlbar.openintab",
            possibleVals: [
                {  val: false },
                {  val: true },
            ]
        },
        "seperator",
    {
            name: "🎊 Animations Modus",
            type: prefs.PREF_STRING,
            pref: "image.animation_mode",
            possibleVals: [
                { name: "Einmal", val: "once" },
                { name: "Keine", val: "none" },
                { name: "Dauerhaft", val: "normal" },
            ]
        },
        "seperator",
    {
            name: "🔏 CSP aktivieren - deaktivieren",
            type: prefs.PREF_BOOL,
            pref: "security.browser_xhtml_csp.enabled",
            possibleVals: [
                {  val: false  },
                {  val: true },
            ]
        },
    
    {
            name: "🔏 eval erlauben - verbieten",
            type: prefs.PREF_BOOL,
            pref: "security.allow_unsafe_dangerous_privileged_evil_eval",
            possibleVals: [
                {  val: false  },
                {  name: "true ⚠️",  val: true , sign: '‼️' },
            ]
    },
    {
        name: "🌐 IPv6 ausschalten",
        type: prefs.PREF_BOOL,
        pref: "network.dns.disableIPv6",
        possibleVals: [
            {  val: false },
            {  val: true },
        ]
    },
    {
        name: "🔐 DNS Modus",
        type: prefs.PREF_INT,
        pref: "network.trr.mode",
        possibleVals: [
            { name: "0 - Default" , val: 0 },
            { name: "2 - DoH, fallback Plain DNS" , val: 2 },
            { name: "3 - DoH only" , val: 3 }, 
            { name: "5 - Plain DNS" , val: 5 }
        ]
    },
    {
        name: "🔐 DoH server",
        type: prefs.PREF_STRING,
        pref: "network.trr.uri",
        possibleVals: [
            { name: "Cloudflare" , val: "https://mozilla.cloudflare-dns.com/dns-query" },
            { name: "NextDNS" , val: "https://firefox.dns.nextdns.io/" }
        ] // See buildin DoH at 'network.trr.resolvers'
    },
    {
        name: "🔏 Veraltete TLS Version aktivieren",
        type: prefs.PREF_BOOL,
        pref: "security.tls.version.enable-deprecated",
        possibleVals: [
            { val: false  },
            { name: "true ⚠️",  val: true , sign: '‼️'},
        ]
    },
    
        "seperator",
    {
        name: "🖱️ Mausrad-Y-Multiplikator",
        type: prefs.PREF_INT,
        pref: "mousewheel.default.delta_multiplier_y",
        possibleVals: [
            { val: 150 },
        ]
    },
    {
        name: "🖱️ Vertikaler Faktor des Systembildlaufes",
        type: prefs.PREF_INT,
        pref: "mousewheel.system_scroll_override.vertical.factor",
        possibleVals: [
            { val: 250 },
        ]
    },
    
    
        "seperator",
    {
        name: "▶️ Autoplay Medien Standard",
        type: prefs.PREF_INT,
        pref: "media.autoplay.default",
        possibleVals: [
            { val: 0, name: "0 - allow" },
            { val: 1, name: "1 - blockAudible 👍" },
            { val: 5, name: "5 - blockAll" },
        ]
    },
    {
            name: "📺 Videos gesperrt - Videos frei",
            type: prefs.PREF_BOOL,
            pref: "media.mediasource.enabled",
            possibleVals: [
                {  val: false  },
                {  val: true },
            ]
    },
    {
        name: "▶️ Media Autoplay ext bg",
        type: prefs.PREF_BOOL,
        pref: "media.autoplay.allow-extension-background-pages",
        possibleVals: [
            {  val: false  },
            {  val: true },
        ]
    },
    {
        name: "▶️ Richtlinien zur Sperrung von Autoplay-Medien",
        type: prefs.PREF_INT,
        pref: "media.autoplay.blocking_policy",
        possibleVals: [
            { val: 0, name: "0 - no block" },
            { val: 1, name: "1 - block 👍" },
            { val: 2, name: "2 - block more" },
            // 0=sticky (default), 1=transient, 2=user
        ]
    },
    {
        name: "▶️ InternetAudio",
        type: prefs.PREF_BOOL,
        pref: "dom.webaudio.enabled",
        possibleVals: [
            {  val: false },
            {  val: true  ,  sign: '‼️' , warnbadge: true},
        ]
    },

        "seperator",    
    {
        name: "🔤 Benutzerdefinierte Web-Schriften zulassen",
        type: prefs.PREF_INT,
        pref: "browser.display.use_document_fonts",
        possibleVals: [
            { name: "1 - Allow", val: 1 },
            { name: "0 - Disallow", val: 0 },
        ]
    },
    {
        name: "💻 Keine Popup Anmeldung für Browser-Werkzeuge",
        type: prefs.PREF_BOOL,
        pref: "devtools.debugger.prompt-connection",
        possibleVals: [
            {  val: true  },
            { name: "false ⚠️",   val: false , sign: '‼️' },
        ]
    },       
    {
        name: "🔏 Tooltips aktivieren - deaktivieren",
        type: prefs.PREF_BOOL,
        pref: "browser.chrome.toolbar_tips",
        possibleVals: [
            {  val: false  },
            {  val: true },
        ]
    },
    ];
    
    if (!window.gBrowser){
    return;
    }

    CustomizableUI.createWidget({
        id: 'aboutconfig-button', // button id
        type: "custom",
        defaultArea: CustomizableUI.AREA_NAVBAR,
        removable: true,
        onBuild: function (doc) {
            let btn = doc.createXULElement('toolbarbutton');
            btn.id = 'aboutconfig-button';
            btn.label = button_label;
            btn.tooltipText = button_label;
            btn.type = 'menu';
            btn.className = 'toolbarbutton-1 chromeclass-toolbar-additional';
            btn.setAttribute("badged", "true"); 
            btn.setAttribute("badge", "!"); 
            
            let mp = doc.createXULElement("menupopup");
            mp.id = 'aboutconfig-popup';
            mp.onclick = function(event) {  event.preventDefault()  ;} ;
            

            
            prefItems.forEach( function (item, items_i) { // loop every user defined pref
                
                if (item === "seperator") 
                {
                    mp.appendChild(doc.createXULElement('menuseparator'));
                    return;
                }
                
                //var current_val = getItemCurrentVal(item) ;
                var menu = doc.createXULElement("menu");
                menu.label = item.name ? item.name : item.pref ;
                menu.id = "aboutconfig_menu_" + items_i ;
                menu.className = 'menuitem-iconic' ;
                
            
                var menupopup = doc.createXULElement("menupopup");
                menupopup.id = "aboutconfig_menupopup_" + items_i ;
                menupopup.className = 'menuitem-iconic' ;
                

                
                item.possibleVals.forEach( function (pv, i) { // loop every possible value
                    
                    var display_val = prefPossibleValToDisplay(item, pv.val) ;
                    
                    // Submenu item. One is one possible value
                    var menuitem = doc.createXULElement("menuitem");
                    menuitem.label = pv.name ? pv.name : display_val ;
                    menuitem.id = "aboutconfig_menu_" + items_i + "__" + i  ;
                    menuitem.setAttribute('type', 'radio') ;
                    menuitem.className = 'menuitem-iconic' ;
                    menuitem.tooltipText = display_val ;

                    if (pv ['sign'])
                        menuitem.label += '　　' + pv['sign']; 
                    
                    
                    menuitem.addEventListener('click', function(event) { 
                        //console.log(this.id); 
                        setItemPrefVal(item , pv.val);
                    } ) ;
                    menupopup.appendChild(menuitem);
                    
                });           
                                
                var default_val = getItemDefaultVal(item);
                var default_val_display = null;
                var reset_label = "Zurücksetzen: ";
                if (item.signWhenDefaultVal)
                    reset_label += item.signWhenDefaultVal + '　' ;
                if (default_val !== undefined && default_val !== null)
                {
                    default_val_display = prefPossibleValToDisplay(item, default_val);
                    reset_label += default_val_display ;
                }
                else
                    reset_label += ' (delete in about:config)'
                
                menupopup.appendChild(
                    doc.createXULElement('menuseparator')
                );
                
                // Submenu entry to reset a pref to default
                var default_item = doc.createXULElement("menuitem");
                default_item.id = "aboutconfig_menu_" + items_i + "__default" ;
                default_item.className = 'menuitem-iconic';
                default_item.label = reset_label;
                default_item.tooltipText = default_val_display;

                default_item.addEventListener('click', function(event) { 
                    //console.log(this.id); 
                    //setItemPrefVal(item , getItemDefaultVal(item) );
                    prefs.clearUserPref(item.pref);
                } ) ;
                
                menupopup.appendChild(default_item);
                
                //------------
                menu.appendChild(menupopup);
                mp.appendChild(menu);
                
                
            });
            
            btn.appendChild(mp);

            mp.addEventListener('popupshowing', function() { 
                //console.log(this);
                evalPopulateMenu(this); 
                
                update_badge();
                
            });

            btn.onclick = function(event) {
                if (event.button == 1) {
                    const win = Components.classes["@mozilla.org/appshell/window-mediator;1"]
                        .getService(Components.interfaces.nsIWindowMediator)
                        .getMostRecentWindow("navigator:browser");
                    win.gBrowser.selectedTab = win.gBrowser.addTrustedTab('about:config');
                }
                
                update_badge();
            };
            
            return btn;
        }
    });
    
    function getItemDefaultVal (item) {
        var default_val = undefined;
        try{
            if ( item.type == prefs.PREF_BOOL )
                default_val = prefs.getDefaultBranch(item.pref).getBoolPref('');
            else if ( item.type == prefs.PREF_INT )
                default_val = prefs.getDefaultBranch(item.pref).getIntPref('');
            else if ( item.type == prefs.PREF_STRING )
                default_val = prefs.getDefaultBranch(item.pref).getStringPref('');
        }catch(err) { default_val = null }
        
        return default_val;
    }
    function getItemCurrentVal (item) {
        var current_val = null;
        try{
            if ( item.type == prefs.PREF_BOOL )
                current_val = prefs.getBoolPref(item.pref);
            else if ( item.type == prefs.PREF_INT )
                current_val = prefs.getIntPref(item.pref);
            else if ( item.type == prefs.PREF_STRING )
                current_val = prefs.getStringPref(item.pref);
        }catch(err){ }
        return current_val ;
    }
    
    function if_pref_current_val_is (item, pv_index) {
        var current_val = getItemCurrentVal(item) ;
        if (current_val === null)
            return false;
        
        if ( current_val === item.possibleVals[pv_index].val )
            return true;
        else 
            return false;
    }
    
    function setItemPrefVal(item, newVal)
    {
        if ( item.type == prefs.PREF_BOOL )
            prefs.setBoolPref(item.pref, newVal);
        else if ( item.type == prefs.PREF_INT )
            prefs.setIntPref(item.pref, newVal);
        else if ( item.type == prefs.PREF_STRING )
            prefs.setStringPref(item.pref, newVal);
        
        update_badge();
    }
    function prefPossibleValToDisplay(item, possible_val ) {
        if (possible_val === null) 
            return "null";
        
        var display_val = possible_val.toString();
        if (item.type == prefs.PREF_STRING)
            display_val = `'${display_val}'`;
        
        return display_val;
    }
    
    function evalPopulateMenu(popupmenu)
    {
        prefItems.forEach( function (item, items_i) {
            if (item === "seperator") 
                return;
            
            const menu = popupmenu.querySelector("#aboutconfig_menu_" + items_i);
            menu.label = item.name ? item.name : item.pref ;
            menu.style.fontWeight = "";
            
            const default_val = getItemDefaultVal(item);
                    
            var current_val = getItemCurrentVal(item) ;
            var current_val_display = prefPossibleValToDisplay(item, current_val);
            menu.tooltipText = `Pref: ${item.pref}\nValue: ${current_val_display}`;
            
            if (current_val !== null)
            {
                if (item.type == prefs.PREF_BOOL) 
                    menu.label += '　　[' + ( current_val?'T':'F' ) + ']';
                else if (item.type == prefs.PREF_INT) 
                    menu.label += '　　[' + current_val + ']';
                else if (item.type == prefs.PREF_STRING) {
                    var current_val_display_short;
                    
                    if (current_val.length > 8)
                        current_val_display_short = current_val.substring(0, 6) + '..'; 
                    else 
                        current_val_display_short = current_val;
                    
                    menu.label += '　　[' + current_val_display_short + ']';
                }
            } 
            
            if (current_val !== default_val)
                menu.style.fontWeight = "bold";
            
            if (current_val === default_val && item.signWhenDefaultVal)
                menu.label += '　　' + item.signWhenDefaultVal;

            
            item.possibleVals.forEach( function (pv, i) {
                menuitem = popupmenu.querySelector("#aboutconfig_menu_" + items_i + "__" + i);
                if ( if_pref_current_val_is(item, i) )
                { 
                    menuitem.setAttribute("checked",true);
                 
                    if (pv ['sign'])
                        menu.label += '　　' + pv['sign'];
                }
                else 
                    menuitem.setAttribute("checked",false);
            });
        });
    }
    
    function add_warnbadge()
    {
        if ( ! sss.sheetRegistered(cssuri_warnbadge, sss.USER_SHEET) )
             sss.loadAndRegisterSheet(cssuri_warnbadge, sss.USER_SHEET);
    }
    function rm_warnbadge()
    {
        if ( sss.sheetRegistered(cssuri_warnbadge, sss.USER_SHEET) )
             sss.unregisterSheet(cssuri_warnbadge, sss.USER_SHEET);
    }
    
    update_badge();
    async function update_badge()
    {
        
        var show_warnbadge = false;
        
        for (item of prefItems)
        {
            if (typeof(item) === "string")
                continue;
            
            const current_val = getItemCurrentVal(item) ;
            if (
                item.possibleVals.some ( function(ele) {
                    return ( ele ['val'] === current_val && ele ['warnbadge'] && ele ['warnbadge'] === true );
                } )
            )
            {
                show_warnbadge = true;
                break;
            }
        }
             
        
        if (show_warnbadge)
            add_warnbadge();
        else 
            rm_warnbadge();
    }
    
    
})();
