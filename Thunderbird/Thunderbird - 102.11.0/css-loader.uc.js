// 'CSS_Loader' script for Thunderbird 68+ by Aris

Components.utils.import("resource://gre/modules/Services.jsm");

// replace comments with custom css code
var my_code = `
	        /* AGENT_SHEET */
		@namespace url(http://www.w3.org/1999/xhtml);
        @-moz-document url("about:about") {
		
		html {background: #FFFFFF !important;}
		
		ul.columns {
        column-count: 3 !important;
        column-gap: 20px !important;
        margin: 0 !important;
        }
		
		body{ 
		background-color: #fffff0 !important;
		max-width: 1320px !important;
		min-height: 600px !important;
        height: auto !important; 
		margin-top: 70px !important;
	    margin-bottom: 30px !important;
		margin-left: 80px !important;
		padding-top: 45px !important;
		padding-left: 25px !important;
		padding-right: 25px !important;
		padding-bottom:  65px !important;
		border-left-color:  lightblue!important;
		border-top-color:  lightblue!important;
		border-right-color:  dodgerblue!important;
		border-bottom-color:  dodgerblue!important;
		border-radius: 20px !important;
		border-width:  4px !important;
		border-style: outset !important;}
		
		
		.container > h1:nth-child(1){
		margin-left: 150px !important;
		color: blue !important; 
		font-size: 24px !important; 
		font-weight: bold !important;}
		
		ul{list-style: none !important;}
						
		#abouts{
		min-width: 1120px !important;
		background-color: #ffffff !important;
		margin-left: -200px !important;
		margin-top: 25px !important;
		padding-top: 25px !important;
		padding-left: 25px !important;
		padding-right: 25px !important;
		padding-bottom:  25px !important;
		border-left-color:  lightblue!important;
		border-top-color:  lightblue!important;
		border-right-color:  dodgerblue!important;
		border-bottom-color:  dodgerblue!important;
		border-radius: 20px !important;
		border-width:  4px !important;
		border-style: outset !important;}
		
		p {margin-left: 160px !important; font-size:15px!important;}
		
		h1::before {
		content: "Endors Firefox:    "; 
		font-weight:bold !important;  
		color:red !important; 
		margin-left: 80px !important;}
		
        a{
        text-decoration:none!important;
        color:black!important;}
	
        /* Breite der Schaltflächen */

        #abouts > li:nth-child(n+1){
		min-width: 170px !important;
		max-width: 170px !important;
		}
		
		/* Die ersten 12 */
        #abouts > li:nth-child(-n+12){
        appearance:none!important;
        background: #efefef url("file:///F:/Adaten/Downloads/Firefox/Thunderbird/Thunderbird Setup 102.0.3/Profilordner/chrome/icons/Bild3.png")no-repeat !important;
        color:transparent!important;
        font-size:14px!important;
        text-decoration:none!important;
        margin-top:3px!important;
		margin-bottom: 5px !important;
        margin-right:20px!important;
        margin-left: 55px !important;
		padding-right: 45px !important;
        padding-left:40px!important;
		padding-top: 1px!important;
		padding-bottom: 2px!important;
        border-left-color:  lightblue!important;
		border-top-color:  lightblue!important;
		border-right-color:  dodgerblue!important;
		border-bottom-color:  dodgerblue!important;
        border-style: outset !important;
        border-width:2px !important;
        background-position:14px 2px!important;
        border-radius:14px!important;}

        /* Die ersten 12 hover */

        #abouts > li:nth-child(-n+12):hover{
        appearance:none!important;
        background: #B2EDFA  url("file:///F:/Adaten/Downloads/Firefox/Thunderbird/Thunderbird Setup 102.0.3/Profilordner/chrome/icons/Bild3.png")no-repeat !important;
        color:transparent!important;
        font-size:14px!important;
        text-decoration:none!important;
	    border-left-color:  #bbddff !important;
		border-top-color:  #bbddff !important;
		border-right-color:  #11508d !important;
		border-bottom-color:  #11508d !important;
        border-style: outset !important;
        border-width:2px !important;
        background-position:14px 2px!important;
        border-radius:14px!important;}		
		
		/* Die mittleren 14 */

        #abouts > li:nth-child(n+13){
        appearance:none!important;
        background: #efffbf url("file:///F:/Adaten/Downloads/Firefox/Thunderbird/Thunderbird Setup 102.0.3/Profilordner/chrome/icons/Bild3.png")no-repeat !important;
        color:transparent!important;
        font-size:14px!important;
        text-decoration:none!important;
        margin-top:3px!important;
		margin-bottom: 5px !important;
        margin-right:5px!important;
        margin-left: 70px !important;
		padding-right: 25px !important;
        padding-left:40px!important;
		padding-top: 1px!important;
		padding-bottom: 2px!important;
        border-left-color:  #79d279 !important;
		border-top-color:  #79d279 !important;
		border-right-color:  #009900 !important;
		border-bottom-color:  #009900 !important;
        border-style: outset !important;
        border-width:2px !important;
        background-position:14px 2px!important;
        border-radius:14px!important;}

        /* Die mittleren 14 hover */

        #abouts > li:nth-child(n+13):hover{
        appearance:none!important;
        background: #B2EDFA  url("file:///F:/Adaten/Downloads/Firefox/Thunderbird/Thunderbird Setup 102.0.3/Profilordner/chrome/icons/Bild3.png")no-repeat !important;
        color:transparent!important;
        font-size:14px!important;
        text-decoration:none!important;
	    border-left-color:  #bbddff !important;
		border-top-color:  #bbddff !important;
		border-right-color:  #11508d !important;
		border-bottom-color:  #11508d !important;
        border-style: outset !important;
        border-width:2px !important;
        background-position:14px 2px!important;
        border-radius:14px!important;}
	
		
        /* Die letzten 14 */

        #abouts > li:nth-child(n+26){
        appearance:none!important;
        background: cornsilk url("file:///F:/Adaten/Downloads/Firefox/Thunderbird/Thunderbird Setup 102.0.3/Profilordner/chrome/icons/Bild3.png")no-repeat !important;
        color:transparent!important;
        font-size:14px!important;
        margin-top:3px!important;
        margin-bottom: 5px !important;
        margin-right:45px!important;
        padding-left:40px!important;
		padding-top: 1px!important;
		padding-bottom: 2px!important;
        border-left-color:  #ffb2b2 !important;
		border-top-color:  #ffb2b2 !important;
		border-right-color:  #8d0000 !important;
		border-bottom-color:  #8d0000 !important;
        border-style: outset !important;
        border-width:2px !important;
        background-position:14px 2px!important;
        border-radius:14px!important;}

        /* Die letzten 14 hover */

        #abouts > li:nth-child(n+26):hover{
		appearance:none!important;
        background: #B2EDFA url("file:///F:/Adaten/Downloads/Firefox/Thunderbird/Thunderbird Setup 102.0.3/Profilordner/chrome/icons/Bild3.png")no-repeat !important;
        color:transparent!important;
        font-size:14px!important;
	    border-left-color:  #bbddff !important;
		border-top-color:  #bbddff !important;
		border-right-color:  #11508d !important;
		border-bottom-color:  #11508d !important;
        border-style: outset !important;
        border-width:2px !important;
        background-position:14px 2px!important;
        border-radius:14px!important;}
		}
`;
	

var CSS_Loader = {
 init: function() {
	
	var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);
	var uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent(my_code), null, null);

	// remove old style sheet
	if (sss.sheetRegistered(uri,sss.AGENT_SHEET)) sss.unregisterSheet(uri,sss.AGENT_SHEET);
	sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);

 }
};

CSS_Loader.init();
