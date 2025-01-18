  
  //  Eyedropper.uc.js
  
  (function() {

   if (location != 'chrome://browser/content/browser.xhtml') return;
	
   try {
	  CustomizableUI.createWidget({
		 id: 'eyedropper-toolbar-button',
		 type: 'custom',
		 defaultArea: CustomizableUI.AREA_MENUBAR,
		 onBuild: function(aDocument) {         
			var toolbaritem = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
			var props = {
			   id: 'eyedropper-toolbar-button',
			   class: 'toolbarbutton-1 chromeclass-toolbar-additional',
			   label: 'Farbe kopieren',
			   tooltiptext: 'Farbe als Hexcode in die Zwischenablage kopieren',
			   style: 'list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADR0lEQVQ4jX2TbUxTBxiFX7PIiC4GwnQ/MDHGKMTMDaOWaLQSt4GSbM5AVtZIpSqsJqAUv+oYGQWmgCioIAQ/ih9BUfyoiZsFSovG0sJstVupFCiDItyL9IMm996ixuMP92NkxJOcf+/z5iTveYlmkMp+NrLc3ZBY6r6Qedxdn3l6uCbxmF0VOdPsNBUaNOHljka1hv2drfNpcTJwDVWBK7jsv4K7LzXsDWeRWmPICJ8RPtp2O+rccJuh3qfH4fFLkI2VYdvYz0hllNjPZqNhIg/myXLYxo4ZLBZZ1P8WnHnerj3FdGCv5xp2j9QhY7QCUkaNHawKvzAKaMZS8JBJhsefjSH3Qe00uNT0QHpiyIK8AR2U/2hxYKQJR9jLUE3U41dvFS5M5KN9fDtczCZ4R9ciNLoTLtMe6fvoBl1ssdVkPNjTiVynEaoBA46/MOK814CGyRZcD95B52Q1PL4cBEc3g+9bA8GRgImuncZeQ1Ys7dO1SbIembw7zGZkdXci39GN856/0ep3wSy4YJ+yws83Y2pcjZAzDZxpPXi9CIE/kr2Dd2USSmvSKZPuPQp9/aALW3QWZD5+hqqeAegZFm4hCD7kwVu2Ha/spyC07ALXmAD+kgjB+g2hvtptStp47r58+cWHwZjGLiy7asGG5qdQ6PtRZ2PwbFDAW/dLvOlsxVRzBYQzGeCKxeCL4xEoiA8OqJPktLDkhmh+eYstosaCuZVmRJ9+gqQGJ37TvoBVH8ArPYvXN3UIVRSCz00Bt3sdhD3xYOVxNodstYiIaNa8QzcLwopMCCuyILKgGxtLHCipHEJ3LQOuZhhTZa0QDpSAl6WAk6yHkLoKz7//soCIZr2/o6w66uNsXX+E6k8sybMhOacHpbn9MOUNwr+vD4KiFVz6CXCSnyD8sBXs5tX9bV/FTi9T+C6teJHiiU+c04tMhQvV8l6Y0l0Y/9EJXmIEJ9HgTVohXn+73edKFItnrHPE0uQ48db71sPyQTTJR/BXugdB6RCQ9hRIvQV7gtIqjV4a98GHCqNPPl8W/c1R2Rf5HSfj65xX19Q6K5fv7/hugahsDs1e+UGYiD4iok+JaBERxRDRin8dQ0SLiegzIpr9X+Adr7cJIv/W9uoAAAAASUVORK5CYII=)',
			};            
			for (var p in props)
					toolbaritem.setAttribute(p, props[p]);
					toolbaritem.addEventListener('click', event => {
					if (event.button == 0) { 
                            document.getElementById('menu_eyedropper').click();
                                 }
				});		   
			return toolbaritem;
		 }      
	  });
   } catch(e) { };
	
   }) ();