gBrowser.tabContainer.addEventListener('dblclick', function(event) {
  if (event.target.localName == 'tab' && event.button == 0) {
    gBrowser.removeTab(event.target, {animate: true});
  }
});
