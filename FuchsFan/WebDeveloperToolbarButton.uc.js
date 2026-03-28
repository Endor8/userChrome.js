// WebDeveloperToolbarButton.uc.js

(function () {
  'use strict';

  const WINDOW_URL = 'chrome://browser/content/browser.xhtml';
  const BUTTON_ID = 'Webdeveloper-button';
  const POPUP_ID = 'menuWebDeveloperPopup';
  const CLONE_POPUP_ID = 'WebDevButton-menuWebDeveloperPopup';

  if (location.href !== WINDOW_URL) {
    return;
  }

  function onCloneMenuItemClick(event) {
    if (event.button !== 0) {
      return;
    }

    const originalId = event.currentTarget.getAttribute('data-original-id');
    if (!originalId) {
      return;
    }

    const original = document.getElementById(originalId);
    if (original) {
      original.click();
    }
  }

  function buildButton(aDocument) {
    const button = aDocument.createElementNS(
      'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul',
      'toolbarbutton'
    );

    const attributes = {
      id: BUTTON_ID,
      class: 'toolbarbutton-1 chromeclass-toolbar-additional',
      type: 'menu',
      removable: 'true',
      label: 'Web Entwickler',
      tooltiptext: 'Web Entwickler',
      style:
        'list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAACy0lEQVR4nI2TW0zTZxTAf9%2B%2FfwptXbQtWoTSUimoCNWqmBiWxkWZqAkajfEaNTHbi4%2Fqgw%2FGhy1zEqMxLFPjZYkmi4Qt8TI0miiRGAteEBCEtlBuKtTSpgLFDYRvD6vGGYmel3OSc37nnJyL4Askx5aZYbfbjtrt9hJFmdD29Dz%2FPRQK721o9Q1qPgfPzrIVbNm2OfBT2Q%2F5GRnmFJdrbpJxmmGhz9fu7H0Zqvxs9aLCBVWhvi559c%2FfZNXlC%2FJE2UG5YE7uL%2B%2F86mSgLT0jVb4dXTcrJ2d1%2BFU%2Fba0tuN1ublTdJNjZ89SdN2dXik63QnwKds1zH9q%2BYcUhxwydkEYHjU116LTJuOYX0OHvZFQm43Raqb5d0%2F%2B%2FDuzWWTtKiouO79vpMTm0AeIDz3kY1dDSHCA720qttw6r3UFWmoVARxcNT5ouvu%2BgYN78Kwf2rCvdUpxOuKmaoL%2Bb%2Fp4%2BDDNyuTecicaSz1c6DaqqASG4dfWvwaC%2FzSIA1q9Zdevw90uKs6f28rDWz9DrEUbHFQZCESLDWrK%2B2UQ83UMs1EUsGqau5s5wdzC4uDnQ4RMrl3nKftzo3G8W3Vy43sa16hfsKHWRPB5hZEzB5Colrrdw7mLF%2BTfDg4fVJFUoQtPe6G%2BXAOrSLP139bdrMKZNYXBM3%2FcszrR4cppOGYpisBcybnLyx6XKR%2FXNLbs%2FNXD1TTQ00RoRmJIMFOWOTlfGrCLVIFFsa8GST0XFpYZq7%2F3CydathuJCzjRa8MWmoJoz1aUlZlLzltMZE5wtPxK4V1frngwGYLnn61%2FP%2F3xQnik%2FKR887ZXRf6Q8Vn5a5joclSmqJiURJgA9oHzMC4C5efl3F7oXeUypZh4%2F8HLf6z0BnErEGBNaD0SAfiAODL1PkHBuBb4FBoBmYAR4BWgS9lsgBrwGwokkfHjKAtACSfz3IxIYA%2F4GJiYbwb9UlwQVHCL1dwAAAABJRU5ErkJggg%3D%3D)'
    };

    for (const [name, value] of Object.entries(attributes)) {
      button.setAttribute(name, value);
    }

    return button;
  }

  function cloneDeveloperPopup(button, popup) {
    if (document.getElementById(CLONE_POPUP_ID)) {
      return;
    }

    const popupClone = popup.cloneNode(true);
    popupClone.id = CLONE_POPUP_ID;

    for (const elem of popupClone.getElementsByTagName('*')) {
      if (!elem.id) {
        continue;
      }

      const originalId = elem.id;
      elem.id = `WebDevButton-${originalId}`;

      if (elem.localName === 'menuitem') {
        elem.setAttribute('data-original-id', originalId);
        elem.addEventListener('click', onCloneMenuItemClick);

        const obs = document.createXULElement('observes');
        obs.setAttribute('element', originalId);
        obs.setAttribute('attribute', 'checked');
        elem.appendChild(obs);
      }
    }

    button.appendChild(popupClone);
  }

  function ensureDevtoolsPopupLoaded() {
    const popup = document.getElementById(POPUP_ID);
    if (!popup) {
      return;
    }

    if (popup.childElementCount <= 5) {
      const { require } = ChromeUtils.importESModule(
        'resource://devtools/shared/loader/Loader.sys.mjs'
      );
      require('devtools/client/framework/devtools-browser.js');
    }
  }

  function init(retryCount = 0) {
    try {
      CustomizableUI.createWidget({
        id: BUTTON_ID,
        type: 'custom',
        defaultArea: CustomizableUI.AREA_NAVBAR,
        onBuild: buildButton
      });
    } catch (e) {
      // Widget existiert vermutlich bereits – bewusst ignoriert.
    }

    const button = document.getElementById(BUTTON_ID);
    const popup = document.getElementById(POPUP_ID);

    if (!button || !popup) {
      if (retryCount < 50) {
        setTimeout(() => init(retryCount + 1), 100);
      }
      return;
    }

    ensureDevtoolsPopupLoaded();
    cloneDeveloperPopup(button, popup);
  }

  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', () => init(), { once: true });
  }
})();