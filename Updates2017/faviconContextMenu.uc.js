// ==UserScript==
// @label                  faviconContextMenu.uc.js
// @description            Favicon-Kontextmenü in Adressleiste
// @author                 noname
// @modified               小蛐蛐，skofkyo
// @license                MIT License
// @charset                UTF-8
// @version                2016.8.23
// @include                chrome://browser/content/browser.xul
// @note                   2016.8.23 CSS加載xul版改寫成uc.js by skofkyo
// @note                   http://g.mozest.com/viewthread.php?tid=43101
// ==/UserScript==
(function() {

    var faviconContextMenu = {

        init: function() {
            this.additem();
            $("identity-icon").setAttribute("context", "faviconContextMenu");
            //$("urlbar").setAttribute("context", "faviconContextMenu");
        },

        additem: function() {
            var mp = $C("menupopup", {
                id: "faviconContextMenu",
            });
            $('mainPopupSet').appendChild(mp);
            var menues = [{
                label: "Adressleiste leeren",
                oncommand: "(gURLBar.value = '') || gURLBar.focus();",
            }, {
                label: "Adressleiste wiederherstellen",
                oncommand: "(gURLBar.value = gBrowser.currentURI.spec) || gURLBar.focus();",
            }, {
                label: "sep",
            }, {
                label: "Adresse kopieren",
                oncommand: "faviconContextMenu.Copy(gBrowser.currentURI.spec);",
            }, {
                label: "Seitentitel und Adresse kopieren",
                oncommand: function() {
                    faviconContextMenu.Copy(content.document.title + '\n' + gBrowser.currentURI.spec);
                },
            }, {
                label: "Seitentitel und Kurzadresse kopieren",
                oncommand: function() {
                    faviconContextMenu.Copy(content.document.title.replace(/\s-\s.*/i, '').replace(/_[^\[\]【】]+$/, '') + '\n' + gBrowser.currentURI.spec)
                },
            }, {
                label: "sep",
            }, {
                label: "Einfügen und öffnen in aktuellem Tab",
                oncommand: "openUILinkIn(readFromClipboard(), 'current', true);",
            }, {
                label: "Einfügen und öffnen in neuem Tab (Vordergrund)",
                oncommand: "openUILinkIn(readFromClipboard(), 'tab', true);",
            }, {
                label: "Einfügen und öffnen in neuem Tab (Hintergrund)",
                oncommand: "gBrowser.loadOneTab(readFromClipboard(), null, null, null, true);",
            }, {
                label: "sep",
            }, {
                label: "Eine Ebene nach oben",
                oncommand: "faviconContextMenu.goUpperLevel();",
            }, {
                label: "Zur Hauptseite",
                oncommand: "faviconContextMenu.goUpperRoot();",
            }, {
                label: "sep",
            }, {
                label: "Screenshot des sichtbaren Bereiches",
                oncommand: "faviconContextMenu.ScreenShot();",
            }, {
                label: "Screenshot der ganzen Seite",
                oncommand: "faviconContextMenu.WebScreenShot();",
            }, {
                label: "sep",
            }, {
                label: "Favicon Adresse kopieren",
                oncommand: "faviconContextMenu.Copy(gBrowser.selectedTab.image);",
            }, {
                label: "Favicon als base64-Code kopieren",
                oncommand: "faviconContextMenu.toBase64(gBrowser.selectedTab.image);",
            }, {
                label: "Favicon speichern",
                oncommand: "saveURL(gBrowser.selectedTab.image, null, null, false, null, null, document);",
            }, ];
            var i, item, menue;
            for (i = 0; i < menues.length; i++) {
                menue = menues[i];
                if (menue.label == "sep") {
                    item = $C('menuseparator');
                } else {
                    item = $C('menuitem', {
                        label: menue.label,
                        class: "menuitem-iconic",
                        oncommand: menue.oncommand,
                    });
                }
                mp.appendChild(item);
            }
        },

        Copy: function(string) {
            Components.classes["@mozilla.org/widget/clipboardhelper;1"].getService(Components.interfaces.nsIClipboardHelper).copyString(string);
        },

        goUpperLevel: function() {
            var uri = gBrowser.currentURI;
            if (uri.path == "/")
                return;
            var pathList = uri.path.split("/");
            if (!pathList.pop())
                pathList.pop();
            loadURI(uri.prePath + pathList.join("/") + "/");
        },

        goUpperRoot: function() {
            var uri = gBrowser.currentURI;
            loadURI(uri.prePath + "/");
        },

        toBase64: function(icon) {
            const NSURI = "http://www.w3.org/1999/xhtml";
            var img = new Image();
            var that = this;
            img.onload = function() {
                var width = this.naturalWidth,
                height = this.naturalHeight;
                var canvas = document.createElementNS(NSURI, "canvas");
                canvas.width = width;
                canvas.height = height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(this, 0, 0);
                that.Copy(canvas.toDataURL("image/png"));
            };
            img.onerror = function() {
                Components.utils.reportError("Count not load: " + icon);
            };
            img.src = icon;
        },

        ScreenShot: function() {
            var canvas = document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
            canvas.width = content.innerWidth;
            canvas.height = content.innerHeight;
            var ctx = canvas.getContext("2d");
            ctx.drawWindow(content, content.pageXOffset, content.pageYOffset, canvas.width, canvas.height, "rgb(255,255,255)");
            saveImageURL(canvas.toDataURL(), content.document.title + ".png", null, false, null, null, document);
        },

        WebScreenShot: function() {
            var canvas = document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
            canvas.width = content.document.width || content.document.body.scrollWidth;
            canvas.height = content.document.body.scrollHeight;
            var ctx = canvas.getContext("2d");
            ctx.drawWindow(content, 0, 0, canvas.width, canvas.height, "rgb(255,255,255)");
            saveImageURL(canvas.toDataURL(), content.document.title + ".png", null, false, null, null, document);
        },

    };

    faviconContextMenu.init();
    window.faviconContextMenu = faviconContextMenu;

    function $(id) document.getElementById(id);

    function $C(name, attr) {
        var el = document.createElement(name);
        if (attr) Object.keys(attr).forEach(function(n) {
            if (typeof attr[n] === 'function') {
                el.setAttribute(n, '(' + attr[n].toSource() + ').call(this, event);');
            } else {
                el.setAttribute(n, attr[n]);
            }
        });
        return el;
    }
}());