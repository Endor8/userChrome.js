  
  //  aboutconfig-button.uc.js
  
  (function() {

   if (location != 'chrome://browser/content/browser.xul') return;
	
	try {
		CustomizableUI.createWidget({
			id: 'aboutconfig-ToolBarButton',
			type: 'custom',
			defaultArea: CustomizableUI.AREA_NAVBAR,
			onBuild: function(aDocument) {			
				var toolbaritem = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
				var props = {
					id: 'aboutconfig-ToolBarButton',
					class: 'toolbarbutton-1 chromeclass-toolbar-additional',
					label: 'About:Config',
					tooltiptext: 'About:Config',
					style: 'list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACkUlEQVQ4ja2SX0hTcRTHv27euz/qLvfqdtO8lRmEoLm2RTTUmWHFtlgYIlFPleNuI5cggYTJpDGIVnP+CaVQ3FtCkYQvPfYSprewxCZCUYwgUKIeHIidHvSKiPrUef2ez/ec3/l9gf9VoijmhcPhq7FYbKizszNSUVFRvFOfATggsqgEUA5AtynYbDb78PDwfCaToaWlJUokEk8A6LfxZfHThsG3rcKk38reA3Bwq8hJktQSiUSmstksLS8vr9XX11/cokv3bRih0fI1Shyi+euGNMfAAQCMw+E4KoriSQD5jY2NiUwmQ0REsiz3qnDMhhEaMBNN24nuFtH4GShGwA4AOo/Hc01RFOrq6nqZTCa/K4pCCwtpejqammIY5kTMiiHqK1yjaTtRTwk9d2sWLDoEAZgAACzLVvb393+amZmh2dlZGhsbo0g0Sg/jiWz0WO7HvwlhVYVfuDWLJgZBAGYAOer7dDqd7qzX632dSqXoZlvbvBzu+BFv2E+rj0ykwuPnMcczCAEQdvohlud5r8fjeceybDOg9QdrKn/+8YMouo8mzmmpLI95ACB/jzSgiGGY4wDMDoejnYio54p35VldLk1UW+mWif/WUlratJcBALBOpzNAROSX5UkA0RqN/utEtZXSPh/Fef53myR1ANDuBBe6XK4gEVEgEHgFoA5AIQe0tHPc5w+1tZT2+aiX4+h2SUkfAIMKakRRbKCNktcnuwGwG7oxH2jqtli+vKmqotaCgulujlu5xPNu1UAbCoVGVQNBEG4A4LZtZ+CBy3fM5sUBSfrl57j3xRtBAgCjy+UaTCaTcxaLpQfA4V3uUyBotc2n9PrHPHABgHHTHUA1ACeAI7sdSB2G9RwYAeT8A0L0/bjRXZQXAAAAAElFTkSuQmCC)',
					onclick: 'if (event.button == 0) { \
										openTrustedLinkIn("about:config", "tab");\
								 }; '
				};
				for (var p in props)
					toolbaritem.setAttribute(p, props[p]);
				return toolbaritem;
			}
		});
	} catch(e) { };
   
})();