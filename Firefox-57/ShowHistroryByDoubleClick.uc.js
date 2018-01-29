(function(){
	let bar = document.getElementById('searchbar');
	let btn = document.getAnonymousElementByAttribute(bar, 'class', 'searchbar-search-button');
	let box = bar._textbox;
	let v = '';
	let showHistory = function(){
		if(box.value) v = box.value; box.value = '';
		box.showHistoryPopup();
		box.value = v;
		v = '';
	}
	btn.ondblclick = showHistory;
})()