// ==UserScript==
// @name				 dav_tab_title_url.uc
// @version				 4.0
// @description			 dav_tab_title_url.uc
// ==/UserScript==

/*
Idea based on
https://github.com/LouCypher/tab-tooltip-url
*/

(function(){
	if(location.href != 'chrome://browser/content/browser.xhtml') return;

	var linkifiesUrl = true,
		showPreview = true,
		timeUpdatePreview = 1000, //miliseconds
		idTimeoutUpdatePreview,
		colorizeExtensionFile = false,
		numberClampsLines = 2 // 0 => no clamps
	;
	var widthCanvasIMG = 400;
	var heightCanvasIMG = widthCanvasIMG*9/16;

	function linkifiesLocationBar(url){

		function appendPart(text, clase) {
			if (!text) return;

			if(clase == "pathname"){
				let sp = createElement({
					type: "label",
					attr: {
						class: "label_pathname",
						innerHTML:"/"
					}
				});
				divLocationBar.appendChild(sp);
			}
			let sp = createElement({
				type: "span",
				attr: {
					class: clase,
					innerHTML:text
				}
			});
			divLocationBar.appendChild(sp);
			sp.setAttribute("href", divLocationBar.textContent);
			return sp;
		}

		var divLocationBar = createElement({
			type: "div",
			attr: {
				class: "claseLocationBarTooltip"
			}
		});

		try {
			var { protocol, hostname, port, pathname, hash, search } = new URL(url);
		} catch (e) {
			divLocationBar.innerHTML = encodeHTML(url);
			return divLocationBar;
		}

		var partido = hostname.split(".");
		var subdomain;
		if(partido.length > 2 && !partido.every( v => v == v-0 ))//chequeamos que no sean todos numeros, porque entonces es una IP
		{
			subdomain = partido.splice(0, partido.length-2).join(".");
			hostname= partido.join(".");
		}

		appendPart(protocol + "//", "protocol");
		if (subdomain) {
			appendPart(subdomain+".", "subdomain");
		}
		appendPart(hostname, "hostname");
		if (port) {
			appendPart(":" + port, "port");
		}
		var arrayPathname = pathname.split("/");
		var arrayPathnameLength = arrayPathname.length;
		arrayPathname.forEach((elto, index) => {
			if (elto) {
				let sp = appendPart(elto, "pathname");
				if(colorizeExtensionFile && index == arrayPathnameLength-1)
				{
					let arrayDot = elto.split(".");
					if(arrayDot.length > 1)
					{
						let extension = arrayDot.pop();
						sp.innerHTML = "";
						sp.appendChild(createElement({
							type: "locationBarTag",
							attr: {
								href:sp.getAttribute("href"),
								innerHTML: arrayDot.join(".")
							}
						}));
						sp.appendChild(createElement({
							type: "locationBarTag",
							attr: {
								class: "extension",
								href:sp.getAttribute("href"),
								innerHTML: "."+extension
							}
						}));
					}
				}
			}
		});
		appendPart(search, "search");
		appendPart(hash, "hash");

		return divLocationBar;
	}

	var CSS_Loader = {
		type:{
			AGENT_SHEET: 0,
			USER_SHEET: 1,
			AUTHOR_SHEET: 2
		},
		type_default:1,
		sss: Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService),
		load: function(cssCode) {
			this.unload(cssCode);
			var uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent(cssCode), null, null);
			this.sss.loadAndRegisterSheet(uri, this.type_default);
		},
		unload: function(cssCode) {
			var uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent(cssCode), null, null);
			if (this.sss.sheetRegistered(uri,this.type_default))
			{
				this.sss.unregisterSheet(uri,this.type_default);
			}
		}
	}
	function asignaEstilosLinkifiesUrl(){
		var style = `
		/*************************************
		*************** COLORS ***************
		*************************************/
		#dav_tab_title_url .title_clamp{
			overflow: hidden;
			display: -webkit-box;
			-webkit-line-clamp: `+numberClampsLines+`;
			-webkit-box-orient: vertical;
		}
		.claseLocationBarTooltip{
			font-family:monospace;
			margin:5px;
		}
		.claseLocationBarTooltip .label_pathname{
			color: black;
		}
		.claseLocationBarTooltip span.protocol{
			font-weight: normal;
			color: #777777;
			margin-right: -1px;
		}
		.claseLocationBarTooltip .subdomain {
			font-weight: bold;
			color: #C68007;
		}
		.claseLocationBarTooltip span.hostname{
			font-weight: bold;
			color: red;
		}
		.claseLocationBarTooltip span.port{
			color: #5F58A3;
		}
		.claseLocationBarTooltip span.pathname{
			color: black;
		}
		.claseLocationBarTooltip span.hash{
			color: #1054C9;
			margin-left: -1px;
		}
		.claseLocationBarTooltip span.search{
			color: #03AA03;
			margin-left: -1px;
		}
		.claseLocationBarTooltip .extension{
			color: rgb(96,86,143);
		}

		/*************************************
		*************** Flecha pathname ***************
		************************************
		.claseLocationBarTooltip .pathname:after{
			content:' ';
			display: block;
			position: absolute;
			border-style: solid;
			border-width: 4px 4px 4px 7px;
			border-color: transparent transparent transparent #6fa880;
			top: 3px;
			left: 0px;
			width: 0px;
			height: 0px;
		}
		.claseLocationBarTooltip span.pathname{
			padding-left:9px;
			margin: 0 2px;
		}
		.claseLocationBarTooltip,
		.claseLocationBarTooltip span{
			position: relative;
			display: inline-block;
		}
		.claseLocationBarTooltip .label_pathname{
			display: none;
		}
		*/
		`;
		CSS_Loader.load(style);
	}
	function asignaEstilos(){
		var style = `
			#dav_tab_title_url {
				font-family: monospace;
			}
			.divTitle{
				display: block;
			}
			#dav_tab_title_url .title,
			#dav_tab_title_url .url,
			#dav_tab_title_url .reloadDiv {
				margin:5px;
			}
			#dav_tab_title_url .title,
			#dav_tab_title_url .url{
				display:inline-block;
			}
			#dav_tab_title_url .title{
				color:black;
				font-weight: bold;
			}
			#dav_tab_title_url .url{
				color:blue;
			}
			#dav_tab_title_url .reloadText{
				color: teal;
			}
			#dav_tab_title_url .reloadValue{
				color: red;
				font-weight: bold;
				margin:0 3px;
			}
		`;
		CSS_Loader.load(style);
	}
	function asignaEstilosPreview(){

		var style = `
			#dav_tab_title_url[hidePreview] #imgPreview
			{
				display: none;
			}
			#dav_tab_title_url img#imgPreview{
				border: 1px solid #27a9e7;
				border-radius:2px;
				width: `+widthCanvasIMG+`px;
				height: `+heightCanvasIMG+`px;
				max-width: `+widthCanvasIMG+`px;
				max-height: `+heightCanvasIMG+`px;
				min-width: `+widthCanvasIMG+`px;
				min-height: `+heightCanvasIMG+`px;
			}
		`;
		CSS_Loader.load(style);
	}

	function paddy(n, p=2, c=0) {
		var pad_char = typeof c !== 'undefined' ? c : '0';
		var pad = new Array(1 + p).join(pad_char);
		return (pad + n).slice(-pad.length);
	}

	function fechaACadena(fecha){
		var dia = paddy(fecha.getDate());
		var mes = paddy(fecha.getMonth()+1);
		var anno = fecha.getFullYear();

		var hora = paddy(fecha.getHours());
		var minutos = paddy(fecha.getMinutes());
		var segundos = paddy(fecha.getSeconds());

		return dia+"/"+mes+"/"+anno+" "+hora+":"+minutos+":"+segundos;
	}

	var styleString = (style) => {
		return Object.keys(style).reduce((prev, curr) => {
			return `${prev += curr.split(/(?=[A-Z])/).join('-').toLowerCase()}:${style[curr]};`
		}, '');
	};
	function encodeHTML(text) {
		return decodeURI(text)
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&apos;');
	}
	function createElement(elto, xul) {
		elto = Object.assign({
			attr: {},
			evtListener: {},
			estilos: {}
		}, elto);

		var node = xul?window.document.createXULElement(elto.type):document.createElement(elto.type);

		Object.keys(elto.attr).forEach(key => {
			if(key == "innerHTML"){
				node.innerHTML = encodeHTML(elto.attr[key]);
			}
			else if(key == "textContent"){
				node.textContent = elto.attr[key];
			}
			else if(key.startsWith('on')){
				node.addEventListener(key.slice(2), new Function(elto.attr[key]));
			}
			else{
				node.setAttribute(key, elto.attr[key]);
			}
		});

		Object.keys(elto.evtListener).forEach(key => {
			node.addEventListener(key, elto.evtListener[key]);
		});

		let estilo = styleString(elto.estilos);
		if (estilo) {
			node.setAttribute("style", estilo);
		}

		return node;
	}
	function getTabElto(target){
		if(!target || target.nodeName == "tab"){
			return target;
		}else{
			return getTabElto(target.parentNode);
		}
	}
	function createLabel(text,clase){
		return createElement({
			type:"label",
			attr:{
				innerHTML: text,
				class: clase
			}
		})
	}
	function createSpan(text,clase){
		return createElement({
			type:"span",
			attr:{
				innerHTML: text,
				class: clase
			}
		})
	}
	function getTooltipData(tab){
		let title = unescape(tab.getAttribute("label")).replace(/%/g, '%25');
		var titulo = createSpan(title,"title");
		if(numberClampsLines > 0){
			titulo.classList.add("title_clamp");
		}
		var url;
		if(linkifiesUrl)
		{
			url = linkifiesLocationBar(tab.linkedBrowser.currentURI.spec);
		}
		else
		{
			url = createSpan(tab.linkedBrowser.currentURI.spec,"url");
		}

		let divTitle = createElement({type:"div", attr:{class:"divTitle"}})
		divTitle.appendChild(titulo);
		divTitle.appendChild(url);

		var df = document.createDocumentFragment();
		df.appendChild(divTitle);

		if(tab.classList.contains("reloadTab"))
		{
			let timeSeg = tab.getAttribute("reloadTab_timeSeg")-0;
			let lastReload = tab.getAttribute("reloadTab_lastReload")-0;
			let times = tab.getAttribute("reloadTab_timesReload")-0;

			let nextTime = new Date(lastReload+timeSeg*1000);
			let nextReload = fechaACadena(nextTime).split(" ")[1]
			let quedan = Math.round((nextTime.getTime()-new Date().getTime())/1000);

			let div = createElement({type:"div", attr:{class:"reloadDiv"}})

			div.append(
				createSpan("Reload:","reloadText"),
				createSpan(timeSeg,"reloadValue"),
				createSpan("seg","reloadText"),

				createSpan(" - Next:","reloadText"),
				createSpan(nextReload,"reloadValue"),

				createSpan(" - Rest:","reloadText"),
				createSpan(quedan,"reloadValue"),
				createSpan("seg","reloadText"),

				createSpan(" - Times:","reloadText"),
				createSpan(times, "reloadValue"),
			);

			df.appendChild(div);

			/*
			let reload = "Reload:"+timeSeg+"seg - Next:"+nextReload+" - Rest:"+quedan+"seg";
			df.appendChild(createElement({
				type:"span",
				attr:{
					innerHTML: reload,
				},
				estilos:{
					color:"teal",
					margin:"5px"
				}
			}));*/
		}

		return df;
	}

	function showing(tip, target){
		var tab = getTabElto(target);
		if(!tab) return false;
		hidding(tip, target);
		let domTooltipData = tip.querySelector("#getTooltipData");
		domTooltipData.textContent = "";
		domTooltipData.appendChild(getTooltipData(tab));
		if(showPreview){
			let img = tip.querySelector("#imgPreview");
			tip.setAttribute("hidePreview", "true");
			getTooltipIMG(img, tab, tip);
		}
		return true;
	}
	function hidding(tip, target){
		if(idTimeoutUpdatePreview){
			clearTimeout(idTimeoutUpdatePreview);
		}
	}
	function createIMG(){
		let htmlns = "http://www.w3.org/1999/xhtml";
		let img = document.createElementNS(htmlns, "img");
		img.setAttribute("id", "imgPreview");
		return img;
	}
	function getTooltipIMG(img, tab, tip){
		var browser = tab.linkedBrowser;
		let pending = tab.hasAttribute("pending") || !browser.browsingContext;
		let docURI = pending ? null : browser?.documentURI || browser?.currentURI;

		let url = docURI?.spec;
		let isBlank = !url || url === "about:blank";
		if (isBlank || pending) {
			tip.setAttribute("hidePreview", "true");
			return;
		}

		var canvas = PageThumbs.createCanvas(window);
		PageThumbs.captureToCanvas(
			browser,
			canvas,
			{
				fullScale:true,
				isImage:true,
				targetWidth: widthCanvasIMG,
				fullViewport: true,
			},
			true
		).then(x=>{
			canvas.toBlob(blob => {
				var reader = new FileReader();
				reader.readAsDataURL(blob);
				reader.onload = function() {
				  var base64data = reader.result;
				  img.setAttribute("src", base64data);
				  tip.removeAttribute("hidePreview");
				}
			});
		});
		//idTimeoutUpdatePreview = setTimeout(getTooltipIMG, timeUpdatePreview, img, tab, tip);

		idTimeoutUpdatePreview = setTimeout(
			() => requestIdleCallback(() => requestAnimationFrame(() => getTooltipIMG(img, tab, tip))),
			timeUpdatePreview
		);
	}

	var tipId = "dav_tab_title_url"
	var tip = createElement({
		type:"tooltip",
		attr:{
			id: tipId,
			orient: "vertical",
		},
		evtListener:{
			popupshowing: function(evt){
				let isShowing = showing(tip, tip.triggerNode || document.tooltipNode);
				if(!isShowing){
					evt.preventDefault();
				}
			},
			popuphiding: function(){hidding(tip, tip.triggerNode || document.tooltipNode);}
		}
	}, true);
	var arrowscrollbox = document.getElementById("tabbrowser-arrowscrollbox")
	arrowscrollbox.removeAttribute("tooltiptext");
	arrowscrollbox.setAttribute("tooltip", tipId);
	arrowscrollbox.setAttribute("popupsinherittooltip", "true");
	document.getElementById("mainPopupSet").appendChild(tip);
	asignaEstilos();

	tip.textContent = "";
	tip.appendChild(createElement({type:"div", attr:{id:"getTooltipData"}}));
	if(showPreview){
		asignaEstilosPreview();
		let img = createIMG();
		let divImg = createElement({type:"div", attr:{class:"divImg"}})
		divImg.appendChild(img);
		tip.appendChild(divImg);
		tip.setAttribute("hidePreview", "true");
	}

	if(linkifiesUrl){
		asignaEstilosLinkifiesUrl();
	}
})();