// ==UserScript== 
// @name           MemoryMonitorMod.uc.js
// @description    Einfacher FF-Speicher-Monitor
// @include        main
// @charset        UTF-8
// @note           Basiert auf dem Script MemoryMonitorMod.uc.js Funktioniert auch mit FF57+
// ==/UserScript==
var ucjsMM = {
  // Update-Intervall[ms]
  _interval: 5000,
  // Neustart bei maximaler Speichernutzung (Achtung! Anpassen an die darunter gewählte Speichereinheit)
  _maxMemory: 1500,
  // Speicher-Einheit: B, KB, KiB, MB, MiB, GB, GiB
  _prefix: " MB",
  // Speicher-Einheitanzeige in der Statusbar
  _dPrefix: true,
  // automatischen Restart bei Überschreitung von _maxMemory durchführen
  _autoRestart: false,

	interval : null,
	init : function () {
/*
		var memoryPanel = document.createElement('statusbarpanel');
		memoryPanel.id = 'MemoryDisplay';
		memoryPanel.setAttribute('label', ucjsMM._MemoryValue + ucjsMM._prefix);
		memoryPanel.setAttribute('tooltiptext', 'Speicher Monitor. Klick öffnet about:memory');
*/
		var memoryPanel = document.createElement('toolbaritem');
		memoryPanel.id = 'MemoryDisplay';
		var label = document.createElement('label');
		label.setAttribute('value', ucjsMM._MemoryValue + ucjsMM._prefix);
		memoryPanel.appendChild(label);

	//  document.getElementById('bottom-toolbar').insertBefore(memoryPanel, document.getElementById('eom-button'));
	    document.getElementById('nav-bar-customization-target').insertBefore(memoryPanel, document.getElementById('search-container'));
	//  document.getElementById('addon-bar').insertBefore(memoryPanel, document.getElementById('uAutoPagerize-icon'));
	//  document.getElementById('urlbar-icons').insertBefore(memoryPanel, document.getElementById('uAutoPagerize-icon'));
		this.start();
		this.interval = setInterval(this.start, this._interval);
	},
	start : function () {
		try {
			const Cc = Components.classes;
			const Ci = Components.interfaces;
			var MemReporters = Cc['@mozilla.org/memory-reporter-manager;1'].getService(Ci.nsIMemoryReporterManager);
			var workingSet = MemReporters.resident;
			ucjsMM._MemoryValue = Math.round(workingSet / (1024 * 1024));
			var restartMemory = ucjsMM._MaxMemory * 1024 * 1024;
			var memoryPanel = document.getElementById('MemoryDisplay');

//			memoryPanel.setAttribute('label', ucjsMM.addFigure(ucjsMM._MemoryValue) + ucjsMM._prefix);

			memoryPanel.firstChild.setAttribute('value', ucjsMM.addFigure(ucjsMM._MemoryValue) + ucjsMM._prefix);   
      
			memoryPanel.setAttribute('onclick', "openUILinkIn('about:memory','tab')");
			if (workingSet > restartMemory) {
				if (memoryPanel.style.backgroundColor == 'red' && ucjsMM._autoRestart)
					ucjsMM.restart();
				else
					memoryPanel.style.backgroundColor = 'red';
			} else if (workingSet > restartMemory * 0.8)
				memoryPanel.style.backgroundColor = '#FF99FF';
			else if (workingSet > restartMemory * 0.6)
				memoryPanel.style.backgroundColor = '#FFFF99';
			else
				memoryPanel.style.backgroundColor = 'transparent';
		} catch (ex) {
			clearInterval(ucjsMM.interval);
		}
	},
	addFigure : function (str) {
		var num = new String(str).replace(/,/g, '');
		while (num != (num = num.replace(/^(-?\d+)(\d{3})/, '$1,$2')));
		return num;
	},
	restart : function () {
		var appStartup = Components.interfaces.nsIAppStartup;
		Components.classes['@mozilla.org/toolkit/app-startup;1'].getService(appStartup).quit(appStartup.eRestart | appStartup.eAttemptQuit);
	},
}
ucjsMM.init();
