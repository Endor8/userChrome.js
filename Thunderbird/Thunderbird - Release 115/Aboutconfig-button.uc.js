// aboutconfig-button.uc.js

"use strict";
(function() {

    if (location != 'chrome://messenger/content/messenger.xhtml') return;

    var toolbarbutton = document.createXULElement('toolbarbutton');
    var props = {
        id: 'aboutconfig-toolbar',
        label: '',
        tooltiptext: 'Aboutconfig öffnen',
        style: 'list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAACcPAAAnDwGrs+/JAAAAB3RJTUUH1AwRDyUGYuIbjQAAAwRJREFUOMuFkV1rWwUAhp+TnnNyPpOsbjVZsSC6sVHY1hXZ1RiIon/AC7+mF16Jv2RjwnDTXfiBoHUoanQLrDpvhMKgiHajq7NN89E0aU6bpM35zDnJOV5YpmMXPnfvzcPL+woAFy9+Ph4nPB3HcT6Oh4U4Jm/oSkHTtbyiyAVZlvOSLOYdx3V+ujX/2tzc1dvsI1y+/NV7x6afeT+bMSVFVdDUNIqiMIpHhGFEGIYMwoixVIqG43Ll65uN+1370nZ57Vqw8E0g3Cgt9E/NHDdr9SbBICQMI6IoIkl4hPstC236CAefyLO49CfFYrFU+/LSK6m0LJqO4xEEIfVala3WJrqmYegaVrvJtSsXWL67SM12mDhUwB9EjOKEzPihl0mNnUulhARVkdF0jbkvPuZW6XsUJY2ma+z2djhz5jQvvXiWqYkD/HZvlXsra1TrG3St1oB4NC4igKKkMXQDSRRRNQ1VVZEkGV03mDlxhEqlwrBapqNO8nt9i85W02//emMBuCNG0RAhJaLrGrphYJomuq4hSTJpWeKTTz/j2PGTvHH+HXIZgzfPv11bunn9AjAPrIuDcISQGkPXVQQgk8lgGBqiKJHNZZl4cpITJ2cwDB0vCEmGowgoAk2AVBAMIIkxNYmppw7T2Wkhjf2TTT1NLmOQyyiYmoTtOAxHw0feET0/IApD5GyaQiHP7Ows3/7wHTsHpqh3XTpDjeclEVkWsPsuw+FjAh/H9TBNheXlFYIgoDc5zQtnn+Ow5bGo6hSXNzl9KqJvO48LfM/HdnyyXsirr7+F67r8aEW0dny6uzau51Hd3KbXc+h0domiMAGSfwV+gG17eEHEs0enASgVb7P4xwq247Be3eBgHDH/yx3Kq38l9Vp5A/AfClzPGz5YrYjt7Q6eH+C6HnnX5uelu/QTkqDd9MWg53xQut5rtxtrltX4ENh7KKitlz9ybOdd294Lt62mY7Wbvf5et9Xv71Z6PetBGA7WK1Dfv60DuP/dQABk4ByQAxrAJtDdrznif/gbTgGEQikOjI8AAAAASUVORK5CYII=)',
        class: 'toolbarbutton-1',
        onclick:
                'if (event.button == 0) { \
                        var tabmail = document.getElementById("tabmail"); \
                        tabmail.openTab("contentTab", { url: "about:config" });\
                };'
    };
    for (var p in props) toolbarbutton.setAttribute(p, props[p]);

    var position = document.getElementById('unifiedToolbarContent');    
    position.parentNode.insertBefore(toolbarbutton, position.nextSibling);

})();