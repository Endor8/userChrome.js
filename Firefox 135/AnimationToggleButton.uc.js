/* AnimationToggleButton.uc.js, Symbole von Zitronella,
 * https://www.camp-firefox.de/forum/thema/133649/
 * Änderungen von Brokenheart: https://www.camp-firefox.de/forum/thema/133649/?postID=1187103#post1187103
 * Änderungen von Endor: https://www.camp-firefox.de/forum/thema/137909/?postID=1249534#post1249534 (anderer Thread)
 * (Speravir: alten Tooltiptext und alte Symbole wieder eingefügt, EventListener) */

(function() {
if (!window.gBrowser) return;// kürzer

const
	buttonID = 'animation-button',
	configPref = 'image.animation_mode',
	dataAttrib = 'data-animmode',
	labelText = 'Animation',
	tooltipText =
`Linksklick: GIF-Animationen einschalten
Mittelklick: Animation einmal abspielen
Rechtsklick: Ausschalten`,
	css =
`#${buttonID}{
&[${dataAttrib}="normal"] {list-style-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABbElEQVR42sWTP6vBURjHfy9DdiarDAZZhBhs/iS/SWGQMlBkIKKUuyMSCwklgxTyFmwWZq/BR8+x3Fu6Nwz31Klvp/N8nuf7PR1Ne2EZjcYvm81GMpmk3W7z62WDwaBLQblcJpfLoes6x+ORzWaDy+Uin88/B1gsFiqVCtPplFAoxGq1Yr1e43Q6CQQC+Hy+n4VWqxW73U6r1eJ6vZJKpZCuUuhwOPjT13w+p1qt4vF4yGazmEwmXslFi8fjZDIZvF6v8ildZdREIoHb7SYYDCotDUTLhJJBLBbD7/ejpdNp+v0+hUKBy+VCs9lUGZxOJxqNBrVaTWmZsl6vcz6fKZVKdDoder0emtlsVonOZjP2+z3L5ZLJZMJut1N6PB6r88ViofThcEBsb7dbFbKyMRqNuN1uL2+xrwBi4R2AZPYRIBwOPwASxkeAbrf7z4DBYPAWIBKJPADFYlG98XA4fLolZHnq72fy2aLRKHfeRoLqwjwI3AAAAABJRU5ErkJggg==")}
&[${dataAttrib}="once"] {list-style-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABaElEQVR42p2TvYrCUBSE72OIvVa2ksIipBENWKRTQ0gqQVOIYKEgpIhYCIL7AAmx0EYRLcRCAip5BTsbrX0GR04s3PwsbDwwzQ3fnDsTLmMJJp1O/3Ach1arBWawt/6aVCqlEWCaJnq9HjRNw+Vygeu6HzjOIJfLYTgcYr1eo1arYb/f43A4QBAESJIUhEn5fB6FQgHT6RSPxwO6roO2EsjzfHBDGKbZbrcYjUYol8vodrvIZDLxueJgmkajgU6nA1EU/Zy0la7abDZRKpVQrVYj1y4Wi1BVFZVKBazdbmM2m2EwGOB+v2MymfgdXK9XjMfjCHy73WAYBizLguM4YNlsFv1+H5vNBufzGbvdDqvVCqfTKQIvl0t4ngeKfTwe/ZL9GIvFAs/nM6AwHP5Oovi+AUVICpOos4jBf2FSvV5/G1AZSeGAgW3bieGAwTfwx+BLmCTLctBgPp/HikqmX/37jB6boih4AcQgRNTa5HaFAAAAAElFTkSuQmCC")}
&[${dataAttrib}="none"] {list-style-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABbUlEQVR42p2TP6uCYBjF/RY32lqaWqOhQVyigoa2/iA6CdUgQUNB0FA0BEH3AxQ56FKIDdEQgopfoa2l5j6Dp/u8F+J69cK1B87i6+887zkixyWYdDr9WSgU0O12EXAc058vp1IpmYDpdIrhcAhZlnG5XGDb9guONcjlcpjNZjBNE81mE6fTCefzGYIgoF6vh2BmkM/nUSwWsVqt8Hg80Ov1QFsJ5Hk+tCEC0xwOB8znc1QqFQwGA2QymY+4SLEwjaIo6Pf7qFarLCdtpat2Oh2Uy2U0Go3ItUulEiRJQq1WA6eqKjRNw3g8xv1+x3K5ZB1cr1csFosIfLvdMJlMsF6vsd1uwWWzWYxGI1iWBc/zcDwesd/v4bpuBN7tdvB9HxTbcRxWMothGAaCIAjrFxw5/xLFZwYUISlMos6iBv+ESa1W69uAykgKhww2m01iOGTwDvwyeBcmtdvtsIGu67GikulT/3xGP5soingC1EBhpA0JGaMAAAAASUVORK5CYII=")}}`;

let prefVal = Services.prefs.getCharPref(configPref);

try {
	CustomizableUI.createWidget({

	id: buttonID,
	type: 'custom',
	defaultArea: CustomizableUI.AREA_NAVBAR,

	onBuild: function(aDocument) {
		let tb_button = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
		let attributes = {
				id: buttonID,
				class: 'toolbarbutton-1 chromeclass-toolbar-additional',
				removable: 'true',
				label: labelText,
				tooltiptext: tooltipText
		};
		for (let a in attributes) tb_button.setAttribute(a, attributes[a]);
		tb_button.setAttribute(dataAttrib, prefVal);
		tb_button.IsOnce = (prefVal == 'once');
		tb_button.addEventListener('contextmenu', event => event.preventDefault() );
		tb_button.addEventListener('click', () => {
			const button = document.getElementById(buttonID);
			function getPref() {return Services.prefs.getCharPref(configPref)};
			function setPref(val) {Services.prefs.setCharPref(configPref,val)};
			function setIsOnce(val) {
				let win = Services.wm.getEnumerator('navigator:browser');
				while (win.hasMoreElements()) {
					win.getNext().document.getElementById(buttonID).IsOnce = val;
				};
			};

			switch (event.button) {
				case 0:
					setPref('normal');
					if (button.IsOnce) {
						BrowserCommands.reloadSkipCache();
						setIsOnce(false);
					} else {
						if (prefVal == 'normal')
							BrowserCommands.reloadSkipCache()
						else
							BrowserCommands.reload();
					};
					break;

				case 1:
					setPref('once');
					BrowserCommands.reloadSkipCache();
					setIsOnce(true);
					break;

				case 2:
					setPref('none');
					event.preventDefault();
					event.stopPropagation();
					BrowserCommands.reload();
					break;
			};

			let win = Services.wm.getEnumerator('navigator:browser');
			while (win.hasMoreElements()) {
				win.getNext().document.getElementById(buttonID).setAttribute(dataAttrib, getPref());
			};
		});

		return tb_button;
	}
	});
} catch(e) {};

let stylesheet = document.createProcessingInstruction('xml-stylesheet', 'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(css) + '"');
document.insertBefore(stylesheet, document.documentElement);

})();