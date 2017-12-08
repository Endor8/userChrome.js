(function() {
  if (location != 'chrome://browser/content/browser.xul')
    return;
  const scrollRight = true;
  let bar = document.getElementById('searchbar');
  let box = bar.textbox.inputField;
  //起動時真っ白回避のために1回だけ呼び出す
  gBrowser.addEventListener('load', function(){ShowCurrentE(Services.search.currentEngine)}, {once:true});
  bar.addEventListener("DOMMouseScroll", function(event) {
    let dir = (scrollRight ? 1 : -1) * Math.sign(event.detail);
  	this.engines = Services.search.getVisibleEngines({});
  	let index = this.engines.indexOf(this.currentEngine);
  		this.engines[this.engines.length] = this.engines[0]
    	this.currentEngine = this.engines[index+dir];
		ShowCurrentE(this.currentEngine)
  }, false);
  
  function ShowCurrentE(E){
    //プレースホルダーに検索エンジンの名前を表示
		box.setAttribute('placeholder', E.name);
	//検索エンジンのアイコンを表示
	let icon = document.getAnonymousElementByAttribute(bar, 'class', 'searchbar-search-icon');
		icon.setAttribute('style', "list-style-image: url('"+ E.iconURI.spec +"') !important; -moz-image-region: auto !important; width: 16px !important; padding: 2px 0 !important;");
  }
})();