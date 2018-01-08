// ==UserScript==
// @name         resetSearchbar
// @description  Doppelklicken auf Suchmaschine, zum Löschen des Suchtextes und zurücksetzen der Suchmaschine 
// @include      main
// ==/UserScript==
(function() {

	const clearSearchHistory = false;  // Suchverlauf löschen? (true=ja - false=nein)

	var searchBar = BrowserSearch.searchBar;
	if (!searchBar) return;

	var searchIcon = document.getAnonymousElementByAttribute(searchBar, 'anonid', 'searchbar-search-button');
	if (!searchIcon) return;

	searchIcon.addEventListener('click', function (event) {
		if (event.target !== this) return;
		if (event.button !== 1) return;

		if (searchBar.textbox.value !== '') {
			searchBar.value = '';
		}

		Services.search.currentEngine = searchBar.engines[0];

		if (clearSearchHistory) {
			goDoCommand('cmd_clearhistory');
		}
	}, false);

}());
