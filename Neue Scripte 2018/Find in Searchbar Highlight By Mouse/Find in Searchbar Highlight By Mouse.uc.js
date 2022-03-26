// ==UserScript==
// @name			Find in Searchbar Highlight By Mouse
// @description		        Suche in der Suchleiste + Suchmarkierung
// @include			chrome://browser/content/browser.xhtml
// @charset			UTF-8
// @compatibility	        60.*
// @note			Find in Searchbar Highlight（Autor:yosuke）Modifizierte Version
// ==/UserScript==

/* ===Überblick=========
・Durch Klicken auf die Schaltfläche → in der Suchleiste wird die Seite nach der als Suchziel angegebenen Zeichenfolge durchsucht
・Klicken Sie auf die Markierungs Schaltfläche neben der Suchleiste, um alle Übereinstimmungen zu markieren
・Wenn die Zeichenfolge nicht gefunden wird, wird der Hintergrund in der Suchleiste rot angezeigt
・Wenn Sie zurück zum Anfang suchen oder bis zum Ende suchen, wird der Hintergrund in der Suchleiste grün

(Besondere Verwendung)
Klicken Sie nach der in der Suchleiste eingegebenen Zeichenfolge -> Suchziel angeben (dort trennen, wenn Leerzeichen enthalten sind)
Beispiel: Suchziel, wenn sich "Firefox userChrome.js" in der Suchleiste befindet
Wenn die letzte Klickposition ("!" In diesem Fall) "Firefox! UserChrome.js", "Firefox" ist
"Firefox userChrome.js!" "UserChrome.js"
"Firefox userChrome! .js" wenn "userChrome"
Wählen Sie die in der Suchleiste eingegebene Zeichenfolge -> Suchziel angeben (auch wenn Leerzeichen enthalten sind, brechen Sie nicht)
Beispiel: Suchziel, wenn sich "Firefox userChrome.js" in der Suchleiste befindet
Wenn die ausgewählte Zeichenkette (hier []) "[Firefox] userChrome.js" "Firefox" ist
"[Firefox userChrome.js]" wenn "Firefox userChrome.js"

Linksklick auf den Suchknopf -> Suche in der Seite, Suche weiter
Rechtsklick auf den Suchknopf -> Vorher suchen (Für die Suchreihenfolge kann in der Einstellung nach links und rechts getauscht werden)
Klicken Sie in die Suchschaltfläche -> Löschen Sie die Zeichenfolge der Suchleiste und der Suchleiste innerhalb der Seite
Wheel scroll on emphasis button -> Suche auf Seite (↓ -> nächstes ↑ -> Vorherige Einstellung kann vertauscht werden)
Klicken Sie auf die Markierungsschaltfläche -> markieren ein / aus

(Achtung)
Verschiedene Funktionen können individuell eingestellt werden, indem der Wert von "Optionale Einstellung" geändert wird
========= */

(function() {
    /*----- Einstellungen (true or false) -----*/
    // Markieren Schaltfläche einfügen
    const USE_HIGHLIGHTBUTTON = true
    // Markierungsschaltfläche beim Ausblenden der Suchleiste ausblenden
    const HIDE_HIGHLIGHTBUTTON = true
    // Bei Erreichen des Seiten Endes Suchleisten Hintergrund grün färben
    const USE_WRAP = true
    // Klicken Sie mit der linken Maustaste, mit Rechts-klick zum nächsten Treffer vorwärts zu suchen
    const USE_ORDER = true
    // Maus scrollen ↓ um nach dem nächsten Treffer zu suchen, ↑ zum letzten zurück
    const USE_DOWN = true

    /*----- Grundeinstellung -----*/
    const searchbar = document.getElementById("searchbar");

    
    // Farben, Smbole
    const white = "#ffffff";
    const green = "#ccffcc";
    const red   = "#ffcccc";
	var onHighlight = 'data:image/png;base64,'+
    'iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAABmJLR0QA/wD/AP+gvaeTAAAACXBI'+
	'WXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2wQFBAcXveirYgAAAB10RVh0Q29tbWVudABDcmVhdGVk'+
	'IHdpdGggVGhlIEdJTVDvZCVuAAADKUlEQVR4AQEeA+H8AAAAAAAAAAAAAAAAAP///wD///8A////'+
	'AP///wD///8A////ANCwHRpDSEf/Q0hH/4+Pj4Py2xoAAQAAAAAAAAAAAAAAAP///wAAAAAAAAAA'+
	'AAAAAAAAAAAA0bEeGgAAAOUuRZQARVOWACEcHQArKyuEAQAAAAAAAAAAAAAAAP///wAAAAAAAQEB'+
	'AAAAAADQsB0xAAAAzi5FlAD+9q8A9vC6AFFtLQAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+
	'ANCwHTEAAADOLkWUAP72rwD28LoA+/nmAI1o1gAAAAAAAQAAAAAAAAAAAAAAAP///wAAAAAA0bEe'+
	'GgAAAOUuRZQA/vavAPbwugD7+eYA/w0AAOTPHQAAAAAbAgAAAAAAAAAAAAAAAAAAAADRsR4aAAAA'+
	'5S5FlAD+9q8A9vC6APv55gD/DQAA5M8dAAAAABsuRZTmAgAAAAAAAAAAAAAAANGxHhoAAADlLkWU'+
	'AP72rwD28LoA+/nmAP8NAADkzx0AAAAAMi5FlOb+9q8AAgAAAAAAAAAAQ0hHGgAAAOUuRZQA/vav'+
	'APbwugD7+eYA/w0AAOTPHQAAAAAyLkWUz/72rwD28LoABAAAAABDSEcaAAAA5S5FlAD+9q8A9vC6'+
	'APv55gD/DQAA5M8dAAAAABsuRZTm/vavAPbwugD7+eYAAgAAAAAAAADlTEdIAEVTlgD28LoA+/nm'+
	'AP8NAADkzx0AAAAAGy5FlOb+9q8A9vC6APv55gD/DQAAAgAAAAAAAAAAAAAAACEcHQBRbS0A/xIA'+
	'AOTPHQAAAAAbLkWU5v72rwD28LoA+/nmAP8NAADkzx0AAdCwHTRzmCrLIRwdAAAAAAAAAAAA3+Tj'+
	'AAAAABu7rWrm/vavAPbwugD7+eYA/w0AAOTPHQAvT+IAAdCwHYAcPON/yswBAKqp/wAAAAAA8/JT'+
	'AP7+/gD7+/sA+vr6APf39wD19fUA8fHxANzc3AEAAAAAAeTaCf/s1hQAkLHjAAYFZgACAgIAAQEB'+
	'AAMDAwAAAAAA/f39APz8/AD5+fkA9fX1APHx8QDw8PAAYSYWElWJpbsAAAAASUVORK5CYII=';
	var offHighlight = 'data:image/png;base64,'+
	'iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAABmJLR0QA/wD/AP+gvaeTAAAACXBI'+
	'WXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2wQFBAIFMyYubwAAAB10RVh0Q29tbWVudABDcmVhdGVk'+
	'IHdpdGggVGhlIEdJTVDvZCVuAAADKUlEQVR4AQEeA+H8AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+
	'AAAAAAAAAAAAAAAAACklEncdITSIAAAAAAMDAwC3t7cBAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+
	'AAAAAAAAAAAAOTITRoOEi4iqqqoAAAAAABsbGwBJSUn/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+
	'AAAAAABXTR8zqamp//Dw8P/h4eH/zc3N/0ZGRv9GRkb/AwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+
	'AEY/IDZbY4rLR0dHAPHx8QDs7OwA9/f3ACQkJADPz88AAgAAAAAAAAAAAAAAAAAAAAAAAAAAIh8S'+
	'FWNqiXJHR0cA8fHxAOzs7AD39/cACAgIAAAAAOvY1ctrAAAAAAAAAAAAAAAAAAAAAAAiHxI7qamp'+
	'qfDw8P/h4eH/zc3N/8TExP/MzMz/tat7/zUvE0kAAAAABAAAAAAAAAAAAAAAAFRJFT5VYJTBR0dH'+
	'APHx8QDs7OwA9/f3AAgICADd3d0AwbOkXsvR7bcAAAAABAAAAAAAAAAAGx0dKFVgjMFHR0cA8fHx'+
	'AOzs7AD39/cACAgIAOHdzgDm0YRHlqTiugAAAAAAAAAABAAAAABARUQSBQECwkdHRwDx8fEA7Ozs'+
	'APf39wAKCfcA493HAIKBhzLR1u7PAAAAAAAAAAAAAAAAAgAAAAADAgLtSklJFVZWVgDs7OwA9/f3'+
	'AAgICADo3r65gIGIRNHW7s8AAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAB4eHgB5eXkACwsL'+
	'AOHdywByeZmnz9XtvQAAAAAAAAAAAAAAAAAAAAAAAAAAAUtEIYT4AyV7IR0eAAAAAAAAAAAA4uLi'+
	'AMLCwtn4+PgoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVVVVf99fX0AdHR0AAAAAAAAAAAADQ0N'+
	'AP7+/gD7+/sA+vr6APf39wD19fUA8fHxAN3d3QEAAAAAAcbGxv/j4+MAvLy8AAEBAQACAgIAAQEB'+
	'AAMDAwAAAAAA/f39APz8/AD5+fkA9fX1APHx8QDw8PAAdePqGO2XyzMAAAAASUVORK5CYII=';

    // Suchziel
    function isVal(){
        let start = searchbar.textbox.selectionStart,
        	end = searchbar.textbox.selectionEnd,
        	diff = end - start;
    	let selValue = BrowserUtils.getSelectionDetails(window).text;
    	let curValue = searchbar.textbox.value.substring(start, diff);
    		curValue = curValue.split(/\s+/)[curValue.split(/\s+/).length-1]
		let val = selValue? selValue : curValue? curValue : searchbar.textbox.value.split(/\s+/)[0]
    	return val;
    }
	// Verarbeitung nach der Suche
    function afterSearch(){
    　 let findstatus = gFindBar._findStatusIcon;
       if(findstatus.getAttribute("status")=="notfound"){
          searchbar.textbox.style.backgroundColor = red;
          // Suchfeld fokussieren, auch wenn nicht gefunden
          gFindBar._findField.value = "";
          gFindBar.close();
          searchbar.textbox.focus();
          }
            // Rückmeldung machen
        else if(findstatus.getAttribute("status")=="wrapped"){
            if(!USE_WRAP){
            	searchbar.textbox.style.backgroundColor = white;
            } else {
                searchbar.textbox.style.backgroundColor = green;
            }
        } 
        	else {
        		searchbar.textbox.style.backgroundColor = white;
        	}
    }
    /*----- Suchschaltfläche als Seitensuchschaltfläche -----*/    
    // Suchfunktion
    function mouseWheel(e){
       gFindBar._findField.value = isVal();
       let scroll = USE_DOWN? (e.deltaY !== 3) : (e.deltaY == 3);
       gFindBar.onFindAgainCommand(scroll); 
       setTimeout(function(){afterSearch()},100);
    }    
	function getBar(){!gFindBar? gLazyFindCommand("onFindCommand") : void(0) }
    function find_in_searchbar(e){
    	if(!searchbar.value) return;
    	gFindBar.close();
        document.getElementById('toggle-all-highlight').style.display = 'block';
        let right = USE_ORDER? (e.button !== 0) : (e.button == 0);
        // Mittlerer Klick -> Suchtext löschen
        if(e.button == 1){
        	searchbar.value = "";
        	if(HIDE_HIGHLIGHTBUTTON) newButton.style.display = "none";//✓Schaltfläche ausblenden
            gFindBar._findField.value = "";// Suchleiste auf der Seite ist ebenfalls leer
            newButton.setAttribute("image", offHighlight);
            gFindBar.toggleHighlight(true);
            gFindBar.toggleHighlight(false);
            sign^= 1;
            searchbar.textbox.style.backgroundColor = white;
        }
        else {
        	gFindBar._findField.value = isVal();
            gFindBar.onFindAgainCommand(right);
            setTimeout(function(){afterSearch()},100);
       	}  
  	}
  	
    // Suchen Schaltfläche Einstellung
    searchbar.addEventListener('load', BtnSet, false);
    function BtnSet(){
    	let btn = document.getAnonymousElementByAttribute(searchbar, "anonid", "search-go-button");
     	btn.removeAttribute("onclick");
     	btn.setAttribute("oncontextmenu","return(false);");
     	btn.addEventListener("click", function(e){getBar();setTimeout(function(){find_in_searchbar(e)},100)}, false);
    }

    /*----- ✓Schaltflächengenerierung -----*/
    let sign = 0;
    // Hervorhebung Ein / Aus-Funktion
    function highlight_toggle2(){
    	gFindBar._findField.value = isVal();
    	gFindBar.onFindAgainCommand(true);
    	gFindBar.onFindAgainCommand(false);
    	gFindBar.toggleHighlight(!sign);
    	setTimeout(function(){afterSearch()}, 100);
    	let image = sign? offHighlight : onHighlight;
    	newButton.setAttribute("image", image);
    	sign^= 1;
    }
    
    // ✓Schaltfläche Einstellungen
    var newButton = document.createXULElement("toolbarbutton");
    newButton.setAttribute("label", "Alle Markierungen");
    newButton.setAttribute("tooltiptext", "Alle Markierungen hervorheben");
    newButton.setAttribute("id", "toggle-all-highlight");
    newButton.addEventListener("click", highlight_toggle2, false);
    newButton.addEventListener("wheel", mouseWheel, false);
    newButton.setAttribute("oncontextmenu","return(false);");
    newButton.setAttribute("image",offHighlight);
    newButton.setAttribute("class", "toolbarbutton-1 chromeclass-toolbar-additional");
    newButton.style.display = "none";
    if(USE_HIGHLIGHTBUTTON){
        searchbar.parentNode.insertBefore(newButton, searchbar.nextSibling);
    }
})();
