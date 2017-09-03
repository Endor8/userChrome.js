// Mit Doppelklick auf ein Tab wird dieser neu geladen 

gBrowser.tabContainer.addEventListener('dblclick', function(event) {
  if (event.target.localName == 'tab' && event.button == 0) {
    gBrowser.getBrowserForTab(event.target).reload();
  }
});
