(function() {	

var menuitem = document.createXULElement('toolbarbutton');
menuitem.id = 'uc_menu_Restart_H';
menuitem.classList.add('subviewbutton', 'subviewbutton-iconic');
menuitem.setAttribute('label' , 'Neustart');
menuitem.setAttribute('tooltiptext' , 'Neustart');
menuitem.style.listStyleImage= 'url(\'data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="grey" fill-opacity="context-fill-opacity" d="M15,1a1,1,0,0,0-1,1V4.418A6.995,6.995,0,1,0,8,15a6.954,6.954,0,0,0,4.95-2.05,1,1,0,0,0-1.414-1.414A5.019,5.019,0,1,1,12.549,6H10a1,1,0,0,0,0,2h5a1,1,0,0,0,1-1V2A1,1,0,0,0,15,1Z"/></svg>\')';
menuitem.setAttribute('oncommand' , "Services.appinfo.invalidateCachesOnRestart() || Services.startup.quit(Ci.nsIAppStartup.eRestart | Ci.nsIAppStartup.eAttemptQuit);");
var refItem = document.getElementById('appmenu-quit');
refItem.parentNode.insertBefore(menuitem, refItem);

})();
