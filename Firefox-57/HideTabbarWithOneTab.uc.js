//  HideTabbarWithOneTab.uc.js
//  v. 0.2

(function() {
  if (!window.gBrowser)
    return;
  let tabbar = document.getElementById("TabsToolbar");
  function showHideTabbar() {
    tabbar.collapsed = (gBrowser.visibleTabs.length == 1);
  };
  setTimeout(function() {
    showHideTabbar();
  }, 0);
  let observer = new MutationObserver(showHideTabbar);
  observer.observe(document.getElementById("tabbrowser-tabs"), {childList: true});
})();
