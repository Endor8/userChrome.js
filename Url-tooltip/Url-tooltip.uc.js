(function() {

  if (!window.gBrowser)
    return;

  var frameScript = function() {

    addEventListener('pageshow', function(event) {
      var documentElement = event.target.documentElement;

      documentElement.addEventListener('mouseover', function(event) {
        var element = event.target;
        var elementsWithTitle = [];
        while (element != documentElement && !element.href) {
          if (element.hasAttribute('title')) {
            elementsWithTitle.push(element);
          };
          element = element.parentNode;
        };
        if (element.href && !element.checkedTooltip) {
          element.checkedTooltip = true;
          if (element.getAttribute('href') != '\u0023' && element.protocol != 'javascript:') {
            if (element.title) {
              element.title += '\n' + element.href;
            } else {
              let length = elementsWithTitle.length;
              if (length > 0) {
                element.title = elementsWithTitle[length - 1].title + '\n' + element.href;
              } else {
                element.title = element.href;
              }
            };
            for (let elem of elementsWithTitle) {
              elem.removeAttribute('title');
            };
          };
        };
      });

    });

  };

  var frameScriptURI = 'data:, (' + frameScript.toString() + ')()';
  window.messageManager.loadFrameScript(frameScriptURI, true);

})();
