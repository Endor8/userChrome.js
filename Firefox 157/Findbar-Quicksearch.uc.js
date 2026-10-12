// ==UserScript==
// @name           Findbar-Quicksearch.uc.js - Schnell-Suche mit Auto-Close Funktion
// @description    Tippe irgendwo einen Buchstaben – die VOLLSTÄNDIGE Firefox-Suchleiste
//                 (mit Pfeilen, Groß-/Kleinschreibung, Hervorheben usw.) öffnet sich,
//                 der Buchstabe steht bereits im Suchfeld, du tippst einfach weiter.
//                 Geschlossen wird nur noch per Klick auf die Seite (oder Escape/X).
// @compatibility  Firefox 157+
// @author         Mira Bellenbaum mit Hilfe von Mistral (KI)
// @version        2026.10.12
// ==/UserScript==
//
// =====================================================================
//  WIE ES FUNKTIONIERT (Quellcode: toolkit/content/widgets/findbar.js)
// =====================================================================
//
//  1. „Beim Tippen automatisch im Seitentext suchen“
//     (accessibility.typeaheadfind) lässt beim Tippen die Quick-Find-Leiste
//     aufgehen – der Buchstabe steht sofort im Suchfeld.
//
//  2. Die Quick-Find-Leiste sieht minimal aus, weil _updateFindUI() bei
//     findMode != FIND_NORMAL alle Elemente außer Textfeld und Trefferzähler
//     auf hidden setzt.
//     → Zwei unabhängige Mechanismen blenden alles wieder ein:
//       a) Prototyp-Patch: nach jedem Original-_updateFindUI
//       b) findbaropen-Event: direkt an der geöffneten Instanz
//
//  3. Navigation durch die Treffer (solange die Leiste geöffnet ist),
//     einzeln schaltbar über die KONFIGURATION unten:
//       - Scrollrad über der Leiste      (scrollNavigation)
//       - Enter = weiter / Shift+Enter = zurück (enterNavigation)
//       - Pfeiltasten ↑/↓ = zurück/weiter (arrowKeyNavigation)
//     Alle Varianten nutzen die FindBar-Methode
//     onFindAgainCommand(true = zurück / false = weiter).
//
//  4. Schließen bei Klick auf die Seite – nativ in Firefox enthalten
//     (findbar.js: onMouseUp schließt die Quick-Find-Leiste selbst).
//
//  FEHLERSUCHE: Alle Meldungen erscheinen IMMER in der Browser-Konsole
//  (Strg+Umschalt+J), gefiltert nach „Schnell-Suche“.
//
// =====================================================================

'use strict';

// =====================================================================
//  KONFIGURATION
// =====================================================================

const CONFIG = {

  // Beim Tippen im Seitentext suchen (Type-Ahead-Find) aktiviert lassen?
  enableTypeAhead: true, /* false => die Leiste muss manuell aktiviert werden */

  // Auto-Close-Timer abschalten? (true = Leiste bleibt offen bis Klick)
  disableAutoClose: true, /* false => die Leiste schließt nach vorgegebener Zeit */

  // Nur relevant, falls disableAutoClose = false:
  autoCloseTimeoutMs: 5000,

  // Navigation durch die Treffer – einzeln schaltbar:

  // Scrollrad über der Leiste: runter = weiter, hoch = zurück
  scrollNavigation: true, /* true => ON, false => OFF */

  // Enter = nächster Treffer, Shift+Enter = vorheriger Treffer
  enterNavigation: true, /* true => ON, false => OFF */

  // Pfeiltasten: ↓ = nächster Treffer, ↑ = vorheriger Treffer
  arrowKeyNavigation: true, /* true => ON, false => OFF */

};

// =====================================================================
//  AB HIER NICHTS MEHR ÄNDERN
// =====================================================================

(function SchnellSucheVollstaendigeLeiste() {

  const LOG = '[Schnell-Suche] ';
  const CE_NAME = 'findbar';
  const MAX_TRIES = 60;            // 60 × 500 ms = max. 30 Sekunden warten

  // In allen Fenstern ausführen
  if (window.gBrowser && !CustomizableUI.getWidget("ExtraConfigMenu-button"))
    return;
  console.log(LOG + '2026.10.10 geladen, Initialisierung läuft …');

  function fail(aMsg, aErr) {
    console.error(LOG + aMsg, aErr);
  }

  // -----------------------------------------------------------------
  //  Kernroutine: an einer konkreten FindBar-Instanz alles einblenden
  // -----------------------------------------------------------------
  function showFullUI(aFb) {
    if (!aFb)
      return false;

    let ok = true;

    // a) Alle Kinder des Containers sichtbar schalten
    try {
      let container = aFb.getElement
        ? aFb.getElement('findbar-container')
        : aFb.querySelector('.findbar-container');
      if (!container) {
        fail('findbar-container nicht gefunden! Verfügbare Struktur:', aFb.outerHTML.slice(0, 600));
        ok = false;
      } else {
        for (let node of container.children) {
          node.hidden = false;
        }
      }
    } catch (err) {
      fail('Fehler beim Einblenden der Container-Kinder: ', err);
      ok = false;
    }

    // b) Pfeile „Weiter“ / „Zurück“
    try {
      let next = aFb.getElement ? aFb.getElement('find-next')
                                : aFb.querySelector('[anonid="find-next"], .findbar-find-next');
      let prev = aFb.getElement ? aFb.getElement('find-previous')
                                : aFb.querySelector('[anonid="find-previous"], .findbar-find-previous');
      if (next) next.hidden = false;
      if (prev) prev.hidden = false;
    } catch (err) {
      fail('Fehler beim Einblenden der Pfeile: ', err);
      ok = false;
    }

    // c) Die drei Options-Checkboxen werden NICHT vom Container-Durchlauf
    //     erfasst, weil _updateCaseSensitivity(), _updateDiacriticMatching()
    //     und _setEntireWord() sie im Quick-Find-Modus explizit auf
    //     hidden = true setzen (findbar.js: „Show the checkbox on the full
    //     Find bar in non-auto mode“). Deshalb hier einzeln einblenden:
    try {
      const TOGGLES = ['find-case-sensitive', 'find-match-diacritics',
                       'find-entire-word'];
      for (let id of TOGGLES) {
        let cb = aFb.getElement ? aFb.getElement(id)
                                : aFb.querySelector('[anonid="' + id + '"]');
        if (cb) cb.hidden = false;
      }
    } catch (err) {
      fail('Fehler beim Einblenden der Options-Checkboxen: ', err);
      ok = false;
    }

    // d) Schmalen Quick-Find-Look des Textfeldes zurücknehmen
    try {
      if (aFb._findField)
        aFb._findField.classList.remove('minimal');
    } catch (err) {
      fail('Fehler beim Zurücksetzen des Textfeld-Looks: ', err);
      ok = false;
    }

    // e) Leeren Trefferzähler nicht als leeres Element zeigen
    try {
      let fm = aFb._foundMatches;
      if (fm && !fm.value)
        fm.hidden = true;
    } catch (err) { /* unkritisch */ }

    return ok;
  }

  // -----------------------------------------------------------------
  //  1)  Prefs setzen (User-Zweig – gewinnt immer)
  // -----------------------------------------------------------------
  try {
    Services.prefs.setBoolPref('accessibility.typeaheadfind',
                               CONFIG.enableTypeAhead);
    Services.prefs.setIntPref('accessibility.typeaheadfind.timeout',
                              CONFIG.disableAutoClose ? 0 : CONFIG.autoCloseTimeoutMs);
    Services.prefs.setBoolPref('accessibility.typeaheadfind.enablesound',
                               false);
    console.log(LOG + 'Prefs gesetzt: typeaheadfind=' +
      Services.prefs.getBoolPref('accessibility.typeaheadfind') +
      ', timeout=' + Services.prefs.getIntPref('accessibility.typeaheadfind.timeout') + 'ms');
  } catch (err) {
    fail('Konnte Prefs nicht setzen: ', err);
  }

  // -----------------------------------------------------------------
  //  2a)  Mechanismus 1: Prototyp-Patch auf _updateFindUI
  // -----------------------------------------------------------------
  let patched = false;

  function patchFindbarClass() {
    let findbarClass = customElements.get(CE_NAME);
    if (!findbarClass)
      return false;

    const origUpdateFindUI = findbarClass.prototype._updateFindUI;
    if (typeof origUpdateFindUI !== 'function') {
      fail('findbar-Klasse gefunden, aber _updateFindUI fehlt – ' +
           'Firefox-Update mit umbenannter Methode?');
      return true; // nicht endlos weiterversuchen
    }

    findbarClass.prototype._updateFindUI = function (...aArgs) {
      try {
        origUpdateFindUI.apply(this, aArgs);
      } catch (err) {
        fail('Original-_updateFindUI warf einen Fehler: ', err);
      }
      showFullUI(this);
    };

    // Die drei Checkboxen werden bei JEDEM Such-Update (also jedem
    // getippten Zeichen) durch updateControlState erneut versteckt.
    // Deshalb zusätzlich diese drei Methoden patchen – nach dem
    // Original-Aufruf die Checkbox immer wieder einblenden:
    const TOGGLE_METHODS = {
      _updateCaseSensitivity:  'find-case-sensitive',
      _updateDiacriticMatching: 'find-match-diacritics',
      _setEntireWord:          'find-entire-word',
    };
    for (let [methodName, anonId] of Object.entries(TOGGLE_METHODS)) {
      let orig = findbarClass.prototype[methodName];
      if (typeof orig !== 'function') {
        fail('Methode ' + methodName + ' nicht gefunden – umbenannt?');
        continue;
      }
      findbarClass.prototype[methodName] = function (...aArgs) {
        try {
          orig.apply(this, aArgs);
        } catch (err) {
          fail('Original-' + methodName + ' warf einen Fehler: ', err);
        }
        try {
          let cb = this.getElement ? this.getElement(anonId)
                                    : this.querySelector('[anonid="' + anonId + '"]');
          if (cb) cb.hidden = false;
          // zugehöriges Status-Label bleibt unsichtbar (nur für die
          // vollständige Leiste ohne Checkbox vorgesehen)
        } catch (err) { /* unkritisch */ }
      };
    }

    patched = true;
    console.log(LOG + 'Mechanismus 1 aktiv: _updateFindUI gepatcht.');
    return true;
  }

  function waitForFindbar(aTries) {
    if (patched)
      return;
    if (patchFindbarClass())
      return;
    if (aTries >= MAX_TRIES) {
      fail('findbar-Custom-Element wurde nach 30 Sekunden nicht registriert.');
      return;
    }
    setTimeout(() => waitForFindbar(aTries + 1), 500);
  }

  waitForFindbar(0);

  // -----------------------------------------------------------------
  //  2b)  Mechanismus 2: findbaropen-Event direkt abfangen.
  //       Das Event wird beim Öffnen auf der FindBar dispatched
  //       (findbar.js: event.initEvent("findbaropen", true, false)).
  // -----------------------------------------------------------------
  document.addEventListener('findbaropen', function (aEvent) {
    let fb = aEvent.target;
    console.log(LOG + 'findbaropen erkannt, blende vollständige Leiste ein …');
    showFullUI(fb);
    enableWheelScrolling(fb);   // 3) Scrollrad-Blättern aktivieren /* Mira */

    // Sicherheitsnetz: nochmals nach einem kurzen Moment, falls
    // interne Aufrufe die Elemente nach dem Öffnen erneut verstecken.
    setTimeout(() => showFullUI(fb), 100);
    setTimeout(() => showFullUI(fb), 400);
  }, true);

  // -----------------------------------------------------------------
  //  3)  Navigation: Scrollrad / Enter / Pfeiltasten
  //      Gemeinsame FindBar-API: onFindAgainCommand(true = zurück,
  //      false = weiter) – das ist der interne Command-Handler der
  //      Pfeil-Buttons (findbar.js).
  // -----------------------------------------------------------------

  //  3a) Scrollrad über der Leiste: runter = weiter, hoch = zurück
  const WHEEL_FLAG = '_schnellSucheWheel';

  function enableWheelScrolling(aFb) {
    if (!CONFIG.scrollNavigation)
      return;
    if (!aFb || aFb[WHEEL_FLAG])
      return;                       // Listener schon angehängt
    aFb[WHEEL_FLAG] = true;

    aFb.addEventListener('wheel', function (aEvent) {
      // Nur bei vorhandenem Suchbegriff blättern
      if (!aFb._findField || !aFb._findField.value)
        return;

      aEvent.preventDefault();
      aEvent.stopPropagation();

      if (aEvent.deltaY > 0) {
        // Rad nach unten → nächster Treffer
        try { aFb.onFindAgainCommand(false); } catch (e) {
          let btn = aFb.getElement && aFb.getElement('find-next');
          if (btn) btn.click();
        }
      } else {
        // Rad nach oben → vorheriger Treffer
        try { aFb.onFindAgainCommand(true); } catch (e) {
          let btn = aFb.getElement && aFb.getElement('find-previous');
          if (btn) btn.click();
        }
      }
    }, { passive: false });
  }

  //  3b) Enter = nächster Treffer, Shift+Enter = vorheriger Treffer,
  //      Pfeiltasten ↑/↓ = zurück/weiter – nur bei offener Leiste.
  if (CONFIG.enterNavigation || CONFIG.arrowKeyNavigation) {
    window.addEventListener('keydown', function (aEvent) {
      if (aEvent.ctrlKey || aEvent.altKey || aEvent.metaKey)
        return;

      let fb = window.gFindBar || window.gBrowser.getCachedFindBar();
      if (!fb || fb.hidden)
        return;
      if (!fb._findField || !fb._findField.value)
        return;

      // Shift+Enter → vorheriger Treffer
      if (CONFIG.enterNavigation &&
          aEvent.key === 'Enter' && aEvent.shiftKey) {
        aEvent.preventDefault();
        fb.onFindAgainCommand(true);
        return;
      }

      switch (aEvent.key) {
        case 'Enter':
        case 'ArrowDown':
          if ((aEvent.key === 'Enter'    && !CONFIG.enterNavigation) ||
              (aEvent.key === 'ArrowDown' && !CONFIG.arrowKeyNavigation))
            return;
          aEvent.preventDefault();
          fb.onFindAgainCommand(false);   // nächster Treffer
          break;

        case 'ArrowUp':
          if (!CONFIG.arrowKeyNavigation)
            return;
          aEvent.preventDefault();
          fb.onFindAgainCommand(true);    // vorheriger Treffer
          break;
      }
    }, true);
  }

  // -----------------------------------------------------------------
  //  4)  Schließen bei Klick auf die Seite: NICHT nötig!
  //      Firefox erledigt das nativ selbst – findbar.js schließt die
  //      Quick-Find-Leiste bei Mouse-up im Seiteninhalt:
  //        onMouseUp() { if (!this.hidden &&
  //                       this.findMode != this.FIND_NORMAL) this.close(); }
  //      Die normale Strg+F-Leiste bleibt bei Klick geöffnet (nativ).
  // -----------------------------------------------------------------

  console.log(LOG + 'Initialisierung abgeschlossen. Navigation: Scrollrad=' +
      CONFIG.scrollNavigation + ', Enter=' + CONFIG.enterNavigation +
      ', Pfeiltasten=' + CONFIG.arrowKeyNavigation);

})();
