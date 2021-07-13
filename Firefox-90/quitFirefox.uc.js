 // Button > Firefox beenden
 // angepasst für Fx 90 by 2002Andreas
 
(function() {

try {
Components.utils.import("resource:///modules/CustomizableUI.jsm");
CustomizableUI.createWidget({
id: "fp-quit",
defaultArea: CustomizableUI.AREA_NAVBAR,
removable: true,
label: "Beenden",
tooltiptext: "Beenden",
onClick: function(event) {
goQuitApplication(event);
},

onCreated: function(aNode) {
aNode.style.listStyleImage = 'url(\'data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15"><path fill="red" d="M8 6a1 1 0 0 0 1-1V1a1 1 0 0 0-2 0v4a1 1 0 0 0 1 1zm3.5-4.032a1 1 0 0 0-1 1.732A4.946 4.946 0 0 1 13 8 5 5 0 0 1 3 8a4.946 4.946 0 0 1 2.5-4.3 1 1 0 0 0-1-1.732 7 7 0 1 0 7.006 0z"></path></svg>\')';
return aNode;
}

});
} catch (e) {
Components.utils.reportError(e);
};

})();
