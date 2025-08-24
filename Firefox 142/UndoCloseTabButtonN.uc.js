// ==UserScript==
// @name			UndoCloseTabButtonN
// @description		Schaltfläche „Geschlossene Tabs wiederherstellen“ in der Symbolleiste und mittlerer Klick auf einen leeren Bereich in der Tab-Leiste, um den zuletzt geschlossenen Tab wiederherzustellen
// @version			1.2.10
// @include			main
// @charset			UTF-8
// @node			  2025/07/28 Fx141 undoCloseTab() undoCloseWindow() → SessionWindowUI, Fx142 range → removeChild
// @note        2025/01/21 Fx136
// @note        2024/10/04 Fx131
// @note        2023/07/10 Fx115
// @note            2021/12/12 Fx95 SessionStore.getClosedTabData / getClosedWindowData 
// @note            2022/11/12 Verhalten der linken, mittleren und rechten Taste ändern
// @note            2021/12/12 Fx95 SessionStore.getClosedTabData / getClosedWindowData Der Rückgabewert wurde von JSON in Array geändert.
// @note            2019/01/23 Fx66 Problem, bei dem das Klicken in die Tableiste nicht funktionierte - behoben
// @note            2019/07/04 Fx69
// @note            2019/09/03 Fx70
// @note            2019/12/09 Fx72
// ==/UserScript==
// Schaltfläche wird standardmäßig in die Tableiste eingefügt.
(function() {
	"use strict";

	const useTabbarMiddleClick = false;	//Mit Mittelklick letzten geschlossenen Tab wieder herstellen. true = ja, false = nein

	const XULNS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";

	window.ucjsUndoCloseTabButtonService = {
		prepareMenu(event) {
			const win = event.view || window;
			const doc = win.document;
			const menu = event.originalTarget;
			this.removeChilds(menu);

			// Geschlossene Tabs
			let data = SessionStore.getClosedTabDataForWindow?
				SessionStore.getClosedTabDataForWindow(win):
				SessionStore.getClosedTabData(win);
			if (typeof(data) === "string") {
				data = JSON.parse(data);
			}
			const tabLength = data.length;

			for (let i = 0; i < tabLength; i++) {
				const item = data[i];
				const m = this.createFaviconMenuitem(doc, item.title, item.image, i, ucjsUndoCloseTabButtonService.undoTab);

				const state = item.state;
				let idx = state.index;
				if (idx == 0)
					idx = state.entries.length;
				if (--idx >= 0 && state.entries[idx])
					m.setAttribute("targetURI", state.entries[idx].url);

				menu.appendChild(m);
			}

			// Geschlossenes Fenster
			data = SessionStore.getClosedWindowData();
			if (typeof(data) === "string") {
				data = JSON.parse(data);
			}
			const winLength = data.length;
			if (winLength > 0) {
				if (tabLength > 0)
					menu.appendChild(this.$C(doc, "menuseparator"));

				menu.appendChild(this.$C(doc, "menuitem", {
					disabled:	true,
					label:		"Geschlossenes Fenster"
				}));

				for (let i = 0; i < winLength; i++) {
					const item = data[i];

					let title = item.title;
					const tabsCount = item.tabs.length - 1;
					if (tabsCount > 0)
						title += " (他:" + tabsCount + ")";

					const tab = item.tabs[item.selected - 1];

					const m = this.createFaviconMenuitem(doc, title, tab.image, i, ucjsUndoCloseTabButtonService.undoWindow);
					menu.appendChild(m);
				}
			}

			if (tabLength + winLength === 0) {
				/*menu.appendChild(this.$C(doc, "menuitem", {
					disabled: true,
					label	: "履歴がありません"
				}));*/
				event.preventDefault();
			}
		},

		createFaviconMenuitem(doc, label, icon, value, command) {
			const attr = {
				class:	"menuitem-iconic bookmark-item menuitem-with-favicon",
				label:	label,
				value:	value
			};
			if (icon) {
				if (/^https?:/.test(icon))
					icon = "moz-anno:favicon:" + icon;
				attr.image = icon;
			}
			const m = this.$C(doc, "menuitem", attr);
			m.addEventListener("command", command, false);
			return m;
		},

		undoTab(event) {
			const win = event.view || window;
			const index = event.originalTarget.getAttribute("value");
			if (typeof SessionWindowUI !== "undefined") {
				SessionWindowUI.undoCloseTab(win, index);
			} else {
				win.undoCloseTab(index);
			}
		},
		undoWindow(event) {
			const index = event.originalTarget.getAttribute("value");
			if (typeof SessionWindowUI !== "undefined") {
				SessionWindowUI.undoCloseWindow(index);
			} else {
				undoCloseWindow(index);
			}
		},
		removeChilds(element) {
			while (element.firstChild){
				element.removeChild(element.firstChild);
			}
		},

		onClick(event) {
			if (event.button === 1) {
				//console.log(event.originalTarget.localName)
				switch (event.originalTarget.localName) {
				case "box":	// -Fx65
				case "scrollbox":	// Fx66-
				case "slot":	// Fx131-
				case "toolbarbutton":
					event.preventDefault();
					event.stopPropagation();
					document.getElementById("History:UndoCloseTab").doCommand();
					break;
				}
			}
		},

		$C(doc, tag, attrs) {
			const e = tag instanceof Node? tag: doc.createElementNS(XULNS, tag);
			if (attrs) {
				Object.entries(attrs).forEach(([key, value]) => e.setAttribute(key, value));
			}
			return e;
		},
	};

	function run() {
		if (useTabbarMiddleClick) {
			gBrowser.tabContainer.addEventListener("click", ucjsUndoCloseTabButtonService.onClick.bind(ucjsUndoCloseTabButtonService), true);
		}

		const buttonId = "ucjs-undo-close-tab-button";

		if (document.getElementById(buttonId)) {
			return;
		}

		try {
			try {
				ChromeUtils.importESModule("resource:///modules/CustomizableUI.sys.mjs");
			} catch (e) {}
			CustomizableUI.createWidget({
				id			: buttonId,
				defaultArea	: CustomizableUI.AREA_TABSTRIP,
				type		: "custom",
				onBuild		: doc => {
					const btn = ucjsUndoCloseTabButtonService.$C(doc, "toolbarbutton", {
						id				: buttonId,
						class			: "toolbarbutton-1 chromeclass-toolbar-additional",
						type			: "menu",
						anchor			: "dropmarker",
						label			: "Geschlossene Tab",
						tooltiptext		: "Geschlossene Tabs\nMit mittlerer Maustaste, letzten geschlossenen Tab wiederherstellen",
						image			: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIj4KICAgIDxwYXRoIHN0cm9rZS13aWR0aD0iMjQiIGZpbGw9IiM1NTU1NTUiIHN0cm9rZT0iI2ZmZmZmZiIgZD0iTSA2IDQ4MCBsIDUwMCAwIGwgMCAtNjAgbCAtNTAgMCBsIDAgLTIyMCBsIC00MDAgMCBsIDAgMjIwIGwgLTUwIDAgeiIvPgogICAgPHBhdGggc3Ryb2tlLXdpZHRoPSIzMCIgZmlsbD0iIzQ0ODhmZiIgc3Ryb2tlPSIjZGRlZWZmIiBkPSJNIDI3MiAzMiBsIC0xNjAgMTMwIGwgMTYwIDEzMCBsIDAgLTc1IGwgNjAgMCBhIDYwIDYwIDAgMCAxIDAgMTIwIGwgLTIwIDAgbCAwIDExMCBsIDIwIDAgYSAxNzAgMTcwIDAgMCAwIDAgLTM0MCBsIC02MCAwIHoiLz4KPC9zdmc+",
					});
					btn.addEventListener("click", ucjsUndoCloseTabButtonService.onClick.bind(ucjsUndoCloseTabButtonService));

					const menu = ucjsUndoCloseTabButtonService.$C(doc, "menupopup", {
						tooltip				: "bhTooltip",
						popupsinherittooltip: "true",
					});
					menu.addEventListener("popupshowing", ucjsUndoCloseTabButtonService.prepareMenu.bind(ucjsUndoCloseTabButtonService));
					btn.appendChild(menu);
					return btn;
				},
			});
		} catch (e) {
			console.error(e);
		}
	}

	if (gBrowserInit.delayedStartupFinished) {
		run();
	} else {
		const OBS_TOPIC = "browser-delayed-startup-finished";
		const delayedStartupFinished = (subject, topic) => {
			if (topic === OBS_TOPIC && subject === window) {
				Services.obs.removeObserver(delayedStartupFinished, topic);
				run();
			}
		};
		Services.obs.addObserver(delayedStartupFinished, OBS_TOPIC);
	}
})();
