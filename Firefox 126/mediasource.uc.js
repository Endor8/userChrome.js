(function() {

   if (location != 'chrome://browser/content/browser.xhtml')
      return;

   try {
      CustomizableUI.createWidget({
         id: 'mediasource-enabled-button',
         type: 'custom',
         defaultArea: CustomizableUI.AREA_NAVBAR,
         onBuild: function(aDocument) {
            var button = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
            var attributes = {
               id: 'mediasource-enabled-button',
               class: 'toolbarbutton-1 chromeclass-toolbar-additional',
               removable: 'true',
               label: 'media.mediasource',               
               tooltiptext: Services.prefs.getBoolPref('media.mediasource.enabled') ?
                  'media.mediasource ist aktiviert' : 'media.mediasource ist deaktiviert',
               oncommand: '(' + onCommand.toString() + ')()'
            };
            for (var a in attributes) {
               button.setAttribute(a, attributes[a]);
            };
            function onCommand() {
               var isEnabled = !Services.prefs.getBoolPref('media.mediasource.enabled');
               Services.prefs.setBoolPref('media.mediasource.enabled', isEnabled);
			   event.target.ownerGlobal.BrowserCommands.reload();
               var windows = Services.wm.getEnumerator('navigator:browser');
               while (windows.hasMoreElements()) {
                  let button = windows.getNext().document.getElementById('mediasource-enabled-button');
                  if (isEnabled)
                     button.setAttribute('tooltiptext', 'media.mediasource ist aktiviert')
                  else
                     button.setAttribute('tooltiptext', 'media.mediasource ist deaktiviert');
               };
            };
            return button;
         }
      });
   } catch(e) { };

   var css =
      '#mediasource-enabled-button[tooltiptext="media.mediasource ist aktiviert"] {list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH4QgVChgZrZw7pAAAAulJREFUOMttk89PXFUUxz/3vofDTAccfo2tFpDXzSSkFZSFYsLChTXsTGSYhS6EpN2y8EmABAIJQ8ho+hcwUbuAmVnpysRYZRaaGKI2pLUmzhhSw1Aob2gKU4b33r0uYChEv8tzvt9zz/mecwUnmJmZYXZ2lvn5eUtrPa61HtBaWwBCiKIQIi+EWJyamirWuAACYHJykmQyyfT09JLveSOPDl1i20Xay5sAPGx6mQdRi5fq6zBMMz03Nzda0wjbtkmlUkxMTPzuHFRe69kpMvrge+qqFZSQAEitcAMh0rF3+K3tCs0XQncXFhZ6bNs+7sC27SVnvzLy8b1veftxASUNpPJR0uAspPL5qbmLpauDtIRD6VQqNWqMjY1Z7tHRF907RT7Y+OVY7Pp8PXiDWOHX2pQAaCHpqDj8E27hUaCxt7+//7b0PG+8VKlys5A/9+LPLV188u4Yfza3I5V/GlfS4OZfeUqVKp7njUvXdQe6dzeoOzx43quAvfIeW1tbfNr6Bp/FriO1Ok2b1Qrdzgau6w5I13Wt9qfb6BPDagXK5TKO43BQdvjhmeTD1z/ifuurCDRKSDr3Sriua5m+76M152EIVldXebr5kGAwSGdHB8GGhjNugNYa3/cxlVLFv4NNMYFCY9SyRCIRGoXCM0yuv2iSvJdDCYlGILVPIdyGUqoolVL5tVAUtz58pjxEo21c7uwkF94lubN2ehMAXv0F1oJRlFJ5CSxGhOLWpb7nbmt4L1LHndIdeg93z4ml8rl1qY+IUACLxvr6evnqtWsdf3hG7+WjfbqqT1CGwUDpPkrK/xzSj+FXuN1oEQq8kF5eXv7SSCQSrKysfNPX0/P+d4G2i5uRi7x5uIPhH6FPbJMo/ECIz9vf4qsGi6ZQ8G4mkxlMJBLHjOHhYTKZDPF4fMn3vBHHh75n21zZfwxAIdzKWjBKswGGaaaz2exoTXO6mXg8TjabZWhoyAL+9zsDi7lcrljjAvwLey1SDvA6/m0AAAAASUVORK5CYII=)} ' +
      '#mediasource-enabled-button[tooltiptext="media.mediasource ist deaktiviert"] {list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH4QgVChcoe9onUQAAAvBJREFUOMttk09M22UYxz+/931b+kcg1FEoZAmWbGOSuCVOjR6IXnfzQGnCDeLBG4lpCJBAIAEye+CqB6qXJrTcPGjMolnINCbOxDl1soQyFKms0lrH1tHf731fD7SdLj7Jk/fwPt+83+/nzePQqIWFBRYXF1leXo5ba6ettSPW2jiA4zgFx3G2HMe5Njc3V2jOAjgAs7OzrKysMD8/v649b+LwxGPocIeB0n0A7ncP8EvPINE2hVIqs7S0NNnUOKlUinQ6zczMzPflR7VLLxfvMrH9JdJzMUICIIzGSB8fXXiTb/uGiYSDt1dXVy+nUqlTB6lUav3o0eOJyR8+5Y3ybkv4bAmj+TryAusvXeX5cCiTTqcnnampqbj2vJ2Lv9/l3e0vMEIh6l4jHE9PC9onkUbz4bm3+OnsMFKpQeV53nTx8QlrhZsYIRF1j/TUBxxVKvxVqVCr1bDWctIWIvfZ+xgleWf3JmNnztEbZFq5rjsyXN5Duict609qNZ48+IOHpRLHx8dYa3EDYRCNKJ7Li0d7HPYMjCjXdePxo32MaN7C/sEB9WqVSqVCtVpFSokO6RYLIySDf/7KfqQ/rrTW2P+Qgjt3fqS8V6BYLGKtJRaL8VzM95QHYLForVHGmMK99p4hcfTzaQQL7e3t2K4uhBBYa+no6KAtHIbSKVRhNNudfRhjCsoYs/VdKDqk/QEczwUL/jNRAvU6JtwBQDAYREW6YbfxuvJxK9RN1JgtZ3x8PO7W6zuvPjzgvd++QjsS6ekWsH95RkuJtIa1/tf4pvMsPr9/UGSz2YKQMnPd382NcD/SGoySGPFMN8Q3wn18HuhFSJnJZrMFmUwm2djY+OTK5UtvX2+L9j4IR3i9dojQLtZxAAdhNUgfa32v8HHnebpCgdu5XO5qMpk85To2NkYulyORSKxrz5soa7hSK3H+7yJYuNcZ41YoSkRYpFKZfD4/2dS0PiaRSJDP5xkdHY0D/7vOwLXNzc1CcxbgH/lpXYTK63B1AAAAAElFTkSuQmCC)} ';
   var stylesheet = document.createProcessingInstruction('xml-stylesheet', 'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(css) + '"');
   document.insertBefore(stylesheet, document.documentElement);

})();

