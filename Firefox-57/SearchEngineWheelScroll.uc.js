(function() {
//Einstellungen	- true = ein(aktiviert) false = aus(deaktiviert)

//Namen und Symbol der Suchmaschine in der Suchleiste anzeigen
  const BUTTON_ONLY = false	//Nur bei Suchleisten Suchschaltfläche anwenden - Suchmaschinen wechseln mit Scrollrad im Hauptkontextmenü deaktivieren
  const label = true; //Namen anzeigen
  const img = true;	//Symbol - Favicon anzeigen
//Doppelklick auf Suchleiste, um zur Standard Suchmaschine zurück zu kehren
  const only = false; //Suchleiste leeren und nicht zur Standardsuchmaschine zurückkehren [Neu in Version 0.6]
  const dbl = true;	//Funktion aktivieren
  const zero = false; //Bei Klick zur obersten Suchmaschine zurückkehren
  const select = 'Google'; //Standard Suchmaschine angeben, zum Beispiel 'DuckDuckGo'.
  const erase = true; //Nach Suche Suchleiste leeren
//[Aktion nach dem Suchen mit der Suchleiste]
  const auto = true; //Andere Einstellungen verwenden, durch einen Doppelklick auf die Suchleiste  
//Kontextmenü Suche wechseln mit[～～Suchen]
  const cxt = true;	//Funktion aktivieren
  const icon = true; //Symbol - Favicon anzeigen
  const clk = true;	//Klicken, um zur Standard Suchmaschine zurückzukehren (Andere Einstellungen verwenden ~ mit Doppelklick auf die Suchleiste)
  const sync = false; //Suchwort an die Suchleiste senden [Neu in Version 0.7]
  const hist = true; //Suchwort der Suchchronik der Suchleiste hinzufügen * Es ist OK, wenn die Synchronisation inkorrekt ist [Neu in Version 0.8]
//[Verhalten beim Start] * Gilt auch beim Neustart
  const start0 = false; //Andere Einstellungen verwenden, durch Doppelklick auf die Suchleiste

//Konfiguration

  const scrollRight = true;
  let bar = document.getElementById('searchbar');
  let box = bar.textbox.inputField;
  let menu = document.getElementById('context-searchselect');
  let BSS = Components.classes["@mozilla.org/browser/search-service;1"]
  			.getService(Components.interfaces.nsIBrowserSearchService);
  
  if(!!dbl) bar.addEventListener('dblclick', ResetE, false);
  bar.addEventListener('DOMMouseScroll', ChangeE, false);
  if(!!cxt) menu.addEventListener('wheel', ChangeE, false);
  if(!!clk) menu.addEventListener('click', function(){
  	if(!!sync) {box.value = this.searchTerms}else{box.value = box.value}
  	if(!!hist) SyncHistory();
  	setTimeout(function(){ResetE()}, 0)
  }, false);

  window.addEventListener('unload', function uninit() {
        bar.removeEventListener('dblclick', ResetE, false);
        bar.removeEventListener('DOMMouseScroll', ChangeE, false);
        menu.removeEventListener('wheel', function(e){if(!!con) ChangeE(e)} , false);
        menu.removeEventListener('click', function(){
        	if(!!sync) {box.value = this.searchTerms}else{box.value = box.value}
        	if(!!hist) SyncHistory();
        	setTimeout(function(){ResetE()}, 0)
        } , false);
        window.removeEventListener('unload', uninit , false);
  }, false);
  
  function ResetE(){
  	this.engines = BSS.getVisibleEngines({});
  	let index = this.engines.indexOf(BSS.currentEngine);
  	if(!only){
  	if(!!zero || select == ''){BSS.currentEngine = this.engines[0]
  	}else{
  		BSS.currentEngine = BSS.getEngineByName(select)
	  	}
  	}
  	if(!!erase || !!only) box.value = '';
  }
  
  function CMenu() {
  	let selectedText = menu.searchTerms || window.getSelection().toString();
  	if (selectedText.length > 15) {
  		let truncLength = 15;
  		let truncChar = selectedText[15].charCodeAt(0);
  		if (truncChar >= 0xDC00 && truncChar <= 0xDFFF)
  			truncLength++;
  		selectedText = selectedText.substr(0, truncLength) + '\u2026';
  	}
  	var menuLabel = gNavigatorBundle.getFormattedString('contextMenuSearch',[BSS.currentEngine.name, selectedText]);
  	menu.setAttribute('label', menuLabel);
  	if(!icon || !cxt) return;
  	let style = '@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);#context-searchselect:before{margin:0 -20px 0 5px;content:"";display:inline-block;width:16px;height:16px;background:url('+ BSS.currentEngine.iconURI.spec +');background-size:contain!important}';
  	let sspi = document.createProcessingInstruction(
    	'xml-stylesheet',
    	'type="text/css" href="data:text/css,' + encodeURIComponent(style) + '"'
  		);
  	document.insertBefore(sspi, document.documentElement);
  	sspi.getAttribute = function(name) {
    	return document.documentElement.getAttribute(name);
  	};  
  }
  
  function SyncHistory(){
  	let val = menu.searchTerms;
  	let addHistory = function(val){
  		setTimeout(function(){bar.FormHistory.update({op: "add", fieldname: "searchbar-history", value: val})}, 500);
  	};
  	let removeHistory = function(callback, val){
  		bar.FormHistory.update({op: "remove", fieldname: "searchbar-history", value: val});
  		callback(val);
  	}
  	removeHistory(addHistory, val);
  }
  
  function ChangeE(event) {
  	if(BUTTON_ONLY && event.originalTarget.className !== 'searchbar-search-button' && event.originalTarget !== menu) return;
    let dir = (scrollRight ? 1 : -1) * Math.sign(event.detail || event.deltaY);
  	this.engines = BSS.getVisibleEngines({});
  	let index = this.engines.indexOf(BSS.currentEngine);
  		this.engines[this.engines.length] = this.engines[0]
  		if(index+dir < 0) return;
    	BSS.currentEngine = this.engines[index+dir];
  }
  
  function ShowCurrentE(){
  	let E = BSS.currentEngine;
		if(!!label)box.setAttribute('placeholder', E.name);
	let icon = document.getAnonymousElementByAttribute(bar, 'class', 'searchbar-search-icon');
		if(!!img)icon.setAttribute('style', "list-style-image: url('"+ E.iconURI.spec +"') !important; -moz-image-region: auto !important; width: 16px !important; padding: 2px 0 !important;");
  }
  
  Services.obs.addObserver(observe, "browser-search-engine-modified");
    window.addEventListener("unload", () => {
      Services.obs.removeObserver(observe, "browser-search-engine-modified");
  });
   
  Services.obs.addObserver(ob2, "browser-search-service");
    window.addEventListener("unload", () => {
      Services.obs.removeObserver(ob2, "browser-search-service");
  });
    
   
   function observe(aEngine, aTopic, aVerb) { 
    if (aTopic == "browser-search-engine-modified") {
      aEngine.QueryInterface(Components.interfaces.nsISearchEngine);
      if(aVerb !== "engine-current") return;
      	ShowCurrentE();
      	CMenu();
  	}
  }

   function ob2(aSubject, aTopic, aData) {
    if(aData === "init-complete" && aTopic === "browser-search-service") {
       if(!!start0) ResetE();
   	   ShowCurrentE();
   	   CMenu();
   	 }
   }
    
  if(!auto) return;
  	bar.cmd = bar.doSearch;
  	bar.doSearch = function(aData, aWhere, aEngine) {
  	this.cmd(aData, aWhere, aEngine);
  	ResetE()
  }  
})()
