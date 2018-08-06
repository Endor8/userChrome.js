//ScrollTopAndBottom.uc.js
(function() {
 
let menuitem = document.createElement('menuitem');
menuitem.id = 'context-to-top';
menuitem.classList.add('menuitem-iconic');
menuitem.setAttribute('tooltiptext' , 'Zum Seitenanfang springen');
menuitem.style.listStyleImage='url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMC8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvVFIvMjAwMS9SRUMtU1ZHLTIwMDEwOTA0L0RURC9zdmcxMC5kdGQnPjxzdmcgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMjQgMjQiIGlkPSJMYXllcl8xIiB2ZXJzaW9uPSIxLjAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PHBvbHlsaW5lIGZpbGw9Im5vbmUiIHBvaW50cz0iMywxMi41IDEyLDMuNSAyMSwxMi41ICIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS13aWR0aD0iMiIvPjxsaW5lIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2Utd2lkdGg9IjIiIHgxPSIxMiIgeDI9IjEyIiB5MT0iMjIiIHkyPSIzLjUiLz48L3N2Zz4=")';
menuitem.setAttribute('oncommand' , "ownerGlobal.gBrowser.selectedBrowser.messageManager.loadFrameScript(' data: , content.scrollTo(0,0) ' , false);");
let refItem = document.getElementById('context-reload');
refItem.parentNode.insertBefore(menuitem, refItem);
 
})();

(function() {
 
let menuitem = document.createElement('menuitem');
menuitem.id = 'context-to-bottom';
menuitem.classList.add('menuitem-iconic');
menuitem.setAttribute('tooltiptext' , 'Zum Seitenende springen');
menuitem.style.listStyleImage='url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMC8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvVFIvMjAwMS9SRUMtU1ZHLTIwMDEwOTA0L0RURC9zdmcxMC5kdGQnPjxzdmcgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMjQgMjQiIGlkPSJMYXllcl8xIiB2ZXJzaW9uPSIxLjAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PHBvbHlsaW5lIGZpbGw9Im5vbmUiIHBvaW50cz0iMjEsMTEuNSAxMiwyMC41IDMsMTEuNSAiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2Utd2lkdGg9IjIiLz48bGluZSBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLXdpZHRoPSIyIiB4MT0iMTIiIHgyPSIxMiIgeTE9IjIiIHkyPSIyMC41Ii8+PC9zdmc+")';
menuitem.setAttribute('oncommand' , "ownerGlobal.gBrowser.selectedBrowser.messageManager.loadFrameScript(' data: , content.scrollTo(0,100000) ' , false);");
let refItem = document.getElementById('context-reload');
refItem.parentNode.insertBefore(menuitem, refItem);
 
})();