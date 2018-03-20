
/* Entwickler-Werkzeuge öffnen*/


[
{
"label" : "Entwickler-Werkzeuge an-/aus",
"accesskey": "W",
"id": "Webentwickler",
"oncommand": "document.getElementById('menu_devToolbox').click();"
},
]
.forEach(function(attrs) {
var menuitem = document.createElement("menuitem");
for (var key in attrs)
menuitem.setAttribute(key, attrs[key]);
document.getElementById("contentAreaContextMenu").insertBefore(menuitem, document.getElementById("context-viewsource"));
});

