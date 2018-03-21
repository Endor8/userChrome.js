
  //  Entwicklerwerkzeuge-button.uc.js

(function() {

	if (location != 'chrome://browser/content/browser.xul') return;

	try {
		CustomizableUI.createWidget({
			id: 'Entwickler-ToolBarButton',
			type: 'custom',
			defaultArea: CustomizableUI.AREA_NAVBAR,
			onBuild: function(aDocument) {			
				var toolbaritem = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
				var props = {
					id: 'Entwickler-ToolBarButton',
					class: 'toolbarbutton-1 chromeclass-toolbar-additional',
					label: 'Entwicklerwerkzeuge',
					tooltiptext: 'Entwickler Werkzeuge öffnen/schließen',
					style: 'list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAqJJREFUeNp0k11IU2EYx593Q0RDL1wOmheihBCoiNHFrIYgYSBDKoRMIWgwduGFjTiIdRHiQIw+iBAS6qKUrJsVlRGsC2vWRUFzEclmxMZKXWzObe377PR/cLOB64Xfzt7zPv/f+8URAwMDVNoUReGHGeRAGITy+bwfbIB0JpMhWZZ369X19fXGqqqqbgR1wJPNZrngK9jAf11bW9vRlpaWE5FI5EAikVBDEkJdblfg8/m6nU7nXeDa3NxcTiaTVFlZyQVRCHyBQEBjsVguGI3G0zU1NQ0ej0eg5gcmyEBGahTq7Ha7a3JycsjtdtcGg8FliIgH0+l0DmRTqZS2tbX1mE6nO9TU1LTf4XAEcrmcF5AKguder3d6eHh4HjMNYUsSD/j9ftre3qZoNPoLYj+vDHJqbGzUx+NxLY9xX1Xcy9ra2rTJZJofGRkZ0mq1Eh/U+vo6bW1txVQqlZb7fIDYVkUsFmPaIac9rbm5WcKWVjo6OqTjtbX7Ojs7pcXFxRW9Xn+dbweysaWlJZ9GozHX1dX1ULmGfUoLkvTWWV3tdptMQe6XDLezJBwOK4XrLttO3Sf6o0xNKfaKisCMEIdXhSALKLQeluB5sFz4PHDNdnUpqJBD/f0RhJ99E+KSC4KZf5Ky7Qr4YjAYeHnJk0QTL4k+xc1mBeEXn4WQPkBw8z8SPqTVvr4+DqeA9Sx+nhLZ7JAkR0cVhF+9F2LsDQRPMHamJHwLfB8cHORwBtzmlyxAmIttjyHJjI8rCDscQlxmwXwhfAf4zVhm4QOaK1qLAoTpISQPIJEnJhSE3y0QXS0KflutVg7LJdI9AoQJN2O7BwnfzizRR0B8GhfBDfAInCuGr/Wq6UiDoMRPhWKvZUrjXXZniTbM1ivvbHvurwADAH3gYJeBXh2yAAAAAElFTkSuQmCC)',
					oncommand:"document.getElementById('menu_devToolbox').click();"
				};
				for (var p in props)
					toolbaritem.setAttribute(p, props[p]);
				return toolbaritem;
			}
		});
	} catch(e) { };

	setTimeout(function() {
		if (document.getElementById('menuWebDeveloperPopup').childElementCount <= 5) {
			let { require } = Cu.import("resource://devtools/shared/Loader.jsm", {});
			require("devtools/client/framework/devtools-browser");
		};
	}, 0);

})();
