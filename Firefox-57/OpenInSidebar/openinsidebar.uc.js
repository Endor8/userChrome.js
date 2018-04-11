//	OpenInSidebar.uc.js

(function() {

	if (location != 'chrome://browser/content/browser.xul') return;

	try {

		const NSxul = 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul';

//	Kopfzeile Seitenleiste - URL
		const sidebarheader = document.getElementById('sidebar-header');
			  sidebarheader.setAttribute('onmouseover','SidebarInfotip(event);');

//	Seitenleiste Menüset
		const broadcaster = document.createElementNS(NSxul, 'broadcaster');
			  broadcaster.setAttribute('id', 'open-page-in-sideber-viewer');
			  broadcaster.setAttribute('autoCheck', 'false');
			  broadcaster.setAttribute('type', 'checkbox');
			  broadcaster.setAttribute('group', 'sidebar');
			  broadcaster.setAttribute('label', 'In Seitenleiste öffnen');
			  broadcaster.setAttribute('style',
					'list-style-image: url("chrome://browser/skin/sidebars.svg")');
			  broadcaster.setAttribute('sidebarurl',
					'chrome://browser/content/webext-panels.xul?panel=' +
						'about:newtab&amp;remote=1&amp;browser-style=1');
			  broadcaster.setAttribute('sidebartitle', 'In Seitenleiste öffnen');
			  broadcaster.setAttribute('oncommand',
					'document.getElementById("sidebar-switcher-target")' +
						'.setAttribute("style",' +
							'document.getElementById("open-page-in-sideber-viewer")' +
								'.getAttribute("style"));' +
									'SidebarUI.toggle("open-page-in-sideber-viewer")');
			  broadcaster.setAttribute('tooltiptext', 'In Seitenleiste öffnen');
		document.getElementById('mainBroadcasterSet').appendChild(broadcaster);

//	Symbolleiste
		const menuitem = document.createElementNS(NSxul, 'menuitem');
			  menuitem.setAttribute('id', 'open-page-in-sideber-viewer_menuitem');
			  menuitem.setAttribute('observes', 'open-page-in-sideber-viewer');
			  menuitem.setAttribute('class', 'menuitem-iconic');
		document.getElementById('viewSidebarMenu').appendChild(menuitem);

//	Sidebar-Menü
		const button = document.createElementNS(NSxul, 'toolbarbutton');
			  button.setAttribute('id', 'open-page-in-sideber-viewer_button');
			  button.setAttribute('observes', 'open-page-in-sideber-viewer');
			  button.setAttribute('class', 'subviewbutton subviewbutton-iconic');
		document.getElementById('sidebar-extensions-separator')
					.parentNode.insertBefore(button,
									document.getElementById('sidebar-extensions-separator'));

//	Kontextmenü
		const menu = document.createElementNS(NSxul, 'menu');
			  menu.setAttribute('id', 'open-page-in-sideber-viewer_contextmenu');
			  menu.setAttribute('label', 'Seitenleiste');
			  menu.setAttribute('tooltiptext', 'In Seitenleiste öffnen');
			  menu.setAttribute('class', 'menu-iconic');
			  menu.setAttribute('image', 'chrome://browser/skin/sidebars.svg');
		document.getElementById('inspect-separator').parentNode.appendChild(menu);

			  const menupopup = document.createElementNS(NSxul, 'menupopup');
					menupopup.setAttribute('id', 'open-page-in-sideber-viewer_popup');
					menupopup.setAttribute('onpopupshowing', 'openPageMenuPopupShowing();');
			  menu.appendChild(menupopup);
//	Seite
					const contextPage = document.createElementNS(NSxul, 'menuitem');
						  contextPage.setAttribute('id',
								'open-page-in-sideber-viewer_contextItem-page');
						  contextPage.setAttribute('label',
								'Seite öffnen');
						  contextPage.setAttribute('class', 'menuitem-iconic');
						  contextPage.setAttribute('tooltip',
								'open-page-in-sideber-viewer_tooltip');
						  contextPage.setAttribute('oncommand',
								'OpenPageinSidebarViewer(event);');
					menupopup.appendChild(contextPage);
//	Links
					const contextLink = document.createElementNS(NSxul, 'menuitem');
						  contextLink.setAttribute('id',
								'open-page-in-sideber-viewer_contextItem-link');
						  contextLink.setAttribute('label',
								'Link öffnen');
						  contextLink.setAttribute('class', 'menuitem-iconic');
						  contextLink.setAttribute('hidden', 'true');
						  contextLink.setAttribute('image',
								'chrome://mozapps/skin/places/defaultFavicon.svg');
						  contextLink.setAttribute('title', 'Open in Sidebar');
						  contextLink.setAttribute('oncommand',
								'OpenPageinSidebarViewer(event);');
					menupopup.appendChild(contextLink);
//	Add-on-Verwaltung
					const contextAddons = document.createElementNS(NSxul, 'menuitem');
						  contextAddons.setAttribute('id',
								'open-page-in-sideber-viewer_contextItem-addons');
						  contextAddons.setAttribute('label',
								'Add-ons-Verwaltung ' +
									'öffnen');
						  contextAddons.setAttribute('class', 'menuitem-iconic');
						  contextAddons.setAttribute('image',
								'chrome://mozapps/skin/extensions/extensionGeneric-16.svg');
						  contextAddons.setAttribute('title',
								'Add-ons-Verwaltung');
						  contextAddons.setAttribute('targeturl', 'about:addons');
						  contextAddons.setAttribute('oncommand',
								'OpenPageinSidebarViewer(event);');
					menupopup.appendChild(contextAddons);
//	Download Panel
					const contextDLpanel = document.createElementNS(NSxul, 'menuitem');
						  contextDLpanel.setAttribute('id',
								'open-page-in-sideber-viewer_contextItem-download');
						  contextDLpanel.setAttribute('label',
								'Download Panel ' +
									'öffnen');
						  contextDLpanel.setAttribute('class', 'menuitem-iconic');
						  contextDLpanel.setAttribute('image',
								'chrome://browser/skin/places/downloads.png');
						  contextDLpanel.setAttribute('title',
								'Downloads');
						  contextDLpanel.setAttribute('targeturl', 'about:downloads');
						  contextDLpanel.setAttribute('oncommand',
								'OpenPageinSidebarViewer(event);');
					menupopup.appendChild(contextDLpanel);
//	Adressleiste
					const contextURLmenu = document.createElementNS(NSxul, 'toolbarbutton');
						  contextURLmenu.setAttribute('id',
								'open-page-in-sideber-viewer_contextItem-urlmenu');
						  contextURLmenu.setAttribute('label', 'Adresse öffnen');
						  contextURLmenu.setAttribute('image',
								'chrome://browser/skin/sidebars.svg');
						  contextURLmenu.setAttribute('popup',
								'open-page-in-sideber-viewer_contextURLpanel');
						  contextURLmenu.setAttribute('targeturl', 'about:newtab');
					menupopup.appendChild(contextURLmenu);

//	Adressleiste
		const contextURLpanel = document.createElementNS(NSxul, 'panel');
			  contextURLpanel.setAttribute('id', 'open-page-in-sideber-viewer_contextURLpanel');
			  contextURLpanel.setAttribute('position', 'after_start');
		document.getElementById('mainPopupSet').appendChild(contextURLpanel);

			  const contextURLbox = document.createElement('vbox');
					contextURLbox.setAttribute('width', '200px');
			  contextURLpanel.appendChild(contextURLbox);

//					const contextURLboxdes = document.createElement('description');
//						  contextURLboxdes.setAttribute('value', 'Open in Sidebar');
//					contextURLbox.appendChild(contextURLboxdes);

					const contextURLinput = document.createElementNS(NSxul, 'textbox');
						  contextURLinput.setAttribute('id',
								'open-page-in-sideber-viewer_contextItem-input');
						  contextURLinput.setAttribute('type', 'url');
						  contextURLinput.setAttribute('onkeypress',
								'OpenPageinSidebarViewerInput(event);');
					contextURLbox.appendChild(contextURLinput);

//	Tooltip
		const tooltip = document.createElementNS(NSxul, 'tooltip');
			  tooltip.setAttribute('id', 'open-page-in-sideber-viewer_tooltip');
			  tooltip.setAttribute('position', 'before_start');
		document.getElementById('mainPopupSet').appendChild(tooltip);
//	Titel
			  const tooltipTitle = document.createElement('description');
					tooltipTitle.setAttribute('id', 'open-page-in-sideber-viewer_tooltipTitle');
			  tooltip.appendChild(tooltipTitle);
//	URL
			  const tooltipUrl = document.createElement('description');
					tooltipUrl.setAttribute('id', 'open-page-in-sideber-viewer_tooltipUrl');
			  tooltip.appendChild(tooltipUrl);

//	Lesezeichenheader und das Menüsymbol für "URL öffnen" hinzufügen und CSS Stylesheet anwenden
		let stylesheet = document.styleSheets.item(0);
		let slen = stylesheet.cssRules.length;
		let uccss = '#sidebar-header #sidebar-icon ' +
						'{ width : 18px !important; height : 18px !important; }';
			stylesheet.insertRule(uccss, slen);
			uccss = '#open-page-in-sideber-viewer_contextItem-urlmenu .toolbarbutton-icon ' +
						'{ margin : 0px 8px 0px 2px !important; }';
			stylesheet.insertRule(uccss, slen + 1);
			uccss = '#open-page-in-sideber-viewer_contextItem-urlmenu .toolbarbutton-text ' +
						'{ width : auto !important; margin-left : 3px !important; ' +
							'text-align : left !important; }';
			stylesheet.insertRule(uccss, slen + 2);

	} catch(e) {};
})();

//	Kontextmenü öffnen
function openPageMenuPopupShowing() {
	let tFavicon = gBrowser.selectedTab.image;
	if (!tFavicon) {
		tFavicon = 'chrome://mozapps/skin/places/defaultFavicon.svg';
	}
	let tUrl = gBrowser.currentURI.spec;
	let tTitle = gBrowser.contentTitle;
	if (!tTitle) {
		tTitle = (tUrl == 'about:newtab') ? 'Neuer Tab' : tUrl;
	}
	let menupage = document.getElementById('open-page-in-sideber-viewer_contextItem-page');
		menupage.setAttribute('image', tFavicon);
		menupage.setAttribute('title', tTitle);
		menupage.setAttribute('targeturl', tUrl);
	document.getElementById('open-page-in-sideber-viewer_tooltipTitle')
				.setAttribute('value', tTitle);
	document.getElementById('open-page-in-sideber-viewer_tooltipUrl')
				.setAttribute('value', tUrl);
//	Linkskontextmenü bei Verknüpfung
	let menulink = document.getElementById('open-page-in-sideber-viewer_contextItem-link');
	let lUrl = gContextMenu.linkURL;
	if ((gContextMenu.onLink) && (/^https?:\/\//i.test(lUrl))) {
		menulink.removeAttribute('hidden');
		menulink.setAttribute('targeturl', lUrl);
		menulink.setAttribute('tooltiptext', lUrl);
	} else {
		menulink.setAttribute('hidden', 'true');
	}
	return;
}
//	Sidebar öffnen
function OpenPageinSidebarViewer(aEvent) {
	let eventelm = aEvent.target;
	let title = eventelm.getAttribute('title');
	let style = 'list-style-image: url("' + eventelm.getAttribute("image") + '")';
	let targeturl = eventelm.getAttribute('targeturl');
		targeturl = encodeURIComponent(targeturl);
		targeturl = 'chrome://browser/content/webext-panels.xul?panel=' +
		targeturl + '&amp;remote=1&amp;browser-style=1';
	const caster = document.getElementById('open-page-in-sideber-viewer');
		  caster.setAttribute('label', title);
		  caster.setAttribute('sidebartitle', title);
		  caster.setAttribute('sidebarurl', targeturl);
		  caster.setAttribute('style', style);
//	Wenn die ID der Erweiterungsregel entspricht, nicht benötigt
	document.getElementById('sidebar-switcher-target').setAttribute('style', style);
	SidebarUI.show('open-page-in-sideber-viewer');
	return;
}
//	Seitenleiste Kopf-, Titel und URL-popup
function SidebarInfotip(aEvent) {
	let eventelm = aEvent.target;
	let sidebarDocument = document.getElementById('sidebar').contentDocument;
	let sidepanelelm = sidebarDocument.getElementById('webext-panels-browser');
	if (sidepanelelm) {
		let panelDocument = sidepanelelm.contentDocument;
		let sTitle = panelDocument.title;
		let sUrl = panelDocument.URL;
		document.getElementById('open-page-in-sideber-viewer_tooltipTitle')
					.setAttribute('value', sTitle);
		document.getElementById('open-page-in-sideber-viewer_tooltipUrl')
					.setAttribute('value', sUrl);
		eventelm.setAttribute('tooltip', 'open-page-in-sideber-viewer_tooltip');
	} else {
		eventelm.removeAttribute('tooltip');
	}
	return;
}
//	In der Seitenleiste öffnen
function OpenPageinSidebarViewerInput(aEvent) {
	let code = aEvent.keyCode;
	if (code != 13) return;
	let str = aEvent.target.value;
	if (/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w-.\/?%&=]*)?/.test(str)) {
		let targeturl = str;
			targeturl = encodeURIComponent(targeturl);
			targeturl = 'chrome://browser/content/webext-panels.xul?panel=' +
			targeturl +	'&amp;remote=1&amp;browser-style=1';

		const caster = document.getElementById('open-page-in-sideber-viewer');
			  caster.setAttribute('label', 'Open in Sidebar');
			  caster.setAttribute('sidebartitle', 'Open in Sidebar');
			  caster.setAttribute('sidebarurl', targeturl);
			  caster.setAttribute('style',
						'list-style-image: url("chrome://browser/skin/sidebars.svg")');
		document.getElementById('sidebar-switcher-target')
					.setAttribute('style',
						'list-style-image: url("chrome://browser/skin/sidebars.svg")');
		SidebarUI.show('open-page-in-sideber-viewer');
		return;
	}
	aEvent.target.value = '';
	return;
}
