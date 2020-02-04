   (function() {

    if (location != 'chrome://browser/content/browser.xhtml')
       return;

    try {
       CustomizableUI.createWidget({
          id: 'pwuco-toolbarbutton',
          type: 'custom',
          defaultArea: CustomizableUI.AREA_NAVBAR,
          onBuild: function(aDocument) {
             var toolbaritem = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
             var attrs = {
                 id: 'pwuco-toolbarbutton',
                 class: 'chromeclass-toolbar-additional',
                 type: 'menu',
                 removable: true,
                 label: 'Passwörter usw. öffnen',
                 tooltiptext: 'Cookies, Passwörter, Update-Chronik und Zertifikate öffnen'
             };
             for (var a in attrs)
                toolbaritem.setAttribute(a, attrs[a]);
             return toolbaritem;
        }
       });
     CustomizableUI.registerToolbarNode(tb);
   } catch(e) { };

   var css = '\
       #pwuco-toolbarbutton {list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAq9JREFUeNp0U0toE1EUPW/mTWYSOya1FaU/0daFIEgRQbS1pQuFugiIFlyIUhdF3CpKKYKb0iK40JVo7cqNgh9cKH7A4kKQ0gqlurGCmiJBTfpLMpP3Ge9MKhQbB+4b3nv3c86597Hh24/wv09p/VhKldY6oF2w5obBMBg4N5/waoFBEEQmhExfGjgBJdQ6H9MyMXrrQbpqAsYYpJRkCp5fxvtP36jmavLVZd+ulsiH/624roJpQgcCIfzNtfWVBKziG55JJREy45p4KqXTlSTBmjKAZRq4PvYwCmLMQI3rEnSbgjVOpw9SAg0e8jx/thdGoGCsRlY0qOQJqyjGUVYWbo49x8njR6GUgk/wA01CKoLiez72DmdQVxtHTY2FuGMhETOQMAGHqBhUfbBuBAPufbCXV2ivoXecgo+dEQUUij42Jh2kam2CGUPC5khYBpywVYaNnt+jcBdeo+FAF4yYDUiBn59f4ZA7Dx7CXS74sBM2WQzxhANNVaUFlEm1YmCjPX8XTfv7SBQHz8YmCAHDkf5O7Mm9oQSEYLnggcdclEiFfIlBEQUiDuXTXREQkuR3UlEblFeAZuE+STpUuoD8isASOS2WiC9pwEyCSR2QQsMzDHj0F7ksnXP09vfQFJK4uR+00ByEM5YrSHw4l6QD2gVl6kAZGhYE24D8nW1o6OgGj3MUs/OwYjQ61IXvc18xXWgHL64sTcxOT3UNTU4ipBNqIgMTXhDHxfqraGnvhtvShqXMHGbeTcG2GCxO2jT34W1mdzRgrWQhQQzduDfppOrR1NiAjrljSDVux6bmViwuFjE/O42R7BB1RpCI4cwoiOLCBLtwbTwaHiEE8r+y48m6LWfKpHyn9RRtsY8IqI3LJfni8OWZwSrPZoH9c9BItrWKY57sS7WH90eAAQCzXjnOEP9Z6gAAAABJRU5ErkJggg==)}\
       #pwuco-toolbarbutton > dropmarker {display: none}\
       ';

   var stylesheet = document.createProcessingInstruction('xml-stylesheet', 'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(css) + '"');

   document.insertBefore(stylesheet, document.documentElement);
	   
   var menu, menuitem, menuseparator, menupopup;

   // menupopup of toolbarbutton

   menupopup = document.createXULElement('menupopup');
   menupopup.id = "pwuco-button-popup";
   document.getElementById('pwuco-toolbarbutton').appendChild(menupopup);

   menuitem = document.createXULElement('menuitem');
   menuitem.setAttribute('label', "Passwörter öffnen");
   menuitem.setAttribute('tooltiptext', "Passwörter anzeigen");
   menuitem.setAttribute('accesskey', "P");
   menuitem.setAttribute('oncommand', 'openTrustedLinkIn("about:logins", "tab");');
   menupopup.appendChild(menuitem);

   menuitem = document.createXULElement('menuitem');
   menuitem.setAttribute('label', "Cookies öffnen");
   menuitem.setAttribute('tooltiptext', "Cookies anzeigen");
   menuitem.setAttribute('accesskey', "C");
   menuitem.setAttribute('oncommand', "window.open('chrome://browser/content/preferences/siteDataSettings.xhtml', 'Browser:Cookies', 'chrome,resizable=yes');");
   menupopup.appendChild(menuitem);

   menuitem = document.createXULElement('menuitem');
   menuitem.setAttribute('label', "Ausnahmen - Cookies öffnen");
   menuitem.setAttribute('tooltiptext', "Ausnahmen - Cookies anzeigen");
   menuitem.setAttribute('accesskey', "A");
   menuitem.setAttribute('oncommand', "window.open('chrome://browser/content/preferences/permissions.xhtml', 'Browser:permissions', 'chrome,resizable=yes');");
   menupopup.appendChild(menuitem);

   menuitem = document.createXULElement('menuitem');
   menuitem.setAttribute('label', "Zertifikate öffnen");
   menuitem.setAttribute('tooltiptext', "Zertifikate anzeigen");
   menuitem.setAttribute('accesskey', "z");
   menuitem.setAttribute('oncommand', "window.open('chrome://pippki/content/certManager.xhtml', 'mozilla:certmanager', 'chrome,resizable=yes,all,width=830,height=400');");
   menupopup.appendChild(menuitem);
   
   menuseparator = document.createXULElement('menuseparator');
   menupopup.appendChild(menuseparator);
   
   menuitem = document.createXULElement('menuitem');
   menuitem.setAttribute('label', "Chronik löschen");
   menuitem.setAttribute('tooltiptext', "Chronik löschen");
   menuitem.setAttribute('accesskey', "l");
   menuitem.setAttribute('oncommand', "window.open('chrome://browser/content/sanitize.xhtml', 'Toolkit:SanitizeDialog', 'chrome,resizable=yes');");
   menupopup.appendChild(menuitem);

   menuitem = document.createXULElement('menuitem');
   menuitem.setAttribute('label', "Update-Chronik öffnen");
   menuitem.setAttribute('tooltiptext', "Update-Chronik öffnen");
   menuitem.setAttribute('accesskey', "U");
   menuitem.setAttribute('oncommand', "window.open('chrome://mozapps/content/update/history.xhtml', 'Update:History', 'chrome,resizable=yes');");
   menupopup.appendChild(menuitem);

   // submenu of context menu

   menu = document.createXULElement('menu');
   menu.id = "context-pwuco-menu";
   menu.setAttribute('label', "Passwörter und co.");
   menu.setAttribute('accesskey', "o");
   document.getElementById('contentAreaContextMenu')
     .insertBefore(menu, document.getElementById('context-sep-viewbgimage').nextSibling);

   menupopup = document.createXULElement('menupopup');
   menu.appendChild(menupopup);

   menuitem = document.createXULElement('menuitem');
   menuitem.id = "context-password";
   menuitem.setAttribute('label', "Passwörter öffnen");
   menuitem.setAttribute('accesskey', "P");
   menuitem.setAttribute('oncommand', 'openTrustedLinkIn("about:logins", "tab");');
   menupopup.appendChild(menuitem);

   menuitem = document.createXULElement('menuitem');
   menuitem.id = "context-opencookies";
   menuitem.setAttribute('label', "Cookies öffnen");
   menuitem.setAttribute('accesskey', "C");
   menuitem.setAttribute('oncommand', "window.open('chrome://browser/content/preferences/siteDataSettings.xhtml', 'Browser:Cookies', 'chrome,resizable=yes');");
   menupopup.appendChild(menuitem);   
   
   menuitem = document.createXULElement('menuitem');
   menuitem.id = "context-open-permissions";
   menuitem.setAttribute('label', "Ausnahmen - Cookies öffnen");
   menuitem.setAttribute('tooltiptext', "Ausnahmen - Cookies anzeigen");
   menuitem.setAttribute('accesskey', "A");
   menuitem.setAttribute('oncommand', "window.open('chrome://browser/content/preferences/permissions.xhtml', 'Browser:permissions', 'chrome,resizable=yes');");
   menupopup.appendChild(menuitem);

   menuitem = document.createXULElement('menuitem');
   menuitem.id = "context-opencert";
   menuitem.setAttribute('label', "Zertifikate öffnen");
   menuitem.setAttribute('accesskey', "z");
   menuitem.setAttribute('oncommand', "window.open('chrome://pippki/content/certManager.xhtml', 'mozilla:certmanager', 'chrome,resizable=yes,all,width=830,height=400');");
   menupopup.appendChild(menuitem);
      
   menuseparator = document.createXULElement('menuseparator');
   menupopup.appendChild(menuseparator);
   
   menuitem = document.createXULElement('menuitem');
   menuitem.id = "context-opensanitize";
   menuitem.setAttribute('label', "Chronik löschen");
   menuitem.setAttribute('accesskey', "l");
   menuitem.setAttribute('oncommand', "window.open('chrome://browser/content/sanitize.xhtml', 'Toolkit:SanitizeDialog', 'chrome,resizable=yes');");
   menupopup.appendChild(menuitem);

   menuitem = document.createXULElement('menuitem');
   menuitem.id = "context-openupdate";
   menuitem.setAttribute('label', "Update-Chronik öffnen");
   menuitem.setAttribute('accesskey', "U");
   menuitem.setAttribute('oncommand', "window.open('chrome://mozapps/content/update/history.xhtml', 'Update:History', 'chrome,resizable=yes');");
   menupopup.appendChild(menuitem);
   
      // submenu of context menu2

   menu = document.createXULElement('menu');
   menu.id = "context-pwuco-menu2";
   menu.setAttribute('label', "Passwörter und co.");
   menu.setAttribute('accesskey', "o");
   document.getElementById('menu_ToolsPopup')
     .insertBefore(menu, document.getElementById('menu_openDownloads').nextSibling);

   menupopup = document.createXULElement('menupopup');
   menu.appendChild(menupopup);

   menuitem = document.createXULElement('menuitem');
   menuitem.id = "context-password";
   menuitem.setAttribute('label', "Passwörter öffnen");
   menuitem.setAttribute('accesskey', "P");
   menuitem.setAttribute('oncommand', 'openTrustedLinkIn("about:logins", "tab");');
   menupopup.appendChild(menuitem);

   menuitem = document.createXULElement('menuitem');
   menuitem.id = "context-opencookies";
   menuitem.setAttribute('label', "Cookies öffnen");
   menuitem.setAttribute('accesskey', "C");
   menuitem.setAttribute('oncommand', "window.open('chrome://browser/content/preferences/siteDataSettings.xhtml', 'Browser:Cookies', 'chrome,resizable=yes');");
   menupopup.appendChild(menuitem);
   
   menuitem = document.createXULElement('menuitem');
   menuitem.id = "context-open-permissions";
   menuitem.setAttribute('label', "Ausnahmen - Cookies öffnen");
   menuitem.setAttribute('tooltiptext', "Ausnahmen - Cookies anzeigen");
   menuitem.setAttribute('accesskey', "A");
   menuitem.setAttribute('oncommand', "window.open('chrome://browser/content/preferences/permissions.xhtml', 'Browser:permissions', 'chrome,resizable=yes');");
   menupopup.appendChild(menuitem);

   menuitem = document.createXULElement('menuitem');
   menuitem.id = "context-opencert";
   menuitem.setAttribute('label', "Zertifikate öffnen");
   menuitem.setAttribute('accesskey', "z");
   menuitem.setAttribute('oncommand', "window.open('chrome://pippki/content/certManager.xhtml', 'mozilla:certmanager', 'chrome,resizable=yes,all,width=830,height=400');");
   menupopup.appendChild(menuitem);
      
   menuseparator = document.createXULElement('menuseparator');
   menupopup.appendChild(menuseparator);
   
   menuitem = document.createXULElement('menuitem');
   menuitem.id = "context-opensanitize";
   menuitem.setAttribute('label', "Chronik löschen");
   menuitem.setAttribute('accesskey', "l");
   menuitem.setAttribute('oncommand', "window.open('chrome://browser/content/sanitize.xhtml', 'Toolkit:SanitizeDialog', 'chrome,resizable=yes');");
   menupopup.appendChild(menuitem);

   menuitem = document.createXULElement('menuitem');
   menuitem.id = "context-openupdate";
   menuitem.setAttribute('label', "Update-Chronik öffnen");
   menuitem.setAttribute('accesskey', "U");
   menuitem.setAttribute('oncommand', "window.open('chrome://mozapps/content/update/history.xhtml', 'Update:History', 'chrome,resizable=yes');");
   menupopup.appendChild(menuitem);

})();