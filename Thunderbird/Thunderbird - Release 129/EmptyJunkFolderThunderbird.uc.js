//    EmptyJunkFolderThunderbird.uc.js
//    ursprünglich von Thomas S. für Trash
//    https://www.thunderbird-mail.de/forum/thread/82717
//
//  gFolderTreeController.emptyTrash(); \  ersetzen gemäß:
//
//  https://www.thunderbird-mail.de/forum/thread/82717-funktion-f%C3%BCr-script-gesucht-userbutton-f%C3%BCr-ordner-leeren-erstellen/?postID=450375#post450375
//
//  durch:       gFolderTreeController.deleteJunk(); \  
//  und/oder:    goDoCommand("cmd_deleteJunk"); \
//    
// geändert von EDV-Oldie für TB ab Version 91 am 24.11.2021
// aktualisiertt von milupo für TB ab Version 115 am 27.05.2023


"use strict";
(function() {

    if (location != 'chrome://messenger/content/messenger.xhtml') return;

    // toolbox
    var toolbarbutton = document.createXULElement('toolbarbutton');
    var currentProfileDirectory = Services.dirsvc.get("ProfD", Ci.nsIFile).path.replace(/\\/g, "/");
        var props = {
        id: 'EmptyJunkFolder-button',
        label: 'Junk leeren',
        tooltiptext: 'Junk leeren',

        style: 'list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAQCAYAAAAmlE46AAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAALGSURBVHjaYmTAAs7FMLAyMTLU/vvPkAPkyhstYfiMrgYggFiwaNJnZmNf///fPwWmv79nGyzG1AQCAAHEhK6JiYnxsEpinyITw//vQBt7gWJCQGyCrhEggJiQNKkAnXdQObiEh01Sk+Hf3z8/gE68BZT6AMTbgPIGyBoBAgiukYmJYZasQygfp6Yz46/nNxgYGRkugMSBmv8B5f4C+UeAmvVg6gECiAlqmxm7sKwZn74n4++9jQwM398yAHWywhQxMjA84udm4Aa5CKhWBCQGEEBgjUCBHGElNa5/9/Yx/P/8kIGJhZHhPwODAtRQlv8MjLJ8AuwMfDyMHEC1NSBxgAACawQ6w5hDWIrx/7ubDAz/fzEw///KwC4oCQoUZ6B0DBsHCy+XED+DkJwsB9D6MJAegAACa/zHwKjIyivI8O/rMwZGdjaG/6/OMkiaWHIDQ3ghEzNTj4SiCA8jFzcDu6wOw79/DGIgVwAEEBOIYGBm42D6/R5oM9AINg6gH58xcAlzMfCpGUgAQ02IkZ2dgRHoRsa/34DOYwJZ9g8ggEDEX4a/v3/+/f4RqAmogA1oI8d/hj8/jzFImLMyyzrrM/5hBvqSnYPh77e3QMP/fwGFNEAAMQGJ/0yM/6/9eP2YgYGNm4GBhZXhH8d3hr/cnxl+s91mYJN4zsAtywwUZ2H4/u41MCAZL4G8BxBAED/++7/09d27X0GaGIBq/rP+AWr+yfCX/xPDP/avYD4D03+G108+fPn3798qkB6AAAJr/P+fYeL3T5/vv7n7+B/Df2Cs/QPiv0wMjD/ZwDSI/+be638/v/26D1Q7BaQHIIAYkZKcIjAEt3HyccoJawhysUr/ZfjP8pvh10sGhvdXv3/9/u77439//nkCvfYApB4ggBjREjkLMArKGJmZooGKVMFOYmG6/f/v/6VAJ3YBNf2BqQUIMADk8eIfdZmUgAAAAABJRU5ErkJggg==) ',

        class: 'toolbarbutton-1',
        onclick:
        'if (event.button == 0 || event.button == 1) { \
            goDoCommand("cmd_deleteJunk"); \
        };'
    };

    for (var p in props) toolbarbutton.setAttribute(p, props[p]);

    var toolbox = document.getElementById("mail-toolbox");
    toolbox.palette.appendChild(toolbarbutton);

    var toolbar = document.getElementById("tabbar-toolbar");
    toolbar.insertItem("EmptyJunkFolder-button", toolbar.lastChild);

})();
