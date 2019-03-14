// userChromeJS - title, alt, url

(function() {

  if (!window.gBrowser)
    return;

  var frameScript = function() {

    addEventListener('pageshow', function(event) {

      var document = event.target;
      if (document.doingTooltipScript)
        return;
      document.doingTooltipScript = true;

      var documentElement = document.documentElement;

      var tooltipElement;
      var makeTooltip = false;
      var titleElement = null;
      var title = '';

      documentElement.addEventListener('mouseover', function(event) {

        var element = event.target;
        tooltipElement = element;

        var alt = '';
        var href = '';

        while ((!alt || !href || !titleElement) && element != documentElement) {
          if (!alt && element.alt) {
            alt = element.alt;
            makeTooltip = true;
          };
          if (!href && element.href && element.getAttribute('href') != '\u0023'
              && element.protocol != 'javascript:') {
            href = element.href;
            makeTooltip = true;
          };
          if (!titleElement && element.hasAttribute('title')) {
            titleElement = element;
          };
          element = element.parentNode;
        };

        if (makeTooltip) {

          if (titleElement) {
            title = titleElement.title;
            titleElement.removeAttribute('title');
          };

          let titleSep = title ? '\n' : '';
          let altSep = alt ? '\n' : '';
          let altPrefix = (alt && !title) ? 'a: ' : '';

          tooltipElement.title = title + titleSep + altPrefix + alt + altSep + href;

        };

      });

      documentElement.addEventListener('mouseout', function(event) {

        if (makeTooltip) {
          tooltipElement.removeAttribute('title');
          if (titleElement) {
            titleElement.setAttribute('title', title);
            title = '';
          };
          makeTooltip = false;
        };
        titleElement = null;

      });

    });

  };

  var frameScriptURI = 'data:, (' + frameScript.toString() + ')()';
  window.messageManager.loadFrameScript(frameScriptURI, true);

})();
