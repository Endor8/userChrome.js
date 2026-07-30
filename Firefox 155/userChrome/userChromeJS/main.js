	// main.js

	/* ***** BEGIN LICENSE BLOCK *****
	 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
	 *
	 * The contents of this file are subject to the Mozilla Public License Version
	 * 1.1 (the "License"); you may not use this file except in compliance with
	 * the License. You may obtain a copy of the License at
	 * http://www.mozilla.org/MPL/
	 *
	 * Software distributed under the License is distributed on an "AS IS" basis,
	 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
	 * for the specific language governing rights and limitations under the
	 * License.
	 *
	 * The Original Code is the userChrome.js component.
	 *
	 * The Initial Developer of the Original Code is
	 * Simon Bünzli <zeniko@gmail.com>
	 *
	 * Portions created by the Initial Developer are Copyright (C) 2007
	 * the Initial Developer. All Rights Reserved.
	 *
	 * Contributor(s):
	 * alta88 <alta88@gmail.com>
	 * aborix <www.camp-firefox.de/forum>
	 *
	 * Alternatively, the contents of this file may be used under the terms of
	 * either the GNU General Public License Version 2 or later (the "GPL"), or
	 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
	 * in which case the provisions of the GPL or the LGPL are applicable instead
	 * of those above. If you wish to allow use of your version of this file only
	 * under the terms of either the GPL or the LGPL, and not to allow others to
	 * use your version of this file under the terms of the MPL, indicate your
	 * decision by deleting the provisions above and replace them with the notice
	 * and other provisions required by the GPL or the LGPL. If you do not delete
	 * the provisions above, a recipient may use your version of this file under
	 * the terms of any one of the MPL, the GPL or the LGPL.
	 *
	 * ***** END LICENSE BLOCK ***** */

	const { FileUtils } = ChromeUtils.importESModule(
		'resource://gre/modules/FileUtils.sys.mjs'
	);

	let UserChrome_js = {

		init: function() {
			Services.obs.addObserver(this, "final-ui-startup", false);
			Services.obs.addObserver(this, "domwindowopened", false);
		},

			// observer
		observe: function(aSubject, aTopic, aData) {
			switch (aTopic) {
				case "final-ui-startup":
					let path = PathUtils.profileDir;
					let ucFilePath = PathUtils.join(path, "chrome", "userChrome.js");
					let ucFile = new FileUtils.File(ucFilePath);
					if (!ucFile.exists()) {
						let path = PathUtils.join(ucjsDirPath, "Readme.txt");
						let readmeFile = new FileUtils.File(path);
						readmeFile.copyTo(ucFile.parent, "userChrome.js");
					};
					if (ucFile.exists() && ucFile.isFile()) {
						let path = PathUtils.join(ucjsDirPath, "utilities.js");
						this.utilFileURI = PathUtils.toFileURI(path);
						this.ucFileURI = PathUtils.toFileURI(ucFilePath);
					};
					Services.obs.removeObserver(this, "final-ui-startup");
					break;

					case "domwindowopened":
					aSubject.addEventListener("load", this, {capture: true, once: true});
					break;
			}
		},

			// event listener for load
		handleEvent: function(aEvent) {
			let document = aEvent.originalTarget;
			let window = document.defaultView;
			if (document.location && document.location.protocol == "chrome:") {
				try {
					//    Services.scriptloader.loadSubScript(this.utilFileURI, window, "UTF-8");
					//    Services.scriptloader.loadSubScript(this.ucFileURI, window, "UTF-8");
					Services.scriptloader.loadSubScriptWithOptions(this.utilFileURI, {
						target: window,
						charset: 'UTF-8',
						allowUnsafeURL: true
					});
					Services.scriptloader.loadSubScriptWithOptions(this.ucFileURI, {
						target: window,
						charset: 'UTF-8',
						allowUnsafeURL: true
					});
				}
				catch (ex) {
					// script execution can be stopped with |throw "stop";|
					if (ex != "stop") {
						Cu.reportError(ex);
					}
				}
			};
		}
	};

	UserChrome_js.init();