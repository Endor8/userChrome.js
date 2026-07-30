/*
 * userChromeJS
 *
 * The file userChrome.js can be used to customize the functioning of Mozilla's
 * user interface. Usage and syntax follow below; for useful code snippets see
 * http://mozilla.zeniko.ch/userchrome.js.html.
 *
 * Examples:
 * setTimeout(function() { document.title = "A new title for every window" }, 2000);
 *
 * if (location == "chrome://browser/content/browser.xul") {
 *   alert("Script loaded in main browser only");
 * }
 *
 * // DOMi window
 * if (location == "chrome://inspector/content/inspector.xul") {
 *    // Move Urlbar box to main toolbar
 *    var tb = document.getElementById('bxURLBar');
 *    var el = document.getElementById('mbrInspectorMain');
 *    if (tb && el) el.appendChild(tb, el.firstChild);
 * }
 *
 * NOTE:
 * userChromeJS includes an 'import' function to facilitate file management.
 * An absolute path or relative path with Directory name property token can be
 * used, as follows:
 *
 * // Single file (javascript .js or overlay .xul file)
 * userChrome.import("Full file path");
 * userChrome.import("Relative file path", "Token");
 * // All .js and .xul files in a folder will be loaded.
 * userChrome.import("Full file folder path");
 * userChrome.import("Relative file folder path/name", "Token");
 * userChrome.import("*", "Token");
 *
 * NOTE:
 * Absolute windows files and folders must be have backslash escaped:
 * "C:\\Program Files\\Mozilla\\scripts\\myscript.js"
 *
 * Examples:
 * // Import script in [ProfileDir]/chrome/scripts/myscript.js
 * userChrome.import("scripts/myscript.js", "UChrm");
 * // Import script in [Profiles]/scripts/myscript.js (share same script in
 * // multiple profiles
 * userChrome.import("scripts/myscript.js", "DefProfRt");
 * // All .js or .xul in profile chrome directory
 * userChrome.import("*", "UChrm");
 * // Import overlay
 * userChrome.import("C:\\Program Files\\Mozilla\\scripts\\myOverlay.xul");
 * // Import everything in Desktop folder /scripts
 * userChrome.import("scripts", "Desk");
 * // Perhaps the only thing you need in this file..
 * if (location == "chrome://browser/content/browser.xul") {
 *  userChrome.import("scripts", "DefProfRt");
 * }
 *
 * NOTE:
 * For a full listing of directory tokens see the two links found here:
 * https://developer.mozilla.org/en-US/Add-ons/Code_snippets/File_I_O#Getting_files_in_special_directories
 * // What's the path for a token? This will print it in the console.
 * userChrome.log(userChrome.getAbsoluteFile("Desk").path, "getAbsoluteFile:'Desk'");
 *
 * NOTE:
 * userChromeJS includes a log function, invoked as follows:
 * userChrome.log("string1"[, "string2"])
 * Example:
 * userChrome.log("hello world!", "myscript.js");
 * Results in a console message:
 * 2009-05-22 18:07:40 userChromeJS myscript.js: hello world!
 *
 * NOTE:
 * The date format for the userChrome.log console logger may be user defined:
 * Example:
 * userChrome.dateFormat = "%Y-%m-%d %H:%M:%S";
 *
 * NOTE:
 * The default charSet is "UTF-8"; for code using the 'import' or
 * 'importFolder' functions to manage files, the charSet for subscript loader
 * may be user defined, prior to calling the import or importFolder functions:
 * Example:
 * userChrome.charSet = "UTF-8";
 *
 * NOTE:
 * Scripts are stored in a startup cache and loaded from it.
 * After a change in userChrome.js you heve to restart Firefox with clearing
 * this cache to make sure the changed file is read.
 * By default this applies to imported .js files too. You can bypass the cache
 * for these scripts with this statement BEFORE any import statement:
 * userChrome.ignoreCache = true;
 *
 */
