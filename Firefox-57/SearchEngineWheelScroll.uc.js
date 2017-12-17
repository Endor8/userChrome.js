(function() {

//Einstellungen	- true = ein(aktiviert) false = aus(deaktiviert)

//Namen und Symbol der Suchmaschine in der Suchleiste anzeigen
  let label = true;//Namen anzeigen
  let img = true;	//Symbol - Favicon anzeigen
//Doppelklick auf Suchleiste, um zur Standard Suchmaschine zurück zukehren
  let only = false;	//Suchleiste leeren und nicht zur Standardsuchmaschine zurückkehren [[[Neu in Version 0.6]]]
  let dbl = true;	//Funktion aktivieren
  let zero = false;	//Bei Klick zur obersten Suchmaschine zurückkehren
  let select = 'Google Deutschland'; //Standard Suchmaschine angeben, zum Beispiel 'DuckDuckGo'.
  let erase = true; //Nach Suche Suchleiste leeren
//[Aktion nach dem Suchen mit der Suchleiste]
  let auto = true;	//Andere Einstellungen verwenden, durch einen Doppelklick auf die Suchleiste  
//Kontextmenü Suche wechseln mit[～～Suchen]
  let con = true;	//Funktion aktivieren
  let icon = true;	//Symbol - Favicon anzeigen
  let clk = true;	//Klicken, um zur Standard Suchmaschine zurückzukehren (Andere Einstellungen verwenden ~ mit Doppelklick auf die Suchleiste)
//[Verhalten beim Start] * Gilt auch beim Neustart
  let start0 = false; //Andere Einstellungen verwenden, durch Doppelklick auf die Suchleiste

//Konfiguration

  const scrollRight = true;
  let bar = document.getElementById('searchbar');
  let box = bar.textbox.inputField;
  let menu = document.getElementById('context-searchselect');
  
  if(!!start0)gBrowser.addEventListener('load', ResetE, {once:true});
  if(!start0)gBrowser.addEventListener('load', ShowCurrentE, {once:true});
  if(!!dbl)bar.addEventListener('dblclick', ResetE, false);
  bar.addEventListener('DOMMouseScroll', ChangeE, false);
  if(!!con)menu.addEventListener('wheel', ChangeE, false);
  if(!!clk)menu.addEventListener('click', function(){setTimeout(function(){ResetE()}, 0)} , false);

  window.addEventListener('unload', function uninit() {
        bar.removeEventListener('dblclick', ResetE, false);
        bar.removeEventListener('DOMMouseScroll', ChangeE, false);
        menu.removeEventListener('wheel', function(e){if(!!con) ChangeE(e)} , false);
        menu.removeEventListener('click', function(){setTimeout(function(){ResetE()}, 0)} , false);
        window.removeEventListener('unload', uninit , false);
    }, false);
  
  function ResetE(){
  	this.engines = Services.search.getVisibleEngines({});
  	let index = this.engines.indexOf(Services.search.currentEngine);
  	if(!only){
  	if(!!zero || select == ''){Services.search.currentEngine = this.engines[0]
  	}else{
  		Services.search.currentEngine = Services.search.getEngineByName(select)
	  	}
  	}	
  	if(!!erase || !!only)box.value = '';
  }
  
  function CMenu() {
  	ShowCurrentE();
  	let selectedText = menu.searchTerms;
  	if (selectedText.length > 15) {
  		let truncLength = 15;
  		let truncChar = selectedText[15].charCodeAt(0);
  		if (truncChar >= 0xDC00 && truncChar <= 0xDFFF)
  			truncLength++;
  		selectedText = selectedText.substr(0, truncLength) + 'Suchen mit ';
  	}
  	var menuLabel = gNavigatorBundle.getFormattedString('contextMenuSearch',[Services.search.currentEngine.name, selectedText]);
  	menu.setAttribute('label', menuLabel);
  	if(!icon || !con) return;
  	let style = '@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);#context-searchselect:before{margin:0 -20px 0 5px;content:"";display:inline-block;width:16px;height:16px;background:url('+ Services.search.currentEngine.iconURI.spec +');background-size:contain!important}';
  	let sspi = document.createProcessingInstruction(
    	'xml-stylesheet',
    	'type="text/css" href="data:text/css,' + encodeURIComponent(style) + '"'
  		);
  	document.insertBefore(sspi, document.documentElement);
  	sspi.getAttribute = function(name) {
    	return document.documentElement.getAttribute(name);
  	};  
  }
  
  function ChangeE(event) {
    let dir = (scrollRight ? 1 : -1) * Math.sign(event.detail || event.deltaY);
  	this.engines = Services.search.getVisibleEngines({});
  	let index = this.engines.indexOf(Services.search.currentEngine);
  		this.engines[this.engines.length] = this.engines[0]
    	Services.search.currentEngine = this.engines[index+dir];
  }
  
  function ShowCurrentE(){
  	let E = Services.search.currentEngine;
		if(!!label)box.setAttribute('placeholder', E.name);
	let icon = document.getAnonymousElementByAttribute(bar, 'class', 'searchbar-search-icon');
		if(!!img)icon.setAttribute('style', "list-style-image: url('"+ E.iconURI.spec +"') !important; -moz-image-region: auto !important; width: 16px !important; padding: 2px 0 !important;");
  }
  
  Services.obs.addObserver(observe, "browser-search-engine-modified");
    window.addEventListener("unload", () => {
      Services.obs.removeObserver(observe, "browser-search-engine-modified");
    });
   
   function observe(aEngine, aTopic, aVerb) { 
    if (aTopic == "browser-search-engine-modified") {
      aEngine.QueryInterface(Components.interfaces.nsISearchEngine);
      if(aVerb !== "engine-current") return;
      	CMenu()
  	}
  }
    
  if(!auto) return;
  	bar.cmd = bar.doSearch;
  	bar.doSearch = function(aData, aWhere, aEngine) {
  	this.cmd(aData, aWhere, aEngine);
  	ResetE()
  }  
})()
