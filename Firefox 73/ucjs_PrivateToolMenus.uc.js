
/* Private Tool Menus */


[
{
"label" : "Cookies öffnen",
"accesskey": "C",
"oncommand": "window.open('chrome://browser/content/preferences/siteDataSettings.xhtml', 'Browser:Cookies', 'chrome,resizable=yes');"
},
{
"label" : "Chronik löschen",
"accesskey": "C",
"oncommand": "window.open('chrome://browser/content/sanitize.xul', 'Toolkit:SanitizeDialog', 'chrome,resizable=yes');"
},
{
"label" : "Passwörter öffnen",
"accesskey": "P",
"oncommand": "window.open('chrome://passwordmgr/content/passwordManager.xul', 'Toolkit:PasswordManager', 'chrome,resizable=yes');"
},
{
"label" : "Update-Chronik öffnen",
"accesskey": "U",
"oncommand": "window.open('chrome://mozapps/content/update/history.xhtml', 'Update:History', 'chrome,resizable=yes');"
},
{
"label" : "Zertifikate öffnen",
"accesskey": "Z",
"oncommand": "window.open('chrome://pippki/content/certManager.xhtml', 'mozilla:certmanager', 'chrome,resizable=yes,all,width=830,height=400');"
},
{
"label" : "Ausnahmen-Cookies öffnen",
"accesskey": "A",
"oncommand": "window.open('chrome://browser/content/preferences/permissions.xhtml', 'mozilla:certmanager', 'chrome,resizable=yes,all,width=830,height=400');"
},
]
.forEach(function(attrs) {
var menuitem = document.createXULElement("menuitem");
for (var key in attrs)
menuitem.setAttribute(key, attrs[key]);
document.getElementById("menu_ToolsPopup").insertBefore(menuitem, document.getElementById("menu_preferences"));
});

oncommand="gAdvancedPane.showUpdates();"