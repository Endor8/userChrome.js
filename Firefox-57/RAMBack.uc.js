//  RAMBack.uc.js

(function() {

  if (location != 'chrome://browser/content/browser.xul')
    return;

  try {
    CustomizableUI.createWidget({
      id: 'ramback-button',
      defaultArea: CustomizableUI.AREA_NAVBAR,
      label: 'Internen Speicher leeren',
      tooltiptext: 'Internen Speicher leeren',
      onCommand: function() {
        onCommand();
      }
    });
  } catch(e) { };
  
  const icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAABGdBTUEAAK%2FINwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAOcSURBVHjaYvz%2F%2Fz8DJQAggBgU5OUZeHl5GSQlJRnY2dkZ%2BPj4GLi5uRn4%2Bfmzvb29X6qpqW1lZGQUAqllZWVlkJGRAdNiYmIMnJycDAABxIJsGMg1nz9%2F5tHS0loSHBzsq6Ojw%2FTmzRuvNWvWXN6%2Ff3%2FCnz9%2FdgMNQ3EAQAAxCwgIMHz%2F%2Fp2BmZmZ4ffv3852dna7gJrNgbYw3rx5k%2BHXr18MBgYGvEAXhj948EAYaMnOHz9%2BgG0HyQEEEDPQqQxfvn4FObkrICBgMtBWocePHzO8evWK4e%2FfvwwfPnxg%2BPbtG4O8vDyzhoaGBdBFgc%2BePdsHNOAt0EIGgABi5uTg0JCTl9%2Fq7Owc9vPnT%2Bbr169DTAa6CBQmoPAAOp3h3r17DO%2Ffv2cAWiDBw80d%2F%2Fbt28%2Ffv307CxBAzH4hYddMLazUjh4%2ByHD%2F%2Fn0GHh4ekGsYhISEGFhYWMAuePHiBZh%2B8uQJw727dxlMLK3YhcUkPW%2FdvM4AEEAsfrYWwiqi4gxf3r9jOHHiKDiEQZqBrgF7A6QR5ILv374DDWRlUNHUZGACikn%2B%2FcYIdIknQAAxRwk8yjGy%2Fc8tKWzJICSvw%2FD0%2BWOGZ0%2BfMjx6%2BBCsGRTAX798YRAUFmJQ09Jn4P7BwBDpzMxgIPaMYf32u%2BcAAojp1VeBS9y8fxi%2BbalmMGe7x%2BDvHcAgoaDK8AUYcK9evgQbIK%2BmyaCsZsigzPKWwfrPQQZ1yc8M39ll%2F3358fcIQACx2Mvxqfx49wKYMHgZpE2%2FMDxdsJbBkFOBgc%2FJjeHa1QsMAiJiDPw%2F%2FzJwnd%2FHENlixsDz1oTh%2FY1bDBJSRoxiHMycAAEAQQC%2B%2FwTW2dP95K%2F9AOryJf4T5eoCEvDJADFYEwC7xgkA9h8mAAHs6QBhUxIABd4CAPba0gDsACv%2F3sfq%2FxccxwL9%2Fv4fAgBBAL7%2FAq7H50BmkuSYHxL9%2FQP25QDm9xv%2BGh0JAPDZwQDh5esA8ebcACEY8QD4Cib%2B7ejtACwd9AGktu%2FXT5DXid36%2B4oCiCFOiINBBJgkPYSY6lOlGF4vibL99f9s9P9gdc43QlIKx9V4uK%2FfmG%2F2%2F9Lc6H85EsyvIxRZnrMzMiTCkjJAAIENkAYyOCBc%2BXYbqQuny5X%2F6wswHgcJiDEwqK6LEf%2ByIVXlvzAD0wSIEAIABBDYACkgQxiIuYFYgoFBGpj12pgYGLxB8iDXKTIwBPEyMLQAmeKMaLkZIMAAUM1Z7n%2BaufcAAAAASUVORK5CYII%3D';

  document.getElementById('ramback-button').style.listStyleImage = 'url(' + icon + ')';

  var menuitem = document.createElement("menuitem");
  menuitem.id = "menu_ramback";  
  menuitem.className = "menuitem-iconic";
  menuitem.setAttribute("image", icon);  
  menuitem.setAttribute("label", "Internen Speicher leeren");
  menuitem.addEventListener("command", onCommand);
  document.getElementById("menu_ToolsPopup").appendChild(menuitem);

  function onCommand() {
    // since we don't know the order of how things are going to go, fire these multiple times
    Services.obs.notifyObservers(null, "memory-pressure", "heap-minimize");
    Services.obs.notifyObservers(null, "memory-pressure", "heap-minimize");
    Services.obs.notifyObservers(null, "memory-pressure", "heap-minimize");
    Services.obs.notifyObservers(null, "dump-mem-stats", "clean up, pig!");
  };

})();
