/* Zitronella in https://www.camp-firefox.de/forum/thema/112673/?postID=1065469#post1065469
*  diverse Edits: Speravir
*/
(function() {

if (!window.gBrowser) return;

const
	buttonID = 'quick-media-codec-button',
	configPref='media.play-stand-alone',
	dataAttrib = 'data-state',
	labelText = 'Quick Media Codec',
	tooltipOn = labelText + ' aktiv (Abspielen)',
	tooltipOff = labelText + ' inaktiv (Speichern)',
	css =
`#${buttonID}[${dataAttrib}="on"] {list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH4QgVCgMdA8c0JwAAAw1JREFUOMttk71LK3kYhZ/JTExGQswXuopfZC1uo+til8JGqxXELfJRWWhpsRYG8SqKippL/gUjbhUTuwXBJojmD/ALtsoqEi0yIZqQhFEmv5kt7kbYZU99nsOB874S/2hra4vt7W329vaClmWtWpY1aVlWEECSpAdJkq4kSfq2vr7+0PYCSABfv35lf3+fzc3NlBBioVKpEAgE8Hg8ANRqNcrlMn6/H1mWj3Z2dhbbjBSPx0kmk6ytrd1Uq9Wf+vv7mZ2dxe/3oygKlmVhGAaVSoWzszOKxSIej+f24OBgPB6Pf28Qj8dT1Wp1IRQKMTMzg9PpRFVVTNMEQAjBx8cH9Xqdi4sL8vk8Xq/3KJlMLkrLy8tBIcRfgUCApaUlOjs7UVWVdDpNNBrFZrNhWRZCCHRdp1arcXx8jKZpyLL8o63Vaq1qmkY4HMbpdNLR0QHA3d0dKysr3N7eIkkSiqKgqioul4u5uTk0TaPVaq3aDMOY7O3txePxYLfbsdlsALy9vVEqldjY2CCRSGCaJrIs43A48Hq99PX1YRjGpM0wjKDP58M0TSzLQpKkz4DX11eazSb5fJ75+Xmur6+x2+3Isozf78cwjKAihMCyLP6ry8tL6vU6qqoyNDSEqqqf4W0JIVBM03zQNO2LEIJ2mCRJeDwe3G43QgimpqZIJBLYbDbe398xTZNSqYRpmg+KaZpXj4+PX6rVKi6Xi46ODhRFobu7G7vdzu7uLqFQ6F9z1mo1CoUCPp/vSh4bG/tTUZTfXl5eGB8fR1EUHA4HxWKRw8NDBgcHP2Fd12k2m6RSKRqNBrIsR+T7+/u30dHRwaenp5/tdjsDAwMIIZienkYIgWmaGIaBrus0Gg3Oz8/J5XKoqnqUTqd/l2OxGCcnJ39MTEz8enNz88Pz8zPDw8OfdXVdR9d1yuUyqVSKXC5HV1fXbSaT+SUWi30/5Wg0SiaTIRKJpIQQC7VajZGREXp6egAolUoUCgXcbjeKohxls9nFNvO5SyQSIZvNEg6Hg8D/vjPw7fT09KHtBfgbw8eNC0eG6lMAAAAASUVORK5CYII=)}
#${buttonID}[${dataAttrib}="off"] {list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH4QgVCgI2tmD8JgAAAutJREFUOMttk71LK2kYxX+TmXxMMHFCIm78WCHX4jayu9hZ+AesIG5hDNhppTY2QVRQlKhcUltG3EoTuwXBJgj6D3hJaa4iKpKE6AwTjXF8593iXlN56nN4DuecR+EX1tfX2djYYGtrKyGlXJJSjkopEwCKolwpinKmKMq31dXVqw8ugAKwsrLC9vY2a2trOSHETL1eJxaLYRgGAJZlUavViEajqKq6t7m5OfuhUdLpNNlsluXl5QvTNP/o6+tjfHycaDSKpmlIKXEch3q9zvHxMbe3txiG8X1nZ+fPdDr900E6nc6ZpjkzMjLC2NgYuq6jaRoejwcAIQStVgvbtjk9PeX8/JxIJLKXzWZnlcXFxYQQ4kcsFmNhYQFd1wkGg3wG27axLIv9/X2q1Sqqqn7R3t/fl2q1GnNzcwQCAYLBIJlMhkajgWmaNJtNpJS0Wi3y+TxCCCYmJshkMnR1dS1pjuOMxuNxDMPA6/UC4Lour6+v2LZNo9Fo5wDg9/uJRCL09PTw8vIyqjmOk+jt7cV1XaSUANzf3/P29sbT0xOWZaGqKkIIAFRVRVVVotEolmUlNCFEW/iBUqnE4+MjDw8PSCmJx+N0dHTwaxNtnhACzXXdq2q1+lUI0b4SCoWQUuLxeJBSEg6H8fv9bZHrulQqFVzXvfK4rnt2fX2NaZq8vr4C4PP5CAQChEIhwuEwuq7j8/kAaLVaWJZFuVzGdd0zZXp6OuE4zo9EIsH8/DyGYRAKhT6tsdFoYNs2u7u7XF5e4vV6v6ilUulpaGjo95ubm7+8Xi/9/f3tQKWUuK6L4zg8Pz/TaDQ4OTmhWCyi6/rewcHBv2oqleLw8PC/4eHhfy4uLn67u7tjYGCgbbfZbNJsNqnVauRyOYrFIp2dnd/z+fzfqVTq55SnpqbI5/Mkk8mcEGLGsiwGBwfp7u4GoFKpUC6XCYfDaJq2VygUZj807U6SySSFQoHJyckE8Ok7A9+Ojo6uPrgA/wO0dY4EG2coXQAAAABJRU5ErkJggg==)}`;

try {
	CustomizableUI.createWidget({
		id: buttonID,
		type: 'custom',
		defaultArea: CustomizableUI.AREA_NAVBAR,
		onBuild: function(aDocument) {
			let tb_button = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
			function getPref() {return Services.prefs.getBoolPref(configPref)};
			let attributes = {
					id: buttonID,
					class: 'toolbarbutton-1 chromeclass-toolbar-additional',
					removable: 'true',
					label: labelText,
					tooltiptext: getPref() ? tooltipOn : tooltipOff
			};
			for (let a in attributes) tb_button.setAttribute(a, attributes[a]);
			tb_button.setAttribute(dataAttrib, getPref() ? 'on' : 'off');
			tb_button.addEventListener('click', () => { if(event.button === 0) {
				let isEnabled=!Services.prefs.getBoolPref(configPref);
				Services.prefs.setBoolPref(configPref, isEnabled);
				let win=Services.wm.getEnumerator('navigator:browser');
				while(win.hasMoreElements()){
					let button=win.getNext().document.getElementById(buttonID);
					if(isEnabled) {
						button.setAttribute('tooltiptext', tooltipOn);
						button.setAttribute(dataAttrib,'on');
					} else {
						button.setAttribute('tooltiptext', tooltipOff);
						button.setAttribute(dataAttrib,'off');
					}
				};
			}});
			return tb_button;
		}
	});
} catch(e) {};

let stylesheet = document.createProcessingInstruction('xml-stylesheet', 'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(css) + '"');
document.insertBefore(stylesheet, document.documentElement);

})();

