// ==UserScript==
// 
// @description      Displays target URL in tooltip, when hovering over a link
// Button has “tooltips on”/“tooltips off” positions
// ==/UserScript==
try {CustomizableUI.createWidget(({
    label: "Links in pop-up tooltips", localized: false,
    id: "URLTooltip", pref: "URLTooltip.enabled",
    get state() {
        return Services.prefs.getBoolPref(this.pref, true); // по-умолчанию включено
    },
    setIcon(btn, state = this.state) {
        btn.setAttribute("image", "data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' style='fill:context-fill rgb(142, 142, 152);'><path d='M9.618 6.721a2.483 2.483 0 0 0-.39-.317l-.735.734A1.486 1.486 0 0 1 8.91 9.55l-2.12 2.122a1.486 1.486 0 0 1-2.122 0 1.486 1.486 0 0 1 0-2.121l.605-.605a3.53 3.53 0 0 1-.206-1.209L3.961 8.843a2.506 2.506 0 0 0 0 3.535 2.506 2.506 0 0 0 3.535 0l2.122-2.121a2.506 2.506 0 0 0 0-3.536z'/><path d='M6.79 9.55c.12.121.25.226.389.317l.734-.734a1.486 1.486 0 0 1-.417-2.411L9.618 4.6a1.486 1.486 0 0 1 2.121 0 1.486 1.486 0 0 1 0 2.121l-.605.605c.137.391.211.798.206 1.209l1.106-1.107a2.506 2.506 0 0 0 0-3.535 2.506 2.506 0 0 0-3.535 0L6.789 6.014a2.506 2.506 0 0 0 0 3.536z'/><circle style='fill:none;stroke:context-fill rgb(142, 142, 152);stroke-width:1.2;stroke-linecap:round;stroke-linejoin:round' cx='8' cy='8' r='7.4'/></svg>");
        btn.style.setProperty("fill", `${state ? "color-mix(in srgb, currentColor 20%, #e31b5d)" : ""}`);
    },
    onCreated(btn) {
        this.setIcon(btn), this.btn = btn, btn.owner = this;
        //btn.setAttribute("oncommand", "owner.toggle()");
			btn.addEventListener('command', () => {
				this.toggle();						
		});
       		btn.addEventListener('mouseenter', () => {
				this.mouseenter();						
		});
		
    },
    mouseenter() {
        this.btn.tooltipText = this.label +' – '+ `${this.state ? "enabled" : "disabled"}`;
    },
    toggle() {
        Services.prefs.setBoolPref(this.pref, !this.state);
    },
    observe(s, topic) {
        if (topic.startsWith("q")) return this.destroy();
        var {state} = this;
        for(var {node} of CustomizableUI.getWidget(this.id).instances)
            this.setIcon(node, state);
        state ? this.initTooltip() : this.destroyTooltip();
    },
    init() {
        Services.prefs.addObserver(this.pref, this);
        Services.obs.addObserver(this, "quit-application-granted", false);
        this.state && this.initTooltip();
        delete this.init; return this;
    },
    destroy() {
        Services.prefs.removeObserver(this.pref, this);
        Services.obs.removeObserver(this, "quit-application-granted");
    },
    initTooltip() {
        var url = this.initURL = this.createURL("psInit");
        (this.initTooltip = () => Services.ppmm.loadProcessScript(url, true))();
    },
    destroyTooltip() {
        var url = this.createURL("psDestroy");
        (this.destroyTooltip = () => {
            Services.ppmm.removeDelayedProcessScript(this.initURL);
            Services.ppmm.loadProcessScript(url, false);
        })();
        delete this.createURL;
    },
    createURL: function createURL(meth) {
        var subst = this.id + "-" + meth;
        (createURL.rph || (createURL.rph = Services.io.getProtocolHandler("resource")
                .QueryInterface(Ci.nsIResProtocolHandler)
        )).setSubstitution(subst, Services.io.newURI("data:text/javascript;charset=utf-8," + encodeURIComponent(
            `(${this[meth]})(ChromeUtils.importESModule("resource://gre/modules/TooltipTextProvider.sys.mjs").TooltipTextProvider.prototype)`
        )));
        delete this[meth]; return "resource://" + subst;
    },
    psInit: proto => {
        if (proto.getTextPlus) return proto.getNodeText = proto.getTextPlus.newGetNodeText;
        //================[ start content ]================
        proto.getTextPlus = node => {
            var href = getHref(node);
            if (!href || href == "#" || skipRe.test(href)) return;
            if (href.startsWith("data:")) return crop(href, 64);
            return crop(decode(href));
        }
        var skipRe = /^(?:javascript|addons):/;
        var getHref = node => {do {
            if (HTMLAnchorElement.isInstance(node) && node.href) return node.href;
        } while (node = node.flattenedTreeParentNode)}
        var crop = (url, max = 128) => url.length <= max
            ? url : url.slice(0, --max) + "\u2026"; // ellipsis
        var decode = url => {
            var ios = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);
            var ldu = ChromeUtils.importESModule("resource:///modules/UrlbarInput.sys.mjs", {}).losslessDecodeURI;
            return (decode = url => {try {return ldu(ios.newURI(url));} catch {return url;}})(url);
        }
        //================[ end content ]==================
        var func = proto.getTextPlus.getNodeText = proto.getNodeText;
        proto.getTextPlus.newGetNodeText = proto.getNodeText = function(node, text) {
            var res = func.apply(this, arguments);
            if (!res && !(node?.localName != "browser" && node.ownerGlobal && node.ownerDocument))
                return false;
            var txt = this.getTextPlus(node), add = "";
            return txt ? text.value = res ? text.value + "\n" + txt + add : txt + add : res;
        }
    },
    psDestroy: proto => {
        proto.getNodeText = proto.getTextPlus.getNodeText;
    }
}).init())} catch(ex) {Cu.reportError(ex);}
