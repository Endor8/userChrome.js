// JsOff.uc.js
(function() {
if (!window.gBrowser) return;
const
    buttonID = 'toolbar-button-js',
    configPref = 'javascript.enabled',
    labelText = 'Javascript ein-/ausschalten',
    tooltipOn = 'Javascript ist eingeschaltet',
    tooltipOff = 'Javascript ist ausgeschaltet',
    css =
`#${buttonID}[tooltiptext="${tooltipOn}"] {list-style-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAARVBMVEUAAAAKmAAJiAALqAAIeACG/zd6/zMAVAEMugAARgEHZgATQAADJgBS/gARvgA+zgABEAAofAAXxgA1sAAANgFb/xUMrACNps2gAAAAfUlEQVR4XmXOVwrEMAxF0afmmjZ1/0sdSYQhkAsG+0gfxj1mJhKPhJgdtNbLNE4V2BnIgRyAaTaBBCaR9kWMRQKIpG3PgK3JfyOhnRuLt12AsX7QAvydEHeFlYD8GFabeNh+ENWEA3ux8kIn7hrwXuAdnXtPGENVOVMduPUDmGIDcIkU2P8AAAAASUVORK5CYII=");}
#${buttonID}[tooltiptext="${tooltipOff}"] {list-style-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAY1BMVEUAAAD/RDf/HxX/U0f/0dH/LyX8CwD/Rz/MBADsCgD/y8v/vb0gAgD/aWn/MTH/Jx2kAACYAwD/FgtYBABdExP/nZ3/W0+KBgB6AgD/iYlpFRW0JCReBAA8AQDABADwEAAwAQBzWTWpAAAAiElEQVR4XmXMR5bDUAhE0Sr4QTk7h+79r9Ig2ZroDe8pwLEkkb+iGMhQYK93KIjwDZ1BNACWEBYAdGBW9RGYuQGpZwfVvC90BdKhf77meQUq/angdEJ2yNtiQhWQEGo/iQYJt3DHI7QNu7c4/KOtq7rHhXFMBuX1BasZZRhXKP6SJSJTSmWJQx/pFASUD6QxIwAAAABJRU5ErkJggg==");}`;
try {
        CustomizableUI.createWidget({
            id: buttonID,
            type: 'custom',
            defaultArea: CustomizableUI.AREA_NAVBAR,
            onBuild: function(aDocument) {
                    let button = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
                    let attributes = {
                        id: buttonID,
                        class: 'toolbarbutton-1 chromeclass-toolbar-additional',
                        removable: 'true',
                        label: labelText,
                        tooltiptext: Services.prefs.getBoolPref(configPref) ? tooltipOn : tooltipOff,
                    };
                    for (let a in attributes) button.setAttribute(a, attributes[a]);
                    button.addEventListener('click', () => { if(event.button === 0) {
                        let isEnabled = !Services.prefs.getBoolPref(configPref);
                        Services.prefs.setBoolPref(configPref, isEnabled);
                        let windows = Services.wm.getEnumerator('navigator:browser');
                        while (windows.hasMoreElements()) {
                                let button = windows.getNext().document.getElementById(buttonID);
                                if (isEnabled) { button.setAttribute('tooltiptext', tooltipOn) }
                                else { button.setAttribute('tooltiptext', tooltipOff) };
                        };
                    }});
                    return button;
            }
        });
} catch(e) { };
let stylesheet = document.createProcessingInstruction('xml-stylesheet', 'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(css) + '"');
document.insertBefore(stylesheet, document.documentElement);
})();
