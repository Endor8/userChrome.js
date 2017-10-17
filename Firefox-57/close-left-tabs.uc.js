(function() {

  if (location != 'chrome://browser/content/browser.xul')
    return;

  var menuitem = document.createElement('menuitem');
  menuitem.id = 'context_closeLeftTabs';
  menuitem.setAttribute('label', 'Linke Tabs schließen');
  menuitem.setAttribute('oncommand',
    'for (let i = TabContextMenu.contextTab._tPos - 1; i >= 0; i--) \
       gBrowser.removeTab(gBrowser.tabs[i], {animate: true})');

  var refItem = document.getElementById('context_closeTabsToTheEnd');
  refItem.parentNode.insertBefore(menuitem, refItem);

})();
