    // ==UserScript==
    // @name Shorten Title
    // @namespace Violentmonkey Scripts
    // @match https://www.camp-firefox.de/forum/*
    // @description   Kürzt den Titel der Themen im Firefox-Forum auf www.camp-firefox.de
    // @Version       0.0.1
    // @grant none
    // ==/UserScript==
	
    // Basiert auf Correct Title von Malte Kraus <http://firefox.maltekraus.de/greasemonkey/correct-title>

    (function()
    {
        var dividers = new Array();
        // you may want to change this to fit your needs:
        dividers[0] = " :: ";
        dividers[1] = " - ";

        //var title = "www.camp-firefox.de - Suchen";

        var title = document.title;
        var parts = new Array();

        for(var i = 0; i < dividers.length; i++)
        {

            if(title.indexOf(dividers[i]) > - 1)
            {

                parts[i] = title.substring(0, title.indexOf(dividers[i]));
                title = title.substring(title.indexOf(dividers[i]) + dividers[i].length, title.length);
            }
        }
        for(i = parts.length - 1; i >= 0; i--)
        {
            if(typeof parts[i] != "undefined")
           title = title;
        }
        //GM_log(title);
        document.title = title;
    })();
