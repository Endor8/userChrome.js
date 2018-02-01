// ==UserScript==
// @name        RemoveSearchHistoryByDoubleClick.uc.js
// @description Doppelklick rechts, zum einzelnen löschen des Suchverlaufs
// @include     main
// @charset     UTF-8
// @note		Bei auskommentierter Zeile 20, klicken Sie mit der rechten Maustaste, um die ausgewählte Zeichenfolge im Suchfeld anzuzeigen
// ==/UserScript==
(function(){
	let bar = document.getElementById('searchbar');
	let PSAC = document.getElementById('PopupSearchAutoComplete');
	let count = 0;

		PSAC.addEventListener('mousedown', remove, false);
		function remove(e){
			if(e.button !== 2) return;
			var controller = this.view.QueryInterface(Components.interfaces.nsIAutoCompleteController);
			var search = controller.getValueAt(this.selectedIndex);
			if(!count){
				count++;
//				bar._textbox.value = search;
				setTimeout(function(){count = 0}, 500);
			}else{
				bar.FormHistory.update({op: 'remove', fieldname: 'searchbar-history', value: search});
				bar._textbox.showHistoryPopup();
			}
		}
		
})()