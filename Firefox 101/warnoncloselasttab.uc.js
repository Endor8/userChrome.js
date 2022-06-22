(function() {

  if (window.__SSi != 'window0')
    return;

  const { BrowserGlue } = ChromeUtils.import('resource:///modules/BrowserGlue.jsm');

  BrowserGlue.prototype._onQuitRequest =
  function BG__onQuitRequest(aCancelQuit, aQuitType) {
    // If user has already dismissed quit request, then do nothing
    if (aCancelQuit instanceof Ci.nsISupportsPRBool && aCancelQuit.data) {
      return;
    }

    // There are several cases where we won't show a dialog here:
    // 1. There is only 1 tab open in 1 window
    // 2. browser.warnOnQuit == false
    // 3. The browser is currently in Private Browsing mode
    // 4. The browser will be restarted.
    // 5. The user has automatic session restore enabled and
    //    browser.sessionstore.warnOnQuit is not set to true.
    // 6. The user doesn't have automatic session restore enabled
    //    and browser.tabs.warnOnClose is not set to true.
    //
    // Otherwise, we will show the "closing multiple tabs" dialog.
    //
    // aQuitType == "lastwindow" is overloaded. "lastwindow" is used to indicate
    // "the last window is closing but we're not quitting (a non-browser window is open)"
    // and also "we're quitting by closing the last window".

    if (aQuitType == "restart" || aQuitType == "os-restart") {
      return;
    }

    // browser.warnOnQuit is a hidden global boolean to override all quit prompts.
    if (!Services.prefs.getBoolPref("browser.warnOnQuit")) {
      return;
    }

    var windowcount = 0;
    var pagecount = 0;
    let pinnedcount = 0;
    for (let win of BrowserWindowTracker.orderedWindows) {
      if (win.closed) {
        continue;
      }
      windowcount++;
      let tabbrowser = win.gBrowser;
      if (tabbrowser) {
        pinnedcount += tabbrowser._numPinnedTabs;
        pagecount +=
          tabbrowser.browsers.length -
          tabbrowser._numPinnedTabs -
          tabbrowser._removingTabs.length;
      }
    }

    // No windows open so no need for a warning.
    if (!windowcount) {
      return;
    }

    // browser.warnOnQuitShortcut is checked when quitting using the shortcut key.
    // The warning will appear even when only one window/tab is open. For other
    // methods of quitting, the warning only appears when there is more than one
    // window or tab open.
    let shouldWarnForShortcut =
      this._quitSource == "shortcut" &&
      Services.prefs.getBoolPref("browser.warnOnQuitShortcut");
    let shouldWarnForTabs =
      //pagecount >= 2 && Services.prefs.getBoolPref("browser.tabs.warnOnClose");
      pagecount >= 1 && Services.prefs.getBoolPref("browser.tabs.warnOnClose");
    if (!shouldWarnForTabs && !shouldWarnForShortcut) {
      return;
    }

    if (!aQuitType) {
      aQuitType = "quit";
    }

    let win = BrowserWindowTracker.getTopWindow();

    // Our prompt for quitting is most important, so replace others.
    win.gDialogBox.replaceDialogIfOpen();

    let title, buttonLabel;
    // More than 1 window. Compose our own message.
    const gTabbrowserBundle = gTabBrowserBundle;
    if (windowcount > 1) {
      title = gTabbrowserBundle.GetStringFromName("tabs.closeWindowsTitle");
      title = PluralForm.get(windowcount, title).replace(/#1/, windowcount);

      buttonLabel =
        AppConstants.platform == "win"
          ? "tabs.closeWindowsButtonWin"
          : "tabs.closeWindowsButton";
      buttonLabel = gTabbrowserBundle.GetStringFromName(buttonLabel);
    } else if (shouldWarnForShortcut) {
      let productName = gBrandBundle.GetStringFromName("brandShorterName");
      title = gTabbrowserBundle.formatStringFromName(
        "tabs.closeTabsWithKeyTitle",
        [productName]
      );
      buttonLabel = gTabbrowserBundle.formatStringFromName(
        "tabs.closeTabsWithKeyButton",
        [productName]
      );
    } else {
      title = gTabbrowserBundle.GetStringFromName("tabs.closeTabsTitle");
      title = PluralForm.get(pagecount, title).replace("#1", pagecount);
      buttonLabel = gTabbrowserBundle.GetStringFromName(
        "tabs.closeButtonMultiple"
      );
    }

    // The checkbox label is different depending on whether the shortcut
    // was used to quit or not.
    let checkboxLabel;
    if (shouldWarnForShortcut) {
      let quitKeyElement = win.document.getElementById("key_quitApplication");
      let quitKey = ShortcutUtils.prettifyShortcut(quitKeyElement);

      checkboxLabel = gTabbrowserBundle.formatStringFromName(
        "tabs.closeTabsWithKeyConfirmCheckbox",
        [quitKey]
      );
    } else {
      checkboxLabel = gTabbrowserBundle.GetStringFromName(
        "tabs.closeTabsConfirmCheckbox"
      );
    }

    let warnOnClose = { value: true };
    let flags =
      Services.prompt.BUTTON_TITLE_IS_STRING * Services.prompt.BUTTON_POS_0 +
      Services.prompt.BUTTON_TITLE_CANCEL * Services.prompt.BUTTON_POS_1;

    // buttonPressed will be 0 for closing, 1 for cancel (don't close/quit)
    let buttonPressed;
    if (pagecount < 2) {
      let url = win.gBrowser.currentURI.spec;
      if (url == 'about:newtab' || url == 'about:home') {
        return;
      } else {
        buttonPressed = Services.prompt.confirmEx(
          win,
          "Tab und Firefox schließen?",
          "Bestätigen, bevor Firefox geschlossen wird",
          flags,
          "Firefox schließen",
          null,
          null,
          null,
          warnOnClose
        );
      }
    } else {
      //let buttonPressed = Services.prompt.confirmEx(
      buttonPressed = Services.prompt.confirmEx(
        win,
        title,
        null,
        flags,
        buttonLabel,
        null,
        null,
        checkboxLabel,
        warnOnClose
      );
    }

    Services.telemetry.setEventRecordingEnabled("close_tab_warning", true);
    let warnCheckbox = warnOnClose.value ? "checked" : "unchecked";

    let sessionWillBeRestored =
      Services.prefs.getIntPref("browser.startup.page") == 3 ||
      Services.prefs.getBoolPref("browser.sessionstore.resume_session_once");
    Services.telemetry.recordEvent(
      "close_tab_warning",
      "shown",
      "application",
      null,
      {
        source: this._quitSource,
        button: buttonPressed == 0 ? "close" : "cancel",
        warn_checkbox: warnCheckbox,
        closing_wins: "" + windowcount,
        closing_tabs: "" + (pagecount + pinnedcount),
        will_restore: sessionWillBeRestored ? "yes" : "no",
      }
    );

    // If the user has unticked the box, and has confirmed closing, stop showing
    // the warning.
    if (buttonPressed == 0 && !warnOnClose.value) {
      if (shouldWarnForShortcut) {
        Services.prefs.setBoolPref("browser.warnOnQuitShortcut", false);
      } else {
        Services.prefs.setBoolPref("browser.tabs.warnOnClose", false);
      }
    }

    this._quitSource = "unknown";

    aCancelQuit.data = buttonPressed != 0;
  }

})();
