//  bottomtoolbar.uc.js

(function() {

  if (location != 'chrome://browser/content/browser.xul')
    return;

  let toolbar = document.createElement('toolbar');
  toolbar.id = 'bottom-toolbar';
  toolbar.setAttribute('customizable', 'true');
  toolbar.setAttribute('mode', 'icons');
  toolbar.setAttribute('context', 'toolbar-context-menu');

  let vbox  = document.createElement('vbox');
  vbox.id = 'bottom-toolbar-vbox';
  let browserBottombox = document.getElementById('browser-bottombox');
  browserBottombox.parentNode.insertBefore(vbox, browserBottombox);
  vbox.appendChild(toolbar);

  CustomizableUI.registerArea('bottom-toolbar', {legacy: true});

})();
