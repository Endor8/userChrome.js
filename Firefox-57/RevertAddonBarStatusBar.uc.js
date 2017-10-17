(function() {

  if (location != 'chrome://browser/content/browser.xul')
    return;
    
  var tb = document.createElement('toolbar');
  tb.id = 'new-toolbar';
  tb.setAttribute('customizable', true);
  tb.setAttribute('mode', 'icons');

  var vbox = document.createElement('vbox');
  document.getElementById('navigator-toolbox').parentNode.insertBefore(
    vbox, document.getElementById('browser-bottombox'));
  vbox.appendChild(tb);

  CustomizableUI.registerArea('new-toolbar', {legacy: true});

})();
