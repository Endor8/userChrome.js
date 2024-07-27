/*
* ToggleFindbar - Speravir in
* https://www.camp-firefox.de/forum/thema/123414/?postID=1253288#post1253288 
* auf Basis von aborix in
* https://www.camp-firefox.de/forum/thema/123414/?postID=1091349#post1091349
* https://www.camp-firefox.de/forum/thema/123414/?postID=1253368#post1253368

Hinweis: 
Die Nutzung der originalen Tastenkombination modKey + "f" führt dazu, dass beispielsweise 
im Einstellungsfenster und im Addon Stylus die vorgesehene Suchfunktion nicht mehr funktioniert. 
Man kann das umgehen, indem man zur Modifiertaste Umschalt + f drückt:

    if( keyMod && event.key == "F" ) {// "F" statt "f" in Zeile 30 ändern

oder sich für eine beliebige andere, noch verfügbare Kombination entscheidet.
*/

(function() {
if (window.gBrowser) {

try {
    onkeydown = function(event){

        ChromeUtils.importESModule("resource://gre/modules/AppConstants.sys.mjs");

        const keyMod = AppConstants.platform == 'macosx' ? event.metaKey : event.ctrlKey;

        if( keyMod && event.key == "f" ) {
            event.preventDefault();
            event.stopPropagation();
            if (!gFindBar || gFindBar.hidden) {
                gLazyFindCommand("onFindCommand")
            } else {
                gFindBar.close()
            }
        }
    };
} catch(e) {};

}
})();
