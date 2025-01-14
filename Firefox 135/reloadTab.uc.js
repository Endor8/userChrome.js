// reloadTab.uc.js - Button > Firefox Tabs neu laden ohne cache
  
  (function() {
      
  if (!window.gBrowser) return;
    
    try {
        CustomizableUI.createWidget({
            id: 'reload-skip-cache-button',
            type: 'custom',
            defaultArea: CustomizableUI.AREA_NAVBAR,
            onBuild: function(aDocument) {            
                var toolbaritem = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
                var props = {
                    id: 'reload-skip-cache-button',
                    class: 'toolbarbutton-1 chromeclass-toolbar-additional',
                    label: 'Aktuellen Tab neu laden',
                    tooltiptext: 'Aktuellen Tab neu laden, ohne den Browsercache zu benutzen',
                    style: 'list-style-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAC+klEQVQ4y2WSW2gcdRTGfzM7l51sdne6s2k36zYmdk1qxRVaiyA+NJAHpUILDYooluKlL4LvKoqivokUBUsRRArSB580lHqh1BDaFCoGNklLsk3bVIZku8lespeZnf/M+JKatH5w3s7345zzHYn/SwHMzVKAABBAE2gAzsPND+gipGUY7yXzqqwYhUB0ZIG3LmhPCTpnQb1wCC+4BM/JqO9J281/KIylxO6vd77+8l5JlaA3Tui5eNUmYr1Ce2ae+r25cwLvbA/WDw7t7n+Aiwpj2fzoL7tOvBatF4v4rTahLyFFQpBVZAUkXccp3aZ2eZL8p5/w40fvIm+OnUv6A9/3v308unZlGn+jiaypGCHENzrooQ9BiL/RRO3vp+/YK+j9ma0bCHjjkZPHc7VrM9Bogq7RvTDJr+7i0lSM2kutaObpPc9kjSf3IQmP0A3wq/UtgELqTdWXqBVvENF12n9d5v3U8k8TLqdoUbbTzviHN6c/T99cRiOG8cQI0r3WFiDak8h1Z0uEi3dQFJVzieXZiXU+AJYmouxzapw0SaLgEdDCvT5LODS0LUYnwLsyj0+NqtumkaYElE4nyCw1+BYYsFl7MO/zX20BVgI7GCROlzpNPPZKPPZdFu0tmwZwAohuPtR2yYAjAywnhB0AXUJkIFulUDY49U4eGVj4YpiV07spzO14qnDr8bHMP/uPapPmkPPZo5QjAHaSPYfD1LOKJ9GiTl9gkax6B+J+cORoksOmzfiwcXBYGszHa/HeRMOIGb+VLikfV7kbAVhtsZJKrr0wdvCI2bljI/AwSYpBNxdLt6wduYEDYFlOJyK5oax6C8U//TM9jVKlw+3I5j6VyTb1kUpxtDAyqutlH4ELRHwtaXZDK+5oVsoJVd25e+Nq8I1xa2GmzBTg3gcEwOLPHnZHXcwPBUrfLm2nlLYyqmaZRGKJYHV1QVy9ft79Ul+b/nuVCaAKID102V6gEFV48fksh6I+ppBxhETDbnNtvsLvwAxQuW/4F2IsPJT8fGTdAAAAAElFTkSuQmCC")',
                }; 
                for (var p in props)
                    toolbaritem.setAttribute(p, props[p]);
					toolbaritem.addEventListener('click', event => {
					if (event.button == 0) { 
                            BrowserCommands.reloadSkipCache();
                                 }
  });
                return toolbaritem;
            }
        });
    } catch(e) { };
   
})();