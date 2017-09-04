// ==UserScript==
// @name           Tab Wheel Scroll
// @namespace      https://www.camp-firefox.de/forum
// @description    Mit dem Mausrad durch die Tabs rollen
// @include        chrome://browser/content/browser.xul
// ==/UserScript==

(function() {
  if (location != 'chrome://browser/content/browser.xul')
    return;
  const scrollRight = true;
  const wrap = true;
  gBrowser.tabContainer.addEventListener("wheel", function(event) {
    let dir = (scrollRight ? 1 : -1) * Math.sign(event.deltaY);
    setTimeout(function() {
      gBrowser.tabContainer.advanceSelectedTab(dir, wrap);
    }, 0);
  }, true);
})();