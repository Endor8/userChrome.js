// ==UserScript==
// @name           context-translate-enhanced.uc.js
// @charset        UTF-8
// @author         @mira
// @version        v2025.05.06
// Source          https://www.camp-firefox.de/forum/thema/139300/?postID=1271397#post1271397

    location.href.endsWith("://browser/content/browser.xhtml") && (async () => {
    await delayedStartupPromise;

    var addEventListener = (...args) => {
        var trg = args[3];
        if (!trg) trg = args[3] = window;
        trg.addEventListener(...args);
        this.handlers.push(args);
    };

    var initFunction = async function(_id, xhtmlns, addDestructor, addEventListener, gClipboard, LOG) {
        // Hier ist der Code, der ursprünglich als String in new Function() übergeben wurde
        var langFrom_google_text = "auto"; //auto
        var langTo_google_text = "de";

        // Assign icons
        var mainicon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADKElEQVR42p2TX2hTdxTHPzfJTW6T3qQmapvWabUbog+udp3kYeLQ4f6wiZQNtjlXHyZaBYe6TekYVGRQYexFscOtuD7UdWxzMtAXEbZStKIbDsaUCbVj9o8mTW+aNrlJbu5vJ8Ex2OMO/Lj87jnne873nO9PSyTV3tkAfYi5NhQ1MB1Ijc3ijN+D7CQh28YK+GHDMyxpjlJTkmAdQi5dWvOsUrYkGB5QC5Kcg/aFBxxqqycmcY38a/1yTqYgMw8ByfFKjtZ4V6myCeW8IApyfOw2155fw1DG4dOJJK1r45x5BPDUpZuMr2uXSuAvgBMQgOitjLJNn7iDSJP0rIJ35dt19TeGoi0Es1MMP72KFvm3+88phuYM3HCd3ObQizpa/cW7Kh020E0Tz1yOUxvjdIr7o6t/cLpkEJqZp7s5zN62ZewfnWLQ9VIIBqodBdI5tIbBG8oKhSAaJZDN8tpSP5+3L8eVgLbeAdKal7NH3mKL3FcOXCfV1ITjc7FLFrWZIlpt/4+qEA7hLRrCwk/RusOXu7ax8xHvGTkVgi/89As/T8ia9EUyghKOWSaYyqNx8oIiuEgcshetsooceibJinvTfNH1DpseD3LHSZE4eprs6k24NQaevI1fF8q5FJqv9xvlmFLdkKZlhb77E8TdIlFD54OOl3mzdXm1k+sP0jzbdwF7cRhsj8ysAWYnpYPeQfXPnn3JJG8/sZT+PW8gkuDbkWEiRh3b29dV/edujNE5dB4nHJSCUrQsTdP9mUKrCKHA5piHK+918quVp/VoD9W9uhGejNRx6+N9VZAmoTJZmhbK4vR7BGDPCQEQ/qU8R15aT2/Hi/R8PcyxyyMyVBmaXwIfPiTVf5yYHiF28ARpOyuqk3nJ4DV2HFc4SamUZ3vrGr7vPlitFNraQc4SzZZt6ptWMv3DAOdGrrGj7yvR+2KYr5A0BeCVAwqvBQuyMG+MTzp3cvj15/ivfXfzNq++/yFEIlD7GFjZ6uPRaE4oGuNQI68jIINJu0QbTFoadIJlL7lSgb8sxbSVEb8geUUVtkh55r50MY5Wec6jibV9/A9LjP7e9TdFQScjW9P1XAAAAABJRU5ErkJggg==";

        function GetXmlHttpObject() {
            if (window.XMLHttpRequest) { return new XMLHttpRequest(); }
            if (window.ActiveXObject) { return new ActiveXObject("Microsoft.XMLHTTP"); }
            return null;
        }

        var lc = navigator.lastClick = {};
        addEventListener("mouseup", e => {
            if (e.button) return;
            lc.X = e.screenX - mozInnerScreenX;
            lc.Y = e.screenY - mozInnerScreenY;
        }, false, gBrowser.tabpanels || 1);

        var createWindow = function(text, status, title, id, pos, size) {
            var win = window, doc = win.document, wId = 'ujs_window' + (id || ''), w = doc.getElementById(wId);
            var keyDown = function(e) {
                if (!e.shiftKey && !e.ctrlKey && !e.altKey && e.keyCode == 27) doc.getElementById(wId).closeWin();
            };
            if (w) w.closeWin();

            gBrowser.addEventListener("click", function c() {
                this.removeEventListener("click", c);
                try { doc.getElementById(wId).closeWin(); } catch (e) {};
            }, true);

            w = doc.createElementNS(xhtmlns, 'div');
            w.setAttribute('style', 'position:fixed;display:block;visibility:hidden;left:0;top:0;width:auto;height:auto;border:1px solid gray;padding:2px;margin:0;z-index:99999;overflow:hidden;cursor:move;' + (typeof w.style.borderRadius === 'string' ? 'background-color:#eaeaea;padding-top:0px;border-radius:4px;box-shadow:0 0 15px rgba(0,0,0,.4);' : 'background:-o-skin("Window Skin");'));
            w.id = wId;
            w.closeWin = function() {
                doc.removeEventListener('keydown', keyDown, false);
                this.parentNode.removeChild(this);
            };
            w.addEle = function(str, style) {
                var ele = doc.createElementNS(xhtmlns, 'div');
                ele.setAttribute('style', style);
                if (str) {
                    ele.innerHTML = str;
                    for (var el, all = ele.getElementsByTagName('*'), i = all.length; i--;) {
                        el = all[i];
                        if (/^(script|frame|iframe|applet|embed|object)$/i.test(el.nodeName)) {
                            el.parentNode.removeChild(el);
                        } else {
                            for (var att = el.attributes, j = att.length; j--;) {
                                if (/^on[a-z]+$/i.test(att[j].name)) att[j].value = '';
                            }
                        }
                    }
                }
                return this.appendChild(ele);
            };
            w.addEle1 = function(str, style) {
                var ele = doc.createElementNS(xhtmlns, 'textarea');
                ele.setAttribute('style', style);
                if (str) {
                    ele.innerHTML = str;
                    for (var el, all = ele.getElementsByTagName('*'), i = all.length; i--;) {
                        el = all[i];
                        if (/^(script|frame|iframe|applet|embed|object)$/i.test(el.nodeName)) {
                            el.parentNode.removeChild(el);
                        } else {
                            for (var att = el.attributes, j = att.length; j--;) {
                                if (/^on[a-z]+$/i.test(att[j].name)) att[j].value = '';
                            }
                        }
                    }
                }
                return this.appendChild(ele);
            };
            var img = doc.createElementNS(xhtmlns, 'div');
            img.setAttribute('style', 'display:block;float:right;width:22px;height:22px;padding:0;margin-top:2px;margin-right:1px;border:none;cursor:pointer;background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAIAAABL1vtsAAAACXBIWXMAAArEAAAKxAFmbYLUAAABc0lEQVQ4y2P84mzGQBlgYaAYoBjBrKn79/plgnrQlCGM4Jwwj0lC6kdjKX5TmDV1Oeq7/7149r0gCcUIZk1dJgkpBgYGjvruXyvm/96wErt+fWOOylYGBgYmCSm4WxjhwQkxHsL+vW39r0Uz0f3s6M6eVsDAyMjAwIDsWEbkGGHW1OWoaGFgZ8c0BaH///8fHbV/L56BSzGiRSqztj5HWROaKcj6f86e+GffDmQtjJjpAs2Uf48f4NGP3Qg0U6AAh36cRkBNqWhmYGWDcH/OmoBVP77UySgmwcDCCucyyciTlsCRw4/hz28GVjZWr0AGBgbMmMZuBFr4/3/5nKOskYGdA5cp6GGBNf6YtfUhpmBNdShGsFjas+dVYI0/ZFN+zZ/2e+cmLEYgEjiO+MNlCtQI5Azyc1L7n2MHsQYzk4o6Z8tECBtuCjQ4/16//O/FM4KZ/d+dm99r8jlbJv69eRXdFSQVOUwq6v/u3CScOuladgIAhMrZgyTDTBwAAAAASUVORK5CYII=");background:-o-skin("Caption Close Button Skin");');
            img.title = (win.navigator.language.indexOf('de') == 0) ? '\u0417\u0430\u043A\u0440\u044B\u0442\u044C' : 'Close';
            img.addEventListener('click', function() { this.parentNode.closeWin(); }, false);
            w.appendChild(img);
            var title = w.addEle(title, 'display:table;color:#000;font:17px Times New Roman;width:auto;height:auto;padding:0;margin:0 2px;cursor:text;');
            title.onclick = e => {
                e.preventDefault();
                var url = e.target.href;
                var ctabpos = gBrowser.selectedTab._tPos + 1;
                gBrowser.moveTabTo(gBrowser.selectedTab = gBrowser.addWebTab(url), ctabpos);
                doc.getElementById(wId).closeWin();
            };
            var cnt = w.addEle1(text, 'display:block;border:1px solid #aaa;padding-bottom:3px;padding-left:3px;background-color:#f2ffe6;color:#8c0023;font:24px Times New Roman;width:600px;height:200px;overflow:auto;cursor:text;-moz-user-focus:normal;-moz-user-select:text;');
            cnt.contentEditable = "true";
            cnt.context = "contentAreaContextMenu";
            w.addEle(status, 'display:table;font:14px Times New Roman;font-weight:bold;color:blue;width:auto;height:auto;padding-top:2px;margin:0 3px;cursor:pointer;');
            w.addEventListener('mousedown', function(e) {
                if (e.target == w) {
                    e.preventDefault();
                    var st = w.style;
                    var mouseMove = e => {
                        st.top = parseInt(st.top) + e.movementY + "px";
                        st.left = parseInt(st.left) + e.movementX + "px";
                    };
                    doc.addEventListener('mousemove', mouseMove, false);
                    doc.addEventListener('mouseup', function() { doc.removeEventListener('mousemove', mouseMove, false); }, false);
                }
            }, false);
            doc.documentElement.appendChild(w);

            if (size) {
                cnt.style.height = size.height;
                cnt.style.width = size.width;
            } else {
                for (var i = 3; i < 10; i++) {
                    if (cnt.scrollHeight > cnt.offsetHeight || cnt.scrollWidth > cnt.offsetWidth) {
                        cnt.style.height = 80 * i + 'px';
                        cnt.style.width = 160 * i + 'px';
                    } else break;
                }
            };
            var docEle = (doc.compatMode == 'CSS1Compat' && win.postMessage) ? doc.documentElement : doc.body;
            var mX = docEle.clientWidth - w.offsetWidth, mY = docEle.clientHeight - w.offsetHeight;
            if (mX < 0) { cnt.style.width = parseInt(cnt.style.width) + mX + 'px'; mX = 0 };
            if (mY < 0) { cnt.style.height = parseInt(cnt.style.height) + mY + 'px'; mY = 0 };
            var hW = parseInt(w.offsetWidth / 2);
            w.style.left = (pos && pos.X < mX + hW ? (pos.X > hW ? pos.X - hW : 0) : mX) + 'px';
            w.style.top = (pos && pos.Y + 10 < mY ? pos.Y + 10 : mY) + 'px';
            w.style.visibility = 'visible';
            doc.addEventListener('keydown', keyDown, false);
            return w;
        };

        var getHash = function(txt) {
            var TKK = ((function() {
                var a = 817046147;
                var b = -335196159;
                return 410049 + '.' + (a + b);
            })());

            function sM(a) {
                var b;
                if (null !== yr)
                    b = yr;
                else {
                    b = wr(String.fromCharCode(84));
                    var c = wr(String.fromCharCode(75));
                    b = [b(), b()];
                    b[1] = c();
                    b = (yr = window[b.join(c())] || "") || "";
                }
                var d = wr(String.fromCharCode(116));
                var c = wr(String.fromCharCode(107));
                d = [d(), d()];
                d[1] = c();
                c = "&" + d.join("") + "=";
                d = b.split(".");
                b = Number(d[0]) || 0;
                for (var e = [], f = 0, g = 0; g < a.length; g++) {
                    var l = a.charCodeAt(g);
                    128 > l ? e[f++] = l : (2048 > l ? e[f++] = l >> 6 | 192 : (55296 == (l & 64512) && g + 1 < a.length && 56320 == (a.charCodeAt(g + 1) & 64512) ? (l = 65536 + ((l & 1023) << 10) + (a.charCodeAt(++g) & 1023),
                        e[f++] = l >> 18 | 240,
                        e[f++] = l >> 12 & 63 | 128) : e[f++] = l >> 12 | 224,
                        e[f++] = l >> 6 & 63 | 128),
                        e[f++] = l & 63 | 128);
                }
                a = b;
                for (f = 0; f < e.length; f++)
                    a += e[f],
                    a = xr(a, "+-a^+6");
                a = xr(a, "+-3^+b+-f");
                a ^= Number(d[1]) || 0;
                0 > a && (a = (a & 2147483647) + 2147483648);
                a %= 1E6;
                return c + (a.toString() + "." + (a ^ b));
            }
            var yr = null;
            var wr = function(a) {
                return function() {
                    return a;
                };
            };
            var xr = function(a, b) {
                for (var c = 0; c < b.length - 2; c += 3) {
                    var d = b.charAt(c + 2);
                    d = "a" <= d ? d.charCodeAt(0) - 87 : Number(d);
                    d = "+" == b.charAt(c + 1) ? a >>> d : a << d;
                    a = "+" == b.charAt(c) ? a + d & 4294967295 : a ^ d;
                }
                return a;
            };
            return sM(txt);
        };

        var ujs_google_translat = function(dir) {
            var lng = 'de';
            var txt = gClipboard.read();
            var l = dir.split('|');
            var encTxt = encodeURIComponent(txt);
            var winWait = function(lng) { createWindow('', (lng == 'de' ? 'Warten bis der Text übersetzt ist' : 'Wait, is going Translating') + '\u2026', 'Google Translate', '_gt', window.navigator.lastClick); };
            if (txt) {
                winWait(lng);
                var xhr = new XMLHttpRequest();
                var url = 'https://translate.google.com/translate_a/single?client=gtx&sl=' + l[0] + '&tl=' + l[1] + '&hl=' + lng + '&eotf=0&dt=at&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t' + getHash(txt);
                var urlt = "http://translate.google.com/translate_t?text=" + encTxt + "&sl=" + l[0] + "&tl=" + l[1] + "&hl=" + lng + "&eotf=0&ujs=gtt";
                xhr.open('POST', url, true);
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
                xhr.onreadystatechange = function() {
                    try {
                        if (xhr.readyState == 4 && xhr.status == 200) {
                            var result = '', status = '', tmp = JSON.parse(xhr.responseText.replace(/\[(?=,)/g, '[0').replace(/,(?=,|\])/g, ',0').replace(/\\n/g, "<br />"));
                            for (var i = 0, n; n = tmp[0][i]; i++) {
                                if (n[0]) result += n[0].toString();
                            };
                            status = tmp[8][0][0].toUpperCase() + ' -\u203A ' + l[1].toUpperCase();
                            createWindow(result, status, '<a href="' + urlt.replace(/&/g, '&amp;') + '" target="_blank" style="display:inline;padding:0;margin:0;text-decoration:none;border:none;color:#009;font:22px Times New Roman;">Google Translate</a>', '_gt', window.navigator.lastClick);
                        }
                    } catch (x) { LOG(x); };
                };
                xhr.send('q=' + encodeURIComponent(txt));
            };
        };

        var ujs_google_translate = function() {
            var lng = 'de';
            var txt = gContextMenu.selectionInfo.fullText;
            var encTxt = encodeURIComponent(txt);
            var winWait = function(lng) { createWindow('', (lng == 'de' ? 'Warten bis der Text übersetzt ist' : 'Wait, is going Translating') + '\u2026', 'Google Translate', '_gt', window.navigator.lastClick); };
            if (txt) {
                winWait(lng);
                var xhr = new XMLHttpRequest();
                var url = 'https://translate.google.com/translate_a/single?client=gtx&sl=' + langFrom_google_text + '&tl=' + langTo_google_text + '&hl=' + lng + '&eotf=0&dt=at&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t' + getHash(txt);
                var urlt = "http://translate.google.com/translate_t?text=" + encTxt + "&sl=" + langFrom_google_text + "&tl=" + langTo_google_text + "&hl=" + lng + "&eotf=0&ujs=gtt";
                xhr.open('POST', url, true);
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
                xhr.onreadystatechange = function() {
                    try {
                        if (xhr.readyState == 4 && xhr.status == 200) {
                            var result = '', status = '', tmp = JSON.parse(xhr.responseText.replace(/\[(?=,)/g, '[0').replace(/,(?=,|\])/g, ',0').replace(/\\n/g, "<br />"));
                            for (var i = 0, n; n = tmp[0][i]; i++) {
                                if (n[0]) result += n[0].toString();
                            };
                            status = tmp[8][0][0].toUpperCase() + ' -\u203A ' + langTo_google_text.toUpperCase();
                            createWindow(result, status, '<a href="' + urlt.replace(/&/g, '&amp;') + '" target="_blank" style="display:inline;padding:0;margin:0;text-decoration:none;border:none;color:#009;font:22px Times New Roman;">Google Translate</a>', '_gt', window.navigator.lastClick);
                        }
                    } catch (x) { LOG(x); };
                };
                xhr.send('q=' + encodeURIComponent(txt));
            };
        };

        (function() {
            if (document.getElementById("TranslateBufer")) return;
            var contextMenu = document.getElementById("contentAreaContextMenu");
            var Item = document.createXULElement("menuitem");
            Item.setAttribute("label", "Translate from clipboard");
            Item.setAttribute("class", "menuitem-iconic");
            Item.setAttribute("image", mainicon);
            Item.addEventListener("command", function() { ujs_google_translat('auto|de'); }, false);
            contextMenu.insertBefore(Item, document.getElementById("context-viewpartialsource-selection"));
            addDestructor(function() { contextMenu.removeChild(Item); });
        })();

        (function() {
            if (document.getElementById("TranslateSelected")) return;
            var contextMenu = document.getElementById("contentAreaContextMenu");
            var Item = document.createXULElement("menuitem");
            Item.setAttribute("id", "TranslateSelected");
            Item.setAttribute("label", "Translate selected text");
            Item.setAttribute("class", "menuitem-iconic");
            Item.setAttribute("image", mainicon);
            Item.addEventListener("command", function() { ujs_google_translate(); }, false);
            contextMenu.insertBefore(Item, document.getElementById("context-viewpartialsource-selection"));
            addDestructor(function() { contextMenu.removeChild(Item); });

            addEventListener("popupshowing", function() {
                Item.hidden = !gContextMenu.isTextSelected;
            }, false, contextMenu);
        })();
    };

    // Initialize handlers array
    this.handlers = [];

    initFunction("cbinit-google-translate", "http://www.w3.org/1999/xhtml", () => {}, addEventListener, { read: readFromClipboard }, Cu.reportError);
    window.addEventListener("unload", this, { once: true });
})();
