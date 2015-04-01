    (function () {

       if (location != 'chrome://browser/content/browser.xul') return;

       const buttonId = 'aboutconfig-button';
       const buttonLabel = 'About:Config';
       const buttonTooltiptext = 'About:Config';
       const buttonIcon = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACkUlEQVQ4ja2SX0hTcRTHv27euz/qLvfqdtO8lRmEoLm2RTTUmWHFtlgYIlFPleNuI5cggYTJpDGIVnP+CaVQ3FtCkYQvPfYSprewxCZCUYwgUKIeHIidHvSKiPrUef2ez/ec3/l9gf9VoijmhcPhq7FYbKizszNSUVFRvFOfATggsqgEUA5AtynYbDb78PDwfCaToaWlJUokEk8A6LfxZfHThsG3rcKk38reA3Bwq8hJktQSiUSmstksLS8vr9XX11/cokv3bRih0fI1Shyi+euGNMfAAQCMw+E4KoriSQD5jY2NiUwmQ0REsiz3qnDMhhEaMBNN24nuFtH4GShGwA4AOo/Hc01RFOrq6nqZTCa/K4pCCwtpejqammIY5kTMiiHqK1yjaTtRTwk9d2sWLDoEAZgAACzLVvb393+amZmh2dlZGhsbo0g0Sg/jiWz0WO7HvwlhVYVfuDWLJgZBAGYAOer7dDqd7qzX632dSqXoZlvbvBzu+BFv2E+rj0ykwuPnMcczCAEQdvohlud5r8fjeceybDOg9QdrKn/+8YMouo8mzmmpLI95ACB/jzSgiGGY4wDMDoejnYio54p35VldLk1UW+mWif/WUlratJcBALBOpzNAROSX5UkA0RqN/utEtZXSPh/Fef53myR1ANDuBBe6XK4gEVEgEHgFoA5AIQe0tHPc5w+1tZT2+aiX4+h2SUkfAIMKakRRbKCNktcnuwGwG7oxH2jqtli+vKmqotaCgulujlu5xPNu1UAbCoVGVQNBEG4A4LZtZ+CBy3fM5sUBSfrl57j3xRtBAgCjy+UaTCaTcxaLpQfA4V3uUyBotc2n9PrHPHABgHHTHUA1ACeAI7sdSB2G9RwYAeT8A0L0/bjRXZQXAAAAAElFTkSuQmCC)';
       
       function buttonFunction() {
          openUILinkIn("about:config", "tab");
       };   
        
       var button = document.createElement('toolbarbutton');
       button.id = buttonId;
       button.setAttribute('class', 'toolbarbutton-1 chromeclass-toolbar-additional');
       button.removable = 'true';
       button.setAttribute('label', buttonLabel);
       button.setAttribute('tooltiptext', buttonTooltiptext);       
       button.style.listStyleImage = buttonIcon;
       
       button.addEventListener('click', function (event) {
          if (event.button == 0)
             buttonFunction();
       });
       
       document.getElementById('ctraddon_extra-bar').insertBefore(button, document.getElementById('ctraddon_extra-bar-customization-target'));   

       var toolbars = document.querySelectorAll('toolbar');
       Array.slice(toolbars).forEach( function (toolbar) {
          var currentset = toolbar.getAttribute('currentset');
          if (currentset.split(',').indexOf(button.id) < 0) return;
          toolbar.currentSet = currentset;
          try {
             BrowserToolboxCustomizeDone(true);
          } catch (ex) {
          }
       });
       
    }) ();

