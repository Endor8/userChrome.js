// userChromeJS

(function() {

  if (!window.gBrowser)
    return;

  var frameScript = function() {

    addEventListener('pageshow', function(event) {
      var document = event.target;
      var documentElement = document.documentElement;

      documentElement.addEventListener('mouseover', function(event) {
        var element = event.target;
        var elementsWithTitle = [];
        var elementWithAlt = null;
        while (element != documentElement && !element.href) {
          if (element.hasAttribute('title')) {
            elementsWithTitle.push(element);
          };
          if (element.alt) {
            elementWithAlt = element;
          };
          element = element.parentNode;
        };

        if (element.href && !element.checkedTooltip) {
          element.checkedTooltip = true;
          if (element.getAttribute('href') != '\u0023' && element.protocol != 'javascript:') {

            let title = element.title;
            if (!title) {
              let length = elementsWithTitle.length;
              if (length > 0) {
                title = elementsWithTitle[length - 1].title;
              };
            };
            if (title) {
              title += '\n';
            };

            let alt = '';
            if (element.alt) {
              alt = element.alt + '\n';
            } else if (elementWithAlt) {
              alt = elementWithAlt.alt + '\n';
            };

            element.title = title + alt + element.href;

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
