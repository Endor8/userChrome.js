// ==UserScript==
// @name           tooltipStyling.uc.js
// @description    tooltipStyling
// @include        *
// ==/UserScript==
(function () {
let sss = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);

let uri = Services.io.newURI("data:text/css;charset=utf-8," + encodeURIComponent(`
tooltip,
#tooltip,
.tooltip,
.balloonTooltip,
#aHTMLTooltip {

  appearance: none !important;
  background-color: #f7f2bd !important;
  color: #000000 !important;
  padding: 2px 12px !important;

} 

tooltip[label="Seiteninformationen anzeigen"]{
	appearance:none!important;
	color:white!important;
	font-size: 13px !important;
	font-weight: bold !important;
	background:  CornflowerBlue url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACAUlEQVQ4jX2TMUxTURSG//T+R10I2kYiDJg0DiQMDrRA4uBCysJoGNycdHPWSeJgYnUwMexG4oAaJt1ITYxoCbbpvVYelHTCQSotQhBimx6HR199fdGz3OH8/5ebc/4D9NQaIJa8ao156si8Fdmw5KcS+aRIXskB7PUEVQIGSuQjR9aciDpSnTH+K6KW/G7JB3kgETEXgPOOfOXIdsdc7u/XzdFRLcfjAcSRbSvyYgWIB+ZFwDgy60Q6Iv3S16c/5ue1WatpY2FBy4lEGELevwfEAABFkbQldwKAMboxMqK/t7dVVbVVr2slnVYbi2lHY8lvBeAyAMCSc4G58/1EQn8uLWm71dKD5WVdHxrq/qCru4MccMaSb0KNE8jXwUGtZjK6PjwcNfua17DAOUeuRpoiWp2e1p1sVquZTNTsA96jCJy15MdQwxj1kkk99jxVVT32PPWSSX+lf+ks+Q45gJZ8GWrEYlpJp7VVr/tDbDQiQ3QiakWe+wESuR0BpFJhwPh4GODn4SYA4DNwyYls/g+w1QsQKReAi0GYnMgtRx4FgLGxLmBvT7cmJgKAJQ+tMTdCUT5Z55wlDwPA7m4UQB6UyLuLwKnIPbwFTltjrpeAfCWVOgoBJid/WWDFGTO7Bsg/LxIAVoELlamp2Waj8VhVnzX39x9WZ2aufQAGerV/AGVctCoMVcRsAAAAAElFTkSuQmCC") no-repeat !important;
	padding-left:40px!important;
	background-position:12px 3px!important;
	border-radius: 14px !important;
	min-width: 250px !important;}
	
	tooltip[label="Versuche der Aktivitätenverfolgung blockiert"]{
	appearance:none!important;
	color:blue!important;
	font-size: 13px !important;
	font-weight: bold !important;
	background:  yellow url("data:image/gif;base64,R0lGODlhEAAQAOZGAP///8opAJMAAP/M/8bP2B6q/wAbiSKs/wBcyP8zAP9MDAAbigBky9bz//+DIACd/83w/wBaxcfQ2f9sFP8pACgzP/z9/vn7/HmDkLzG0ABfySSv/67h//39/uDl5wBdyIyVmgCT/87x/wBgyXuIlCczPvD0+crT2wAdi/n8/gBDsMvV3c3V3gAcisPN1vb4+214g7jBzOzx9v7+/7/J0rvFz7zH0bvFzmpzf2JqdaarsGNtdyo1Qb/J08HL1e3y98XKzvf5/Pn6/P/+/kpTXnJ+iP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAEYALAAAAAAQABAAAAfDgAwaHwgRDxEIhYcIHxoMIxwiEA0hDRCTlRAiHCMMGwUFBw8HoKKkBRsMKi0GBgsoC62vsQYtKiAAuQAeuru9ICS9K8K9JBgsBAQSJxLJy80ELBhFAEIXFi4WFx25M9wAQDAAL0EpPSkWQwEBuesAOD43NRk0GQABAwPr+QE7ADI/TMQwAUCAAwf5DgrI0cuGLgETIk4QAIBIhRIlKvCooOOego8K2BkZSXIkPgoJElDQV7KkAJQCBKgU0NIlTSMxjQQCADs=") no-repeat !important;
	padding-left:35px!important;
	background-position:9px 2px!important;
	border-radius: 14px !important;
	min-width: 350px !important;}

	tooltip[label="Diese Website stellt keine Identitätsdaten zur Verfügung."]{
	appearance:none!important;
	color:white!important;
	font-size: 13px !important;
	font-weight: bold !important;
	background:  red url("data:image/gif;base64,R0lGODlhEAAQAOZXAJFdAP///8opAJMAAP/jmv3JAP/M//fEAJNfAOi1AJFeAMyZAO26APK/AP8pAFo6AP+DIP/bB/9MDP8zAP9sFPPelsqXAFEyAP3IAP//6//pm5VhAP/dAP/bAP3KAP/jmf/ijP//APG9ANqmAPG+AP/YAP/PAJxoANCcAP/hAOy4AItXAP/nhdKoKs2vAJNeAP/ZE//eWP/eZNOpKtyoAO67AIxYANqlAP/TAPC9AFY2APzJAMeTAJtoAH1TAK97AHdNAP/fcunUlv/ZANK9lv/nANajAP/hgJdjAPbCAJdkAHxTAP/jI+azAPPAAP/+/v/wmbB8AP/fBvjFAOm2ANqnAFExAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAFcALAAAAAAQABAAAAfGgFcIAISFhgAIV4IaHwSOj48fGokAIBgFmJmZGCAAVwBHSQejpFM7Hh4siQpBIg2vr045C7S0SgoyKgy7uyQnLhkZISEvCjFNCcnJNStFMy0dKQBEAQEVFdUVVDZDUT8mOApPAgLV5NY9KBwdJRwbAgYG5PHlVUAXF1Y6SwMQEPH+BgQwMoLGDSZIrgQYQKEhBYFCLEjkAUOBQgESMkooByWCxwhSNlyB52DCBAfyAjxY+cCHogElBww4OUCRzZsyX9a8eTMQADs=") no-repeat !important;
	padding-left:35px!important;
	background-position:9px 2px!important;
	border-radius: 14px !important;
	min-width: 350px !important;}
	
	tooltip[label="Verifiziert von: Actalis S.p.A./03358520967"],
	tooltip[label="Verifiziert von: GeoTrust Inc."],
	tooltip[label="Verifiziert von: Symantec Corporation"],
	tooltip[label="Verifiziert von: Let's Encrypt"],
	tooltip[label="Verifiziert von: COMODO CA Limited"], 
	tooltip[label="Verifiziert von: GlobalSign nv-sa"],
	tooltip[label="Verifiziert von: Google Inc"],
	tooltip[label="Verifiziert von: Google Trust Services"],
	tooltip[label="Verifiziert von: DigiCert Inc"],
	tooltip[label="Verifiziert von: thawte, Inc."],
    tooltip[label="Verifiziert von: Telecom Italia Trust Technologies S.r.l."]{
	appearance:none!important;
	font-size: 13px !important;
	font-weight: bold !important;
	color:#eeee00!important;
	background:  #3cb371 url("data:image/gif;base64,R0lGODlhEAAQAOZQAP///wBmAPv6+gBzAIjtUXnePiczPqn/cSgzP/n8/vf5/LvFz+3y9/D0+bzG0AAbiSo1Qb/J0/b4+5z/Zuzx9rzH0WJqdbvFzvz9/m14g7jBzB6q/3J+iABky2Ntdw2JB8HL1b/J0sbP2Gpzf/n7/K7h/xSNCiiXFsrT2/38/Pr6+8XJzj+fDiaWFSKs/7nnGOfr7ubp7CSv/wBdyACZAAuIBg6gBxelDNbz/3uIlHmDkABaxc3w/xOMCQBgyUpUXun3BQAbigAcigmIBQBfyQBDsABcyPn6/MfQ2UpTXgqeBc3V3sPN1lzIMYyVms7x/////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAFAALAAAAAAQABAAAAe/gFCCg4IBhoeEiQEHjI0BiYUTTUAvLQMmEwEdRDNGOwIBBCcDLAMAAwQBPiVPPDigBKamp6kdMhsbLrCzpx+pRUIPD0GwPbIfNqlOAMwAoAU3NQNDSjQFATnNADDPBd7eAQI6SyIiSCgxoIeGAiscAEckGEwYKgL3+CkcGQASCgkREij4F1CBBAAZRoC4sMBBCAcLGj5ccAHECA8AKDBooKEBg40dGVAA4MGCtgontVlIgsCAAQQQWr6M6RLBj0AAOw==") no-repeat !important;
	padding-left:35px!important;
	background-position:7px 2px!important;
	border-radius: 14px !important;
	min-width: 250px !important;}
`), null, null);

sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
})();
