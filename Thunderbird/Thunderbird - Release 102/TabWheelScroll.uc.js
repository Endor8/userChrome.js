(function() {
  if (location != 'chrome://messenger/content/messenger.xhtml')
    return;
  const scrollRight = true;
  const wrap = true;
  const dirFactor = scrollRight ? 1 : -1;
  tabmail.tabContainer.addEventListener('wheel', function(event) {
    //event.preventDefault();
    event.stopPropagation();
    let dir = dirFactor * Math.sign(event.deltaY);
    setTimeout(function() {
      tabmail.tabContainer.advanceSelectedTab(dir, wrap);
    }, 0);
  }, true);
})();
