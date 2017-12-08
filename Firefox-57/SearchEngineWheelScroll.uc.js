(function() {//ver.0.2
  const scrollRight = true;
  let bar = document.getElementById('searchbar');
  let box = bar.textbox.inputField;
  let menu = document.getElementById('context-searchselect');
  //Nur einmal aufrufen um leere Seite beim Start zu vermeiden
  gBrowser.addEventListener('load', ShowCurrentE, {once:true});
  //Entspricht, wenn sich die Suchmaschine aufgrund der alten Suchleiste geändert hat
  document.getElementById('PopupSearchAutoComplete').addEventListener('mouseup', function(){setTimeout(function(){CMenu()}, 0)}, false);
  bar.addEventListener("DOMMouseScroll",function(e){ChangeE(e)} , false);
  //Such aus Kontextmenü [Suchen mit ~~]
  let iran = false;//zum Aktivieren dieser Funktion auf true ändern
  let icon = true;//Suchmaschinen Symbole anzeigen true=ja false=nein
  menu.addEventListener("wheel",function(e){if(!iran) ChangeE(e)} , false);
  
  function CMenu() {
  	ShowCurrentE();
  	menu.setAttribute('label', Services.search.currentEngine.name + '\u3067\u691c\u7d22');
  	if(!icon || !!iran) return;
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
    	CMenu()
  }
  
  function ShowCurrentE(){
  	let E = Services.search.currentEngine;
    //Zeigt den Namen der Suchmaschine in einem Platzhalter
		box.setAttribute('placeholder', E.name);
	//Das Symbol der Suchmaschine anzeigen
	let icon = document.getAnonymousElementByAttribute(bar, 'class', 'searchbar-search-icon');
		icon.setAttribute('style', "list-style-image: url('"+ E.iconURI.spec +"') !important; -moz-image-region: auto !important; width: 16px !important; padding: 2px 0 !important;");
  }
})();
