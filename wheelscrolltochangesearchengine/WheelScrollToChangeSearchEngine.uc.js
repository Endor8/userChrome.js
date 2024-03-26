// ==UserScript==
// @name           wheelscroll to change search engine
// @description    検索バー上のホイールスクロールで検索エンジンを変える
// @version        1.2
// @author         oflow
// @compatibility  Firefox 38, 43
// @namespace      https://oflow.me/archives/1565
// @note           Firefox 38.0.1 (ESR)で動作確認
//                 Firefox 43.0.2 (Release)で動作確認
// ==/UserScript==

(function() {
    Components.utils.import('resource:///modules/CustomizableUI.jsm');

    var searchbar = icon = null,
        // テーマによってはwidth/height指定しないと16x16pxのアイコンが拡大されたりズレる
        // デフォルトテーマはsearchbar-search-button 20x20px + margin 1px
        css = '\
            .searchbar-search-button {\
                cursor: pointer !important;\
                width: 16px !important;\
                height: 16px !important;\
                margin-top: 3px !important;\
                margin-bottom: 3px !important;\
                -moz-margin-start: 4px !important;\
                -moz-margin-end: 4px !important;\
            }\
            '.replace(/\s+/g, ' ');

    var ucjsScrollSearchEngine = {
        listener: {
            // ツールバーカスタマイズでアイコンが消えるのをなんとかする
            onCustomizeStart: function() {
                if (searchbar) {
                    searchbar.removeEventListener('DOMMouseScroll', ucjsScrollSearchEngine, false);
                    window.removeEventListener('unload', ucjsScrollSearchEngine, false);
                }
            },
            onCustomizeEnd: function() {
                ucjsScrollSearchEngine.init();
            }
        },
        init: function() {
            searchbar = document.getElementById('searchbar');
            CustomizableUI.addListener(this.listener);
            if (!searchbar) {
                return;
            }
            icon = document.getAnonymousElementByAttribute(searchbar, 'anonid', 'searchbar-search-button');
            searchbar.addEventListener('DOMMouseScroll', this, false);
            window.addEventListener('unload', this, false);
            if (icon) {
                this.setEngine();
            }
            if (css) {
                var style = document.createProcessingInstruction('xml-stylesheet','type="text/css" href="data:text/css,'+ encodeURIComponent(css) +'"');
                document.insertBefore(style, document.documentElement);
                css = null;
            }
        },
        handleEvent: function(event) {
            switch (event.type) {
                case 'unload':
                    this.unload();
                    break;
                case 'DOMMouseScroll':
                    this.scroll(event);
                    break;
            }
        },
        unload: function() {
            CustomizableUI.removeListener(this.listener);
            searchbar.removeEventListener('DOMMouseScroll', this, false);
            window.removeEventListener('unload', this, false);
        },
        scroll: function(event) {
            searchbar.selectEngine(event, event.detail > 0);
            this.setEngine();
        },
        setEngine() {
            var engine = searchbar.currentEngine;
            searchbar._textbox.setAttribute('placeholder', engine.name);
            if (icon) icon.setAttribute('src', engine.iconURI.spec);
        }
    };
    ucjsScrollSearchEngine.init();
})();
