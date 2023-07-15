(function() {

    try {

        // Run .as.css .author.css .css files
        const SheetFiles = FileUtils.getDir("UChrm", ["CSS"], true).directoryEntries;
        let sss = Cc['@mozilla.org/content/style-sheet-service;1'].getService(Ci.nsIStyleSheetService);
        while(SheetFiles.hasMoreElements()) {
            let file = SheetFiles.getNext().QueryInterface(Ci.nsIFile);
            let fileURI = Services.io.newFileURI(file);
            if(file.isFile()) {
                if(/\.as\.css$/i.test(file.leafName)) {
                    if(!sss.sheetRegistered(fileURI, sss.AGENT_SHEET))
                        sss.loadAndRegisterSheet(fileURI, sss.AGENT_SHEET);
                }
                else if(/\.author\.css$/i.test(file.leafName)) {
                    if(!sss.sheetRegistered(fileURI, sss.AUTHOR_SHEET))
                        sss.loadAndRegisterSheet(fileURI, sss.AUTHOR_SHEET);
                }
                else if(/(?!(userChrome|userContent)\.css$)/i.test(file.leafName)) {
                    if(!sss.sheetRegistered(fileURI, sss.USER_SHEET))
                        sss.loadAndRegisterSheet(fileURI, sss.USER_SHEET);
                }
            }
        }

    } catch(e) {};

})();