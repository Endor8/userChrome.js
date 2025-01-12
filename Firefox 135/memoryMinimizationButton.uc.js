// ==UserScript==
// @name           memoryMinimizationButton.uc.js
// @namespace      http://space.geocities.yahoo.co.jp/gl/alice0775
// @description    memory minimization button
// @charset        utf-8
// @include        main
// @include        about:processes?memoryMinimizationButton
// @include        about:processes?memoryMinimizationButton2
// @compatibility  Firefox 135
// @author         Alice0775
// @version        2024/12/22 fix Bug 1936336 - Disallow inline event handlers
// @version        2023/01/21 00:00 check link
// @version        2022/11/04 00:00 ucjsMemoryUsage
// @version        2022/10*18 10:00 fix Bug 1790616
// @version        2022/06/18 00:00 kil process
// @version        2018/10/09 00:00 fix CSS
// @version        2018/09/07 23:00 fix initial visual status
// ==/UserScript==
var memoryMinimizationButton = {
  get memoryMinimizationButton(){
    return document.getElementById("memoryMinimizationButton");
  },

  get statusinfo() {
    if ("StatusPanel" in window) {
      // fx61+
      return StatusPanel._labelElement.value;
    } else {
      return XULBrowserWindow.statusTextField.label;
    }
  },

  set statusinfo(val) {
    if ("StatusPanel" in window) {
      // fx61+
      StatusPanel._label = val;
    } else {
      XULBrowserWindow.statusTextField.label = val;
    }
    if(this._statusinfotimer)
      clearTimeout(this._statusinfotimer);
    this._statusinfotimer = setTimeout(() => {this.hideStatusInfo();}, 2000);
    this._laststatusinfo = val;
    return val;
  },

  init: function() {
    let style = `
      #memoryMinimizationButton {
          /*width: 16px;*/
          /*height: 16px;*/
        list-style-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAABGdBTUEAAK%2FINwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAOcSURBVHjaYvz%2F%2Fz8DJQAggBgU5OUZeHl5GSQlJRnY2dkZ%2BPj4GLi5uRn4%2Bfmzvb29X6qpqW1lZGQUAqllZWVlkJGRAdNiYmIMnJycDAABxIJsGMg1nz9%2F5tHS0loSHBzsq6Ojw%2FTmzRuvNWvWXN6%2Ff3%2FCnz9%2FdgMNQ3EAQAAxCwgIMHz%2F%2Fp2BmZmZ4ffv3852dna7gJrNgbYw3rx5k%2BHXr18MBgYGvEAXhj948EAYaMnOHz9%2BgG0HyQEEEDPQqQxfvn4FObkrICBgMtBWocePHzO8evWK4e%2FfvwwfPnxg%2BPbtG4O8vDyzhoaGBdBFgc%2BePdsHNOAt0EIGgABi5uTg0JCTl9%2Fq7Owc9vPnT%2Bbr169DTAa6CBQmoPAAOp3h3r17DO%2Ffv2cAWiDBw80d%2F%2Fbt28%2Ffv307CxBAzH4hYddMLazUjh4%2ByHD%2F%2Fn0GHh4ekGsYhISEGFhYWMAuePHiBZh%2B8uQJw727dxlMLK3YhcUkPW%2FdvM4AEEAsfrYWwiqi4gxf3r9jOHHiKDiEQZqBrgF7A6QR5ILv374DDWRlUNHUZGACikn%2B%2FcYIdIknQAAxRwk8yjGy%2Fc8tKWzJICSvw%2FD0%2BWOGZ0%2BfMjx6%2BBCsGRTAX798YRAUFmJQ09Jn4P7BwBDpzMxgIPaMYf32u%2BcAAojp1VeBS9y8fxi%2BbalmMGe7x%2BDvHcAgoaDK8AUYcK9evgQbIK%2BmyaCsZsigzPKWwfrPQQZ1yc8M39ll%2F3358fcIQACx2Mvxqfx49wKYMHgZpE2%2FMDxdsJbBkFOBgc%2FJjeHa1QsMAiJiDPw%2F%2FzJwnd%2FHENlixsDz1oTh%2FY1bDBJSRoxiHMycAAEAQQC%2B%2FwTW2dP95K%2F9AOryJf4T5eoCEvDJADFYEwC7xgkA9h8mAAHs6QBhUxIABd4CAPba0gDsACv%2F3sfq%2FxccxwL9%2Fv4fAgBBAL7%2FAq7H50BmkuSYHxL9%2FQP25QDm9xv%2BGh0JAPDZwQDh5esA8ebcACEY8QD4Cib%2B7ejtACwd9AGktu%2FXT5DXid36%2B4oCiCFOiINBBJgkPYSY6lOlGF4vibL99f9s9P9gdc43QlIKx9V4uK%2FfmG%2F2%2F9Lc6H85EsyvIxRZnrMzMiTCkjJAAIENkAYyOCBc%2BXYbqQuny5X%2F6wswHgcJiDEwqK6LEf%2ByIVXlvzAD0wSIEAIABBDYACkgQxiIuYFYgoFBGpj12pgYGLxB8iDXKTIwBPEyMLQAmeKMaLkZIMAAUM1Z7n%2BaufcAAAAASUVORK5CYII%3D');
      }
      @media (min-resolution: 1.1dppx) {
        #memoryMinimizationButton {
          width: 32px;
          height: 32px;
        }
      }
     `.replace(/\s+/g, " ");

    let sss = Components.classes['@mozilla.org/content/style-sheet-service;1']
                .getService(Components.interfaces.nsIStyleSheetService);
    let newURIParam = {
        aURL: 'data:text/css,' + encodeURIComponent(style),
        aOriginCharset: null,
        aBaseURI: null
    }
    let cssUri = Services.io.newURI(newURIParam.aURL, newURIParam.aOriginCharset, newURIParam.aBaseURI);
    if (!sss.sheetRegistered(cssUri, sss.AUTHOR_SHEET))
      sss.loadAndRegisterSheet(cssUri, sss.AUTHOR_SHEET);

    if (this.memoryMinimizationButton)
      return;
    if (!document.getElementById("memoryMinimizationButton"))
    try {
      CustomizableUI.createWidget({ //must run createWidget before windowListener.register because the register function needs the button added first
        id: 'memoryMinimizationButton',
        type:  'custom',
        defaultArea: CustomizableUI.AREA_NAVBAR,
        onBuild: function(aDocument) {
          var toolbaritem = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
          var props = {
            id: "memoryMinimizationButton",
            class: "toolbarbutton-1 chromeclass-toolbar-additional",
            tooltiptext: "Speicherminimierung (Umschalt+Klick; andere Tabs Speicher minimieren)",
            //oncommand: "memoryMinimizationButton.doMinimize(event);",
            //onclick: "if (event.button == 1) memoryMinimizationButton.doMinimize(event);",
            type: CustomizableUI.TYPE_TOOLBAR,
            label: "Speicherminimierung",
            removable: "true"
          };
          for (var p in props) {
            toolbaritem.setAttribute(p, props[p]);
          }
          toolbaritem.addEventListener("command", (event) => event.target.ownerGlobal.memoryMinimizationButton.doMinimize(event));
          toolbaritem.addEventListener("click", (event) => {if (event.button == 1) event.target.ownerGlobal.memoryMinimizationButton.doMinimize(event)});
          return toolbaritem;
        },
      });
    } catch(ee) {}
  },

  doMinimize: function(event) {
    function doGlobalGC()  {
       Services.obs.notifyObservers(null, "child-gc-request");
       Cu.forceGC();
    }

    function doCC()  {
      Services.obs.notifyObservers(null, "child-cc-request");
      if (typeof window.windowUtils != "undefined")
        window.windowUtils.cycleCollect();
      else
      window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
            .getInterface(Components.interfaces.nsIDOMWindowUtils).cycleCollect();
    }

    function doMemMinimize(event) {
      if (event.button == 1 || event.shiftKey || event.altKey || event.ctrlKey)
        memoryMinimizationButton.kill(true);
      else
        memoryMinimizationButton.kill(false);
      Services.obs.notifyObservers(null, "child-mmu-request");
      var gMgr = Cc["@mozilla.org/memory-reporter-manager;1"]
             .getService(Ci.nsIMemoryReporterManager);
      gMgr.minimizeMemoryUsage(() => {
        if (!(event.button == 1 || event.shiftKey || event.altKey || event.ctrlKey)) {
          memoryMinimizationButton.displayStatus("Memory minimization done");
          if (typeof ucjsMemoryUsage != "undefined") ucjsMemoryUsage.requestMemory();
        }
      });
    }
    function sendHeapMinNotifications()  {
      function runSoon(f) {
        var tm = Cc["@mozilla.org/thread-manager;1"]
                  .getService(Ci.nsIThreadManager);

        tm.mainThread.dispatch({ run: f }, Ci.nsIThread.DISPATCH_NORMAL);
      }

      function sendHeapMinNotificationsInner() {
        var os = Cc["@mozilla.org/observer-service;1"]
                 .getService(Ci.nsIObserverService);
        os.notifyObservers(null, "memory-pressure", "heap-minimize");

        if (++j < 3)
          runSoon(sendHeapMinNotificationsInner);
      }

      var j = 0;
      sendHeapMinNotificationsInner();
    }

    this.displayStatus("Memory minimization start")
    doGlobalGC();
    doCC();
    //sendHeapMinNotifications();
    setTimeout((event)=> {doMemMinimize(event);}, 1000, event);
  },
  
  _statusinfotimer: null,
  _laststatusinfo: null,
  displayStatus: function(val) {
    this.statusinfo = val;
  },
  hideStatusInfo: function() {
    if(this._statusinfotimer)
      clearTimeout(this._statusinfotimer);
    this._statusinfotimer = null;
    if (this._laststatusinfo == this.statusinfo)
      this.statusinfo = "";
  },

  kill: function(force) {
    this.browser = document.createXULElement("browser");
    if (force)
      this.browser.src = "about:processes?memoryMinimizationButton";
    else
      this.browser.src = "about:processes?memoryMinimizationButton2";
    document.documentElement.appendChild(this.browser);
    setTimeout(() => {
      this.browser.src = "about:blank";
      document.documentElement.removeChild(this.browser);
      delete this.browser;
      Services.console.logStringMessage("killing done");
      this.displayStatus("Memory minimization done");
      if (typeof ucjsMemoryUsage != "undefined") ucjsMemoryUsage.requestMemory();
    }, 8000);
  }
}

if (location.href == "chrome://browser/content/browser.xhtml") {
  memoryMinimizationButton.init();
} else if (location.href == "about:processes?memoryMinimizationButton") {
  Services.console.logStringMessage("killing start");
  setTimeout(() => {
    let closeButtons = document.querySelectorAll("tr.process > td.close-icon");
    for(let closeButton of closeButtons) {
      let row = closeButton.parentNode;
      let canKill = true;
      if (row.querySelector("favicon")?.getAttribute("style")?.includes("link.svg")) {
        canKill = false;
        break;
      }
      for (let childRow = row.nextSibling;
           childRow && !childRow.classList.contains("process");
           childRow = childRow.nextSibling ) {
        let win = childRow.win;
        if (win?.tab?.tab?.selected) {
          canKill = false;
          break;
        }
      }
      if (canKill)
        Control._handleKill(closeButton);
    }
    return;
    /*
    let closeButtons = document.querySelectorAll("tr.process > td.close-icon");
    for(let closeButton of closeButtons) {
      closeButton.click();
    }
    */
  }, 5000);
} else if (location.href == "about:processes?memoryMinimizationButton2") {
  Services.console.logStringMessage("killing start");
  setTimeout(() => {
    let closeButtons = document.querySelectorAll("tr.process > td.close-icon");
    for(let closeButton of closeButtons) {
      let row = closeButton.parentNode;
      let canKill = true;
      if (row.querySelector("favicon")?.getAttribute("style")?.includes("link.svg")) {
        canKill = false;
        break;
      }
      for (let childRow = row.nextSibling;
           childRow && !childRow.classList.contains("process");
           childRow = childRow.nextSibling ) {
        let win = childRow.win;
        if (!win?.tab?.tab?.hasAttribute("pending")) {
          canKill = false;
          break;
        }
      }
      if (canKill)
        Control._handleKill(closeButton);
    }
    return;
    /*
    let closeButtons = document.querySelectorAll("tr.process > td.close-icon");
    for(let closeButton of closeButtons) {
      closeButton.click();
    }
    */
  }, 5000);
}
