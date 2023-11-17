// ==UserScript==
// @name           Show addon details in about:addons
// @include        main
// ==/UserScript==

if (typeof window === "undefined" || globalThis !== window) {
    this.EXPORTED_SYMBOLS = ["AboutAddonsVerboseChild"];
    ChromeUtils.defineModuleGetter(this, "AddonManager", "resource://gre/modules/AddonManager.jsm");
    try {
        ChromeUtils.registerWindowActor("AboutAddonsVerbose", {
            child: {
                moduleURI: __URI__,
                events: {
                    DOMDocElementInserted: {},
                },
            },
            matches: ["about:addons"],
        });
    } catch (e) {Cu.reportError(e);}
    this.AboutAddonsVerboseChild = class extends JSWindowActorChild {
        handleEvent({type}) {
            if (type !== "DOMDocElementInserted") return;
            const win = this.contentWindow;
            const doc = win.document;
            doc.addEventListener("view-loaded", () => {
                const addons = doc.querySelectorAll(".addon-name");
                for (let addon of addons) {
                    const addonId = addon.querySelector("a")?.href.slice("addons://detail/".length);
                    if (addonId) AddonManager.getAddonByID(addonId).then(result => {
                        const {version, updateDate} = result;
                        const info = doc.createElement("span");
                        info.style.fontSize = "1rem";
                        info.style.fontStyle = "normal";
						info.style.fontWeight = "900";
                        info.style.marginInlineEnd = "8px";
                        info.textContent = `${version} - ${updateDate.toLocaleDateString("de-DE")}`;
                        addon.insertAdjacentElement("afterend", info);
                    }).catch(err => Cu.reportError(err));
                }
            });
        }
    };
}
else {
    try {
        const fileHandler = Services.io.getProtocolHandler("file").QueryInterface(Ci.nsIFileProtocolHandler);
        const scriptFile = fileHandler.getFileFromURLSpec(Components.stack.filename);
        const resourceHandler = Services.io.getProtocolHandler("resource").QueryInterface(Ci.nsIResProtocolHandler);
        if (!resourceHandler.hasSubstitution("about-addons-verbose-ucjs")) {
            resourceHandler.setSubstitution("about-addons-verbose-ucjs", Services.io.newFileURI(scriptFile.parent));
        }
        ChromeUtils.import(`resource://about-addons-verbose-ucjs/${scriptFile.leafName}?${scriptFile.lastModifiedTime}`);
    } catch (e) {Cu.reportError(e)}
}
