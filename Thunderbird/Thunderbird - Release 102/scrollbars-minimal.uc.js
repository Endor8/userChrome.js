(function() {
var css =`
scrollbar {
z-index: 2147483647 !important;
position: relative !important;
}


scrollbar,
scrollbar * {
-moz-appearance: none !important;
margin: 0px !important;
padding: 0px !important;
border: 0px !important;
box-shadow: none !important;
}


scrollbar[orient="vertical"] {
-moz-margin-start: 0px !important;
max-width: 12px !important;
min-width: 12px !important;


/*background: #38383d !important;*/
background: transparent !important;
background-size: 12px 12px !important;
background-repeat: repeat-y !important;
background-position: 50% 0% !important;
cursor: default;
}


scrollbar[orient="horizontal"] {
margin-top: 0px !important;
max-height: 12px !important;
min-height: 12px !important;
/*background: #38383d !important;*/
background: transparent !important;
background-size: 12px 12px !important;
background-repeat: repeat-x !important;
background-position: 0% 50% !important;
cursor: default;
}




/*scrollbar[orient="vertical"]:hover {
background: #ddd !important;
transition: all 0.08s !important;
}
scrollbar[orient="horizontal"]:hover {
background: #ddd !important;
transition: all 0.08s !important;
}*/


scrollbar thumb[orient="vertical"] {
min-height: 24px !important;
width: 12px !important;
min-width: 12px !important;
max-width: 12px !important;
}


scrollbar thumb[orient="horizontal"] {
min-width: 24px !important;
height: 12px !important;
min-height: 12px !important;
max-height: 12px !important;
}


scrollbar thumb {
border-radius: 6px !important;
/*background: #38383d !important;*/
background: transparent !important;
border: 2px solid rgba(0,255,255,0) !important;
box-shadow: 0 0 0 8px #696969 inset !important; /* Scrollbalken #6495ed */
transition: all 0.04s !important;
opacity: 1 !important;
}


scrollbar:hover thumb {
box-shadow: 0 0 0 8px #87ceeb inset !important; /* Scrollbalken #1876bc */
}
scrollbar thumb:active {
box-shadow: 0 0 0 8px #0c3c60 inset !important;
background: #1876bc !important;
}




scrollbar, scrollcorner {
-moz-appearance: none !important;
/*background-color: #38383d !important;*/
background: transparent !important;
background-image: unset !important;
}




/*scrollbar gripper {
box-shadow: 0 0 0 8px red inset !important;
background: blue !important;
}*/




/* no buttons */
scrollbar:hover scrollbarbutton {
box-shadow: 0 0 0 8px #87ceeb inset !important;   /* Scrollpunkt #23a1ff */
opacity: 1 !important;
}
scrollbar:active scrollbarbutton {
box-shadow: 0 0 0 8px #1876bc inset !important;
opacity: 1 !important;
}
scrollbar scrollbarbutton:hover {    
box-shadow: 0 0 0 8px #87ceeb inset !important;   /* Scrollpunkt #1876bc */
opacity: 1 !important;
}
scrollbar scrollbarbutton:active {
box-shadow: 0 0 0 8px #0c3c60 inset !important;
background: #1876bc !important;
opacity: 1 !important;
}
scrollbar scrollbarbutton {
min-height: 12px !important;
min-width: 12px !important;
max-height: 12px !important;
max-width: 12px !important;
height: 12px !important;
width: 12px !important;
border-radius: 6px !important;
/*background: #38383d !important;*/
background: transparent !important;
border: 2px solid rgba(0,255,255,0) !important;
box-shadow: 0 0 0 8px #696969 inset !important;     /* Scrollpunkt #6495ed */
/*box-shadow: 0 0 0 8px rgba(100,100,100,0.3) inset !important;*/
transition: all 0.04s !important;
opacity: 1 !important;
}`;


var sss = Cc['@mozilla.org/content/style-sheet-service;1'].getService(Ci.nsIStyleSheetService);
var uri = makeURI('data:text/css;charset=UTF=8,' + encodeURIComponent(css));
sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
})();