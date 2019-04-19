   (function() {

    if (location != 'chrome://browser/content/browser.xul')
       return;

    try {
       CustomizableUI.createWidget({
          id: 'about-toolbarbutton',
          type: 'custom',
          defaultArea: CustomizableUI.AREA_NAVBAR,
          onBuild: function(aDocument) {
             var toolbaritem = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
             var attrs = {
                 id: 'about-toolbarbutton',
                 class: 'chromeclass-toolbar-additional',
                 type: 'menu',
                 removable: true,
                 label: 'about Seiten öffnen',
                 tooltiptext: 'about Seiten öffnen'
             };
             for (var a in attrs)
                toolbaritem.setAttribute(a, attrs[a]);
             return toolbaritem;
        }
       });
   } catch(e) { };

   var css = '\
       #about-toolbarbutton {list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAvdJREFUeNp8U1tIVFEUXefOnTuj+EpFJTEETSQKogdkBBYRIWERBoZ9BRlYQhj9mH75kUlg9mlhJUEgGZmRRWrkKx+NlD0U0zRmeljojKPjzJ37Ou17nfoQ6Vw253DuWevsddberKbxIRjnrZyjiIODARQMNgEQuN7ijss9KXCDdjnWDoExiIZhtGZu2liUmpIMzlcJRAK/mdMxOS8XM1kpXgs2zwiCAElkj1F14z5fDmvctyxz75JszSvBMC+5Ncx1YlQiEY6EuVb56ihtdnHKgCOsaBiZcFtpmmlJNgZO+xrt1PbNYUtqAtKTnNbV3/0cn+f9uLw7wTxtStCh6TqSExIJTGeIwG7qZ17IJL1waxpa37nhDTjBPnTDM/kRjNJvHs+Bg2cTAcnTNB2d/SOki1kkIjM1JsGgufXtV5zZl4k7d1twMCsFp05UYnHRj5npaXgGhyDCMKBqGgry91gEzCJgGOuaAilBxYFMa1anXNhccAGd3a8w/mkcqhyE3Wa6QEoUkvC81/VPggmI4U6U3x4lO4lUEJHhlBAIBpG4IRErAT/md5QitPCj3bQRiqKiYH/eag2wiE1ELLEgmu61oa76/K72By0ukbTHxsZADmtIdt2EKNqOimQ+STDQ+XrYun2VwPw4juzNRYeSjMKWiZKd2xHyBgJRkiShuroSuqqjvqHBsDKQNRW52WlWidiYSC7Y4RAMVPW4MRudjabDuRev9c/gkDz2q3tgJBU28+mM6YGBvkuiWaRKWLWcsO4mcO3gZsyGTmNRqkB/2TacbfMgNS4OjUPCQOh6/ZVIQYYovlguKASOcsZjRfbB6YhGVd44jnf7MWiCH3mQHichGPQhNtoR47jaP1qx3AGVHtYsfIGTZp2KKawuUQ/YEFK84EyhalRR/nQO6fFOhIJ+jL13vfhdc+ycHYb1wCyShiivLPc8edabbzbS30ZxMAM5LA2eb8C83YaFn+6Xc3UlZRm1XTPhdRoriyIB/x8+ipn1fvwRYABPz3B9ncIrWwAAAABJRU5ErkJggg==)}\
       #about-toolbarbutton > dropmarker {display: none}\
       ';

   var stylesheet = document.createProcessingInstruction('xml-stylesheet', 'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(css) + '"');

   document.insertBefore(stylesheet, document.documentElement);
	   
   var menu, menuitem, menuseparator, menupopup;

   // menupopup of toolbarbutton

   menupopup = document.createElement('menupopup');
   menupopup.id = "about-button-popup";
   document.getElementById('about-toolbarbutton').appendChild(menupopup);
   
   menuitem = document.createElement('menuitem');
   menuitem.setAttribute('label', "about:about");
   menuitem.setAttribute('tooltiptext', "about:about öffnen");
   menuitem.setAttribute('accesskey', "o");
   menuitem.setAttribute('oncommand', 'openTrustedLinkIn("about:about", "tab");');
   menupopup.appendChild(menuitem);   
   
   menuitem = document.createElement('menuitem');
   menuitem.setAttribute('label', "about:addons");
   menuitem.setAttribute('tooltiptext', "about:addons öffnen");
   menuitem.setAttribute('accesskey', "a");
   menuitem.setAttribute('oncommand', 'openTrustedLinkIn("about:addons", "tab");');
   menupopup.appendChild(menuitem);   
   
   menuitem = document.createElement('menuitem');
   menuitem.setAttribute('label', "about:buildconfig");
   menuitem.setAttribute('tooltiptext', "about:buildconfig öffnen");
   menuitem.setAttribute('accesskey', "b");
   menuitem.setAttribute('oncommand', 'openTrustedLinkIn("about:buildconfig", "tab");');
   menupopup.appendChild(menuitem);     
   
   menuitem = document.createElement('menuitem');
   menuitem.setAttribute('label', "about:cache");
   menuitem.setAttribute('tooltiptext', "about:cache öffnen");
   menuitem.setAttribute('accesskey', "c");
   menuitem.setAttribute('oncommand', 'openTrustedLinkIn("about:cache", "tab");');
   menupopup.appendChild(menuitem);
      
   menuitem = document.createElement('menuitem');
   menuitem.setAttribute('label', "about:config");
   menuitem.setAttribute('tooltiptext', "about:config öffnen");
   menuitem.setAttribute('accesskey', "g");
   menuitem.setAttribute('oncommand', 'openTrustedLinkIn("about:config", "tab");');
   menupopup.appendChild(menuitem);
   
   menuitem = document.createElement('menuitem');
   menuitem.setAttribute('label', "about:crashes");
   menuitem.setAttribute('tooltiptext', "about:crashes öffnen");
   menuitem.setAttribute('accesskey', "r");
   menuitem.setAttribute('oncommand', 'openTrustedLinkIn("about:crashes", "tab");');
   menupopup.appendChild(menuitem);
   
   menuitem = document.createElement('menuitem');
   menuitem.setAttribute('label', "about:containers");
   menuitem.setAttribute('tooltiptext', "about:containers öffnen");
   menuitem.setAttribute('accesskey', "r");
   menuitem.setAttribute('oncommand', 'openTrustedLinkIn("about:preferences#containers", "tab");');
   menupopup.appendChild(menuitem);   
   
   menuitem = document.createElement('menuitem');
   menuitem.setAttribute('label', "about:debugging");
   menuitem.setAttribute('tooltiptext', "about:debugging öffnen");
   menuitem.setAttribute('accesskey', "d");
   menuitem.setAttribute('oncommand', 'openTrustedLinkIn("about:debugging", "tab");');
   menupopup.appendChild(menuitem);
   
   menuitem = document.createElement('menuitem');
   menuitem.setAttribute('label', "about:home");
   menuitem.setAttribute('tooltiptext', "about:home öffnen");
   menuitem.setAttribute('accesskey', "h");
   menuitem.setAttribute('oncommand', 'openTrustedLinkIn("about:home", "tab");');
   menupopup.appendChild(menuitem);
   
   menuitem = document.createElement('menuitem');
   menuitem.setAttribute('label', "about:memory");
   menuitem.setAttribute('tooltiptext', "about:memory öffnen");
   menuitem.setAttribute('accesskey', "m");
   menuitem.setAttribute('oncommand', 'openTrustedLinkIn("about:memory", "tab");');
   menupopup.appendChild(menuitem);
   
   menuitem = document.createElement('menuitem');
   menuitem.setAttribute('label', "about:networking");
   menuitem.setAttribute('tooltiptext', "about:networking öffnen");
   menuitem.setAttribute('accesskey', "w");
   menuitem.setAttribute('oncommand', 'openTrustedLinkIn("about:networking", "tab");');
   menupopup.appendChild(menuitem);
   
   menuitem = document.createElement('menuitem');
   menuitem.setAttribute('label', "about:newtab");
   menuitem.setAttribute('tooltiptext', "about:newtab öffnen");
   menuitem.setAttribute('accesskey', "n");
   menuitem.setAttribute('oncommand', 'openTrustedLinkIn("about:newtab", "tab");');
   menupopup.appendChild(menuitem);   
   
   menuitem = document.createElement('menuitem');
   menuitem.setAttribute('label', "about:performance");
   menuitem.setAttribute('tooltiptext', "about:performance öffnen");
   menuitem.setAttribute('accesskey', "f");
   menuitem.setAttribute('oncommand', 'openTrustedLinkIn("about:performance", "tab");');
   menupopup.appendChild(menuitem);

   menuitem = document.createElement('menuitem');
   menuitem.setAttribute('label', "about:plugins");
   menuitem.setAttribute('tooltiptext', "about:plugins öffnen");
   menuitem.setAttribute('accesskey', "P");
   menuitem.setAttribute('oncommand', 'openTrustedLinkIn("about:plugins", "tab");');
   
   menupopup.appendChild(menuitem);
   menuitem = document.createElement('menuitem');
   menuitem.setAttribute('label', "about:preferences");
   menuitem.setAttribute('tooltiptext', "about:preferences öffnen");
   menuitem.setAttribute('accesskey', "e");
   menuitem.setAttribute('oncommand', 'openTrustedLinkIn("about:preferences", "tab");');
   menupopup.appendChild(menuitem);
   
   menuitem = document.createElement('menuitem');
   menuitem.setAttribute('label', "about:profiles");
   menuitem.setAttribute('tooltiptext', "about:profiles öffnen");
   menuitem.setAttribute('accesskey', "i");
   menuitem.setAttribute('oncommand', 'openTrustedLinkIn("about:profiles", "tab");');
   menupopup.appendChild(menuitem);
   
   menuitem = document.createElement('menuitem');
   menuitem.setAttribute('label', "about:serviceworkers");
   menuitem.setAttribute('tooltiptext', "about:serviceworkers öffnen");
   menuitem.setAttribute('accesskey', "v");
   menuitem.setAttribute('oncommand', 'openTrustedLinkIn("about:serviceworkers", "tab");');
   menupopup.appendChild(menuitem); 
   
   menuitem = document.createElement('menuitem');
   menuitem.setAttribute('label', "about:support");
   menuitem.setAttribute('tooltiptext', "about:support öffnen");
   menuitem.setAttribute('accesskey', "u");
   menuitem.setAttribute('oncommand', 'openTrustedLinkIn("about:support", "tab");');
   menupopup.appendChild(menuitem);
   
   menuitem = document.createElement('menuitem');
   menuitem.setAttribute('label', "about:sync-log");
   menuitem.setAttribute('tooltiptext', "about:sync-log öffnen");
   menuitem.setAttribute('accesskey', "l");
   menuitem.setAttribute('oncommand', 'openTrustedLinkIn("about:sync-log", "tab");');
   menupopup.appendChild(menuitem);    
   
   menuitem = document.createElement('menuitem');
   menuitem.setAttribute('label', "about:telemetry");
   menuitem.setAttribute('tooltiptext', "about:telemetry öffnen");
   menuitem.setAttribute('accesskey', "t");
   menuitem.setAttribute('oncommand', 'openTrustedLinkIn("about:telemetry", "tab");');
   menupopup.appendChild(menuitem);    
   
   menuitem = document.createElement('menuitem');
   menuitem.setAttribute('label', "about:url-classifier");
   menuitem.setAttribute('tooltiptext', "about:url-classifier öffnen");
   menuitem.setAttribute('accesskey', "s");
   menuitem.setAttribute('oncommand', 'openTrustedLinkIn("about:url-classifier", "tab");');
   menupopup.appendChild(menuitem);    
      
   // submenu of context menu

   menu = document.createElement('menu');
   menu.id = "context-about-menu";
   menu.setAttribute('label', "about Seiten öffnen");
   menu.setAttribute('accesskey', "o");
   document.getElementById('contentAreaContextMenu')
     .insertBefore(menu, document.getElementById('context-sep-viewbgimage').nextSibling);

   menupopup = document.createElement('menupopup');
   menu.appendChild(menupopup);

   menuitem = document.createElement('menuitem');
   menuitem.id = "context-about:about";
   menuitem.setAttribute('label', "about:about");
   menuitem.setAttribute('tooltiptext', "about:about öffnen");
   menuitem.setAttribute('accesskey', "o");
   menuitem.setAttribute('oncommand', 'openTrustedLinkIn("about:about", "tab");');
   menupopup.appendChild(menuitem);
   
   menuitem = document.createElement('menuitem');
   menuitem.id = "context-about:addons";
   menuitem.setAttribute('label', "about:addons");
   menuitem.setAttribute('tooltiptext', "about:addons öffnen");
   menuitem.setAttribute('accesskey', "a");
   menuitem.setAttribute('oncommand', 'openTrustedLinkIn("about:addons", "tab");');
   menupopup.appendChild(menuitem);   
   
   menuitem = document.createElement('menuitem');
   menuitem.id = "context-about:buildconfig";
   menuitem.setAttribute('label', "about:buildconfig");
   menuitem.setAttribute('tooltiptext', "about:buildconfig öffnen");
   menuitem.setAttribute('accesskey', "b");
   menuitem.setAttribute('oncommand', 'openTrustedLinkIn("about:buildconfig", "tab");');
   menupopup.appendChild(menuitem);

   menuitem = document.createElement('menuitem');
   menuitem.id = "context-about-cache";
   menuitem.setAttribute('label', "about:cache");
   menuitem.setAttribute('tooltiptext', "about:cache öffnen");
   menuitem.setAttribute('accesskey', "c");
   menuitem.setAttribute('oncommand', 'openTrustedLinkIn("about:cache", "tab");');
   menupopup.appendChild(menuitem); 

   menuitem = document.createElement('menuitem');
   menuitem.id = "context-about-config";
   menuitem.setAttribute('label', "about:config");
   menuitem.setAttribute('tooltiptext', "about:config öffnen");
   menuitem.setAttribute('accesskey', "g");
   menuitem.setAttribute('oncommand', 'openTrustedLinkIn("about:config", "tab");');
   menupopup.appendChild(menuitem);
     
   menuitem = document.createElement('menuitem');
   menuitem.id = "context-about-crashes";   
   menuitem.setAttribute('label', "about:crashes");
   menuitem.setAttribute('tooltiptext', "about:crashes öffnen");
   menuitem.setAttribute('accesskey', "r");
   menuitem.setAttribute('oncommand', 'openTrustedLinkIn("about:crashes", "tab");');
   menupopup.appendChild(menuitem);   
   
   menuitem = document.createElement('menuitem');
   menuitem.id = "context-about-containers";   
   menuitem.setAttribute('label', "about:containers");
   menuitem.setAttribute('tooltiptext', "about:containers öffnen");
   menuitem.setAttribute('accesskey', "r");
   menuitem.setAttribute('oncommand', 'openTrustedLinkIn("about:preferences#containers", "tab");');
   menupopup.appendChild(menuitem); 
   
   menuitem = document.createElement('menuitem');
   menuitem.id = "context-about:debugging";
   menuitem.setAttribute('label', "about:debugging");
   menuitem.setAttribute('tooltiptext', "about:debugging öffnen");
   menuitem.setAttribute('accesskey', "d");
   menuitem.setAttribute('oncommand', 'openTrustedLinkIn("about:debugging", "tab");');
   menupopup.appendChild(menuitem);
   
   menuitem = document.createElement('menuitem');
   menuitem.id = "context-about:home";
   menuitem.setAttribute('label', "about:home");
   menuitem.setAttribute('tooltiptext', "about:home öffnen");
   menuitem.setAttribute('accesskey', "h");
   menuitem.setAttribute('oncommand', 'openTrustedLinkIn("about:home", "tab");');
   menupopup.appendChild(menuitem);
   
   menuitem = document.createElement('menuitem');
   menuitem.id = "context-about:memory";
   menuitem.setAttribute('label', "about:memory");
   menuitem.setAttribute('tooltiptext', "about:memory öffnen");
   menuitem.setAttribute('accesskey', "m");
   menuitem.setAttribute('oncommand', 'openTrustedLinkIn("about:memory", "tab");');
   menupopup.appendChild(menuitem);
   
   menuitem = document.createElement('menuitem');
   menuitem.id = "context-about:networking";
   menuitem.setAttribute('label', "about:networking");
   menuitem.setAttribute('tooltiptext', "about:networking öffnen");
   menuitem.setAttribute('accesskey', "w");
   menuitem.setAttribute('oncommand', 'openTrustedLinkIn("about:networking", "tab");');
   menupopup.appendChild(menuitem);
   
   menuitem = document.createElement('menuitem');
   menuitem.id = "context-about:newtab";
   menuitem.setAttribute('label', "about:newtab");
   menuitem.setAttribute('tooltiptext', "about:newtab");
   menuitem.setAttribute('accesskey', "n");
   menuitem.setAttribute('oncommand', 'openTrustedLinkIn("about:newtab", "tab");');
   menupopup.appendChild(menuitem);   
   
   menuitem = document.createElement('menuitem');
   menuitem.id = "context-about:performance";
   menuitem.setAttribute('label', "about:performance");
   menuitem.setAttribute('tooltiptext', "about:performance öffnen");
   menuitem.setAttribute('accesskey', "f");
   menuitem.setAttribute('oncommand', 'openTrustedLinkIn("about:performance", "tab");');
   menupopup.appendChild(menuitem);
      
   menuitem = document.createElement('menuitem');
   menuitem.id = "context-about-plugins";
   menuitem.setAttribute('label', "about:plugins");
   menuitem.setAttribute('tooltiptext', "about:plugins öffnen");
   menuitem.setAttribute('accesskey', "P");
   menuitem.setAttribute('oncommand', 'openTrustedLinkIn("about:plugins", "tab");');
   menupopup.appendChild(menuitem);
  
   menuitem = document.createElement('menuitem');
   menuitem.id = "context-about:preferences";
   menuitem.setAttribute('label', "about:preferences");
   menuitem.setAttribute('tooltiptext', "about:preferences öffnen");
   menuitem.setAttribute('accesskey', "e");
   menuitem.setAttribute('oncommand', 'openTrustedLinkIn("about:preferences", "tab");');
   menupopup.appendChild(menuitem);
   
   menuitem = document.createElement('menuitem');
   menuitem.id = "context-about:profiles";
   menuitem.setAttribute('label', "about:profiles");
   menuitem.setAttribute('tooltiptext', "about:profiles öffnen");
   menuitem.setAttribute('accesskey', "i");
   menuitem.setAttribute('oncommand', 'openTrustedLinkIn("about:profiles", "tab");');
   menupopup.appendChild(menuitem);
   
   menuitem = document.createElement('menuitem');
   menuitem.id = "context-about:serviceworkers";
   menuitem.setAttribute('label', "about:serviceworkers");
   menuitem.setAttribute('tooltiptext', "about:serviceworkers öffnen");
   menuitem.setAttribute('accesskey', "v");
   menuitem.setAttribute('oncommand', 'openTrustedLinkIn("about:serviceworkers", "tab");');
   menupopup.appendChild(menuitem); 
   
   menuitem = document.createElement('menuitem');
   menuitem.id = "context-about:support";
   menuitem.setAttribute('label', "about:support");
   menuitem.setAttribute('tooltiptext', "about:support öffnen");
   menuitem.setAttribute('accesskey', "u");
   menuitem.setAttribute('oncommand', 'openTrustedLinkIn("about:support", "tab");');
   menupopup.appendChild(menuitem);
   
   menuitem = document.createElement('menuitem');
   menuitem.id = "context-about:sync-log";
   menuitem.setAttribute('label', "about:sync-log");
   menuitem.setAttribute('tooltiptext', "about:sync-log öffnen");
   menuitem.setAttribute('accesskey', "l");
   menuitem.setAttribute('oncommand', 'openTrustedLinkIn("about:sync-log", "tab");');
   menupopup.appendChild(menuitem);    
   
   menuitem = document.createElement('menuitem');
   menuitem.id = "context-about:telemetry";
   menuitem.setAttribute('label', "about:telemetry");
   menuitem.setAttribute('tooltiptext', "about:telemetry öffnen");
   menuitem.setAttribute('accesskey', "t");
   menuitem.setAttribute('oncommand', 'openTrustedLinkIn("about:telemetry", "tab");');
   menupopup.appendChild(menuitem);    
   
   menuitem = document.createElement('menuitem');
   menuitem.id = "context-about:url-classifier";
   menuitem.setAttribute('label', "about:url-classifier");
   menuitem.setAttribute('tooltiptext', "about:url-classifier öffnen");
   menuitem.setAttribute('accesskey', "s");
   menuitem.setAttribute('oncommand', 'openTrustedLinkIn("about:url-classifier", "tab");');
   menupopup.appendChild(menuitem);    
})();
