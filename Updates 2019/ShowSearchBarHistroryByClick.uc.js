// ==UserScript==
// @name        	ShowSearchBarHistroryByClick.uc.js
// @description    	Erstellt eine Schaltfläche zum Anzeigen der Such-Chronik am rechten Ende des Suchleiste, 
// @description    	oder mit Rechtsklick auf Lupensymbol in der Suchleiste anzeigen.
// @charset			UTF-8
// @include     	main
// @version			0.6.2	68a対応/pref操作をこのスクリプト単独でできるように変更
// @version			0.6.1	64a対応
// @version			0.6		ボタンとマウスボタンをチェックするように修正
// @version			0.5		prefの操作を追加
// @version			0.4		「検索バー非表示→表示」で履歴表示ボタンが消えるのを修正
// @note					履歴表示件数を上限なしにできるように変更					
// @version			0.3		UIカスタマイズをすると履歴表示ボタンが消えるのを修正
// ==/UserScript==	
(function(){
	"use strict";
	
	const createButton = true
	// true = Schaltfläche am rechten Ende der Suchleiste zum Anzeigen der Such-Chronik
	// false = Rechtsklick auf Lupensymbol in Suchleiste zum Anzeigen der Such-Chronik
	const noLimitResult = true
	// true = unbegrenzte Anzahl der Chronik Einträge　false = Standard (nur 20 Einträge anzeigen)
	const timeSeries = true
	// true Suchchronik nach Such-Reihenfolge sortieren　false = Standard (in alphabetischer Reihenfolge)
	
	timeSeries? set_formfill() : reset_formfill();
	
	function set_formfill(){
		setPref('browser.formfill.bucketSize', -1);
		setPref('browser.formfill.maxTimeGroupings', -1);
		setPref('browser.formfill.timeGroupingSize', -1);
	}
	
	function reset_formfill(){
		clearPref('browser.formfill.bucketSize');
		clearPref('browser.formfill.maxTimeGroupings');
		clearPref('browser.formfill.timeGroupingSize');
	}
	
	function btnSet(){
		const h = document.getElementById('searchbar-history-dropmarker');
		const bar = document.getElementById('searchbar');
		const box = bar._textbox;
		const mushi = bar.querySelector('.searchbar-search-button');
		const img = 'chrome://global/skin/icons/arrow-dropdown-16.svg';
		const btn = document.createElement('toolbarbutton');
			btn.setAttribute('image', img);
			btn.setAttribute('height', '24px');
			btn.setAttribute('class', 'toolbarbutton-1 chromeclass-toolbar-additional');
			btn.setAttribute('id', 'searchbar-history-dropmarker')
			btn.addEventListener('click', showHistory, false);
		let v = '';
	
    	if(createButton){
    		if(h) return; 
    		//box.appendChild(btn);
    		// fix67
    		bar.querySelector('.search-go-container').appendChild(btn);
    	}else{
     		mushi.addEventListener('click', showHistory, false);
     		mushi.setAttribute('oncontextmenu', 'return(false);');
     	}
     	
 		function showHistory(e){
 			if(!((e.target.id == 'searchbar-history-dropmarker' && e.button == 0) || (e.target == mushi && e.button == 2))) return;
			if(box.value) v = box.value; box.value = '';
 			box.showHistoryPopup();
			box.value = v;
			v = '';
 		}
 		noLimitResult? box.popup.setAttribute('nomaxresults', 'true') : box.popup.removeAttribute('nomaxresults');
	}

	btnSet();
	window.addEventListener('aftercustomization', btnSet, false);
	BrowserSearch.searchBar.addEventListener('load', btnSet, false);

	window.addEventListener('unload', function uninit(){
		window.removeEventListener('aftercustomization', btnSet, false);
		BrowserSearch.searchBar.removeEventListener('load', btnSet, false);
		window.removeEventListener('unload', uninit , false);
	}, false);
	
    // Standard Einstellungen erstellen
    function setPref(aPrefString, aPrefType, aValue){
      var xpPref = Services.prefs;
      try {
        switch (aPrefType){
          case 'complex':
            return xpPref.setComplexValue(aPrefString, Components.interfaces.nsIFile, aValue); break;
          case 'str':
            return xpPref.setCharPref(aPrefString, escape(aValue)); break;
          case 'int':
            aValue = parseInt(aValue);
            return xpPref.setIntPref(aPrefString, aValue);  break;
          case 'bool':
          default:
            return xpPref.setBoolPref(aPrefString, aValue); break;
        }
        } catch(e) {}
      return null;
    }
    
    // Standard Einstellungen entfernen
    function clearPref(aPrefString){
    	Services.prefs.clearUserPref(aPrefString);
    }
})()
