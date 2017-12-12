(function() {

//Einstellungen	- true = ein(aktiviert) false = aus(deaktiviert)

  let moc = true;	//in Verbindung mit der alten Suchleiste verwenden
  let keyUD	= false;//Suchmaschine auch mit Strg + ↑ ↓ Tasten ändern
  let over = false;	//Sämtliche Änderungen mit Mousehover bei Suchleiste anzeigen
//Namen und Symbol der Suchmaschine in der Suchleiste anzeigen
  let label = true; //Namen anzeigen
  let img = true;	//Symbol - Favicon anzeigen
//Doppelklick auf Suchleiste, um zur Standard Suchmaschine zurück zukehren
  let dbl = true;	//Funktion aktivieren
  let zero = true;	//Zurück an die Spitze der Suchmaschinen mit einem Klick
  let select = 'Google Deutschland';  //Standard Suchmaschine angeben, zum Beispiel 'DuckDuckGo'.
  let erase = false;//Nach Suche Suchleiste leeren
//Nach Suche mit der Suchleiste, zur angegebenen Suchmaschine zurück zukehren
  let auto = true;	//Andere Einstellungen verwenden, durch einen Doppelklick auf die Suchleiste
//Kontextmenü Suche mit[～～Suchen]
  let con = true;	//Funktion aktivieren
  let icon = true;	//Symbol - Favicon anzeigen
  let clk = true;	//Klicken, um zur Standard Suchmaschine zurückzukehren (Andere Einstellungen verwenden ~ mit Doppelklick auf die Suchleiste)
//Zu der beim Start angegebenen Suchmaschine zurückkehren. * Gilt auch beim Neustart
  let start0 = true;//Andere Einstellungen verwenden, durch einen Doppelklick auf die Suchleiste

//Konfiguration

  const scrollRight = true;
  let bar = document.getElementById('searchbar');
  let box = bar.textbox.inputField;
  let menu = document.getElementById('context-searchselect');
  //Nur einmal aufrufen, zur Vermeidung von leerer Seite
  if(!!start0)gBrowser.addEventListener('load', ResetE, {once:true});
  if(!start0)gBrowser.addEventListener('load', ShowCurrentE, {once:true});
  if(!!moc)document.getElementById('PopupSearchAutoComplete').addEventListener('mouseup', function(){setTimeout(function(){CMenu()}, 0)}, false);
  if(!!keyUD)box.addEventListener('keyup', function(e){CheckK(e)}, false);
  if(!!over)bar.addEventListener('mouseover', ShowCurrentE, false);
  if(!!dbl)bar.addEventListener('dblclick', ResetE, false);
  bar.addEventListener('DOMMouseScroll', function(e){ChangeE(e)} , false);
  menu.addEventListener('wheel', function(e){if(!!con) ChangeE(e)} , false);
  if(!!clk)menu.addEventListener('click', function(){setTimeout(function(){ResetE()}, 0)} , false);
  
  
  function ResetE(){
  	this.engines = Services.search.getVisibleEngines({});
  	let index = this.engines.indexOf(Services.search.currentEngine);
  	if(!!zero || select == ''){Services.search.currentEngine = this.engines[0]}else{
  		Services.search.currentEngine = Services.search.getEngineByName(select)
  		}
  	CMenu();
  	if(!!erase)box.value = '';
  }
  
  function CheckK(event){
  	if(!event.ctrlKey && !event.keyCode == 38 && !event.keyCode == 40) return;
  	CMenu()
  }
  
  function CMenu() {
  	ShowCurrentE();
  	menu.setAttribute('label','Suchen mit ' + Services.search.currentEngine.name);
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
    	//console.log(Services.search.currentEngine.name); //Suchmaschinennamen erfassen
    	CMenu()
  }
  
  function ShowCurrentE(){
  	let E = Services.search.currentEngine;
		if(!!label)box.setAttribute('placeholder', E.name);
	let icon = document.getAnonymousElementByAttribute(bar, 'class', 'searchbar-search-icon');
		if(!!img)icon.setAttribute('style', "list-style-image: url('"+ E.iconURI.spec +"') !important; -moz-image-region: auto !important; width: 16px !important; padding: 2px 0 !important;");
  }
  
  if(!auto) return;
  	bar.cmd = bar.doSearch;
  	bar.doSearch = function(aData, aWhere, aEngine) {
  	this.cmd(aData, aWhere, aEngine);
  	ResetE()
  }  
})();