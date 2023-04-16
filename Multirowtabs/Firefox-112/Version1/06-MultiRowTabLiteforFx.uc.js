// ==UserScript==
// @name           zzzz-MultiRowTab_LiteforFx48.uc.js
// @namespace      http://space.geocities.yahoo.co.jp/gl/alice0775
// @description    多段タブもどき実験版 CSS入れ替えまくりLiteバージョン
// @include        main
// @compatibility  Firefox 112
// @author         Alice0775
// @version        2016/08/05 00:00 Firefox 48
// @version        2016/05/01 00:01 hide favicon if busy
// @version        2016/03/09 00:01 Bug 1222490 - Actually remove panorama for Fx45+
// @version        2016/02/09 00:01 workaround css for lwt
// @version        2016/02/09 00:00
// ==/UserScript==
"use strict";
MultiRowTabLiteforFx();
function MultiRowTabLiteforFx() {

    var css =` /* USER_SHEET */
    @-moz-document url-prefix("chrome://browser/content/browser.xhtml") {

    /* ツールバーの並び順 */
    #toolbar-menubar { -moz-box-ordinal-group: 1; } /* メニューバー */
    #nav-bar         { -moz-box-ordinal-group: 2; } /* ナビゲーションツールバー */
    #PersonalToolbar { -moz-box-ordinal-group: 3; } /* ブックマークツールバー */

    /* ツールバーの調整 */
    #titlebar,#tabbrowser-tabs { -moz-appearance: none !important; }
    #titlebar { border-top: 1px solid var(--chrome-content-separator-color) !important; }

    /* タイトルバーボタン[－□×]の調整 */
    #nav-bar > .titlebar-buttonbox-container .titlebar-button { width: 46px !important; }
    #toolbar-menubar:not([inactive]) ~ #nav-bar:not([inFullscreen]) > .titlebar-buttonbox-container { display: none !important; }

    /* フルスクリーン時タブバーを隠して画面の一番上と一番下をマウスオーバーすると表示する様にしてみました。
       画面の一番上をマウスオーバーした場合ツールバーと一緒にタブバーが出てきます。
       画面の一番下をマウスオーバーした場合タブバーだけ出てきます。 */
    #titlebar > #TabsToolbar[inFullscreen] { display: none !important; }
    #navigator-toolbox-background:hover ~ #titlebar > #TabsToolbar[inFullscreen],
    #titlebar:hover > #TabsToolbar[inFullscreen] { display: block !important; }

    /* 多段タブ */
    box.scrollbox-clip[orient="horizontal"] { display: block !important; }
    box.scrollbox-clip[orient="horizontal"] > scrollbox {
        display: flex !important;
        flex-wrap: wrap !important;
        max-height: calc(calc(8px + var(--tab-min-height)) * 3); /* 段数(デフォルト3段) */
        overflow-x: hidden !important;
        overflow-y: auto !important; }
    .tabbrowser-tab[fadein]:not([pinned]) { flex-grow: 1 !important; }
    #TabsToolbar .toolbarbutton-1 { margin: 0 !important; padding: 0 !important; }

    /* 非表示 */
    .tabbrowser-tab:not([fadein]),#alltabs-button { display: none !important; }

    /* --- タブバー ドラッグ領域 --- */

    /* 横幅 調整 */
    hbox.titlebar-spacer[type="pre-tabs"] { width: 0px !important; } /* 左のドラッグ領域：デフォルト 40px */
    hbox.titlebar-spacer[type="post-tabs"] { width: 0px !important; } /* 右のドラッグ領域：デフォルト 40px */

    /* ↓CSSコードの左右にあるコメントアウトを外してCSSコードを有効にするとウィンドウを最大化した時非表示になる左のドラッグ領域が表示出来ます。 */
    /* :root:not([sizemode="normal"]) hbox.titlebar-spacer[type="pre-tabs"] { display: block !important; } */

    /* ↓CSSコードの左右にあるコメントアウトを外してCSSコードを有効にするとフルスクリーンにした時非表示になる左右のドラッグ領域が表示出来ます。 */
    /* :root[inFullscreen] hbox.titlebar-spacer { display: block !important; } */



    /* スクリプトを使用してタブバーをウィンドウの下部に移動する場合テーマが機能しない為
       browser.cssから機能させる為に必要なCSSコードを取り込んで、#navigator-toolboxを#titlebarに変更しました */

    #titlebar:-moz-lwtheme {
      background-image: var(--lwt-additional-images);
      background-repeat: var(--lwt-background-tiling);
      background-position: var(--lwt-background-alignment);
    }

    /* TODO bug 1695280: Remove these media selectors and merge the rule below
       with the ruleset above. We must set background properties on :root and not
       #navigator-toolbox on Windows 7/8 due to a WebRender bug that hides the
       minimize/maximize/close buttons. */
    @media not (-moz-platform: windows-win7) {
      @media not (-moz-platform: windows-win8) {
        #titlebar:-moz-lwtheme {
          background-color: var(--lwt-accent-color);
        }

        /* When a theme defines both theme_frame and additional_backgrounds, show
           the latter atop the former. */
       :root[lwtheme-image] #titlebar {
         background-image: var(--lwt-header-image), var(--lwt-additional-images);
         background-repeat: no-repeat, var(--lwt-background-tiling);
         background-position: right top, var(--lwt-background-alignment);
       }

       #titlebar:-moz-window-inactive:-moz-lwtheme {
         background-color: var(--lwt-accent-color-inactive, var(--lwt-accent-color));
       }
      }
    }

    } `;
    var sss = Cc['@mozilla.org/content/style-sheet-service;1'].getService(Ci.nsIStyleSheetService);
    var uri = makeURI('data:text/css;charset=UTF=8,' + encodeURIComponent(css));
    sss.loadAndRegisterSheet(uri, sss.USER_SHEET);

    var css =` /* AGENT_SHEET */
    @-moz-document url-prefix("chrome://browser/content/browser.xhtml") {

    /* 指定段数を超えるとタブバーに表示されるスクローバーのドラッグ領域を無効化してマウスクリックで上下出来るようにする */
    box.scrollbox-clip > scrollbox[orient="horizontal"] > scrollbar { -moz-window-dragging: no-drag !important; }

    } `;
    var sss = Cc['@mozilla.org/content/style-sheet-service;1'].getService(Ci.nsIStyleSheetService);
    var uri = makeURI('data:text/css;charset=UTF=8,' + encodeURIComponent(css));
    sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);

    var css =` /* AUTHOR_SHEET */

    /*
    #tabbrowser-arrowscrollbox::part(scrollbox-clip) { display: block !important; }
    #tabbrowser-arrowscrollbox::part(scrollbox) {
        display: flex !important;
        flex-wrap: wrap !important;
        max-height: calc(calc(8px + var(--tab-min-height)) * 3);
        overflow-x: hidden !important;
        overflow-y: auto !important; }
    */

    /* タブバーshadowRoot内のscrollbuttonとspacerを非表示 */
    #tabbrowser-arrowscrollbox[scrolledtostart]::part(overflow-start-indicator),
    #tabbrowser-arrowscrollbox[scrolledtoend]::part(overflow-end-indicator),
    #tabbrowser-arrowscrollbox::part(scrollbutton-up),
    #tabbrowser-arrowscrollbox::part(scrollbutton-down) { display: none !important; }

    `;
    var sss = Components.classes['@mozilla.org/content/style-sheet-service;1'].getService(Components.interfaces.nsIStyleSheetService);
    var uri = makeURI('data:text/css;charset=UTF=8,' + encodeURIComponent(css));
    sss.loadAndRegisterSheet(uri, sss.AUTHOR_SHEET);

    if(location.href !== 'chrome://browser/content/browser.xhtml') return;

    // メニューバーをツールバーの上部に移動
    document.getElementById("titlebar").parentNode.insertBefore(document.getElementById("toolbar-menubar"),document.getElementById("nav-bar"));

    // タブバーをウィンドウの下部に移動
    document.body.appendChild(document.getElementById("titlebar"));

    // タブバーのタイトルバーボタン[－□×]をナビゲーションツールバーの右端に移動
    document.getElementById("nav-bar").appendChild(document.querySelector("#TabsToolbar .titlebar-buttonbox-container"));

    // Tabbar scrollIntoView
    gBrowser.tabContainer.addEventListener("SSTabRestoring", function(event) {event.target.scrollIntoView({behavior: "instant", block: "nearest", inline: "nearest"})}, true);
    gBrowser.tabContainer.addEventListener("TabAttrModified", function(event) {event.target.scrollIntoView({behavior: "instant", block: "nearest", inline: "nearest"})}, true);
    gBrowser.tabContainer.addEventListener("TabMove", function(event) {event.target.scrollIntoView({behavior: "instant", block: "nearest", inline: "nearest"})}, true);

    // drag & drop & DropIndicator

    gBrowser.tabContainer.on_dragover = function(event) {
      var effects = this.getDropEffectForTabDrag(event);

      var ind = this._tabDropIndicator;
      if (effects == "" || effects == "none") {
        ind.hidden = true;
        return;
      }
      event.preventDefault();
      event.stopPropagation();

      var arrowScrollbox = this.arrowScrollbox;

      if (effects == "link") {
        let tab = this._getDragTargetTab(event, { ignoreTabSides: true });
        if (tab) {
          if (!this._dragTime) {
            this._dragTime = Date.now();
          }
          if (Date.now() >= this._dragTime + this._dragOverDelay) {
            this.selectedItem = tab;
          }
          ind.hidden = true;
          return;
        }
      }

      var rect = arrowScrollbox.getBoundingClientRect();
      var newMarginX, newMarginY;
      let newIndex = this._getDropIndex(event);
      let children = this.allTabs;
      if (newIndex == children.length) {
        let tabRect = this._getVisibleTabs()
          .at(-1)
          .getBoundingClientRect();
        if (RTL_UI) {
          newMarginX = rect.right - tabRect.left;
        } else {
          newMarginX = tabRect.right - rect.left;
        }
          newMarginY = tabRect.top - rect.top + tabRect.height / 2 - rect.height / 2;
      } else {
        let tabRect = children[newIndex].getBoundingClientRect();
        if (RTL_UI) {
          newMarginX = rect.right - tabRect.right;
        } else {
          newMarginX = tabRect.left - rect.left;
        }
          newMarginY = tabRect.top - rect.top + tabRect.height / 2 - rect.height / 2;
      }

      ind.hidden = false;
      newMarginX += ind.clientWidth / 2;
      if (RTL_UI) {
        newMarginX *= -1;
      }
      ind.style.transform = "translate(" + Math.round(newMarginX) + "px," + Math.round(newMarginY) + "px)";
    }

    gBrowser.tabContainer.on_drop = function(event) {
      var dt = event.dataTransfer;
      var dropEffect = dt.dropEffect;
      var draggedTab;
      let movingTabs;
      if (dt.mozTypesAt(0)[0] == TAB_DROP_TYPE) {
        // tab copy or move
        draggedTab = dt.mozGetDataAt(TAB_DROP_TYPE, 0);
        // not our drop then
        if (!draggedTab) {
          return;
        }
        movingTabs = draggedTab._dragData.movingTabs;
        draggedTab.container._finishGroupSelectedTabs(draggedTab);
      }

      this._tabDropIndicator.hidden = true;
      event.stopPropagation();
      if (draggedTab && dropEffect == "copy") {
        // copy the dropped tab (wherever it's from)
        let newIndex = this._getDropIndex(event);
        let draggedTabCopy;
        for (let tab of movingTabs) {
          let newTab = gBrowser.duplicateTab(tab);
          gBrowser.moveTabTo(newTab, newIndex++);
          if (tab == draggedTab) {
            draggedTabCopy = newTab;
          }
        }
        if (draggedTab.container != this || event.shiftKey) {
          this.selectedItem = draggedTabCopy;
        }
      } else if (draggedTab && draggedTab.container == this) {
        let oldTranslateX = Math.round(draggedTab._dragData.translateX);
        let tabWidth = Math.round(draggedTab._dragData.tabWidth);
        let translateOffset = oldTranslateX % tabWidth;
        let newTranslateX = oldTranslateX - translateOffset;
        if (oldTranslateX > 0 && translateOffset > tabWidth / 2) {
          newTranslateX += tabWidth;
        } else if (oldTranslateX < 0 && -translateOffset > tabWidth / 2) {
          newTranslateX -= tabWidth;
        }

        let dropIndex;
        if (draggedTab._dragData.fromTabList) {
          dropIndex = this._getDropIndex(event);
        } else {
          dropIndex = this._getDropIndex(event);
         // "animDropIndex" in draggedTab._dragData &&
         // draggedTab._dragData.animDropIndex;
        }
        let incrementDropIndex = true;
        if (dropIndex && dropIndex > movingTabs[0]._tPos) {
          dropIndex--;
          incrementDropIndex = false;
        }

        if (oldTranslateX && oldTranslateX != newTranslateX && !gReduceMotion) {
          for (let tab of movingTabs) {
            tab.setAttribute("tabdrop-samewindow", "true");
            tab.style.transform = "translateX(" + newTranslateX + "px)";
            let postTransitionCleanup = () => {
              tab.removeAttribute("tabdrop-samewindow");

              this._finishAnimateTabMove();
              if (dropIndex !== false) {
                gBrowser.moveTabTo(tab, dropIndex);
                if (incrementDropIndex) {
                  dropIndex++;
                }
              }

              gBrowser.syncThrobberAnimations(tab);
            };
            if (gReduceMotion) {
              postTransitionCleanup();
            } else {
              let onTransitionEnd = transitionendEvent => {
                if (
                  transitionendEvent.propertyName != "transform" ||
                  transitionendEvent.originalTarget != tab
                ) {
                  return;
                }
                tab.removeEventListener("transitionend", onTransitionEnd);

                postTransitionCleanup();
              };
              tab.addEventListener("transitionend", onTransitionEnd);
            }
          }
        } else {
          this._finishAnimateTabMove();
          if (dropIndex !== false) {
            for (let tab of movingTabs) {
              gBrowser.moveTabTo(tab, dropIndex);
              if (incrementDropIndex) {
                dropIndex++;
              }
            }
          }
        }
      } else if (draggedTab) {
        // Move the tabs. To avoid multiple tab-switches in the original window,
        // the selected tab should be adopted last.
        const dropIndex = this._getDropIndex(event);
        let newIndex = dropIndex;
        let selectedTab;
        let indexForSelectedTab;
        for (let i = 0; i < movingTabs.length; ++i) {
          const tab = movingTabs[i];
          if (tab.selected) {
            selectedTab = tab;
            indexForSelectedTab = newIndex;
          } else {
            const newTab = gBrowser.adoptTab(tab, newIndex, tab == draggedTab);
            if (newTab) {
              ++newIndex;
            }
          }
        }
        if (selectedTab) {
          const newTab = gBrowser.adoptTab(
            selectedTab,
            indexForSelectedTab,
            selectedTab == draggedTab
          );
          if (newTab) {
            ++newIndex;
          }
        }

        // Restore tab selection
        gBrowser.addRangeToMultiSelectedTabs(
          gBrowser.tabs[dropIndex],
          gBrowser.tabs[newIndex - 1]
        );
      } else {
        // Pass true to disallow dropping javascript: or data: urls
        let links;
        try {
          links = browserDragAndDrop.dropLinks(event, true);
        } catch (ex) {}

        if (!links || links.length === 0) {
          return;
        }

        let inBackground = Services.prefs.getBoolPref(
          "browser.tabs.loadInBackground"
        );
        if (event.shiftKey) {
          inBackground = !inBackground;
        }

        let targetTab = this._getDragTargetTab(event, { ignoreTabSides: true });
        let userContextId = this.selectedItem.getAttribute("usercontextid");
        let replace = !!targetTab;
        let newIndex = this._getDropIndex(event);
        let urls = links.map(link => link.url);
        let csp = browserDragAndDrop.getCsp(event);
        let triggeringPrincipal = browserDragAndDrop.getTriggeringPrincipal(
          event
        );

        (async () => {
          if (
            urls.length >=
            Services.prefs.getIntPref("browser.tabs.maxOpenBeforeWarn")
          ) {
            // Sync dialog cannot be used inside drop event handler.
            let answer = await OpenInTabsUtils.promiseConfirmOpenInTabs(
              urls.length,
              window
            );
            if (!answer) {
              return;
            }
          }

          gBrowser.loadTabs(urls, {
            inBackground,
            replace,
            allowThirdPartyFixup: true,
            targetTab,
            newIndex,
            userContextId,
            triggeringPrincipal,
            csp,
          });
        })();
      }

      if (draggedTab) {
        delete draggedTab._dragData;
      }
    }

}
