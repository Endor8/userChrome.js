(function() {

  if (window.__SSi != 'window0')
    return;

  CustomizableUI.createWidget({
    id: 'addons-update-button',
    defaultArea: CustomizableUI.AREA_NAVBAR,
    label: 'Add-ons Update',
    tooltiptext: '',
    onCommand: onCommand,
    onCreated: function(button) {
        button.style.listStyleImage = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAdUlEQVQokZVSwRHAIAgLPYfoXs7RCTpG53Avt7APrhaFU8gLMEEJAkEQgFbc7IxkVjt0r6Sp7VIVITumBpKt00FA2ThmjXzkfMMWO8EZFSj8LrUyjsG9b9DaJXq+qAIVxEUxtLHpaXE95dj1NcK2rmbwaGJ4Af0tIg00j/6iAAAAAElFTkSuQmCC)';}
  });

  function onCommand(event) {

    let frameScript = function() {
      addEventListener('pageshow', function onPageshow(event) {
        let document = event.target;
        if (document.URL != 'about:addons')
          return;
        removeEventListener('pageshow', onPageshow);
        content.setTimeout(function() {
          content.getHtmlBrowser().contentDocument.querySelector('[action="check-for-updates"]').click();
          let item = document.getElementById('category-availableUpdates');
          item.click();
          let categories = item.parentNode;
          categories.addEventListener('mousedown', function onMousedown(event) {
            if (event.target != item && event.target.parentNode != item) {
              item.hidden = true;
              categories.removeEventListener('mousedown', onMousedown);
            };
          });
        }, 0);
      });
    };

    let frameScriptURI = 'data:,(' + frameScript.toString() + ')()';
    let window = event.target.ownerGlobal;
    window.openTrustedLinkIn('about:addons', 'tab');
    window.gBrowser.selectedBrowser.messageManager.loadFrameScript(frameScriptURI, true);

  };

})();
