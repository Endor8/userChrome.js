// ==UserScript==
// @name      	SearchEngineWheelScrollContextMenu.uc.js
// @include    	main
// @version     0.4 2024/03/14 engine.getIconURL()→await engine.getIconURL()
// @version     0.3 2023/12/28 Einstellung hinzugefügt, um zusätzlich zur herkömmlichen
// @Version                    Abwärtsrichtung eine Schleife nach oben durchzuführen.
// @version	0.2 2023/12/25 engine.iconURI.spec geändert in: engine.getIconURL()
// @version	0.1 2019/02/05 Abgeleitet vom Script SearchEngineWheelScroll.uc.js 
// ==/UserScript==
// Wenn es eine Suchleiste gibt, suchen Sie mit dieser Funktion. 
// Wenn nicht, suchen Sie mit einer Funktion, die der Kontextmenüsuche ähnelt
(function(){
	// Maus-Scrolling und Engine-Scrolling-Richtung nach oben/unten abgleichen [true] =ja [false] =ein
	const scrollDown = true;
	// Schleife beim Aufwärtsscrollen [true] =ja - Keine Schleife [false]
	const scrollLoop = true;
	const $ = function(selector){return document.querySelector(selector);}
	const menu = $('#context-searchselect');
	let currentEngine;
	
	menu.addEventListener('wheel', ChangeE, false);
	menu.removeAttribute('oncommand');
	menu.addEventListener('command', contextSearch, false);
	menu.parentNode.addEventListener('popupshown', CMenu_init, false);
	menu.setAttribute('class', 'menuitem-iconic');

	function CMenu_init(){
		currentEngine = null;
		Services.search.getVisibleEngines().then(function(engines){
			CMenu(engines[0]);
		});
		
  	}

	function ChangeE(e) {
		const dir = (scrollDown ? 1 : -1) * Math.sign(e.deltaY);
		Services.search.getVisibleEngines().then(function(engines){
			const index = currentEngine? engines.indexOf(currentEngine) : 0;
			engines[engines.length] = engines[0];
			//currentEngine = engines[index + dir];
			currentEngine = (index + dir < 0) ? scrollLoop ? engines[engines.length -2] : false : engines[index + dir];
			if(!currentEngine) return;
			CMenu(currentEngine);
		})
	}
	
	async function CMenu(engine) {
		this.engine = engine;
  		let selectedText = menu.searchTerms || window.getSelection().toString();
  		if (selectedText.length > 15) {
  			let truncLength = 15;
  			let truncChar = selectedText[15].charCodeAt(0);
  			if (truncChar >= 0xDC00 && truncChar <= 0xDFFF)
  				truncLength++;
  			selectedText = selectedText.substr(0, truncLength) + '\u2026';
  		}
  		const menuLabel = gNavigatorBundle.getFormattedString('contextMenuSearch', [this.engine.name, selectedText]);
  		menu.setAttribute('label', menuLabel);
		//menu.setAttribute('image', this.engine.iconURI.spec);
		menu.setAttribute('image', await this.engine.getIconURL());
	}
	
	function contextSearch(){
		const str = menu.searchTerms;
		if($('#searchbar')){
  			$('#searchbar').doSearch(str, 'tab', currentEngine, {}, false);
  		}else{
  			_contextSearch(str, 'tab', currentEngine);
  		}
  		currentEngine = null;
	}

	function _contextSearch(str, where, engine){
		let submission = engine.getSubmission(str, null);
    	openLinkIn(submission.uri.spec,
        	where,
            { postData: submission.postData,
              relatedToCurrent: true,
              inBackground: false,
              triggeringPrincipal: Services.scriptSecurityManager.getSystemPrincipal()
            }
        );
	}

	function observe(aSubject, aTopic, aData) {
    	if(aData === 'init-complete' && aTopic === 'browser-search-service'){
   	   		CMenu_init();
   	 	}
	}
		
	Services.obs.addObserver(observe, 'browser-search-service');
  	window.addEventListener('unload', () => {
  		Services.obs.removeObserver(observe, 'browser-search-service');
 	});

})()
