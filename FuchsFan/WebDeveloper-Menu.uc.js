// WebDeveloper-Menu.uc.js
// Firefox 148+
// Komplette Browser-Tools-Struktur, korrekt aus menuWebDeveloperPopup aufgebaut.

(function () {
  if (location.href !== "chrome://browser/content/browser.xhtml") {
    return;
  }

  const MENU_INIT_ID = "browserToolsMenu";
  const SRC_POPUP_ID = "menuWebDeveloperPopup";
  const DST_ID = "context-browserToolsMenu";

  function ensureDevToolsMenuReady() {
    const menu = document.getElementById(MENU_INIT_ID);
    const popup = document.getElementById(SRC_POPUP_ID);

    if (!menu || !popup) {
      return null;
    }

    // Firefox initialisiert DevTools beim popupshowing von browserToolsMenu.
    if (popup.childElementCount <= 5) {
      const { require } = ChromeUtils.importESModule(
        "resource://devtools/shared/loader/Loader.sys.mjs",
        {}
      );
      require("resource://devtools/client/framework/devtools-browser.js");

      menu.dispatchEvent(
        new Event("popupshowing", { bubbles: true, cancelable: true })
      );
    }

    return document.getElementById(SRC_POPUP_ID);
  }

  function copyAttributes(src, dst) {
    for (const attr of src.attributes) {
      const name = attr.name;

      if (name === "id") {
        continue;
      }
      if (name.startsWith("on")) {
        continue;
      }

      dst.setAttribute(name, attr.value);
    }
  }

  function buildNode(srcNode, doc) {
    const tag = srcNode.tagName.toLowerCase();

    if (tag === "menuseparator") {
      const sep = doc.createXULElement("menuseparator");
      if (srcNode.id) {
        sep.id = "context-" + srcNode.id;
      }
      copyAttributes(srcNode, sep);
      return sep;
    }

    if (tag === "menuitem") {
      const item = doc.createXULElement("menuitem");

      if (srcNode.id) {
        item.id = "context-" + srcNode.id;
      }

      copyAttributes(srcNode, item);

      item.addEventListener("command", (event) => {
        event.stopPropagation();

        const orig = document.getElementById(srcNode.id);
        if (!orig) {
          return;
        }

        if (typeof orig.doCommand === "function") {
          orig.doCommand();
        } else if (typeof orig.click === "function") {
          orig.click();
        }
      });

      return item;
    }

    if (tag === "menu") {
      const menu = doc.createXULElement("menu");

      if (srcNode.id) {
        menu.id = "context-" + srcNode.id;
      }

      copyAttributes(srcNode, menu);

      const popup = doc.createXULElement("menupopup");
      popup.setAttribute("incontentshell", "false");

      for (const child of srcNode.children) {
        const built = buildNode(child, doc);
        if (built) {
          popup.appendChild(built);
        }
      }

      menu.appendChild(popup);
      return menu;
    }

    // menupopup / andere Container werden bewusst nicht direkt gebaut,
    // sondern über ihre Kinder verarbeitet.
    return null;
  }

  function rebuildContextMenu() {
    const srcPopup = ensureDevToolsMenuReady();
    if (!srcPopup) {
      return;
    }

    const old = document.getElementById(DST_ID);
    if (old) {
      old.remove();
    }

    const contextMenu = document.getElementById("contentAreaContextMenu");
    const refNode = document.getElementById("context-viewsource");

    if (!contextMenu || !refNode) {
      return;
    }

    const wrapper = document.createXULElement("menu");
    wrapper.id = DST_ID;
    wrapper.setAttribute("label", "Web-Entwicklung");
    wrapper.setAttribute("accesskey", "W");

    const popup = document.createXULElement("menupopup");
    popup.setAttribute("incontentshell", "false");

    for (const child of srcPopup.children) {
      const built = buildNode(child, document);
      if (built) {
        popup.appendChild(built);
      }
    }

    wrapper.appendChild(popup);
    contextMenu.insertBefore(wrapper, refNode);
  }

  window.addEventListener(
    "popupshowing",
    (event) => {
      if (event.target && event.target.id === "contentAreaContextMenu") {
        rebuildContextMenu();
      }
    },
    true
  );
}());