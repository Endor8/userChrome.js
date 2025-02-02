   (function() {

    if (location != 'chrome://browser/content/browser.xhtml')
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

   menupopup = document.createXULElement('menupopup');
   menupopup.id = "about-button-popup";
   document.getElementById('about-toolbarbutton').appendChild(menupopup);
   
   menuitem = document.createXULElement('menuitem');
   menuitem.setAttribute('label', "about:about");
   menuitem.setAttribute('tooltiptext', "about:about öffnen");
   menuitem.setAttribute('accesskey', "o");
   menuitem.addEventListener('command', function(event) { openTrustedLinkIn("about:about", "tab");}, true);
   menupopup.appendChild(menuitem);   
   
   menuitem = document.createXULElement('menuitem');
   menuitem.setAttribute('label', "about:addons");
   menuitem.setAttribute('tooltiptext', "about:addons öffnen");
   menuitem.setAttribute('accesskey', "a");
   menuitem.addEventListener('command', function(event) { openTrustedLinkIn("about:addons", "tab");}, true);
   menupopup.appendChild(menuitem);   
   
   menuitem = document.createXULElement('menuitem');
   menuitem.setAttribute('label', "about:buildconfig");
   menuitem.setAttribute('tooltiptext', "about:buildconfig öffnen");
   menuitem.setAttribute('accesskey', "b");
   menuitem.addEventListener('command', function(event) {openTrustedLinkIn("about:buildconfig", "tab");}, true);
   menupopup.appendChild(menuitem);     
   
   menuitem = document.createXULElement('menuitem');
   menuitem.setAttribute('label', "about:cache");
   menuitem.setAttribute('tooltiptext', "about:cache öffnen");
   menuitem.setAttribute('accesskey', "c");
   menuitem.addEventListener('command', function(event) {openTrustedLinkIn("about:cache", "tab");}, true);
   menupopup.appendChild(menuitem);
      
   menuitem = document.createXULElement('menuitem');
   menuitem.setAttribute('label', "about:config");
   menuitem.setAttribute('tooltiptext', "about:config öffnen");
   menuitem.setAttribute('accesskey', "g");
   menuitem.addEventListener('command', function(event) {openTrustedLinkIn("about:config", "tab");}, true);
   menupopup.appendChild(menuitem);
   
   menuitem = document.createXULElement('menuitem');
   menuitem.setAttribute('label', "about:crashes");
   menuitem.setAttribute('tooltiptext', "about:crashes öffnen");
   menuitem.setAttribute('accesskey', "r");
   menuitem.addEventListener('command', function(event) {openTrustedLinkIn("about:crashes", "tab");}, true);
   menupopup.appendChild(menuitem);
   
   menuitem = document.createXULElement('menuitem');
   menuitem.setAttribute('label', "about:containers");
   menuitem.setAttribute('tooltiptext', "about:containers öffnen");
   menuitem.setAttribute('accesskey', "r");
   menuitem.addEventListener('command', function(event) {openTrustedLinkIn("about:preferences#containers", "tab");}, true);
   menupopup.appendChild(menuitem); 

   menuitem = document.createXULElement('menuitem');
   menuitem.setAttribute('label', "aboutDialog");
   menuitem.setAttribute('tooltiptext', "aboutDialog öffnen");
   menuitem.setAttribute('accesskey', "D");
   menuitem.addEventListener('command', function(event) {openTrustedLinkIn("chrome://browser/content/aboutDialog.xhtml", "tab");}, true);
   menupopup.appendChild(menuitem);   
   
   menuitem = document.createXULElement('menuitem');
   menuitem.setAttribute('label', "about:debugging");
   menuitem.setAttribute('tooltiptext', "about:debugging öffnen");
   menuitem.setAttribute('accesskey', "d");
   menuitem.addEventListener('command', function(event) {openTrustedLinkIn("about:debugging", "tab");}, true);
   menupopup.appendChild(menuitem);
   
   menuitem = document.createXULElement('menuitem');
   menuitem.setAttribute('label', "about:home");
   menuitem.setAttribute('tooltiptext', "about:home öffnen");
   menuitem.setAttribute('accesskey', "h");
   menuitem.addEventListener('command', function(event) {openTrustedLinkIn("about:home", "tab");}, true);
   menupopup.appendChild(menuitem);
   
   menuitem = document.createXULElement('menuitem');
   menuitem.setAttribute('label', "about:license");
   menuitem.setAttribute('tooltiptext', "about:license öffnen");
   menuitem.setAttribute('accesskey', "l");
   menuitem.addEventListener('command', function(event) {openTrustedLinkIn("about:license", "tab");}, true);
   menupopup.appendChild(menuitem);  
   
   menuitem = document.createXULElement('menuitem');
   menuitem.setAttribute('label', "about:logging");
   menuitem.setAttribute('tooltiptext', "about:logging öffnen");
   menuitem.setAttribute('accesskey', "l");
   menuitem.addEventListener('command', function(event) {openTrustedLinkIn("about:logging", "tab");}, true);
   menupopup.appendChild(menuitem); 
   
   menuitem = document.createXULElement('menuitem');
   menuitem.setAttribute('label', "about:logins");
   menuitem.setAttribute('tooltiptext', "about:logins öffnen");
   menuitem.setAttribute('accesskey', "l");
   menuitem.addEventListener('command', function(event) {openTrustedLinkIn("about:logins", "tab");}, true);
   menupopup.appendChild(menuitem);     
   
   menuitem = document.createXULElement('menuitem');
   menuitem.setAttribute('label', "about:memory");
   menuitem.setAttribute('tooltiptext', "about:memory öffnen");
   menuitem.setAttribute('accesskey', "m");
   menuitem.addEventListener('command', function(event) {openTrustedLinkIn("about:memory", "tab");}, true);
   menupopup.appendChild(menuitem);
   
   menuitem = document.createXULElement('menuitem');
   menuitem.setAttribute('label', "about:networking");
   menuitem.setAttribute('tooltiptext', "about:networking öffnen");
   menuitem.setAttribute('accesskey', "w");
   menuitem.addEventListener('command', function(event) {openTrustedLinkIn("about:networking", "tab");}, true);
   menupopup.appendChild(menuitem);
   
   menuitem = document.createXULElement('menuitem');
   menuitem.setAttribute('label', "about:newtab");
   menuitem.setAttribute('tooltiptext', "about:newtab öffnen");
   menuitem.setAttribute('accesskey', "n");
   menuitem.addEventListener('command', function(event) {openTrustedLinkIn("about:newtab", "tab");}, true);
   menupopup.appendChild(menuitem);   
   
   menuitem = document.createXULElement('menuitem');
   menuitem.setAttribute('label', "about:performance");
   menuitem.setAttribute('tooltiptext', "about:performance öffnen");
   menuitem.setAttribute('accesskey', "f");
   menuitem.addEventListener('command', function(event) {openTrustedLinkIn("about:performance", "tab");}, true);
   menupopup.appendChild(menuitem);

   menupopup.appendChild(menuitem);
   menuitem = document.createXULElement('menuitem');
   menuitem.setAttribute('label', "about:preferences");
   menuitem.setAttribute('tooltiptext', "about:preferences öffnen");
   menuitem.setAttribute('accesskey', "e");
   menuitem.addEventListener('command', function(event) {openTrustedLinkIn("about:preferences", "tab");}, true);
   menupopup.appendChild(menuitem);
   
   menuitem = document.createXULElement('menuitem');
   menuitem.setAttribute('label', "about:profiles");
   menuitem.setAttribute('tooltiptext', "about:profiles öffnen");
   menuitem.setAttribute('accesskey', "i");
   menuitem.addEventListener('command', function(event) {openTrustedLinkIn("about:profiles", "tab");}, true);
   menupopup.appendChild(menuitem);

   menuitem = document.createXULElement('menuitem');
   menuitem.setAttribute('label', "about:profiling");
   menuitem.setAttribute('tooltiptext', "about:profiling öffnen");
   menuitem.setAttribute('accesskey', "P");
   menuitem.addEventListener('command', function(event) {openTrustedLinkIn("about:profiling", "tab");}, true);
   menupopup.appendChild(menuitem);
   
   menuitem = document.createXULElement('menuitem');
   menuitem.setAttribute('label', "about:serviceworkers");
   menuitem.setAttribute('tooltiptext', "about:serviceworkers öffnen");
   menuitem.setAttribute('accesskey', "v");
   menuitem.addEventListener('command', function(event) {openTrustedLinkIn("about:serviceworkers", "tab");}, true);
   menupopup.appendChild(menuitem); 
   
   menuitem = document.createXULElement('menuitem');
   menuitem.setAttribute('label', "about:support");
   menuitem.setAttribute('tooltiptext', "about:support öffnen");
   menuitem.setAttribute('accesskey', "u");
   menuitem.addEventListener('command', function(event) {openTrustedLinkIn("about:support", "tab");}, true);
   menupopup.appendChild(menuitem);
   
   menuitem = document.createXULElement('menuitem');
   menuitem.setAttribute('label', "about:sync-log");
   menuitem.setAttribute('tooltiptext', "about:sync-log öffnen");
   menuitem.setAttribute('accesskey', "l");
   menuitem.addEventListener('command', function(event) {openTrustedLinkIn("about:sync-log", "tab");}, true);
   menupopup.appendChild(menuitem);    
   
   menuitem = document.createXULElement('menuitem');
   menuitem.setAttribute('label', "about:telemetry");
   menuitem.setAttribute('tooltiptext', "about:telemetry öffnen");
   menuitem.setAttribute('accesskey', "t");
   menuitem.addEventListener('command', function(event) {openTrustedLinkIn("about:telemetry", "tab");}, true);
   menupopup.appendChild(menuitem);  

   menuitem = document.createXULElement('menuitem');
   menuitem.setAttribute('label', "about:translations");
   menuitem.setAttribute('tooltiptext', "about:translations öffnen");
   menuitem.setAttribute('accesskey', "t");
   menuitem.addEventListener('command', function(event) {openTrustedLinkIn("about:translations", "tab");}, true);
   menupopup.appendChild(menuitem);    
   
   menuitem = document.createXULElement('menuitem');
   menuitem.setAttribute('label', "about:url-classifier");
   menuitem.setAttribute('tooltiptext', "about:url-classifier öffnen");
   menuitem.setAttribute('accesskey', "s");
   menuitem.addEventListener('command', function(event) {openTrustedLinkIn("about:url-classifier", "tab");}, true);
   menupopup.appendChild(menuitem);    
      
   // submenu of context menu

   menu = document.createXULElement('menu');
   menu.id = "context-about-menu";
   menu.setAttribute('label', "about Seiten öffnen");
   menu.setAttribute('accesskey', "o");
   document.getElementById('contentAreaContextMenu')
     .insertBefore(menu, document.getElementById('context-sep-open').nextSibling);

   menupopup = document.createXULElement('menupopup');
   menu.appendChild(menupopup);

   menuitem = document.createXULElement('menuitem');
   menuitem.id = "context-about:about";
   menuitem.setAttribute('label', "about:about");
   menuitem.setAttribute('tooltiptext', "about:about öffnen");
   menuitem.setAttribute('accesskey', "o");
   menuitem.addEventListener('command', function(event) {openTrustedLinkIn("about:about", "tab");}, true);
   menupopup.appendChild(menuitem);
   
   menuitem = document.createXULElement('menuitem');
   menuitem.id = "context-about:addons";
   menuitem.setAttribute('label', "about:addons");
   menuitem.setAttribute('tooltiptext', "about:addons öffnen");
   menuitem.setAttribute('accesskey', "a");
   menuitem.addEventListener('command', function(event) {openTrustedLinkIn("about:addons", "tab");}, true);
   menupopup.appendChild(menuitem);   
   
   menuitem = document.createXULElement('menuitem');
   menuitem.id = "context-about:buildconfig";
   menuitem.setAttribute('label', "about:buildconfig");
   menuitem.setAttribute('tooltiptext', "about:buildconfig öffnen");
   menuitem.setAttribute('accesskey', "b");
   menuitem.addEventListener('command', function(event) {openTrustedLinkIn("about:buildconfig", "tab");}, true);
   menupopup.appendChild(menuitem);

   menuitem = document.createXULElement('menuitem');
   menuitem.id = "context-about-cache";
   menuitem.setAttribute('label', "about:cache");
   menuitem.setAttribute('tooltiptext', "about:cache öffnen");
   menuitem.setAttribute('accesskey', "c");
   menuitem.addEventListener('command', function(event) {openTrustedLinkIn("about:cache", "tab");}, true);
   menupopup.appendChild(menuitem); 

   menuitem = document.createXULElement('menuitem');
   menuitem.id = "context-about-config";
   menuitem.setAttribute('label', "about:config");
   menuitem.setAttribute('tooltiptext', "about:config öffnen");
   menuitem.setAttribute('accesskey', "g");
   menuitem.addEventListener('command', function(event) {openTrustedLinkIn("about:config", "tab");}, true);
   menupopup.appendChild(menuitem);
     
   menuitem = document.createXULElement('menuitem');
   menuitem.id = "context-about-crashes";   
   menuitem.setAttribute('label', "about:crashes");
   menuitem.setAttribute('tooltiptext', "about:crashes öffnen");
   menuitem.setAttribute('accesskey', "r");
   menuitem.addEventListener('command', function(event) {openTrustedLinkIn("about:crashes", "tab");}, true);
   menupopup.appendChild(menuitem);   
   
   menuitem = document.createXULElement('menuitem');
   menuitem.id = "context-about-containers";   
   menuitem.setAttribute('label', "about:containers");
   menuitem.setAttribute('tooltiptext', "about:containers öffnen");
   menuitem.setAttribute('accesskey', "r");
   menuitem.addEventListener('command', function(event) {openTrustedLinkIn("about:preferences#containers", "tab");}, true);
   menupopup.appendChild(menuitem); 
   
   menuitem = document.createXULElement('menuitem');
   menuitem.id = "context-about-Dialog";   
   menuitem.setAttribute('label', "aboutDialog");
   menuitem.setAttribute('tooltiptext', "aboutDialog öffnen");
   menuitem.setAttribute('accesskey', "D");
   menuitem.addEventListener('command', function(event) {openTrustedLinkIn("chrome://browser/content/aboutDialog.xhtml", "tab");}, true);
   menupopup.appendChild(menuitem);    
   
   menuitem = document.createXULElement('menuitem');
   menuitem.id = "context-about:debugging";
   menuitem.setAttribute('label', "about:debugging");
   menuitem.setAttribute('tooltiptext', "about:debugging öffnen");
   menuitem.setAttribute('accesskey', "d");
   menuitem.addEventListener('command', function(event) {openTrustedLinkIn("about:debugging", "tab");}, true);
   menupopup.appendChild(menuitem);
   
   menuitem = document.createXULElement('menuitem');
   menuitem.id = "context-about:home";
   menuitem.setAttribute('label', "about:home");
   menuitem.setAttribute('tooltiptext', "about:home öffnen");
   menuitem.setAttribute('accesskey', "h");
   menuitem.addEventListener('command', function(event) {openTrustedLinkIn("about:home", "tab");}, true);
   menupopup.appendChild(menuitem);
   
   menuitem = document.createXULElement('menuitem');
   menuitem.id = "context-about:license";
   menuitem.setAttribute('label', "about:license");
   menuitem.setAttribute('tooltiptext', "about:license öffnen");
   menuitem.setAttribute('accesskey', "l");
   menuitem.addEventListener('command', function(event) {openTrustedLinkIn("about:license", "tab");}, true);
   menupopup.appendChild(menuitem);
      
   menuitem = document.createXULElement('menuitem');
   menuitem.setAttribute('label', "about:logging");
   menuitem.setAttribute('tooltiptext', "about:logging öffnen");
   menuitem.setAttribute('accesskey', "l");
   menuitem.addEventListener('command', function(event) {openTrustedLinkIn("about:logging", "tab");}, true);
   menupopup.appendChild(menuitem); 
   
   menuitem = document.createXULElement('menuitem');
   menuitem.setAttribute('label', "about:logins");
   menuitem.setAttribute('tooltiptext', "about:logins öffnen");
   menuitem.setAttribute('accesskey', "l");
   menuitem.addEventListener('command', function(event) {openTrustedLinkIn("about:logins", "tab");}, true);
   menupopup.appendChild(menuitem); 
   
   menuitem = document.createXULElement('menuitem');
   menuitem.id = "context-about:memory";
   menuitem.setAttribute('label', "about:memory");
   menuitem.setAttribute('tooltiptext', "about:memory öffnen");
   menuitem.setAttribute('accesskey', "m");
   menuitem.addEventListener('command', function(event) {openTrustedLinkIn("about:memory", "tab");}, true);
   menupopup.appendChild(menuitem);
   
   menuitem = document.createXULElement('menuitem');
   menuitem.id = "context-about:networking";
   menuitem.setAttribute('label', "about:networking");
   menuitem.setAttribute('tooltiptext', "about:networking öffnen");
   menuitem.setAttribute('accesskey', "w");
   menuitem.addEventListener('command', function(event) {openTrustedLinkIn("about:networking", "tab");}, true);
   menupopup.appendChild(menuitem);
   
   menuitem = document.createXULElement('menuitem');
   menuitem.id = "context-about:newtab";
   menuitem.setAttribute('label', "about:newtab");
   menuitem.setAttribute('tooltiptext', "about:newtab");
   menuitem.setAttribute('accesskey', "n");
   menuitem.addEventListener('command', function(event) {openTrustedLinkIn("about:newtab", "tab");}, true);
   menupopup.appendChild(menuitem);   
   
   menuitem = document.createXULElement('menuitem');
   menuitem.id = "context-about:performance";
   menuitem.setAttribute('label', "about:performance");
   menuitem.setAttribute('tooltiptext', "about:performance öffnen");
   menuitem.setAttribute('accesskey', "f");
   menuitem.addEventListener('command', function(event) {openTrustedLinkIn("about:performance", "tab");}, true);
   menupopup.appendChild(menuitem);
 
   menuitem = document.createXULElement('menuitem');
   menuitem.id = "context-about:preferences";
   menuitem.setAttribute('label', "about:preferences");
   menuitem.setAttribute('tooltiptext', "about:preferences öffnen");
   menuitem.setAttribute('accesskey', "e");
   menuitem.addEventListener('command', function(event) {openTrustedLinkIn("about:preferences", "tab");}, true);
   menupopup.appendChild(menuitem);
   
   menuitem = document.createXULElement('menuitem');
   menuitem.id = "context-about:profiles";
   menuitem.setAttribute('label', "about:profiles");
   menuitem.setAttribute('tooltiptext', "about:profiles öffnen");
   menuitem.setAttribute('accesskey', "i");
   menuitem.addEventListener('command', function(event) {openTrustedLinkIn("about:profiles", "tab");}, true);
   menupopup.appendChild(menuitem);   
      
   menuitem = document.createXULElement('menuitem');
   menuitem.id = "context-about-profiling";
   menuitem.setAttribute('label', "about:profiling");
   menuitem.setAttribute('tooltiptext', "about:profiling öffnen");
   menuitem.setAttribute('accesskey', "P");
   menuitem.addEventListener('command', function(event) {openTrustedLinkIn("about:profiling", "tab");}, true);
   menupopup.appendChild(menuitem);
   
   menuitem = document.createXULElement('menuitem');
   menuitem.id = "context-about:serviceworkers";
   menuitem.setAttribute('label', "about:serviceworkers");
   menuitem.setAttribute('tooltiptext', "about:serviceworkers öffnen");
   menuitem.setAttribute('accesskey', "v");
   menuitem.addEventListener('command', function(event) {openTrustedLinkIn("about:serviceworkers", "tab");}, true);
   menupopup.appendChild(menuitem); 
   
   menuitem = document.createXULElement('menuitem');
   menuitem.id = "context-about:support";
   menuitem.setAttribute('label', "about:support");
   menuitem.setAttribute('tooltiptext', "about:support öffnen");
   menuitem.setAttribute('accesskey', "u");
   menuitem.addEventListener('command', function(event) {openTrustedLinkIn("about:support", "tab");}, true);
   menupopup.appendChild(menuitem);
   
   menuitem = document.createXULElement('menuitem');
   menuitem.id = "context-about:sync-log";
   menuitem.setAttribute('label', "about:sync-log");
   menuitem.setAttribute('tooltiptext', "about:sync-log öffnen");
   menuitem.setAttribute('accesskey', "l");
   menuitem.addEventListener('command', function(event) {openTrustedLinkIn("about:sync-log", "tab");}, true);
   menupopup.appendChild(menuitem);    
   
   menuitem = document.createXULElement('menuitem');
   menuitem.id = "context-about:telemetry";
   menuitem.setAttribute('label', "about:telemetry");
   menuitem.setAttribute('tooltiptext', "about:telemetry öffnen");
   menuitem.setAttribute('accesskey', "t");
   menuitem.addEventListener('command', function(event) {openTrustedLinkIn("about:telemetry", "tab");}, true);
   menupopup.appendChild(menuitem);    
   
   menuitem = document.createXULElement('menuitem');
   menuitem.setAttribute('label', "about:translations");
   menuitem.setAttribute('tooltiptext', "about:translations öffnen");
   menuitem.setAttribute('accesskey', "s");
   menuitem.addEventListener('command', function(event) {openTrustedLinkIn("about:translations", "tab");}, true);
   menupopup.appendChild(menuitem);       
   
   menuitem = document.createXULElement('menuitem');
   menuitem.id = "context-about:url-classifier";
   menuitem.setAttribute('label', "about:url-classifier");
   menuitem.setAttribute('tooltiptext', "about:url-classifier öffnen");
   menuitem.setAttribute('accesskey', "s");
   menuitem.addEventListener('command', function(event) {openTrustedLinkIn("about:url-classifier", "tab");}, true);
   menupopup.appendChild(menuitem);    
})();