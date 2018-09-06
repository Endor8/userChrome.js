(function() {

if (location != 'chrome://browser/content/browser.xul')
   return;

let tb = document.createElement('toolbar');
tb.id = 'uc-toolbar-2';
tb.setAttribute('customizable', true);
tb.setAttribute('mode', 'icons');
tb.setAttribute('context', 'toolbar-context-menu');

let parentE = document.getElementById('PersonalToolbar').parentNode;
let childE = document.getElementById('PersonalToolbar');
let vbox = document.createElement('vbox');
vbox.id = 'uc-tb2-vbox';
vbox.appendChild(tb);
parentE.insertBefore( vbox , childE );
vbox.style.backgroundColor = '#E7E7E7'; //als Wert geht: red, green, yellow oder black, aber auch zbs. #f7f7f7 usw.

CustomizableUI.registerArea( 'uc-toolbar-2' , { legacy: true } );

})();
