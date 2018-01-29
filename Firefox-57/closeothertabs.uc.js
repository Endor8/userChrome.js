  
  //  closeothertabs.uc.js
  
  (function() {

       if (location != 'chrome://browser/content/browser.xul') return;
	    
       try {
          CustomizableUI.createWidget({
             id: 'Close-Tabs-button',
             type: 'custom',
             defaultArea: CustomizableUI.AREA_NAVBAR,
             onBuild: function(aDocument) {         
                var toolbaritem = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
                var props = {
                   id: 'Close-Tabs-button',
                   class: 'toolbarbutton-1 chromeclass-toolbar-additional',
                   removable: true,
                   label: 'Andere Tabs schließen',
                   tooltiptext: 'Andere Tabs schließen',
                   style: 'list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACeklEQVQ4y61RXUjTURw99/7vPtjmNp0OLVzM1ZJCs0lqHwQF06xwZZShFFG++hJEjwk99BJRlGRFlA+yKIhkfZAolRCFQYmlJVMM01zKdFP3odv93x5Ga64Qgg784B6499zzO4cgDYP1LhoNRVZRpcJX8uBJHAC6aqqyBKWy89GzQPp9mkoG6l3qhYh8Pqe65p2fK1p69+4yeraW7jA6yl/rixwvOqqd29IFSCp5ua/q+Oa62tuK6+dY9MAp+b13sjd3vb2AdXWYZYMJE/ZNn8KD/dtdDz1zf3XACQZ933zfF9cWI3zrMi3UoUJ6es88N/AZosgR9w8N9cYUyihWwuOdFWUfL1388fWIU/SZIN6aFMJ7o4Xfrapsc9fW6FbM4M3pJnVcpTmoU0n6uf4+LKr0CIBgorMTOaWlZYGZQHG6gAQAJ+sbHMUOR+v89GyT07X/cPBCsyJuyoH2TLOstNjI6H03YUyVTbaUH9Lk5e7Oy7dsHBkZ7k6GWFfXcKe9ve1EcNiLyZ4eSF/6ES4oRLfbfU25zn60xGrNjhECbzCIkNkM39QUluZDa67ebB1jAKBSaRgA6Ats4AKYNmYiLkkYtW34oDFk7MmiUvZCJIyI2YxwNApZBphSrQQABgD5+ZbKRKkEeqsVWosFfv8M7GO+K5QSzSwIREYmwGVotWpoNAaMj/teAVjNAMBmszFKKTjnyXCMRgMaG4/pOOfgXIYsy0icOYQQ8Hie65IOKGV/1EkIQerj1BFCgBD2u0bGFPhXSFJC4JcDGgqFwTlPWk38lnDAeXzZGkIIUMpoUkCWyVmPp0dJSKJZQhIrCCGWTSwWT+FsCf8DPwGA2iNN0enOgQAAAABJRU5ErkJggg==)',
                   onclick:"gBrowser.removeAllTabsBut('gBrowser.mCurrentTab');"
				};
				for (var p in props)
					toolbaritem.setAttribute(p, props[p]);
				return toolbaritem;
			}
		});
	} catch(e) { };
   
})();