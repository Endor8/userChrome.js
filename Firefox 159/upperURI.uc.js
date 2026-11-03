// ==UserScript==
// -*- mode:JScript; Encoding:utf8n -*-
// @name           upper URI
// @namespace      http://d.hatena.ne.jp/p-arai/
// @description    Add upper URIs to the context menu in Location bar.
// @include        main
// @compatibility  Firefox 156+
// @author         p-arai
// @version        2026/11/01 Firefox 156+ context menu API
// ==/UserScript==

(function() {
  "use strict";

  var upperMenu = null;
  var upperPopup = null;

  // Create context menu entries using the new Firefox API
  gURLBar.addContextMenuItems({

    createItems() {
      var fragment = document.createDocumentFragment();

      // Separator
      var sep = document.createXULElement("menuseparator");
      fragment.appendChild(sep);

      // Main menu
      upperMenu = document.createXULElement("menu");
      upperMenu.setAttribute("id", "upperURI");
      upperMenu.setAttribute("label", "Höhere URL");
      upperMenu.setAttribute(
        "tooltiptext",
        "Darüberliegende Adressen"
      );

      // Submenu
      upperPopup = document.createXULElement("menupopup");
      upperMenu.appendChild(upperPopup);

      fragment.appendChild(upperMenu);

      return fragment;
    },

    // Called whenever the context menu is opened
    onShowing(input, items) {
      populateMenu();
    }

  });


  // Populate submenu
  function populateMenu() {

    if (!upperPopup)
      return;

    while (upperPopup.lastChild) {
      upperPopup.removeChild(upperPopup.lastChild);
    }

    var uri = gBrowser.currentURI;
    var uriArray = getUpURIs();

    for (var i = 0; i < uriArray.length; i++) {

      var menuitem = document.createXULElement("menuitem");

      var url = uriArray[i];

      menuitem.setAttribute(
        "label",
        url == uri.prePath
          ? url
          : url.replace(uri.prePath, "")
      );

      menuitem.setAttribute("value", url);

      // Normal activation
      menuitem.addEventListener("command", function(event) {
        openLinkIn(
          event.currentTarget.getAttribute("value"),
          "current",
          {
            allowThirdPartyFixup: false,
            triggeringPrincipal:
              Services.scriptSecurityManager.createNullPrincipal({})
          }
        );
      });

      // Middle click / modifier keys
      menuitem.addEventListener("click", function(event) {

        if (event.button == 2)
          return;

        var where = BrowserUtils.whereToOpenLink(
          event,
          false,
          true
        );

        // Normal left click is handled by command
        if (where == "current")
          return;

        event.preventDefault();
        event.stopPropagation();

        openTrustedLinkIn(
          event.currentTarget.getAttribute("value"),
          where,
          {
            allowThirdPartyFixup: false,
            postData: null,
            referrerInfo: null,
            triggeringPrincipal:
              Services.scriptSecurityManager.createNullPrincipal({})
          }
        );

      });

      upperPopup.appendChild(menuitem);
    }

    upperMenu.disabled = uriArray.length == 0;
  }


  // Generate parent URLs
  function getUpURIs() {

    var uriArray = [];
    var uri = gBrowser.currentURI;

    var host;

    try {
      host = uri.host;
    } catch(e) {
      return uriArray;
    }

    if (!host)
      return uriArray;

    if (
      uri.scheme == "data" ||
      uri.scheme == "javascript" ||
      uri.scheme == "chrome" ||
      uri.scheme == "about"
    ) {
      return uriArray;
    }

    // Remove query and fragment
    var uriPath = uri.pathQueryRef.replace(/[?#].*$/, "");

    if (uriPath == "/")
      return uriArray;

    uriPath = uriPath.replace(/\/$/, "");

    var pathArray = uriPath.split("/");
    var path = pathArray.pop();

    var isTaskcluster =
      host == "tools.taskcluster.net" ||
      host == "firefox-ci-tc.services.mozilla.com";

    // Special handling for Taskcluster URLs
    if (isTaskcluster) {

      var pathArray2 = path.split(".");
      pathArray2.pop();

      while (pathArray2.length) {

        uriArray.push(
          uri.prePath +
          pathArray.join("/") +
          "/" +
          pathArray2.join(".")
        );

        pathArray2.pop();
      }
    }

    // Generate parent directories
    while (pathArray.length) {

      uriArray.push(
        uri.prePath +
        pathArray.join("/") +
        "/"
      );

      path = pathArray.pop();

      // Special handling for Taskcluster URLs
      if (isTaskcluster) {

        var pathArray2 = path.split(".");
        pathArray2.pop();

        while (pathArray2.length) {

          uriArray.push(
            uri.prePath +
            pathArray.join("/") +
            "/" +
            pathArray2.join(".")
          );

          pathArray2.pop();
        }
      }
    }

    return uriArray;
  }

})();