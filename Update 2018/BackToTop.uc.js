//  BackToTop.uc.js
  
(function() {

	if (location != 'chrome://browser/content/browser.xul')
		return;
	
	try {
		CustomizableUI.createWidget({
			id: 'addBackToTop-panel',
			type: 'custom',
			defaultArea: CustomizableUI.AREA_NAVBAR,
			onBuild: function(aDocument) {
				var toolbaritem = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
				var props = {
					id: 'addBackToTop-panel',
					class: 'toolbarbutton-1 chromeclass-toolbar-additional',
					label: 'Seite nach oben',
					tooltiptext: 'Seite nach oben',
					style: 'list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAACXBIWXMAAAsSAAALEgHS3X78AAACsklEQVQ4jX2TT2gcdRTHP%2B%2F3m%2Bnszs7umk2TbjbENFpXS2K02lZoKqUKFlsoFAmlZzUHETyI54J4KJWC9KwepAdzkIAXEU968qSiBS2RttRk2RD7Z01ndmZnfr%2Bfhw1ijfrgwYP3vp8Hj%2B8T%2Fi907QK1fSMMum%2FhV1LSHqgQynsBA3e%2FRf2HVKGqH9aPn39ndunKkky9%2FBV5HuHMzh3%2FIi4RjC%2BHx949d%2BzsG%2BrFhT2EEwcevn5j86Trfv8Znp%2FgjwIW0rUdgN2UJ1eCFy6dfOrUqzK1RxMAz87VeWjmcPOXG%2F1Fu%2FHjFwT124jsAMxQa3%2Bun39%2FoXXkLKNV0A60Ai0w3w5pPPLcyK83%2B4uDjdVv0NIh7fwFmKcxv6IOX5oP9p%2BmVAYP8PUwcZAPoD1dYrx9MFq9ZRazznc%2Fka2takS9xPjCp%2FLkB4%2F6zeMoH6waCj0Fsn1mY6GfQWsioDV7qLS%2B6Z2JO1dvaWrty7TfOyilQ4hJEHG4XR5OC1pABPICMgNpDrfvFQySBKlO%2B92tyRMeqvoJzo677kelwmSPyxOv%2BVIJiZXDGKE%2FgOkGNCsQ7YLORsaXH6%2FEiFyz3si6hzPLZN1l7nwdktvVIl5q5b8XkDj8psfsXuHABJQ9CALIe5BtJT%2FYPD1KXePhBnD9MvxxtWD3olaxpTnmmJ0TjszBVAOMgcJAWIYosChV09Z6IOCx9TM4OzRQKpw6qnnljM9IBZyDLAfHsI4qEHoW0ly4XwAp3rZ4GLnhmbbm6cdgc3PIDf1hyzmoRlDVDvpmeNU8xXvA%2F05ULYDJGlT%2B8SXOQb0C1yKBtFD0c%2FA1HlS3RwYJRRqv%2F5aMra9VuJ8ZnHsQkJQVazdjbGYMxgEWQaLtkRSYeb069vbFxmgrcjazfwcAKKVUrxfH93p33kTcFRD%2BBJjxDD9ykwv%2FAAAAAElFTkSuQmCC)',
					oncommand: 'var tabMM = event.target.ownerGlobal.gBrowser.selectedBrowser.messageManager; \
						tabMM.loadFrameScript("data:, content.scrollTo(0,0)", false);'
				};
				for (var p in props)
					toolbaritem.setAttribute(p, props[p]);
				return toolbaritem;
			}
		});
	} catch(e) { };
	  
	var item = document.createElement('menuitem');
   item.id = 'addBackToTop-context';
   item.setAttribute('label', 'Seite nach oben');
   item.setAttribute('accesskey', 'O');
   item.setAttribute('oncommand',
      'var tabMM = gBrowser.selectedBrowser.messageManager;' +
      'tabMM.loadFrameScript("data:, content.scrollTo(0,0)", false);'
   );
   document.getElementById('contentAreaContextMenu').appendChild(item);
   
})();
