// ==UserScript==
// @name           Appmenu.uc.js
// @namespace      Appmenu@gmail.com
// @description    Basiert auf dem Script externalFuncButtonM.uc.js, Wiederherstellung der Orangenen FF-Menü Schaltfläche
// @include        main
// @version        update für Firefox 129+ by bege
// @author         defpt
// @charset        UTF-8
// @version        2019.08.04
// @version        2020.05.27
// @version        2020.07.13 Weitere Menüs und Funktionen ergänzt by bege
// @version        2024.08.10 alle Einstellungen im Abschnitt Konfiguration vornehmen
// ==/UserScript==

var Appmenu = {
    // Beginn der Konfiguration ------------------
    
    // Editor mit angegebenem Pfad verwenden
    // editor: 'C:\\Program Files\\Notepad++\\notepad++.exe',
    // oder
    // in 'view_source.editor.path' eingetragenen Editor verwenden
    editor: Services.prefs.getCharPref('view_source.editor.path'),
    // Dateimanager mit angegebenem Pfad verwenden oder leer ('') wenn System-Dateimanager verwenden
    fileManager: '',
    // fileManager: 'C:\\Program files\\FreeCommander XE\\FreeCommander.exe',
    // Parameter für Dateimanager oder leer ('')
    FMParameter: '/T',
    // Submenüs ohne Inhalt im Hauptmenü automatisch ausblenden
    autohideEmptySubDirs: true,
    // Submenüs im Hauptmenü nach unten verschieben
    moveSubDirstoBottom: false,
    // Ort und Aussehen des Menü-Buttons einstellen
    isUrlbar: 0,  // 0: TabsToolbar, 1: navbar, 2: toolbar-menubar;
    isButton: 1,  // 0: Hamburger, klein; 1: Firefox, groß
    // Hotkey zum Öffnen des Appmenüs oder leer ('')
    hotkey: 'x',
    hotkeyModifier: 'alt',
    
    // Ende der Konfiguration --------------------
    
    subdirPopupHash: [],
    subdirMenuHash: [],
    toolbar: {
        // Submenüs des Hauptmenüs definieren; Separator einfügen mit {name: 'separator'}
        subdirs: [{
            name: 'Firefox Verzeichnisse',
            image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADC0lEQVQ4jYWTa0wVBBiGXxHKLmyobUe3rFaOFBRcDAs1OM0WBsWEtZZQLSugUNSBI0wEFDAPMAQ6XGY5Qd2JDlK0qTDczDnDSmIoCmarcRiXgCmH2yE4l6c/xepH9Px+vmffj++T5uHbo7l+CeEh8fM5/4n9Qk1+0b43MFRYTq0urq0LtlrX/+/Q8MDAFvq7LBez42eeyypGg6Dm39DHX6G40lH/PQfPblnrGyZJsyNtz0wOdRr+FaiLf+LDS+WJB1XaNq2GHlR/GyVbMCamUWbZD13vgC0TT+9+sO3D1VnQLEn6Y+iXp+xtSTe4a5rBUc6d1nRWRr2J1mSwPT8HpgpgugrPeBXYK2Gigu4z7zNyJfO0JGnm3q9rGcrD4/gMt+0Q2LKhLw8G8sHxKZ67Zhg1M2sr4t7VNNoqkzgWG0C9Obxsbn1Xxwd4xo7jvBCHu8+Ep78Iek24bEdwdB2mtySWG4mPci76EW6ejMSabaBsT/SBucDQ2ZibDJqZOB/H1PepTLXuZLw1hYnz6UweXoOzdhH2muU07V3MriB/GvaGU53xaspcoL/mxWuuzmz6a40MWl+h3xJNX3EUM/Wv42kK5IfCeBICHyZ542M0ZoXSU7WBL46mvyZJmvoy6ZDz+ufYG2PpLAzgekkw3TufxNlSjftiKJc++YjYlYuo2+HPj/nBXMtfxzepy+luPRYhSaIjmYa3Q8d7zME07vKjPTUAR+Vu3B1bGT1jwrpNDJeu4ve8ZXTmLCEvxovcKB/aL1cHaOb2T0Hu796lvfCFse6KCHpLNjN7MgLXz+lw6wATV97jxI6Xydjsw5EEb7Zv8iYm2Hs2cvXCMUkbdM56Ytlk4UtwKwX31UCcLWFMn47A2RJDfZqRVQ/K9fhSTa7w08D9XuqSdFnS15LKJa2TJL21Qs0jmc/iyI1gLG8jwwWRmJ5fiqQ7kpokHZdUIGm3pG2SQsPCwh745xX73idlBfmqYf1iNS1ZoHpJOX/JmyQ9LclgMBgeMhqN3vP9k1dISIiPpIWSFswn/s2f5mHBqON1Ok8AAAAASUVORK5CYII="
        },
        {
            name: 'Firefox Profil-Dateien',
            image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACc0lEQVQ4ja3TW0iTARjG8RdnKo4yHcimRRmRNCyMIKc1Sy1IKtTGVlppqMVKp81MZ2FYmlEhuSJrDjQNSxeCdGBY0+hAB1CRMiRP0zzu2z53NtDg6aoQ6aKsB36X/8uH6D/Nh0O0h8OhpPmISPBHdex6jyaHdgnm6r1+ma3zQsMxT1axndOetcDJaI5htT/Jf/bcksNik/VhLlhdDsyNCjAPsjB1TYxTxReQqdWjsqEWZW0dKHz8HhkaPZo0x6FTx30nolAiouTR8UnYnS5Ypm2YZFh8HeiDUbkKfeXR6C8WorbqLLL1H5D2pAuK9k/YqtDgUtU5ENEB4nK5uXanCw6nG9M2BxiLFWPtGhhVQRhSCjCkFKC/KALVN0uRUGPAZtVdxJbpcLSqFd6+vlkUHLzyonvmG5zuGdgcTrBWO8bqMmHM56M/R4CX+wNRXVEAqaYN+64/xdKobPBEcuzKuAI+P+g8hW0Mv2UcncDI+BRGJxmMT5nRWyKD8bQA7xL9YIjyQemZPOQXlaHyajHWiNLgsWwbaivSESZcd4N2xMQ1TpjMmK+voRq9qcsxmBMIY6ovDHt5qIgRIl4ogrdPOJJEYnxsXouYyA33SSKVPWetdsxnMVvQIRHhc4o/BhQ8DCl5aD4SisvxO3EnMRTDeQGwPQqGVCJuJbn8RJfT5cZC7KARb+O2wLCCizeb/NC5OxA9h/j4ogjA2G1POLvDIU+XdFJhoWqEYafxOybGjB6tFq+SpXgmjsCLhEh0lx/EyOsaMAyDAlXRMFWq1a7Z2TkshlqtdpFElmyq17Xg3l+q17VAIksxERGFEFHSIoX8841/AH8LBtcBwgOXAAAAAElFTkSuQmCC"
        },
        {
            name: 'Firefox Funktionen',
            image: "data:image/x-icon;base64,AAABAAEAEBAAAAAAAABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACQAAAB0AAAAzAAAAQgAAAEUAAAA4AAAAIwAAAA0AAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAKgQAIngOFHPPHiGf9hwnsv4aK7H+HCid9BYmiNoNEVGWAAAAOQAAAAkAAAAAAAAAAAAAAAAAAAAAAAAADhISZ4oiJaj4JTfD/yVDzf8lTNP/JU/X/yVT2f8lUNL/HDas/g4bbJsAAAAaAAAAAAAAAAAAAAAAAAAAACAmkVYeKLn+JT7I/yVL0/8lVNr/JVrd/yVf3/8lZuL/JW3k/yVk4P8bT9P+HkXBjAAAAAAAAAAAAAAAABoaaxMeMbXqJT/K/yVN1v8lWN3/JmDf/ytSr/81OWr/M0qL/yZ64/8jiez/JXXh/x9Msv4ITLo/AAAAAAAAAAAiN6B3JT7I/yVN1v8lWd3/JV3d/ytEnv81J1T/SiIe/04iFf9BISL/I6HV/xus7v8hhtn/JVCofAAAAAAAAAAAIEGw0SVL0/8lV9z/JVnb/yZn4P8oct7/Jnjg/ydjt/9RUE3/WCgR/zp3fv8axfb/EMj1/xmC0LQAAAAAAAAAABxKxv0lVNr/Jl/f/ydCyf84WaX/a0AX/3NMHP9lZEf/dUQT/2cyDf9ZNB//Q9j3/ybh/P8ap9X1AAAAAAAAAAAbWM/8JVve/yZm4P8mWNP/Nkh+/3JXLf+aWgv/mFkL/4tNBv+ARQf/bTcH/6Pw+v977v7/Opuz/gB/fwIAAAAAIWHV5SZf4P8ma+H/Jnfk/yOP5/9QZYT/qXAm/7NyHP+qaBX/mVkN/4xPCP+dtKv/lu3+/yOy1uUAAAAAAAAAAB1exJElZeL/Jm7i/yZ+5f8iheD/QHDX/2uAk//DiRP/vH4V/7V0GP+jZRn/rbKa/4js//8AyOONAAAAAAAAAAAdU7JGJVnY/yZw4/8kguX/IJLg/4p4N/+wjhv/0p0F/9GaCf/FiRD/sHkv/8Ts8P+L4/L/DcbnTQAAAAAAAAAAGVnYFB5m3P12eX39coBn/02bp/92i1H/1qYb/+GvIf/cqQz/yJId/8SlaP+539//Za/KtwAAAAAAAAAAAAAAAAAAAAAiguZSv5tRZMKXQPXBkiX/xKU3/+a2Qf/rvEj/5bQ4/9OpQP/XyZ7vkqmnegAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADkwWkd5cBimOe/X+TswV7+7sNe/um/X+HivWeRzbBOGgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="
        },
        {
            name: 'about:',
            image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACkUlEQVQ4ja2SX0hTcRTHv27euz/qLvfqdtO8lRmEoLm2RTTUmWHFtlgYIlFPleNuI5cggYTJpDGIVnP+CaVQ3FtCkYQvPfYSprewxCZCUYwgUKIeHIidHvSKiPrUef2ez/ec3/l9gf9VoijmhcPhq7FYbKizszNSUVFRvFOfATggsqgEUA5AtynYbDb78PDwfCaToaWlJUokEk8A6LfxZfHThsG3rcKk38reA3Bwq8hJktQSiUSmstksLS8vr9XX11/cokv3bRih0fI1Shyi+euGNMfAAQCMw+E4KoriSQD5jY2NiUwmQ0REsiz3qnDMhhEaMBNN24nuFtH4GShGwA4AOo/Hc01RFOrq6nqZTCa/K4pCCwtpejqammIY5kTMiiHqK1yjaTtRTwk9d2sWLDoEAZgAACzLVvb393+amZmh2dlZGhsbo0g0Sg/jiWz0WO7HvwlhVYVfuDWLJgZBAGYAOer7dDqd7qzX632dSqXoZlvbvBzu+BFv2E+rj0ykwuPnMcczCAEQdvohlud5r8fjeceybDOg9QdrKn/+8YMouo8mzmmpLI95ACB/jzSgiGGY4wDMDoejnYio54p35VldLk1UW+mWif/WUlratJcBALBOpzNAROSX5UkA0RqN/utEtZXSPh/Fef53myR1ANDuBBe6XK4gEVEgEHgFoA5AIQe0tHPc5w+1tZT2+aiX4+h2SUkfAIMKakRRbKCNktcnuwGwG7oxH2jqtli+vKmqotaCgulujlu5xPNu1UAbCoVGVQNBEG4A4LZtZ+CBy3fM5sUBSfrl57j3xRtBAgCjy+UaTCaTcxaLpQfA4V3uUyBotc2n9PrHPHABgHHTHUA1ACeAI7sdSB2G9RwYAeT8A0L0/bjRXZQXAAAAAElFTkSuQmCC"
        }],
        
        apps: [{
        // Untermenü Firefox Profil-Dateien
            name: 'userChrome.css',
            root: 'ProfD',
            path: '\\chrome\\userChrome.css',
            subdir: 'Firefox Profil-Dateien',
            image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADFklEQVQ4jXXR3U9bdQDG8fMHbFcjLjFRE2PIEhsTTfTOK++8UmNc2JzeaIQ0GzFBnSxLUDvs1DnCRJSgvIjsFUYXNg/Ki8IKnfQFCm3T0xZq11Eobc/pK6ft+fXrxYyhMT7Jc/l8bh5J2heLZeKxmZlQdGU1oblXtjWXN6m5fBlt2ZfRFr2aKk/Hfzt84PAj0v/lwjcLjelkTvBP8gIeFAWr6Qq3lQLTgTIX+mZ+P7AfmYjSfS0o+q9E6B9yF8cmAyVjJlrlTrjCLaXMgLfEoCeDM17E5lZxx+BM38KCdPDgIUmSJOlnP7WLdsHQSpWh1QoDrj0653L0O3K8O7bDs71/0XIjSDRdYno9hyOgsxiBiz/MLTQ0NDwqjfrQupcENwNVuhb3sPl0+hx5bKt5Prid5LneKO9PBNnN6Tg3Svy6nuXassovCrSe7uqRBjcQX3lgJAwjCnzrrHD+bpEue573bCkaL8Uwjytki2UiqoE7UWZ2o4QtbGD97s6S9NTRsz1PvH5m9PFXP/rpyTfOTjYPOIzWy25ahpd550cHb35vp3tqjVTRYFM1WNup4IjrzCfB0ntrqe6Fl196q3Ezsq0blRJqrviw2QKpfJlEocb9nCCUruJNVnCp8FnPxGIdYLXOPq1Es/oesFuCnSIkCrCVrxHPGsQ0QSRtEEhV8Rfgk0s364GOjkmTP5LRCwK2C4KtvCCeE9zPCmJZQVQ1iKhVQqpAKUFH93g90N4+bvKGUrpWhQf7h5ogouko2Sz2eBRHPE9Yh/avx+qBtrYrJldwV09X+Xe4oQoiWo3lrTh3E2HkYIZR/xoezeDjL/8DDJuWAkk9WYZNTRBWBUrmYWeDGtfXfVz1xBj88x72ZIXTX1yvB06dGjbN+5J6ogwhtUYwLQikBYGMYH6zwohTYdC+zpgzgTsHbZ9frQdaWoee+SOQZxuI6hDZA6UE/iKs5cCegLkYONLg0qHt/A1PHXDkyAuHXjvx4eW3T1qmTpgt8nGzRT7Wck4+2nxObmrulJvMVvmY2So3NXfKx09ap55/8ZVP/waJWLfEOCt3rAAAAABJRU5ErkJggg=='
        },
        {
            name: 'userContent.css',
            root: 'ProfD',
            path: '\\chrome\\userContent.css',
            subdir: 'Firefox Profil-Dateien',
            image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADFklEQVQ4jXXR3U9bdQDG8fMHbFcjLjFRE2PIEhsTTfTOK++8UmNc2JzeaIQ0GzFBnSxLUDvs1DnCRJSgvIjsFUYXNg/Ki8IKnfQFCm3T0xZq11Eobc/pK6ft+fXrxYyhMT7Jc/l8bh5J2heLZeKxmZlQdGU1oblXtjWXN6m5fBlt2ZfRFr2aKk/Hfzt84PAj0v/lwjcLjelkTvBP8gIeFAWr6Qq3lQLTgTIX+mZ+P7AfmYjSfS0o+q9E6B9yF8cmAyVjJlrlTrjCLaXMgLfEoCeDM17E5lZxx+BM38KCdPDgIUmSJOlnP7WLdsHQSpWh1QoDrj0653L0O3K8O7bDs71/0XIjSDRdYno9hyOgsxiBiz/MLTQ0NDwqjfrQupcENwNVuhb3sPl0+hx5bKt5Prid5LneKO9PBNnN6Tg3Svy6nuXassovCrSe7uqRBjcQX3lgJAwjCnzrrHD+bpEue573bCkaL8Uwjytki2UiqoE7UWZ2o4QtbGD97s6S9NTRsz1PvH5m9PFXP/rpyTfOTjYPOIzWy25ahpd550cHb35vp3tqjVTRYFM1WNup4IjrzCfB0ntrqe6Fl196q3Ezsq0blRJqrviw2QKpfJlEocb9nCCUruJNVnCp8FnPxGIdYLXOPq1Es/oesFuCnSIkCrCVrxHPGsQ0QSRtEEhV8Rfgk0s364GOjkmTP5LRCwK2C4KtvCCeE9zPCmJZQVQ1iKhVQqpAKUFH93g90N4+bvKGUrpWhQf7h5ogouko2Sz2eBRHPE9Yh/avx+qBtrYrJldwV09X+Xe4oQoiWo3lrTh3E2HkYIZR/xoezeDjL/8DDJuWAkk9WYZNTRBWBUrmYWeDGtfXfVz1xBj88x72ZIXTX1yvB06dGjbN+5J6ogwhtUYwLQikBYGMYH6zwohTYdC+zpgzgTsHbZ9frQdaWoee+SOQZxuI6hDZA6UE/iKs5cCegLkYONLg0qHt/A1PHXDkyAuHXjvx4eW3T1qmTpgt8nGzRT7Wck4+2nxObmrulJvMVvmY2So3NXfKx09ap55/8ZVP/waJWLfEOCt3rAAAAABJRU5ErkJggg=='
        },
        {
            name: 'userChrome.js',
            root: 'ProfD',
            path: '\\chrome\\userChrome.js',
            subdir: 'Firefox Profil-Dateien',
            image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADFklEQVQ4jXXR3U9bdQDG8fMHbFcjLjFRE2PIEhsTTfTOK++8UmNc2JzeaIQ0GzFBnSxLUDvs1DnCRJSgvIjsFUYXNg/Ki8IKnfQFCm3T0xZq11Eobc/pK6ft+fXrxYyhMT7Jc/l8bh5J2heLZeKxmZlQdGU1oblXtjWXN6m5fBlt2ZfRFr2aKk/Hfzt84PAj0v/lwjcLjelkTvBP8gIeFAWr6Qq3lQLTgTIX+mZ+P7AfmYjSfS0o+q9E6B9yF8cmAyVjJlrlTrjCLaXMgLfEoCeDM17E5lZxx+BM38KCdPDgIUmSJOlnP7WLdsHQSpWh1QoDrj0653L0O3K8O7bDs71/0XIjSDRdYno9hyOgsxiBiz/MLTQ0NDwqjfrQupcENwNVuhb3sPl0+hx5bKt5Prid5LneKO9PBNnN6Tg3Svy6nuXassovCrSe7uqRBjcQX3lgJAwjCnzrrHD+bpEue573bCkaL8Uwjytki2UiqoE7UWZ2o4QtbGD97s6S9NTRsz1PvH5m9PFXP/rpyTfOTjYPOIzWy25ahpd550cHb35vp3tqjVTRYFM1WNup4IjrzCfB0ntrqe6Fl196q3Ezsq0blRJqrviw2QKpfJlEocb9nCCUruJNVnCp8FnPxGIdYLXOPq1Es/oesFuCnSIkCrCVrxHPGsQ0QSRtEEhV8Rfgk0s364GOjkmTP5LRCwK2C4KtvCCeE9zPCmJZQVQ1iKhVQqpAKUFH93g90N4+bvKGUrpWhQf7h5ogouko2Sz2eBRHPE9Yh/avx+qBtrYrJldwV09X+Xe4oQoiWo3lrTh3E2HkYIZR/xoezeDjL/8DDJuWAkk9WYZNTRBWBUrmYWeDGtfXfVz1xBj88x72ZIXTX1yvB06dGjbN+5J6ogwhtUYwLQikBYGMYH6zwohTYdC+zpgzgTsHbZ9frQdaWoee+SOQZxuI6hDZA6UE/iKs5cCegLkYONLg0qHt/A1PHXDkyAuHXjvx4eW3T1qmTpgt8nGzRT7Wck4+2nxObmrulJvMVvmY2So3NXfKx09ap55/8ZVP/waJWLfEOCt3rAAAAABJRU5ErkJggg=='
        },
        {
            name: 'prefs.js',
            root: 'ProfD',
            path: '\\prefs.js',
            subdir: 'Firefox Profil-Dateien',
            image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAsZJREFUeNqMU1tIFGEU/uafm+6urhKWt80UEUFzs10LkkhIsgyCeggrCLPwqadeIqIwQoSIHnrpQl4Qil6EXuqhLboQ5GUXDZYS0iV1uyCGru22u7Pzz/T/s7slUdGBb2bOmXPO/813zggVfT5wMxl0aiCm0cX6kvyifEXEckKHP7wCURCsHH4lRIAsMhACVSLVEjJmmiYSunH55sGGoo4tZfiX+d4vwpkjY3//6B2SDRqsQVxLdWWLdeZz0DUwM7l9z2aRZGw3rbO3SFn6zEdL9fpS7kc1ajVca5y+yOjbZBHPQ0s4ei8KRSKQsgKwExx5atpNUApeL/xG3UZEq7FK42/C5w+c5LGfDPRkonZrqdNK1FIGTC5cRjxk2NhVEROfIqzInC/vfRxwMD8jIvtGg+7ylDuZ8ikkeL4oApwRf9Z0K4uH3sa4FkaIMjbfWJhkDzAorS3MVbCapEiwcDxHQtRVjJhrA5KyZGGmpBi79zYgBkxFVDs4fo1RVLZ7ypyYWkmC2hRIrnK4Hw4jeKgbSSF9iKzmYOODfoSOnB5UZXGIiATEmgB767TnunijpKpCqnTBfasHuNEDVWCUU0BKY3edAtcvoPLaOXwVVHNZzgVJUcNk22dGqVlQezuAghp2cg8T2DeCd68iaO/1YSQwB0XXUBxewOSLZZiP7mPzmcNIGYJJkrqByKV9iFxsw3S3J70sS1/YzBxgq4Gr7TUY8i8wPUWEaHohBFsey/lsTYkQLTZx5eUs5lYTmInpEBbCCA0+YQ1sqOvwwu2twtm2Oqg2CYXVm9B4bBvgyMPU3ddwj496hfzWzlZlZ4ePfQoM1pHKCr7bnJgd7ETViRbMDzxFxfEBS8UPw12oOLWHFY+h0T/mDe5oDvBNURnq//TTTDc1+fP0OMomg17uf2ys96/IjNn4uDfY3BzAf5gng7/5+CHAAPUhK3nsRsW2AAAAAElFTkSuQmCC'
        },
        {
            name: 'user.js',
            root: 'ProfD',
            path: '\\user.js',
            subdir: 'Firefox Profil-Dateien',
            image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAArBJREFUeNqMU11IFFEU/vbO7Iyuums/GvmXhISBiOWWGFgGiyaC0UMkWRT11FNPQbEl9iNb0mtgUEQW+xjUQ5RrlClZ5IbaQ0bpw+paSGLGbrs7O3emc2d/kKjowBnm3HvnO9/5vju2Tb4ARJiUOjcQ1fhizUZnkVORsBzXMT7/HZLNZp0RT8ZssEuUjEGVWZWMdJimibhuXO4/UFvUWVeKf0Xg0yJcOXa03359i2UWDQKIackTmY91qkXyVWmmz/qezyBBbCvX5TXLGfpUo7mquETUEY1bgKtD0JeIvsMu4cXsNxz2R6DIDHJGAOqQX6CmyjjnEN/bfqPuYJIFrPLY5Ly346RYyzLQE/Hq7SUu66CWNFJd0+KZaTYFioxgeAV2mKH1vYPBfFVCWgOa0eB76stcpHwSmmFAQMiktkjxLpJUR2glBtlIzArsn9QoxYAaGJxXr8lVECHruGHSrEDxhccWfLinLcXozEM4cmTkJmITWVuzNkpKQ32pC1GuW1039DzB6OlWSCQaSUoacTCJYfiUB2ZRxR3RRAzGLAeIQmFeTrkAUumCVF4ZxMCR3bg0HLaU13UDMaJr0GjnhkLoP9gIjXNT1CxJUHT7zKhuFO68MYKqa8/g62jEgw/LePP5I3ZVroV/cgGin9m3HyPT0/BPLcHbskOMasoJQl+52Ja1ip19hIWoBofKLG2ut29Fp/8duraVIvwjBiGe2AtHEpYIjGnRt30vZxCizTnKJRLs7qsp5NOdONRQi703x9Dt2QInWbj56hC6GutQoNpxb+w9vpzf57Y5Pcc9SlNngEaxRJFpZoVEFN4fbarDwMhkyiXaFYofo7X7oxP42t3mrvAFgsIJlbLmTz9NWe/TcRvxnPO2uEVd3js4LrSY97a66S8O4j+iPp1/q/FLgAEAGto2bg8Nx1UAAAAASUVORK5CYII='
        },
        // Untermenü Firefox Verzeichnisse
        {
            name: 'Profil',
            root: 'ProfD',
            path: '\\',
            subdir: 'Firefox Verzeichnisse',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Qzc3OTM4REU3NkFEMTFFMkJGRDBENEQyQ0IxOTY5MEIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Qzc3OTM4REY3NkFEMTFFMkJGRDBENEQyQ0IxOTY5MEIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDNzc5MzhEQzc2QUQxMUUyQkZEMEQ0RDJDQjE5NjkwQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDNzc5MzhERDc2QUQxMUUyQkZEMEQ0RDJDQjE5NjkwQiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pk3JkLkAAAL0SURBVHjadJPba1xVFMZ/+8yZMZ3MZCaJSUNaWqkkKY2k2kDwWm21lgRMhBSFWpJC60MVLIXqkz70DyiIF1A0iLRoK1YtJA+2Sm0CQWIg+GATgiUwkmSSSWaSmcz1XLbrTEZTxC7Yh7XXWetb37ps9dZXU3jiuPoHy3H7XFejuUeU8j4VHXxy9xvqus/gZc9gena9CdD36UBnWddbIfzz3ztGxX7mynSfYeiybmploPVmzsHPJyg5Dt5VSSbD/wDmWozI8El2hDPk8rCcj2AOXMXQFp6jaZshcG0sK8fQ6S7EjFSBIfB+0d978SiPHQgSqW9nLQO5yTnWLp0SynY5sXFw/DiHf30FxwhQkICPbsfJ2XBrAX5JQ2Ylgatq0L46HN1IYNt2CqsJurs7eeH5RzE8Bo4ZvIxZhSsA+1uaGBqb50gz1AQo027pfJrd7e0cPfYUr5/rpVgsYdnuZduWElzUt5aj+n8b+ZpP1h9iJS/Ugg287w/w9jMNjLS10XnkIOvzKySTa2QzOUqhRoqF4mtoVaWGzj2nu7qPo1wL7TrSGIEMPsj56wliiQz1/jyXTlBuaCqVJr64RLhhP+HaRiZGvsS0LIfG3Y8wfuUCyvDJaGQ8AvJh76sCFoX0LMnYn2QC25lfWGZjbpJd9TPsGfyMknTclPmTT/1FKBisAGxOPjZxlVD8R5r3thHYd4b1uTvkMinMpgN07Jxh9ZuXZJR7ZA+0wkkvEqreJgCGZNesdrzLrp+eYEf/G/ir8lS1Pknt42dpy8p4kjepXb9GsFBN17UPMFwBMAsJojUhoqFqIuEQ1ugF/L4iti6R+v0L4t91Idgon4kz2sPq1BCWU5JkUkK2YN/+fnjsWf3vAisJ9NPaXGBjaZas7IKW3qYuVpbbRxksuDRTdvesD8uJ8h/54x0m3aY6WcfAPS+CrVdi2bjxFcyP3zx0d+vReNlNeqI3GJ7m7GGSF4Wmyf+IVG7/PMt5xf0lUmF3Px+P0t2/BRgAgYA3fi+XoFwAAAAASUVORK5CYII='
        },
        {
            name: 'chrome',
            root: 'ProfD',
            path: '\\chrome',
            subdir: 'Firefox Verzeichnisse',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACnElEQVR4Xm2RzYtbZRSHn/fr3pvJzTB3qiNM2k2pMBUGhEHaqsUqdeFGQalCobgREaFu/B/cqCtxVSjoQhBEQRBmIfWDKgNGJUPt0Nhah9JJ4iSd5E6+bu5972tAO4SS5/DjXZ1znsMrNiq1eikMQqYYJCmjxNH5+zdW777L0J5KKl9VPmnf+ut9KWkwhbheuzNcOVYOmGKc5iRO0r1ykeXCx0h7kt4fC3z5wfqbQnAJwQHa5S7jAZSRuJ0mkf81cheobhBXZa+ri1uptQjHAZoZCEC1PiPgDuwxCfwerBU7b73zXn//3usCcdt4HkZ7SGZg431U51NUCgwlO3cV/bVXhR/6p9ut+nP9QYeNn7/n8qUPZxvQ/Q6VVWHk4ZqWRvlJjpx9hcGfW2wO95N2q8m3618A2WwDt/0RplSAXsBed57eyossHl5GYdHacG3zGpADM06wjQ1UUIN+CLHPvfAxojPnKLiE+bDE1R9+5GatAmgPeGCAteQ7l5GBhGSyuROyd/gFouUyWkqEErR2mwXAAA8BRS0AgMQBjSra30ZkEeDzz9Dn4ZcvMO51SMcJcTdGChmA0ABA6cAgzyG3I8jLEBylV4fWoaeIc0V7t0Uv7pFbC+CA+28mp/8+SwXKnMVmz1O9HpE+eobMZdjcoY1GIHD/NwIdoH1fBaNguzlg88pVyoUi4vTbFI8eJxsNAIfSkrliESllH/L0v0jktNNomFGv1TFrL3Fo9QSMR3jaEEXzLC09gjaKp595No0WjyCEB4zRclICUMDxtRMce/wJ1MIi2SglXShhfI/cOjxPoZRmbq4gXzt/gVrtBrdvbiG+Wf+p/mvll1BpiVAGhCDPxuAUDotz4HKHlIJON6bRbL4hhPjcMx5mkn8BBLEUrsVZbq0AAAAASUVORK5CYII='
        },
        {
            name: 'CSS',
            root: 'ProfD',
            path: '\\chrome\\CSS',
            subdir: 'Firefox Verzeichnisse',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAatJREFUeNqkU7tKA0EUPbM7boISNKhBsLRQ9AMECx8EEQstgqVgL1iYyg+w1UbwC6ziA1TyA7FKjCKiYCGihSAIikiIJptZ7527amIjmmWHnXNn7jn3tSoIAjTzOGjy0cerI2umZtKB+VskylFwXGdds/Pw/AzgG8ByKHrV901OUYV2i41stYP81mFaW+X3MnC5IZctgabkaBmfbDWWo9VCe18WKw0tgX21dfJfgbE9IJEUlccjIJcKbWNi200Ao3X4fNkKasvml8R5p5OUSSn1IPXly9txCreNoCc40wG0tAJ9czZV6UJQEVavHYh2A9lB2sfENr4PuKTjeoInDmhPIqZS30Y/7EkkXFEhyA6QigvM3oo920+XGN8RQcmm4NiicWVtoSkd8wZMnRK1K0T5BTnjCBgXQmyqoilVp91zEZi+ksPnEyIg7skzwU9FiSBZCM+LX63VtkWc48UKfalY1Rdpo0fFyyXDvruNmKOL9dj2ap4oRIgkiMscRLuk759DZIXUDwzrw7765rG8icz1YuMoq18GObDO7Ms3KRb0/vNfulfN/s4fAgwAwWWMUVTgPhoAAAAASUVORK5CYII='
        },
        {
            name: 'JS',
            root: 'ProfD',
            path: '\\chrome\\JS',
            subdir: 'Firefox Verzeichnisse',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAC4gAAAuIAeWOKUkAAAEZSURBVDhP7ZMxLENRFIa/c2l5ESrFI+KpoUQTRoOYTJp0NBgsFpP5xSAxWNgkNlYJo72L3SIhMRiaaCxdRKIRkfQet+81FhUPsTnLvfnPzfefc3Ku6MW08oswrfPH8Q/4c8DohjKyFt+7AmVix5I/ULIlG4tfAfoXlb75eE+mDiGzIBgPctuG9HCkJ2tBOpTunPB4DrfrwvWS8lqTZioZQBvCQ9nirwqFU6Vn9n17kw+xEhqqu5a079o5MgwuR3NoD0j5sYO4tLbMmq61Y8NVUXipKAOlT1oINi0zZ8L4lsWbjB/3zlkKJ+KclSB0VYw5/S4if/yNKVdiECpeHp5vlOqe0HgSskXL0IrQmYH6JdzvO73eBvCtgDf14FTmcYgI3gAAAABJRU5ErkJggg=='
        },
        {
            name: 'Addons',
            root: 'ProfD',
            path: '\\extensions',
            subdir: 'Firefox Verzeichnisse',
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjbQg61aAAACkUlEQVQ4T43T60tTYRwH8HMQ9QQJRSBJ50xU8BL1QpJMsbxNc162edxcYlAoZdkFh6gZurF5WV6nc7M/oBdBb7q9DSPEVBDbZtN0c5tzNymolwXht2eDhVO0Dnx4Hn6/5/me8xx4KOqQR2rcYfjpIC81BpXiqWBnxUSgpWQ0kHrY+gN1xdOdu/XTQfDGIMSGAET6AMpG/TbhiD/uv0LqTYF7cmPgN2/wQzzhh2jMB+Gwz1I65I3/Z8A1o5eRTXqP85M+pVTv260Z86JieNtcMridXNjnZvI1Lia31xV7IIgf99AKg/e1wrAN+YQHtXoPJKNbqBrewlWdG6UDLlzRupCv3sTFns3vFx47SqJCFHoPoyAb5eNb4MlGyYgb1UNuiHQulPW7UKRx4rJqE5d6HMjpdiC7066mRFpHvFTnbCHuSJ84E+rIJumQExKdEzVE5YAT5RoHCnvsyO3aQHb7Os63rSHrwRoy76+qqErNBi/ut4PYrdFsKCWDDoj77CjvXUdu+yqyWleQcsuK5GYrBE0WcE0Wm6DZmsk1W7VEI1XRu6YUqb6gUh22W9BhQ8ZtCwQ3PoEjQuM+psi5SSBNCR/Zusq7bSju+IyMpmWwjUvgrh+hcWks6scVKs0tBQ/NSG5YBKtYNHOKRRxt4WUogKufTwmh8lqXU9MaFlY42UcLJ5tnOfk8yPwov0j/LfGNUIe/huXnYrm6uTiOn2UI7GEjcxMxTrwifu7rq6KOw0o+MAT2SI8sYGtnaVJ/s68fFUCfONd2jK2e+cFWv0dY1bu+mPiTocsTmyR8kU56X//2wmtmuiMvoMkkdEkEp3K0N08XPZsKScwzdNB0zFlSz0pIaxBG6mQ0JBU/1yXmm878AbFQoHrb98HyAAAAAElFTkSuQmCC'
         },
         {
            name: 'Programm',
            root: 'CurProcD',
            path: '\\',
            subdir: 'Firefox Verzeichnisse',
            image: 'data:image/x-icon;base64,AAABAAEAEBAAAAAAAABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACQAAAB0AAAAzAAAAQgAAAEUAAAA4AAAAIwAAAA0AAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAKgQAIngOFHPPHiGf9hwnsv4aK7H+HCid9BYmiNoNEVGWAAAAOQAAAAkAAAAAAAAAAAAAAAAAAAAAAAAADhISZ4oiJaj4JTfD/yVDzf8lTNP/JU/X/yVT2f8lUNL/HDas/g4bbJsAAAAaAAAAAAAAAAAAAAAAAAAAACAmkVYeKLn+JT7I/yVL0/8lVNr/JVrd/yVf3/8lZuL/JW3k/yVk4P8bT9P+HkXBjAAAAAAAAAAAAAAAABoaaxMeMbXqJT/K/yVN1v8lWN3/JmDf/ytSr/81OWr/M0qL/yZ64/8jiez/JXXh/x9Msv4ITLo/AAAAAAAAAAAiN6B3JT7I/yVN1v8lWd3/JV3d/ytEnv81J1T/SiIe/04iFf9BISL/I6HV/xus7v8hhtn/JVCofAAAAAAAAAAAIEGw0SVL0/8lV9z/JVnb/yZn4P8oct7/Jnjg/ydjt/9RUE3/WCgR/zp3fv8axfb/EMj1/xmC0LQAAAAAAAAAABxKxv0lVNr/Jl/f/ydCyf84WaX/a0AX/3NMHP9lZEf/dUQT/2cyDf9ZNB//Q9j3/ybh/P8ap9X1AAAAAAAAAAAbWM/8JVve/yZm4P8mWNP/Nkh+/3JXLf+aWgv/mFkL/4tNBv+ARQf/bTcH/6Pw+v977v7/Opuz/gB/fwIAAAAAIWHV5SZf4P8ma+H/Jnfk/yOP5/9QZYT/qXAm/7NyHP+qaBX/mVkN/4xPCP+dtKv/lu3+/yOy1uUAAAAAAAAAAB1exJElZeL/Jm7i/yZ+5f8iheD/QHDX/2uAk//DiRP/vH4V/7V0GP+jZRn/rbKa/4js//8AyOONAAAAAAAAAAAdU7JGJVnY/yZw4/8kguX/IJLg/4p4N/+wjhv/0p0F/9GaCf/FiRD/sHkv/8Ts8P+L4/L/DcbnTQAAAAAAAAAAGVnYFB5m3P12eX39coBn/02bp/92i1H/1qYb/+GvIf/cqQz/yJId/8SlaP+539//Za/KtwAAAAAAAAAAAAAAAAAAAAAiguZSv5tRZMKXQPXBkiX/xKU3/+a2Qf/rvEj/5bQ4/9OpQP/XyZ7vkqmnegAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADkwWkd5cBimOe/X+TswV7+7sNe/um/X+HivWeRzbBOGgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=='
         },
         {
            name: 'Startup-Cache',
            root: 'ProfLD',
            path: '\\startupCache',
            subdir: 'Firefox Verzeichnisse',
            image: 'data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAB3RJTUUH1wcREBAg9OD7NAAAAAlwSFlzAAAewQAAHsEBw2lUUwAAAARnQU1BAACxjwv8YQUAAAH6SURBVHjaxVNBaxNBFP4mGRNp06bSaGu9qXhRLOSQX6Dg0d48SMWC4Mmbv8AfYA7Sgp6UgteCF29CKahBsKKWglgam4rRxGxiks3u7Mz6zZIlSVHRk7N8vLcz7/vemzczwP8eorSCgtLJJeXpUGtMBQHgK5RptxbuYJUx5o8CL5bx+OzCkyuZ2cLIwtPihbVW9a1GiCyFQyusFD4S2zfv4x5DtI2TAphOZk8zbXFE4NKt5ctInDmY8OLd6zNrtI+IlhURG0Xs55dezZXXF9Gq7CA9NQvNbAH19W/wo+6gWXeaN1aQkybEXLv2Bb36Z+SvfUAynYLgB9Y+GLEv6Sl4HTdcvX0yy4kZqdkit1nFWC4Pme4ydvMXxNiOwwTfIVP5OCBlK0Cv8Y4C5xnXYM+bB0ixTwjWHwpUdzbh+ijZSWlYQefrcxwrLJJcIZxRAWM33qP1KTCOwJ9ErbyLno8trvqRgOrsITV5ik6pT2IXvbZdINmjVr8CmYMx09h7/8wKMBtUtIWgu4/DE8e5lxob4pLsDkhhvxJrjYfE2Am065/Et1ZUQRAJTBxJIDQJZrgKZDiRwYA03AlxCF1Ho92oYGM7ElCS5/qmVjXzLx+cg71tMex5D/8Pw+ng4etd2GYpER0ucJRI26v9l2/Ivg82CI2YIP+BPCyifwI91AzKs/qQkQAAAABJRU5ErkJggg=='
         }
         ],
        
        configs: [
        // Untermenü Firefox Funktionen
        {
            name: 'Anpassen',
            command: "gCustomizeMode.enter()",
            subdir: 'Firefox Funktionen',
            image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAdhsAAHYbAfWG3pUAAAHbSURBVDhPY2QgA6jVnZD8958pmuH3zwXMUDGigVrjWZc/HMJ7f7MJBTD9/PSaJBeoNp5P+cMpPP0vAysL0/cP71m+vdJhgsoRBMq1p8t/sQnN+vufhYXx17f/zN/fJt/ptH9GlAFKFcfqfrMKdvz7y8D4/+d3Buavr1rvdtisB8kRNECxcH/lL2b+xr9//jP8//WDgeXLy8WMv3/UQaUZ8IaBWuGe3C8sQpP+M7MBFf5nYP31fiPLv5+hdye4/oYqYcAZCwsO3ArX1VScff7RD8bfv/8wsP58t4n597ewe5M94JpBAKsB3VuumnILSmzg5eVlkxXh+H/r7qNV/39+i7w/1QtFMwhgGFC26rIEB5/IXkYOPuGvP38x/PnyZrK6BGvaxhLrv1AlKAAlDM7n8vIttzmyjVNSzZrpz4/fvz+9ymsJUJ8BlcYK4C64XsQdK8z+c7fS22Oqpzmd3n758tm3J1RzDVQaJwC7YL2FAru+4au3ovzfuH98ZGS49YLP33r9x01gFQQAOB18estk8/46G/evtwwM79+wvGX4+28vWJYIwLhARUmA+8+//XyMvwx+szK+/cLCHBlx7dFuqDxBAHQBo9YPJqbVz5k4Q9/85VAgRTMDAwMDAIpDuk3/mjFSAAAAAElFTkSuQmCC'
        },

        {
            name: 'Neustart im abgesicherten Modus',
            command: "safeModeRestart();",
            subdir: 'Firefox Funktionen',
            image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACh0lEQVQ4jY2SW0iTARzFz7cvRfqclA7Lpi51tjlnikukB3VKFzQC02UPmQaVRqlpRqiVLak0UUIxsVroTAsFTUzmJY1u0HUJ2YWCVg9RCWEPZauETk8+zJZ1ns/vxx/+B5gnmZlZuRZL23W5XK6Yr+c2OwsOhFg7Lz28Zx/n9pzdVQaDwWNeoKAgT9vQUJfX2Tuw2dpqbXxhM3+6032E7VcG2HI7jcdbiu2l+8pKy0vLTWtS1+coFIoAF0GgWmucsOb/mmyP43SPjt/bwJt1ETSf3sa6JwKrHCKzbkRS1x/FDcUb7RKkKNcTfPziu7MSf07lg9/OgzNN4Mdd4IkGsPYNWDYBqgZAtAqMSNHdAqB1FXh765tXJ315HwR+zQFn1oHOMLC6Hix3gPn3QekiiAYZdQmRQwCCXXhJqYw+m5DkfA3w83LQ6Q9Oi2BBBWgaB402EI2gUCNjVLJhGECQi8DDf1F0fVKy8wHAtwqBk34CJ0WBm/aAQTZQbgFRA4pVMuoTY0YAqOY+IjxtS+XUyoxhphfeZW7FU2YUPqO5MYHdI6ClF2zqBGvPiYyO1fYDCJgrUCSkFz2XbX1Jn8IPVB91MqDsB082p9I+DI72gYM9oOWMnEuXqZoBSH9sITY2rss3bYhIe0zP7FcUTA4erDZy9CrY0wX294JFxUoCC3e4HZOPl5i9am0FoRkkDNeIyDGWHIqjrQ/s6wFbL8io0QY7AGjcCgD4rlCrbCExlYRkJcQ2luyP5Ngw2GEFjSn+BBaY/wbPJj40NPCRWptDQTjGwr3hPFUN6nSLCXhcBrDkXwIAMEiS2BGm1k/p9BrKRK93AGoAKP8Hns1iACYAhwEkAvB0V/oNnDMV0lvYzsIAAAAASUVORK5CYII='
        },
        {
            name: 'Browser-Konsole',
            command: "var { require } = ChromeUtils.importESModule('resource://devtools/shared/loader/Loader.sys.mjs', {});\
                      var { BrowserConsoleManager } = require('resource://devtools/client/webconsole/browser-console-manager');\
                      BrowserConsoleManager.openBrowserConsoleOrFocus();",
            subdir: 'Firefox Funktionen',
            image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACwElEQVQ4jU2TS28SURiG5yf5G1xo1KqJd43aJkYTEzfGuNSdMV5jotVYG6vponipF3BKL7SAlrZWipbeLdABBsoMMMOAU+48LuaYuHhzvrP5zvs933mlOJAGNoVUIAPEbNBFvS2UAmLAOpAQdylQh8G4xf05hdvftrgzneLRnEbvQpnHP0rcnda4F9K5N5Pj4XeN++Ect2dTPFnM8j7bQLoShsPDCsfdCc5Naez/orJ3LM8+v8ku12/2+i12j+bYM5LlyGSe0+MZTni26JmyuL4C0sGxBodkk0v+PBeDObq8GQ74S5yKdDgabtIV+sMeX4F9vjzHfRrn5E3OuxMckwvsd5tI5ydtetPgM2BC3eGzDu90eJsFjwkjFnwRp1eHYMYiZEBfCi6M6UgnvTqfGg4wo9VC+w9ktgWaAKgBuQ7YjQplYNSGHjmB1OU3GKyBSoOF9VnkSJQVCyzABqpABSgBfwDYxqaC3IIT4zGkQ8Earg4Ugbga5albZnQ9gwEUOlAGtBYU/jVoK1Qp8cGGUxMq0pERGCo5LzRp415WuDu2wEINFBylhIoAdQ27WSXYhG6PiXR2uMWc6B5dWmPAF0HeqqIA3qRFX/AXDz3feOL9QSRVhB0LOjBThsvvS0hXXAbzFTBMUFYTLCXKaG2HQaIIkU2DUDTD9JKOVmjDTg2aECnCjY860vURg4AFZgeaODMXO46jShvMqgOzDNhtaLccsLMmXBuOI3VPKLytw6r434rIRk4oI1asiqykRBYGS3BGXka6GorzYKPEi5hB/3KGobUi8lYVn1JjKlEloNTxrJl44jZvYhYuxeJVssKtJY2by3mkmWIH12Kagfk4r8NxXoZWeT4V4dnkPP1ff9IfXKR3fJ6BmTWeBaI8DqzwNLTBQDjJnA2SBShVx3YaSAq7qqhTYiz1vwingWTLWetfmUuJaUgo1TsAAAAASUVORK5CYII='
        },
        {
            name: 'Entwickler-Werkzeuge',
            command: "var { require } = ChromeUtils.importESModule('resource://devtools/shared/loader/Loader.sys.mjs', {});\
                var { gDevToolsBrowser } = require('devtools/client/framework/devtools-browser');\
                gDevToolsBrowser.toggleToolboxCommand(window.gBrowser, Cu.now());",
            subdir: 'Firefox Funktionen',
            image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAqJJREFUeNp0k11IU2EYx593Q0RDL1wOmheihBCoiNHFrIYgYSBDKoRMIWgwduGFjTiIdRHiQIw+iBAS6qKUrJsVlRGsC2vWRUFzEclmxMZKXWzObe377PR/cLOB64Xfzt7zPv/f+8URAwMDVNoUReGHGeRAGITy+bwfbIB0JpMhWZZ369X19fXGqqqqbgR1wJPNZrngK9jAf11bW9vRlpaWE5FI5EAikVBDEkJdblfg8/m6nU7nXeDa3NxcTiaTVFlZyQVRCHyBQEBjsVguGI3G0zU1NQ0ej0eg5gcmyEBGahTq7Ha7a3JycsjtdtcGg8FliIgH0+l0DmRTqZS2tbX1mE6nO9TU1LTf4XAEcrmcF5AKguder3d6eHh4HjMNYUsSD/j9ftre3qZoNPoLYj+vDHJqbGzUx+NxLY9xX1Xcy9ra2rTJZJofGRkZ0mq1Eh/U+vo6bW1txVQqlZb7fIDYVkUsFmPaIac9rbm5WcKWVjo6OqTjtbX7Ojs7pcXFxRW9Xn+dbweysaWlJZ9GozHX1dX1ULmGfUoLkvTWWV3tdptMQe6XDLezJBwOK4XrLttO3Sf6o0xNKfaKisCMEIdXhSALKLQeluB5sFz4PHDNdnUpqJBD/f0RhJ99E+KSC4KZf5Ky7Qr4YjAYeHnJk0QTL4k+xc1mBeEXn4WQPkBw8z8SPqTVvr4+DqeA9Sx+nhLZ7JAkR0cVhF+9F2LsDQRPMHamJHwLfB8cHORwBtzmlyxAmIttjyHJjI8rCDscQlxmwXwhfAf4zVhm4QOaK1qLAoTpISQPIJEnJhSE3y0QXS0KflutVg7LJdI9AoQJN2O7BwnfzizRR0B8GhfBDfAInCuGr/Wq6UiDoMRPhWKvZUrjXXZniTbM1ivvbHvurwADAH3gYJeBXh2yAAAAAElFTkSuQmCC',
        },	
        {
            name: 'Browser-Werkzeuge',
            command: "var { require } = ChromeUtils.importESModule('resource://devtools/shared/loader/Loader.sys.mjs', {});\
                      var { BrowserToolboxLauncher } = require('resource://devtools/client/framework/browser-toolbox/Launcher.sys.mjs');\
                      BrowserToolboxLauncher.init();",
            subdir: 'Firefox Funktionen',
            image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAdUlEQVQokZVSwRHAIAgLPYfoXs7RCTpG53Avt7APrhaFU8gLMEEJAkEQgFbc7IxkVjt0r6Sp7VIVITumBpKt00FA2ThmjXzkfMMWO8EZFSj8LrUyjsG9b9DaJXq+qAIVxEUxtLHpaXE95dj1NcK2rmbwaGJ4Af0tIg00j/6iAAAAAElFTkSuQmCC',
        },
        {
            name: 'Firefox synchronisieren',
            command: "gSync.openPrefs('menubar');",
            subdir: 'Firefox Funktionen',
            image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAA7DAAAOwwHHb6hkAAADcElEQVR4nHVTXWxTZRh+zzntOafn9Gdt3enoz8po2dauMLYat6iom5OpCwMGmswrLjRecAGBkDkTkCtCiDeQaGKCF7vQoBL0gpARJyFTxCDQwqA/6Nba/bU9Xdedru1pe3441Y2MGJ7kTb683/c835PvfT4E1jB66E2zQ2/4WG8wD+KUzmgwvsCwqYWSUC4VVSKXZsz6B6HH8c+OnPslBRuArS8yCzGqu9075vG2tkp8zhwLXieTM0HdcipmSubKlv1793Q1O5kjO1u08nfXo5P/Ezh/bOh0y9bNfdmFx8AmQiBUy4ChKFTxhspAfy9eb9ICRWCow2rqfcOjt34zEb3yVODCSM9Aq8t+vlLioLiSVjoIEFojqEmtfPt+5F5yOkgE7tymljJpqDfqwLmpzv+iiwpfmow/QmsCjYzxKzUiAggFIEkCArH83G+h9JiAGVJ3Zrh9uNpkUxH4udzyMvx6609IZ5Zg21b7F7WbsAuf9HXsaLYdl8QKIDLA71MJ9tufA+2hxeSP2z3t5MXxwJUbIVacCC6N7+5u7K7T0e4iXwUrU6exm/AfVEaafI8kcUVMBgRB4G5k/uzfSWBrzkY+v3hq44trCOKMXke/TRI4rBYqyA6P/SBKooJP2QCNYp3AcQhPZ6/Cc/Aono3ptBTUSo0TgKtU9agoVUVRFoE2bQKDmYF3X201P0+gKsrv6LQ0/FcUZLjSFJpcKl+ORKJA1VlBZ2uHXT0vndxIOjzUNliblt8P6ja3daRGpCgSaJqSI3H2Kpb/IxHydpo/RRAJtTZ3gaO5Y8vwK0z+y+9v3lKI6Ae97gkCFfS9Ps/Z9/v9XprSQKEkQI7jY/tGL5/E4gBSf5ezMfzwfudKJgFN23ZCQ9uu/pHhzuEOO/gseqxn4HXfa2+97LNqaQ1kuRJUBFEOhGc/unQjGkbWE/n10e7p2bk5Z21Em5tcYHe6gZ2bWTVoMK3DYYEtThtwRQHiC1lYzhXGDpz46SD8G7k1WCxAjw75g8nFRffKagkaLPW8BhXIRpsVXC4nJNJFKPIVKFeF8Idnrm1XKMIzf6FQAPnuP8I9iqI5bxNjL/CSSlKRMsej0oNpVszl+TxfFVO5QuVmdDExns9D9RkHa1AxDOOUZdmGYeBCAXHUzoiC9JcS9HklaPMsy8aUnrhOeALXrFu6bGkawwAAAABJRU5ErkJggg=='
        },
        {
            name: 'Zugangsdaten und Passwörter',
            command: "LoginHelper.openPasswordManager(window, { entryPoint: 'mainmenu' })",
            tooltiptext: 'about:logins',
            subdir: 'Firefox Funktionen',
            image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwACTowAAk6MAZI9dFgAAAFSSURBVDhPzVG9SgNBGPxmQ4qAZ7SRVKIIom+gIBbaWagIigg2iZVgkc4HER8jiL2dnaAgNqJGU4gaYsIR4w/J3Tq7dwb0vFOwcWCY/b7dmf2TvwKhxsI9zDqUBXKQvCL3s1PuC9UiMYDmSUqJzNlGgAo5z5BTU8QG0NxHOScHTI0mWtLEse7XE5LRt2yNM+RVmckYLJPWbNHCYu9KYxqeFFkNkXOmnRQwHKqFzvmzPNWI7tEzQUNGjcQH+JIJRx/YJi/JJVPgGR2j3wbY+yvJh2UUbQZUcWCGcSdYgwuHx4yC+6Kqdp31xokpIwHcfROP2OFCoMEnE6lTy6jBw4O6UDepIn9kK1j95Ru7ZtPvwKcx7495JX5XM1gRRTfgk1nkCDW16hTqZTuZABtAc5rmN965LWkp4E49ORv1PbviB9g3UNep4CQeUrhXZ781/weIvAOtoWn16DKkRwAAAABJRU5ErkJggg=='
        },
        {
            name: 'Task Manager',
            command: "switchToTabHavingURI('about:processes', true)",
            tooltiptext: 'about:processes',
            subdir: 'Firefox Funktionen',
            image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAMWSURBVDhPbZNPbNNWHMe/dprasR23zULGHDIEalnXVV3TFE4ITkiIG2LSxpU/F4TEASEEJ7QjTKBtB6QdBxoCtUg7QOGwCYSEAEFBFNYUUP8GktZJ7Th//Df23jMlbBJf6T372b/P9/l9/R6DTyiX3cclP9uUSaWSaUVJKXFZ+lyWpYQgcHGGgTUxcfu3setn52htB+127zohHTi494wkysMdHdEtHMelu3tkVhR5RKMsbNdEpVLCykoRmUwGenU4PnYdR9sG6XRqdNu20ePT+RnMLU5B01VUVpehEqBUKsCoarAsK2yHDh1BjFeSlKNiaVcolFTLtDH59C7u3BnHk8d/49XMUxTsN7BtMyz8IMOoguP4nrXhe4NafaWoaQZiQhye56HVasFv+XBHXQS+D3+tBUEAXdfJsjoTIU0UGjx6fE03jJopxmS4rhuasAoL8ZUERmLgd/nwFPJc8VD1NGrQ/YENO8+z/aZplUQxjqbcgLvOQRDx0cg3EBviEbABggVSuAhU31EDTiajML/QgKrZtIqC1AVP9WDN2tCmdDi2A40nAb612kvTdY1kEBMJ0km5tkGj0VyWxW44NZcEZ8NxHHJ1oJc1eO5aLiQHmoEgiDzDMALlws+gqhn1oiwnQpgWUoDOGjwks5Ddk83m8M3ACLr6eTKOsnEpJRq15Y8GpmkVeT4Gzw8QjUQwNJRF/1fDGPg6h97eQZTVejA7+6b0enr6/s9Xzt0m8BLl2gb1RrPYIjNe+Okyvlj/JVYrDTTNBhAwWFwo45dfz19UlMw9rlM0dd25TxCPchHaUW1QhmyybXfOzxWej4//ea9/IL15ONvHCYIEkbRs9tutvb2bvhsc7PshmYyPTNy6+jvl2gYv/rmr9vVtX0inld253MieZDLBOQ7579U62WgGeJ4luTit/MzUgyt/XPpxqZAPD1P7NO7Yflg6dfqYlujp6mAjLEhuJHEjqFRUdbWiPpucfP7XjZtjN94VX+ZJees99R8Dcsvs//7kvnWpno3lcqWWz88U5ucnX69qSwXy8v8Hoi3gX7e/eW+7FbGUAAAAAElFTkSuQmCC'
        },
        {
            name: 'Offline arbeiten',
            command: "BrowserOffline.toggleOfflineStatus();",
            subdir: 'Firefox Funktionen',
            image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAMUSURBVDhPXZPbS1RRFMa/vfeZ8TSXLiJZY5ZNMmhRBPVUSkUXinzIN+mhC0UvPkRID/UHFET04lOC9BAE0UtUUElXREy7l6Y5k4GXJqecu47OmXNWa5+MogU/9t7r7PXttdbeR+QMBW3CNKFsG0KqIBYHt8uqqiZj9Zo6+9u3uBgd7XqdST8/Ol8cG3Z3/zV1Xkp3IpSCIqo11tVeNXbuOq8aGraJSCQsly3bJIPB5gBhTyKXy/WUSh/cgAX7LUAE6fXuLFu/4Z5qbNwq6us9KCsDsllgfp53KZimWblLykOzuZyv17IeL8RDnRMCkKreXBu+q2prV6a5FBmNQnV3w+nthYjFYKfTSDoOAsWi2CxEw1ihYAza9hMtIAtCBopLl14wTHNFkjP5ePAg3tfU4MeLF0ix0NTQEB6EQuhpbcVYVRUMzqhl0aIzQeCAm8K417t3IhTKWuEwTe3YQZOxGCVtm3ra2mhIKbrd3EyfxsfJIaLJ48cpaprUv2QJNRvGHVdgwO9vH66ooERlJWX8foru3k2JiQmaYZGBri76nkgQOQ5NnjjhCr71+aibOe3xjLkC3X7/o75AgIaDQYqxwCdu6ZvGBppOcUFsNhNtaaF+9r9kgR6vlx4wZwwjo+NlwS6lsqUS0sUiZhjuO74vr+T2Gvo7iElWVyPP4xw3MsdvJc/MEnH3WcC0Sk84XSfDIhnLwtemJqxrb0e5z4f4tWuYS0yh7tIlWGfPIunxIMcieW52ghxLC+CyEOFOpT7f4sOu19XRh9FRt+aBkyfpLvue7dtHP+NxKnAp948coQ72XZSSqgXe63j1FEgFAGONEPutfB6rIhHEOzsx0tHhpp/98gXJwUEEKiowzP7p6Wn0sb+PcIOHh24dXK08KsT1LUSHtUNXr9Fzmykycwy/SYwwN4H+GeAYT4fcP8nhtN6xmhIiVA5s1ifrAM0sU1gY3/GrvQ284uA2Xr5m3EP+NbUWaN0oxKlyoogH8OhOpZgYkOArvsfiV3g5qDdr+1/gj61ktjI1DOu4tzvAvGF0RQsG/AKOw3K+vE21tQAAAABJRU5ErkJggg=='
        },
        // Untermenü about:
        
        /* {
            name: 'separator'
        }, */
        {
            name: 'about:about',
            command: "openTrustedLinkIn('about:about', gBrowser.selectedTab.isEmpty ? 'current' : 'tab')",
            subdir: 'about:',
            image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACkUlEQVQ4ja2SX0hTcRTHv27euz/qLvfqdtO8lRmEoLm2RTTUmWHFtlgYIlFPleNuI5cggYTJpDGIVnP+CaVQ3FtCkYQvPfYSprewxCZCUYwgUKIeHIidHvSKiPrUef2ez/ec3/l9gf9VoijmhcPhq7FYbKizszNSUVFRvFOfATggsqgEUA5AtynYbDb78PDwfCaToaWlJUokEk8A6LfxZfHThsG3rcKk38reA3Bwq8hJktQSiUSmstksLS8vr9XX11/cokv3bRih0fI1Shyi+euGNMfAAQCMw+E4KoriSQD5jY2NiUwmQ0REsiz3qnDMhhEaMBNN24nuFtH4GShGwA4AOo/Hc01RFOrq6nqZTCa/K4pCCwtpejqammIY5kTMiiHqK1yjaTtRTwk9d2sWLDoEAZgAACzLVvb393+amZmh2dlZGhsbo0g0Sg/jiWz0WO7HvwlhVYVfuDWLJgZBAGYAOer7dDqd7qzX632dSqXoZlvbvBzu+BFv2E+rj0ykwuPnMcczCAEQdvohlud5r8fjeceybDOg9QdrKn/+8YMouo8mzmmpLI95ACB/jzSgiGGY4wDMDoejnYio54p35VldLk1UW+mWif/WUlratJcBALBOpzNAROSX5UkA0RqN/utEtZXSPh/Fef53myR1ANDuBBe6XK4gEVEgEHgFoA5AIQe0tHPc5w+1tZT2+aiX4+h2SUkfAIMKakRRbKCNktcnuwGwG7oxH2jqtli+vKmqotaCgulujlu5xPNu1UAbCoVGVQNBEG4A4LZtZ+CBy3fM5sUBSfrl57j3xRtBAgCjy+UaTCaTcxaLpQfA4V3uUyBotc2n9PrHPHABgHHTHUA1ACeAI7sdSB2G9RwYAeT8A0L0/bjRXZQXAAAAAElFTkSuQmCC'
        },
        {
            name: 'about:cache',
            command: "openTrustedLinkIn('about:cache', gBrowser.selectedTab.isEmpty ? 'current' : 'tab')",
            subdir: 'about:',
            image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACkUlEQVQ4ja2SX0hTcRTHv27euz/qLvfqdtO8lRmEoLm2RTTUmWHFtlgYIlFPleNuI5cggYTJpDGIVnP+CaVQ3FtCkYQvPfYSprewxCZCUYwgUKIeHIidHvSKiPrUef2ez/ec3/l9gf9VoijmhcPhq7FYbKizszNSUVFRvFOfATggsqgEUA5AtynYbDb78PDwfCaToaWlJUokEk8A6LfxZfHThsG3rcKk38reA3Bwq8hJktQSiUSmstksLS8vr9XX11/cokv3bRih0fI1Shyi+euGNMfAAQCMw+E4KoriSQD5jY2NiUwmQ0REsiz3qnDMhhEaMBNN24nuFtH4GShGwA4AOo/Hc01RFOrq6nqZTCa/K4pCCwtpejqammIY5kTMiiHqK1yjaTtRTwk9d2sWLDoEAZgAACzLVvb393+amZmh2dlZGhsbo0g0Sg/jiWz0WO7HvwlhVYVfuDWLJgZBAGYAOer7dDqd7qzX632dSqXoZlvbvBzu+BFv2E+rj0ykwuPnMcczCAEQdvohlud5r8fjeceybDOg9QdrKn/+8YMouo8mzmmpLI95ACB/jzSgiGGY4wDMDoejnYio54p35VldLk1UW+mWif/WUlratJcBALBOpzNAROSX5UkA0RqN/utEtZXSPh/Fef53myR1ANDuBBe6XK4gEVEgEHgFoA5AIQe0tHPc5w+1tZT2+aiX4+h2SUkfAIMKakRRbKCNktcnuwGwG7oxH2jqtli+vKmqotaCgulujlu5xPNu1UAbCoVGVQNBEG4A4LZtZ+CBy3fM5sUBSfrl57j3xRtBAgCjy+UaTCaTcxaLpQfA4V3uUyBotc2n9PrHPHABgHHTHUA1ACeAI7sdSB2G9RwYAeT8A0L0/bjRXZQXAAAAAElFTkSuQmCC'
        },
        {
            name: 'about:certificate',
            command: "openTrustedLinkIn('about:certificate', gBrowser.selectedTab.isEmpty ? 'current' : 'tab')",
            subdir: 'about:',
            image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACkUlEQVQ4ja2SX0hTcRTHv27euz/qLvfqdtO8lRmEoLm2RTTUmWHFtlgYIlFPleNuI5cggYTJpDGIVnP+CaVQ3FtCkYQvPfYSprewxCZCUYwgUKIeHIidHvSKiPrUef2ez/ec3/l9gf9VoijmhcPhq7FYbKizszNSUVFRvFOfATggsqgEUA5AtynYbDb78PDwfCaToaWlJUokEk8A6LfxZfHThsG3rcKk38reA3Bwq8hJktQSiUSmstksLS8vr9XX11/cokv3bRih0fI1Shyi+euGNMfAAQCMw+E4KoriSQD5jY2NiUwmQ0REsiz3qnDMhhEaMBNN24nuFtH4GShGwA4AOo/Hc01RFOrq6nqZTCa/K4pCCwtpejqammIY5kTMiiHqK1yjaTtRTwk9d2sWLDoEAZgAACzLVvb393+amZmh2dlZGhsbo0g0Sg/jiWz0WO7HvwlhVYVfuDWLJgZBAGYAOer7dDqd7qzX632dSqXoZlvbvBzu+BFv2E+rj0ykwuPnMcczCAEQdvohlud5r8fjeceybDOg9QdrKn/+8YMouo8mzmmpLI95ACB/jzSgiGGY4wDMDoejnYio54p35VldLk1UW+mWif/WUlratJcBALBOpzNAROSX5UkA0RqN/utEtZXSPh/Fef53myR1ANDuBBe6XK4gEVEgEHgFoA5AIQe0tHPc5w+1tZT2+aiX4+h2SUkfAIMKakRRbKCNktcnuwGwG7oxH2jqtli+vKmqotaCgulujlu5xPNu1UAbCoVGVQNBEG4A4LZtZ+CBy3fM5sUBSfrl57j3xRtBAgCjy+UaTCaTcxaLpQfA4V3uUyBotc2n9PrHPHABgHHTHUA1ACeAI7sdSB2G9RwYAeT8A0L0/bjRXZQXAAAAAElFTkSuQmCC'
        },
        {
            name: 'about:checkerboard',
            command: "openTrustedLinkIn('about:checkerboard', gBrowser.selectedTab.isEmpty ? 'current' : 'tab')",
            subdir: 'about:',
            image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACkUlEQVQ4ja2SX0hTcRTHv27euz/qLvfqdtO8lRmEoLm2RTTUmWHFtlgYIlFPleNuI5cggYTJpDGIVnP+CaVQ3FtCkYQvPfYSprewxCZCUYwgUKIeHIidHvSKiPrUef2ez/ec3/l9gf9VoijmhcPhq7FYbKizszNSUVFRvFOfATggsqgEUA5AtynYbDb78PDwfCaToaWlJUokEk8A6LfxZfHThsG3rcKk38reA3Bwq8hJktQSiUSmstksLS8vr9XX11/cokv3bRih0fI1Shyi+euGNMfAAQCMw+E4KoriSQD5jY2NiUwmQ0REsiz3qnDMhhEaMBNN24nuFtH4GShGwA4AOo/Hc01RFOrq6nqZTCa/K4pCCwtpejqammIY5kTMiiHqK1yjaTtRTwk9d2sWLDoEAZgAACzLVvb393+amZmh2dlZGhsbo0g0Sg/jiWz0WO7HvwlhVYVfuDWLJgZBAGYAOer7dDqd7qzX632dSqXoZlvbvBzu+BFv2E+rj0ykwuPnMcczCAEQdvohlud5r8fjeceybDOg9QdrKn/+8YMouo8mzmmpLI95ACB/jzSgiGGY4wDMDoejnYio54p35VldLk1UW+mWif/WUlratJcBALBOpzNAROSX5UkA0RqN/utEtZXSPh/Fef53myR1ANDuBBe6XK4gEVEgEHgFoA5AIQe0tHPc5w+1tZT2+aiX4+h2SUkfAIMKakRRbKCNktcnuwGwG7oxH2jqtli+vKmqotaCgulujlu5xPNu1UAbCoVGVQNBEG4A4LZtZ+CBy3fM5sUBSfrl57j3xRtBAgCjy+UaTCaTcxaLpQfA4V3uUyBotc2n9PrHPHABgHHTHUA1ACeAI7sdSB2G9RwYAeT8A0L0/bjRXZQXAAAAAElFTkSuQmCC'
        },
        {
            name: 'about:compat',
            command: "openTrustedLinkIn('about:compat', gBrowser.selectedTab.isEmpty ? 'current' : 'tab')",
            subdir: 'about:',
            image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACkUlEQVQ4ja2SX0hTcRTHv27euz/qLvfqdtO8lRmEoLm2RTTUmWHFtlgYIlFPleNuI5cggYTJpDGIVnP+CaVQ3FtCkYQvPfYSprewxCZCUYwgUKIeHIidHvSKiPrUef2ez/ec3/l9gf9VoijmhcPhq7FYbKizszNSUVFRvFOfATggsqgEUA5AtynYbDb78PDwfCaToaWlJUokEk8A6LfxZfHThsG3rcKk38reA3Bwq8hJktQSiUSmstksLS8vr9XX11/cokv3bRih0fI1Shyi+euGNMfAAQCMw+E4KoriSQD5jY2NiUwmQ0REsiz3qnDMhhEaMBNN24nuFtH4GShGwA4AOo/Hc01RFOrq6nqZTCa/K4pCCwtpejqammIY5kTMiiHqK1yjaTtRTwk9d2sWLDoEAZgAACzLVvb393+amZmh2dlZGhsbo0g0Sg/jiWz0WO7HvwlhVYVfuDWLJgZBAGYAOer7dDqd7qzX632dSqXoZlvbvBzu+BFv2E+rj0ykwuPnMcczCAEQdvohlud5r8fjeceybDOg9QdrKn/+8YMouo8mzmmpLI95ACB/jzSgiGGY4wDMDoejnYio54p35VldLk1UW+mWif/WUlratJcBALBOpzNAROSX5UkA0RqN/utEtZXSPh/Fef53myR1ANDuBBe6XK4gEVEgEHgFoA5AIQe0tHPc5w+1tZT2+aiX4+h2SUkfAIMKakRRbKCNktcnuwGwG7oxH2jqtli+vKmqotaCgulujlu5xPNu1UAbCoVGVQNBEG4A4LZtZ+CBy3fM5sUBSfrl57j3xRtBAgCjy+UaTCaTcxaLpQfA4V3uUyBotc2n9PrHPHABgHHTHUA1ACeAI7sdSB2G9RwYAeT8A0L0/bjRXZQXAAAAAElFTkSuQmCC'
        },
        {
            name: 'about:config',
            command: "openTrustedLinkIn('about:config', gBrowser.selectedTab.isEmpty ? 'current' : 'tab')",
            subdir: 'about:',
            image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACkUlEQVQ4ja2SX0hTcRTHv27euz/qLvfqdtO8lRmEoLm2RTTUmWHFtlgYIlFPleNuI5cggYTJpDGIVnP+CaVQ3FtCkYQvPfYSprewxCZCUYwgUKIeHIidHvSKiPrUef2ez/ec3/l9gf9VoijmhcPhq7FYbKizszNSUVFRvFOfATggsqgEUA5AtynYbDb78PDwfCaToaWlJUokEk8A6LfxZfHThsG3rcKk38reA3Bwq8hJktQSiUSmstksLS8vr9XX11/cokv3bRih0fI1Shyi+euGNMfAAQCMw+E4KoriSQD5jY2NiUwmQ0REsiz3qnDMhhEaMBNN24nuFtH4GShGwA4AOo/Hc01RFOrq6nqZTCa/K4pCCwtpejqammIY5kTMiiHqK1yjaTtRTwk9d2sWLDoEAZgAACzLVvb393+amZmh2dlZGhsbo0g0Sg/jiWz0WO7HvwlhVYVfuDWLJgZBAGYAOer7dDqd7qzX632dSqXoZlvbvBzu+BFv2E+rj0ykwuPnMcczCAEQdvohlud5r8fjeceybDOg9QdrKn/+8YMouo8mzmmpLI95ACB/jzSgiGGY4wDMDoejnYio54p35VldLk1UW+mWif/WUlratJcBALBOpzNAROSX5UkA0RqN/utEtZXSPh/Fef53myR1ANDuBBe6XK4gEVEgEHgFoA5AIQe0tHPc5w+1tZT2+aiX4+h2SUkfAIMKakRRbKCNktcnuwGwG7oxH2jqtli+vKmqotaCgulujlu5xPNu1UAbCoVGVQNBEG4A4LZtZ+CBy3fM5sUBSfrl57j3xRtBAgCjy+UaTCaTcxaLpQfA4V3uUyBotc2n9PrHPHABgHHTHUA1ACeAI7sdSB2G9RwYAeT8A0L0/bjRXZQXAAAAAElFTkSuQmCC'
        },
        {
            name: 'about:crashes',
            command: "openTrustedLinkIn('about:crashes', gBrowser.selectedTab.isEmpty ? 'current' : 'tab')",
            subdir: 'about:',
            image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACkUlEQVQ4ja2SX0hTcRTHv27euz/qLvfqdtO8lRmEoLm2RTTUmWHFtlgYIlFPleNuI5cggYTJpDGIVnP+CaVQ3FtCkYQvPfYSprewxCZCUYwgUKIeHIidHvSKiPrUef2ez/ec3/l9gf9VoijmhcPhq7FYbKizszNSUVFRvFOfATggsqgEUA5AtynYbDb78PDwfCaToaWlJUokEk8A6LfxZfHThsG3rcKk38reA3Bwq8hJktQSiUSmstksLS8vr9XX11/cokv3bRih0fI1Shyi+euGNMfAAQCMw+E4KoriSQD5jY2NiUwmQ0REsiz3qnDMhhEaMBNN24nuFtH4GShGwA4AOo/Hc01RFOrq6nqZTCa/K4pCCwtpejqammIY5kTMiiHqK1yjaTtRTwk9d2sWLDoEAZgAACzLVvb393+amZmh2dlZGhsbo0g0Sg/jiWz0WO7HvwlhVYVfuDWLJgZBAGYAOer7dDqd7qzX632dSqXoZlvbvBzu+BFv2E+rj0ykwuPnMcczCAEQdvohlud5r8fjeceybDOg9QdrKn/+8YMouo8mzmmpLI95ACB/jzSgiGGY4wDMDoejnYio54p35VldLk1UW+mWif/WUlratJcBALBOpzNAROSX5UkA0RqN/utEtZXSPh/Fef53myR1ANDuBBe6XK4gEVEgEHgFoA5AIQe0tHPc5w+1tZT2+aiX4+h2SUkfAIMKakRRbKCNktcnuwGwG7oxH2jqtli+vKmqotaCgulujlu5xPNu1UAbCoVGVQNBEG4A4LZtZ+CBy3fM5sUBSfrl57j3xRtBAgCjy+UaTCaTcxaLpQfA4V3uUyBotc2n9PrHPHABgHHTHUA1ACeAI7sdSB2G9RwYAeT8A0L0/bjRXZQXAAAAAElFTkSuQmCC'
        },
        {
            name: 'about:debugging',
            command: "openTrustedLinkIn('about:debugging', gBrowser.selectedTab.isEmpty ? 'current' : 'tab')",
            subdir: 'about:',
            image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACkUlEQVQ4ja2SX0hTcRTHv27euz/qLvfqdtO8lRmEoLm2RTTUmWHFtlgYIlFPleNuI5cggYTJpDGIVnP+CaVQ3FtCkYQvPfYSprewxCZCUYwgUKIeHIidHvSKiPrUef2ez/ec3/l9gf9VoijmhcPhq7FYbKizszNSUVFRvFOfATggsqgEUA5AtynYbDb78PDwfCaToaWlJUokEk8A6LfxZfHThsG3rcKk38reA3Bwq8hJktQSiUSmstksLS8vr9XX11/cokv3bRih0fI1Shyi+euGNMfAAQCMw+E4KoriSQD5jY2NiUwmQ0REsiz3qnDMhhEaMBNN24nuFtH4GShGwA4AOo/Hc01RFOrq6nqZTCa/K4pCCwtpejqammIY5kTMiiHqK1yjaTtRTwk9d2sWLDoEAZgAACzLVvb393+amZmh2dlZGhsbo0g0Sg/jiWz0WO7HvwlhVYVfuDWLJgZBAGYAOer7dDqd7qzX632dSqXoZlvbvBzu+BFv2E+rj0ykwuPnMcczCAEQdvohlud5r8fjeceybDOg9QdrKn/+8YMouo8mzmmpLI95ACB/jzSgiGGY4wDMDoejnYio54p35VldLk1UW+mWif/WUlratJcBALBOpzNAROSX5UkA0RqN/utEtZXSPh/Fef53myR1ANDuBBe6XK4gEVEgEHgFoA5AIQe0tHPc5w+1tZT2+aiX4+h2SUkfAIMKakRRbKCNktcnuwGwG7oxH2jqtli+vKmqotaCgulujlu5xPNu1UAbCoVGVQNBEG4A4LZtZ+CBy3fM5sUBSfrl57j3xRtBAgCjy+UaTCaTcxaLpQfA4V3uUyBotc2n9PrHPHABgHHTHUA1ACeAI7sdSB2G9RwYAeT8A0L0/bjRXZQXAAAAAElFTkSuQmCC'
        },
        {
            name: 'about:downloads',
            command: "openTrustedLinkIn('about:downloads', gBrowser.selectedTab.isEmpty ? 'current' : 'tab')",
            subdir: 'about:',
            image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACkUlEQVQ4ja2SX0hTcRTHv27euz/qLvfqdtO8lRmEoLm2RTTUmWHFtlgYIlFPleNuI5cggYTJpDGIVnP+CaVQ3FtCkYQvPfYSprewxCZCUYwgUKIeHIidHvSKiPrUef2ez/ec3/l9gf9VoijmhcPhq7FYbKizszNSUVFRvFOfATggsqgEUA5AtynYbDb78PDwfCaToaWlJUokEk8A6LfxZfHThsG3rcKk38reA3Bwq8hJktQSiUSmstksLS8vr9XX11/cokv3bRih0fI1Shyi+euGNMfAAQCMw+E4KoriSQD5jY2NiUwmQ0REsiz3qnDMhhEaMBNN24nuFtH4GShGwA4AOo/Hc01RFOrq6nqZTCa/K4pCCwtpejqammIY5kTMiiHqK1yjaTtRTwk9d2sWLDoEAZgAACzLVvb393+amZmh2dlZGhsbo0g0Sg/jiWz0WO7HvwlhVYVfuDWLJgZBAGYAOer7dDqd7qzX632dSqXoZlvbvBzu+BFv2E+rj0ykwuPnMcczCAEQdvohlud5r8fjeceybDOg9QdrKn/+8YMouo8mzmmpLI95ACB/jzSgiGGY4wDMDoejnYio54p35VldLk1UW+mWif/WUlratJcBALBOpzNAROSX5UkA0RqN/utEtZXSPh/Fef53myR1ANDuBBe6XK4gEVEgEHgFoA5AIQe0tHPc5w+1tZT2+aiX4+h2SUkfAIMKakRRbKCNktcnuwGwG7oxH2jqtli+vKmqotaCgulujlu5xPNu1UAbCoVGVQNBEG4A4LZtZ+CBy3fM5sUBSfrl57j3xRtBAgCjy+UaTCaTcxaLpQfA4V3uUyBotc2n9PrHPHABgHHTHUA1ACeAI7sdSB2G9RwYAeT8A0L0/bjRXZQXAAAAAElFTkSuQmCC'
        },
        {
            name: 'about:logging',
            command: "openTrustedLinkIn('about:logging', gBrowser.selectedTab.isEmpty ? 'current' : 'tab')",
            subdir: 'about:',
            image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACkUlEQVQ4ja2SX0hTcRTHv27euz/qLvfqdtO8lRmEoLm2RTTUmWHFtlgYIlFPleNuI5cggYTJpDGIVnP+CaVQ3FtCkYQvPfYSprewxCZCUYwgUKIeHIidHvSKiPrUef2ez/ec3/l9gf9VoijmhcPhq7FYbKizszNSUVFRvFOfATggsqgEUA5AtynYbDb78PDwfCaToaWlJUokEk8A6LfxZfHThsG3rcKk38reA3Bwq8hJktQSiUSmstksLS8vr9XX11/cokv3bRih0fI1Shyi+euGNMfAAQCMw+E4KoriSQD5jY2NiUwmQ0REsiz3qnDMhhEaMBNN24nuFtH4GShGwA4AOo/Hc01RFOrq6nqZTCa/K4pCCwtpejqammIY5kTMiiHqK1yjaTtRTwk9d2sWLDoEAZgAACzLVvb393+amZmh2dlZGhsbo0g0Sg/jiWz0WO7HvwlhVYVfuDWLJgZBAGYAOer7dDqd7qzX632dSqXoZlvbvBzu+BFv2E+rj0ykwuPnMcczCAEQdvohlud5r8fjeceybDOg9QdrKn/+8YMouo8mzmmpLI95ACB/jzSgiGGY4wDMDoejnYio54p35VldLk1UW+mWif/WUlratJcBALBOpzNAROSX5UkA0RqN/utEtZXSPh/Fef53myR1ANDuBBe6XK4gEVEgEHgFoA5AIQe0tHPc5w+1tZT2+aiX4+h2SUkfAIMKakRRbKCNktcnuwGwG7oxH2jqtli+vKmqotaCgulujlu5xPNu1UAbCoVGVQNBEG4A4LZtZ+CBy3fM5sUBSfrl57j3xRtBAgCjy+UaTCaTcxaLpQfA4V3uUyBotc2n9PrHPHABgHHTHUA1ACeAI7sdSB2G9RwYAeT8A0L0/bjRXZQXAAAAAElFTkSuQmCC'
        },
        {
            name: 'about:logins',
            command: "openTrustedLinkIn('about:logins', gBrowser.selectedTab.isEmpty ? 'current' : 'tab')",
            subdir: 'about:',
            image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACkUlEQVQ4ja2SX0hTcRTHv27euz/qLvfqdtO8lRmEoLm2RTTUmWHFtlgYIlFPleNuI5cggYTJpDGIVnP+CaVQ3FtCkYQvPfYSprewxCZCUYwgUKIeHIidHvSKiPrUef2ez/ec3/l9gf9VoijmhcPhq7FYbKizszNSUVFRvFOfATggsqgEUA5AtynYbDb78PDwfCaToaWlJUokEk8A6LfxZfHThsG3rcKk38reA3Bwq8hJktQSiUSmstksLS8vr9XX11/cokv3bRih0fI1Shyi+euGNMfAAQCMw+E4KoriSQD5jY2NiUwmQ0REsiz3qnDMhhEaMBNN24nuFtH4GShGwA4AOo/Hc01RFOrq6nqZTCa/K4pCCwtpejqammIY5kTMiiHqK1yjaTtRTwk9d2sWLDoEAZgAACzLVvb393+amZmh2dlZGhsbo0g0Sg/jiWz0WO7HvwlhVYVfuDWLJgZBAGYAOer7dDqd7qzX632dSqXoZlvbvBzu+BFv2E+rj0ykwuPnMcczCAEQdvohlud5r8fjeceybDOg9QdrKn/+8YMouo8mzmmpLI95ACB/jzSgiGGY4wDMDoejnYio54p35VldLk1UW+mWif/WUlratJcBALBOpzNAROSX5UkA0RqN/utEtZXSPh/Fef53myR1ANDuBBe6XK4gEVEgEHgFoA5AIQe0tHPc5w+1tZT2+aiX4+h2SUkfAIMKakRRbKCNktcnuwGwG7oxH2jqtli+vKmqotaCgulujlu5xPNu1UAbCoVGVQNBEG4A4LZtZ+CBy3fM5sUBSfrl57j3xRtBAgCjy+UaTCaTcxaLpQfA4V3uUyBotc2n9PrHPHABgHHTHUA1ACeAI7sdSB2G9RwYAeT8A0L0/bjRXZQXAAAAAElFTkSuQmCC'
        },
        {
            name: 'about:memory',
            command: "openTrustedLinkIn('about:memory', gBrowser.selectedTab.isEmpty ? 'current' : 'tab')",
            subdir: 'about:',
            image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACkUlEQVQ4ja2SX0hTcRTHv27euz/qLvfqdtO8lRmEoLm2RTTUmWHFtlgYIlFPleNuI5cggYTJpDGIVnP+CaVQ3FtCkYQvPfYSprewxCZCUYwgUKIeHIidHvSKiPrUef2ez/ec3/l9gf9VoijmhcPhq7FYbKizszNSUVFRvFOfATggsqgEUA5AtynYbDb78PDwfCaToaWlJUokEk8A6LfxZfHThsG3rcKk38reA3Bwq8hJktQSiUSmstksLS8vr9XX11/cokv3bRih0fI1Shyi+euGNMfAAQCMw+E4KoriSQD5jY2NiUwmQ0REsiz3qnDMhhEaMBNN24nuFtH4GShGwA4AOo/Hc01RFOrq6nqZTCa/K4pCCwtpejqammIY5kTMiiHqK1yjaTtRTwk9d2sWLDoEAZgAACzLVvb393+amZmh2dlZGhsbo0g0Sg/jiWz0WO7HvwlhVYVfuDWLJgZBAGYAOer7dDqd7qzX632dSqXoZlvbvBzu+BFv2E+rj0ykwuPnMcczCAEQdvohlud5r8fjeceybDOg9QdrKn/+8YMouo8mzmmpLI95ACB/jzSgiGGY4wDMDoejnYio54p35VldLk1UW+mWif/WUlratJcBALBOpzNAROSX5UkA0RqN/utEtZXSPh/Fef53myR1ANDuBBe6XK4gEVEgEHgFoA5AIQe0tHPc5w+1tZT2+aiX4+h2SUkfAIMKakRRbKCNktcnuwGwG7oxH2jqtli+vKmqotaCgulujlu5xPNu1UAbCoVGVQNBEG4A4LZtZ+CBy3fM5sUBSfrl57j3xRtBAgCjy+UaTCaTcxaLpQfA4V3uUyBotc2n9PrHPHABgHHTHUA1ACeAI7sdSB2G9RwYAeT8A0L0/bjRXZQXAAAAAElFTkSuQmCC'
        },
        {
            name: 'about:networking',
            command: "openTrustedLinkIn('about:networking', gBrowser.selectedTab.isEmpty ? 'current' : 'tab')",
            subdir: 'about:',
            image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACkUlEQVQ4ja2SX0hTcRTHv27euz/qLvfqdtO8lRmEoLm2RTTUmWHFtlgYIlFPleNuI5cggYTJpDGIVnP+CaVQ3FtCkYQvPfYSprewxCZCUYwgUKIeHIidHvSKiPrUef2ez/ec3/l9gf9VoijmhcPhq7FYbKizszNSUVFRvFOfATggsqgEUA5AtynYbDb78PDwfCaToaWlJUokEk8A6LfxZfHThsG3rcKk38reA3Bwq8hJktQSiUSmstksLS8vr9XX11/cokv3bRih0fI1Shyi+euGNMfAAQCMw+E4KoriSQD5jY2NiUwmQ0REsiz3qnDMhhEaMBNN24nuFtH4GShGwA4AOo/Hc01RFOrq6nqZTCa/K4pCCwtpejqammIY5kTMiiHqK1yjaTtRTwk9d2sWLDoEAZgAACzLVvb393+amZmh2dlZGhsbo0g0Sg/jiWz0WO7HvwlhVYVfuDWLJgZBAGYAOer7dDqd7qzX632dSqXoZlvbvBzu+BFv2E+rj0ykwuPnMcczCAEQdvohlud5r8fjeceybDOg9QdrKn/+8YMouo8mzmmpLI95ACB/jzSgiGGY4wDMDoejnYio54p35VldLk1UW+mWif/WUlratJcBALBOpzNAROSX5UkA0RqN/utEtZXSPh/Fef53myR1ANDuBBe6XK4gEVEgEHgFoA5AIQe0tHPc5w+1tZT2+aiX4+h2SUkfAIMKakRRbKCNktcnuwGwG7oxH2jqtli+vKmqotaCgulujlu5xPNu1UAbCoVGVQNBEG4A4LZtZ+CBy3fM5sUBSfrl57j3xRtBAgCjy+UaTCaTcxaLpQfA4V3uUyBotc2n9PrHPHABgHHTHUA1ACeAI7sdSB2G9RwYAeT8A0L0/bjRXZQXAAAAAElFTkSuQmCC'
        },
        {
            name: 'about:processes',
            command: "openTrustedLinkIn('about:processes', gBrowser.selectedTab.isEmpty ? 'current' : 'tab')",
            tooltiptext: 'Task Manager',
            subdir: 'about:',
            image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACkUlEQVQ4ja2SX0hTcRTHv27euz/qLvfqdtO8lRmEoLm2RTTUmWHFtlgYIlFPleNuI5cggYTJpDGIVnP+CaVQ3FtCkYQvPfYSprewxCZCUYwgUKIeHIidHvSKiPrUef2ez/ec3/l9gf9VoijmhcPhq7FYbKizszNSUVFRvFOfATggsqgEUA5AtynYbDb78PDwfCaToaWlJUokEk8A6LfxZfHThsG3rcKk38reA3Bwq8hJktQSiUSmstksLS8vr9XX11/cokv3bRih0fI1Shyi+euGNMfAAQCMw+E4KoriSQD5jY2NiUwmQ0REsiz3qnDMhhEaMBNN24nuFtH4GShGwA4AOo/Hc01RFOrq6nqZTCa/K4pCCwtpejqammIY5kTMiiHqK1yjaTtRTwk9d2sWLDoEAZgAACzLVvb393+amZmh2dlZGhsbo0g0Sg/jiWz0WO7HvwlhVYVfuDWLJgZBAGYAOer7dDqd7qzX632dSqXoZlvbvBzu+BFv2E+rj0ykwuPnMcczCAEQdvohlud5r8fjeceybDOg9QdrKn/+8YMouo8mzmmpLI95ACB/jzSgiGGY4wDMDoejnYio54p35VldLk1UW+mWif/WUlratJcBALBOpzNAROSX5UkA0RqN/utEtZXSPh/Fef53myR1ANDuBBe6XK4gEVEgEHgFoA5AIQe0tHPc5w+1tZT2+aiX4+h2SUkfAIMKakRRbKCNktcnuwGwG7oxH2jqtli+vKmqotaCgulujlu5xPNu1UAbCoVGVQNBEG4A4LZtZ+CBy3fM5sUBSfrl57j3xRtBAgCjy+UaTCaTcxaLpQfA4V3uUyBotc2n9PrHPHABgHHTHUA1ACeAI7sdSB2G9RwYAeT8A0L0/bjRXZQXAAAAAElFTkSuQmCC'
        },
        {
            name: 'about:policies',
            command: "openTrustedLinkIn('about:policies', gBrowser.selectedTab.isEmpty ? 'current' : 'tab')",
            subdir: 'about:',
            image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACkUlEQVQ4ja2SX0hTcRTHv27euz/qLvfqdtO8lRmEoLm2RTTUmWHFtlgYIlFPleNuI5cggYTJpDGIVnP+CaVQ3FtCkYQvPfYSprewxCZCUYwgUKIeHIidHvSKiPrUef2ez/ec3/l9gf9VoijmhcPhq7FYbKizszNSUVFRvFOfATggsqgEUA5AtynYbDb78PDwfCaToaWlJUokEk8A6LfxZfHThsG3rcKk38reA3Bwq8hJktQSiUSmstksLS8vr9XX11/cokv3bRih0fI1Shyi+euGNMfAAQCMw+E4KoriSQD5jY2NiUwmQ0REsiz3qnDMhhEaMBNN24nuFtH4GShGwA4AOo/Hc01RFOrq6nqZTCa/K4pCCwtpejqammIY5kTMiiHqK1yjaTtRTwk9d2sWLDoEAZgAACzLVvb393+amZmh2dlZGhsbo0g0Sg/jiWz0WO7HvwlhVYVfuDWLJgZBAGYAOer7dDqd7qzX632dSqXoZlvbvBzu+BFv2E+rj0ykwuPnMcczCAEQdvohlud5r8fjeceybDOg9QdrKn/+8YMouo8mzmmpLI95ACB/jzSgiGGY4wDMDoejnYio54p35VldLk1UW+mWif/WUlratJcBALBOpzNAROSX5UkA0RqN/utEtZXSPh/Fef53myR1ANDuBBe6XK4gEVEgEHgFoA5AIQe0tHPc5w+1tZT2+aiX4+h2SUkfAIMKakRRbKCNktcnuwGwG7oxH2jqtli+vKmqotaCgulujlu5xPNu1UAbCoVGVQNBEG4A4LZtZ+CBy3fM5sUBSfrl57j3xRtBAgCjy+UaTCaTcxaLpQfA4V3uUyBotc2n9PrHPHABgHHTHUA1ACeAI7sdSB2G9RwYAeT8A0L0/bjRXZQXAAAAAElFTkSuQmCC'
        },
        {
            name: 'about:profiles',
            command: "openTrustedLinkIn('about:profiles', gBrowser.selectedTab.isEmpty ? 'current' : 'tab')",
            subdir: 'about:',
            image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACkUlEQVQ4ja2SX0hTcRTHv27euz/qLvfqdtO8lRmEoLm2RTTUmWHFtlgYIlFPleNuI5cggYTJpDGIVnP+CaVQ3FtCkYQvPfYSprewxCZCUYwgUKIeHIidHvSKiPrUef2ez/ec3/l9gf9VoijmhcPhq7FYbKizszNSUVFRvFOfATggsqgEUA5AtynYbDb78PDwfCaToaWlJUokEk8A6LfxZfHThsG3rcKk38reA3Bwq8hJktQSiUSmstksLS8vr9XX11/cokv3bRih0fI1Shyi+euGNMfAAQCMw+E4KoriSQD5jY2NiUwmQ0REsiz3qnDMhhEaMBNN24nuFtH4GShGwA4AOo/Hc01RFOrq6nqZTCa/K4pCCwtpejqammIY5kTMiiHqK1yjaTtRTwk9d2sWLDoEAZgAACzLVvb393+amZmh2dlZGhsbo0g0Sg/jiWz0WO7HvwlhVYVfuDWLJgZBAGYAOer7dDqd7qzX632dSqXoZlvbvBzu+BFv2E+rj0ykwuPnMcczCAEQdvohlud5r8fjeceybDOg9QdrKn/+8YMouo8mzmmpLI95ACB/jzSgiGGY4wDMDoejnYio54p35VldLk1UW+mWif/WUlratJcBALBOpzNAROSX5UkA0RqN/utEtZXSPh/Fef53myR1ANDuBBe6XK4gEVEgEHgFoA5AIQe0tHPc5w+1tZT2+aiX4+h2SUkfAIMKakRRbKCNktcnuwGwG7oxH2jqtli+vKmqotaCgulujlu5xPNu1UAbCoVGVQNBEG4A4LZtZ+CBy3fM5sUBSfrl57j3xRtBAgCjy+UaTCaTcxaLpQfA4V3uUyBotc2n9PrHPHABgHHTHUA1ACeAI7sdSB2G9RwYAeT8A0L0/bjRXZQXAAAAAElFTkSuQmCC'
        },
        {
            name: 'about:profiling',
            command: "openTrustedLinkIn('about:profiling', gBrowser.selectedTab.isEmpty ? 'current' : 'tab')",
            subdir: 'about:',
            image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACkUlEQVQ4ja2SX0hTcRTHv27euz/qLvfqdtO8lRmEoLm2RTTUmWHFtlgYIlFPleNuI5cggYTJpDGIVnP+CaVQ3FtCkYQvPfYSprewxCZCUYwgUKIeHIidHvSKiPrUef2ez/ec3/l9gf9VoijmhcPhq7FYbKizszNSUVFRvFOfATggsqgEUA5AtynYbDb78PDwfCaToaWlJUokEk8A6LfxZfHThsG3rcKk38reA3Bwq8hJktQSiUSmstksLS8vr9XX11/cokv3bRih0fI1Shyi+euGNMfAAQCMw+E4KoriSQD5jY2NiUwmQ0REsiz3qnDMhhEaMBNN24nuFtH4GShGwA4AOo/Hc01RFOrq6nqZTCa/K4pCCwtpejqammIY5kTMiiHqK1yjaTtRTwk9d2sWLDoEAZgAACzLVvb393+amZmh2dlZGhsbo0g0Sg/jiWz0WO7HvwlhVYVfuDWLJgZBAGYAOer7dDqd7qzX632dSqXoZlvbvBzu+BFv2E+rj0ykwuPnMcczCAEQdvohlud5r8fjeceybDOg9QdrKn/+8YMouo8mzmmpLI95ACB/jzSgiGGY4wDMDoejnYio54p35VldLk1UW+mWif/WUlratJcBALBOpzNAROSX5UkA0RqN/utEtZXSPh/Fef53myR1ANDuBBe6XK4gEVEgEHgFoA5AIQe0tHPc5w+1tZT2+aiX4+h2SUkfAIMKakRRbKCNktcnuwGwG7oxH2jqtli+vKmqotaCgulujlu5xPNu1UAbCoVGVQNBEG4A4LZtZ+CBy3fM5sUBSfrl57j3xRtBAgCjy+UaTCaTcxaLpQfA4V3uUyBotc2n9PrHPHABgHHTHUA1ACeAI7sdSB2G9RwYAeT8A0L0/bjRXZQXAAAAAElFTkSuQmCC'
        },
        {
            name: 'about:protections',
            command: "openTrustedLinkIn('about:protections', gBrowser.selectedTab.isEmpty ? 'current' : 'tab')",
            subdir: 'about:',
            image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACkUlEQVQ4ja2SX0hTcRTHv27euz/qLvfqdtO8lRmEoLm2RTTUmWHFtlgYIlFPleNuI5cggYTJpDGIVnP+CaVQ3FtCkYQvPfYSprewxCZCUYwgUKIeHIidHvSKiPrUef2ez/ec3/l9gf9VoijmhcPhq7FYbKizszNSUVFRvFOfATggsqgEUA5AtynYbDb78PDwfCaToaWlJUokEk8A6LfxZfHThsG3rcKk38reA3Bwq8hJktQSiUSmstksLS8vr9XX11/cokv3bRih0fI1Shyi+euGNMfAAQCMw+E4KoriSQD5jY2NiUwmQ0REsiz3qnDMhhEaMBNN24nuFtH4GShGwA4AOo/Hc01RFOrq6nqZTCa/K4pCCwtpejqammIY5kTMiiHqK1yjaTtRTwk9d2sWLDoEAZgAACzLVvb393+amZmh2dlZGhsbo0g0Sg/jiWz0WO7HvwlhVYVfuDWLJgZBAGYAOer7dDqd7qzX632dSqXoZlvbvBzu+BFv2E+rj0ykwuPnMcczCAEQdvohlud5r8fjeceybDOg9QdrKn/+8YMouo8mzmmpLI95ACB/jzSgiGGY4wDMDoejnYio54p35VldLk1UW+mWif/WUlratJcBALBOpzNAROSX5UkA0RqN/utEtZXSPh/Fef53myR1ANDuBBe6XK4gEVEgEHgFoA5AIQe0tHPc5w+1tZT2+aiX4+h2SUkfAIMKakRRbKCNktcnuwGwG7oxH2jqtli+vKmqotaCgulujlu5xPNu1UAbCoVGVQNBEG4A4LZtZ+CBy3fM5sUBSfrl57j3xRtBAgCjy+UaTCaTcxaLpQfA4V3uUyBotc2n9PrHPHABgHHTHUA1ACeAI7sdSB2G9RwYAeT8A0L0/bjRXZQXAAAAAElFTkSuQmCC'
        },
        {
            name: 'about:rights',
            command: "openTrustedLinkIn('about:rights', gBrowser.selectedTab.isEmpty ? 'current' : 'tab')",
            subdir: 'about:',
            image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACkUlEQVQ4ja2SX0hTcRTHv27euz/qLvfqdtO8lRmEoLm2RTTUmWHFtlgYIlFPleNuI5cggYTJpDGIVnP+CaVQ3FtCkYQvPfYSprewxCZCUYwgUKIeHIidHvSKiPrUef2ez/ec3/l9gf9VoijmhcPhq7FYbKizszNSUVFRvFOfATggsqgEUA5AtynYbDb78PDwfCaToaWlJUokEk8A6LfxZfHThsG3rcKk38reA3Bwq8hJktQSiUSmstksLS8vr9XX11/cokv3bRih0fI1Shyi+euGNMfAAQCMw+E4KoriSQD5jY2NiUwmQ0REsiz3qnDMhhEaMBNN24nuFtH4GShGwA4AOo/Hc01RFOrq6nqZTCa/K4pCCwtpejqammIY5kTMiiHqK1yjaTtRTwk9d2sWLDoEAZgAACzLVvb393+amZmh2dlZGhsbo0g0Sg/jiWz0WO7HvwlhVYVfuDWLJgZBAGYAOer7dDqd7qzX632dSqXoZlvbvBzu+BFv2E+rj0ykwuPnMcczCAEQdvohlud5r8fjeceybDOg9QdrKn/+8YMouo8mzmmpLI95ACB/jzSgiGGY4wDMDoejnYio54p35VldLk1UW+mWif/WUlratJcBALBOpzNAROSX5UkA0RqN/utEtZXSPh/Fef53myR1ANDuBBe6XK4gEVEgEHgFoA5AIQe0tHPc5w+1tZT2+aiX4+h2SUkfAIMKakRRbKCNktcnuwGwG7oxH2jqtli+vKmqotaCgulujlu5xPNu1UAbCoVGVQNBEG4A4LZtZ+CBy3fM5sUBSfrl57j3xRtBAgCjy+UaTCaTcxaLpQfA4V3uUyBotc2n9PrHPHABgHHTHUA1ACeAI7sdSB2G9RwYAeT8A0L0/bjRXZQXAAAAAElFTkSuQmCC'
        },
		{
            name: 'about:serviceworkers',
            command: "openTrustedLinkIn('about:serviceworkers', gBrowser.selectedTab.isEmpty ? 'current' : 'tab')",
            subdir: 'about:',
            image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACkUlEQVQ4ja2SX0hTcRTHv27euz/qLvfqdtO8lRmEoLm2RTTUmWHFtlgYIlFPleNuI5cggYTJpDGIVnP+CaVQ3FtCkYQvPfYSprewxCZCUYwgUKIeHIidHvSKiPrUef2ez/ec3/l9gf9VoijmhcPhq7FYbKizszNSUVFRvFOfATggsqgEUA5AtynYbDb78PDwfCaToaWlJUokEk8A6LfxZfHThsG3rcKk38reA3Bwq8hJktQSiUSmstksLS8vr9XX11/cokv3bRih0fI1Shyi+euGNMfAAQCMw+E4KoriSQD5jY2NiUwmQ0REsiz3qnDMhhEaMBNN24nuFtH4GShGwA4AOo/Hc01RFOrq6nqZTCa/K4pCCwtpejqammIY5kTMiiHqK1yjaTtRTwk9d2sWLDoEAZgAACzLVvb393+amZmh2dlZGhsbo0g0Sg/jiWz0WO7HvwlhVYVfuDWLJgZBAGYAOer7dDqd7qzX632dSqXoZlvbvBzu+BFv2E+rj0ykwuPnMcczCAEQdvohlud5r8fjeceybDOg9QdrKn/+8YMouo8mzmmpLI95ACB/jzSgiGGY4wDMDoejnYio54p35VldLk1UW+mWif/WUlratJcBALBOpzNAROSX5UkA0RqN/utEtZXSPh/Fef53myR1ANDuBBe6XK4gEVEgEHgFoA5AIQe0tHPc5w+1tZT2+aiX4+h2SUkfAIMKakRRbKCNktcnuwGwG7oxH2jqtli+vKmqotaCgulujlu5xPNu1UAbCoVGVQNBEG4A4LZtZ+CBy3fM5sUBSfrl57j3xRtBAgCjy+UaTCaTcxaLpQfA4V3uUyBotc2n9PrHPHABgHHTHUA1ACeAI7sdSB2G9RwYAeT8A0L0/bjRXZQXAAAAAElFTkSuQmCC'
        },
        {
            name: 'about:studies',
            command: "openTrustedLinkIn('about:studies', gBrowser.selectedTab.isEmpty ? 'current' : 'tab')",
            subdir: 'about:',
            image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACkUlEQVQ4ja2SX0hTcRTHv27euz/qLvfqdtO8lRmEoLm2RTTUmWHFtlgYIlFPleNuI5cggYTJpDGIVnP+CaVQ3FtCkYQvPfYSprewxCZCUYwgUKIeHIidHvSKiPrUef2ez/ec3/l9gf9VoijmhcPhq7FYbKizszNSUVFRvFOfATggsqgEUA5AtynYbDb78PDwfCaToaWlJUokEk8A6LfxZfHThsG3rcKk38reA3Bwq8hJktQSiUSmstksLS8vr9XX11/cokv3bRih0fI1Shyi+euGNMfAAQCMw+E4KoriSQD5jY2NiUwmQ0REsiz3qnDMhhEaMBNN24nuFtH4GShGwA4AOo/Hc01RFOrq6nqZTCa/K4pCCwtpejqammIY5kTMiiHqK1yjaTtRTwk9d2sWLDoEAZgAACzLVvb393+amZmh2dlZGhsbo0g0Sg/jiWz0WO7HvwlhVYVfuDWLJgZBAGYAOer7dDqd7qzX632dSqXoZlvbvBzu+BFv2E+rj0ykwuPnMcczCAEQdvohlud5r8fjeceybDOg9QdrKn/+8YMouo8mzmmpLI95ACB/jzSgiGGY4wDMDoejnYio54p35VldLk1UW+mWif/WUlratJcBALBOpzNAROSX5UkA0RqN/utEtZXSPh/Fef53myR1ANDuBBe6XK4gEVEgEHgFoA5AIQe0tHPc5w+1tZT2+aiX4+h2SUkfAIMKakRRbKCNktcnuwGwG7oxH2jqtli+vKmqotaCgulujlu5xPNu1UAbCoVGVQNBEG4A4LZtZ+CBy3fM5sUBSfrl57j3xRtBAgCjy+UaTCaTcxaLpQfA4V3uUyBotc2n9PrHPHABgHHTHUA1ACeAI7sdSB2G9RwYAeT8A0L0/bjRXZQXAAAAAElFTkSuQmCC'
        },
        {
            name: 'about:support',
            command: "openTrustedLinkIn('about:support', gBrowser.selectedTab.isEmpty ? 'current' : 'tab')",
            subdir: 'about:',
            image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACkUlEQVQ4ja2SX0hTcRTHv27euz/qLvfqdtO8lRmEoLm2RTTUmWHFtlgYIlFPleNuI5cggYTJpDGIVnP+CaVQ3FtCkYQvPfYSprewxCZCUYwgUKIeHIidHvSKiPrUef2ez/ec3/l9gf9VoijmhcPhq7FYbKizszNSUVFRvFOfATggsqgEUA5AtynYbDb78PDwfCaToaWlJUokEk8A6LfxZfHThsG3rcKk38reA3Bwq8hJktQSiUSmstksLS8vr9XX11/cokv3bRih0fI1Shyi+euGNMfAAQCMw+E4KoriSQD5jY2NiUwmQ0REsiz3qnDMhhEaMBNN24nuFtH4GShGwA4AOo/Hc01RFOrq6nqZTCa/K4pCCwtpejqammIY5kTMiiHqK1yjaTtRTwk9d2sWLDoEAZgAACzLVvb393+amZmh2dlZGhsbo0g0Sg/jiWz0WO7HvwlhVYVfuDWLJgZBAGYAOer7dDqd7qzX632dSqXoZlvbvBzu+BFv2E+rj0ykwuPnMcczCAEQdvohlud5r8fjeceybDOg9QdrKn/+8YMouo8mzmmpLI95ACB/jzSgiGGY4wDMDoejnYio54p35VldLk1UW+mWif/WUlratJcBALBOpzNAROSX5UkA0RqN/utEtZXSPh/Fef53myR1ANDuBBe6XK4gEVEgEHgFoA5AIQe0tHPc5w+1tZT2+aiX4+h2SUkfAIMKakRRbKCNktcnuwGwG7oxH2jqtli+vKmqotaCgulujlu5xPNu1UAbCoVGVQNBEG4A4LZtZ+CBy3fM5sUBSfrl57j3xRtBAgCjy+UaTCaTcxaLpQfA4V3uUyBotc2n9PrHPHABgHHTHUA1ACeAI7sdSB2G9RwYAeT8A0L0/bjRXZQXAAAAAElFTkSuQmCC'
        },
        {
            name: 'about:sync-log',
            command: "openTrustedLinkIn('about:sync-log', gBrowser.selectedTab.isEmpty ? 'current' : 'tab')",
            subdir: 'about:',
            image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACkUlEQVQ4ja2SX0hTcRTHv27euz/qLvfqdtO8lRmEoLm2RTTUmWHFtlgYIlFPleNuI5cggYTJpDGIVnP+CaVQ3FtCkYQvPfYSprewxCZCUYwgUKIeHIidHvSKiPrUef2ez/ec3/l9gf9VoijmhcPhq7FYbKizszNSUVFRvFOfATggsqgEUA5AtynYbDb78PDwfCaToaWlJUokEk8A6LfxZfHThsG3rcKk38reA3Bwq8hJktQSiUSmstksLS8vr9XX11/cokv3bRih0fI1Shyi+euGNMfAAQCMw+E4KoriSQD5jY2NiUwmQ0REsiz3qnDMhhEaMBNN24nuFtH4GShGwA4AOo/Hc01RFOrq6nqZTCa/K4pCCwtpejqammIY5kTMiiHqK1yjaTtRTwk9d2sWLDoEAZgAACzLVvb393+amZmh2dlZGhsbo0g0Sg/jiWz0WO7HvwlhVYVfuDWLJgZBAGYAOer7dDqd7qzX632dSqXoZlvbvBzu+BFv2E+rj0ykwuPnMcczCAEQdvohlud5r8fjeceybDOg9QdrKn/+8YMouo8mzmmpLI95ACB/jzSgiGGY4wDMDoejnYio54p35VldLk1UW+mWif/WUlratJcBALBOpzNAROSX5UkA0RqN/utEtZXSPh/Fef53myR1ANDuBBe6XK4gEVEgEHgFoA5AIQe0tHPc5w+1tZT2+aiX4+h2SUkfAIMKakRRbKCNktcnuwGwG7oxH2jqtli+vKmqotaCgulujlu5xPNu1UAbCoVGVQNBEG4A4LZtZ+CBy3fM5sUBSfrl57j3xRtBAgCjy+UaTCaTcxaLpQfA4V3uUyBotc2n9PrHPHABgHHTHUA1ACeAI7sdSB2G9RwYAeT8A0L0/bjRXZQXAAAAAElFTkSuQmCC'
        },
        {
            name: 'about:telemetry',
            command: "openTrustedLinkIn('about:telemetry', gBrowser.selectedTab.isEmpty ? 'current' : 'tab')",
            subdir: 'about:',
            image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACkUlEQVQ4ja2SX0hTcRTHv27euz/qLvfqdtO8lRmEoLm2RTTUmWHFtlgYIlFPleNuI5cggYTJpDGIVnP+CaVQ3FtCkYQvPfYSprewxCZCUYwgUKIeHIidHvSKiPrUef2ez/ec3/l9gf9VoijmhcPhq7FYbKizszNSUVFRvFOfATggsqgEUA5AtynYbDb78PDwfCaToaWlJUokEk8A6LfxZfHThsG3rcKk38reA3Bwq8hJktQSiUSmstksLS8vr9XX11/cokv3bRih0fI1Shyi+euGNMfAAQCMw+E4KoriSQD5jY2NiUwmQ0REsiz3qnDMhhEaMBNN24nuFtH4GShGwA4AOo/Hc01RFOrq6nqZTCa/K4pCCwtpejqammIY5kTMiiHqK1yjaTtRTwk9d2sWLDoEAZgAACzLVvb393+amZmh2dlZGhsbo0g0Sg/jiWz0WO7HvwlhVYVfuDWLJgZBAGYAOer7dDqd7qzX632dSqXoZlvbvBzu+BFv2E+rj0ykwuPnMcczCAEQdvohlud5r8fjeceybDOg9QdrKn/+8YMouo8mzmmpLI95ACB/jzSgiGGY4wDMDoejnYio54p35VldLk1UW+mWif/WUlratJcBALBOpzNAROSX5UkA0RqN/utEtZXSPh/Fef53myR1ANDuBBe6XK4gEVEgEHgFoA5AIQe0tHPc5w+1tZT2+aiX4+h2SUkfAIMKakRRbKCNktcnuwGwG7oxH2jqtli+vKmqotaCgulujlu5xPNu1UAbCoVGVQNBEG4A4LZtZ+CBy3fM5sUBSfrl57j3xRtBAgCjy+UaTCaTcxaLpQfA4V3uUyBotc2n9PrHPHABgHHTHUA1ACeAI7sdSB2G9RwYAeT8A0L0/bjRXZQXAAAAAElFTkSuQmCC'
        },
        {
            name: 'about:third-party',
            command: "openTrustedLinkIn('about:third-party', gBrowser.selectedTab.isEmpty ? 'current' : 'tab')",
            subdir: 'about:',
            image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACkUlEQVQ4ja2SX0hTcRTHv27euz/qLvfqdtO8lRmEoLm2RTTUmWHFtlgYIlFPleNuI5cggYTJpDGIVnP+CaVQ3FtCkYQvPfYSprewxCZCUYwgUKIeHIidHvSKiPrUef2ez/ec3/l9gf9VoijmhcPhq7FYbKizszNSUVFRvFOfATggsqgEUA5AtynYbDb78PDwfCaToaWlJUokEk8A6LfxZfHThsG3rcKk38reA3Bwq8hJktQSiUSmstksLS8vr9XX11/cokv3bRih0fI1Shyi+euGNMfAAQCMw+E4KoriSQD5jY2NiUwmQ0REsiz3qnDMhhEaMBNN24nuFtH4GShGwA4AOo/Hc01RFOrq6nqZTCa/K4pCCwtpejqammIY5kTMiiHqK1yjaTtRTwk9d2sWLDoEAZgAACzLVvb393+amZmh2dlZGhsbo0g0Sg/jiWz0WO7HvwlhVYVfuDWLJgZBAGYAOer7dDqd7qzX632dSqXoZlvbvBzu+BFv2E+rj0ykwuPnMcczCAEQdvohlud5r8fjeceybDOg9QdrKn/+8YMouo8mzmmpLI95ACB/jzSgiGGY4wDMDoejnYio54p35VldLk1UW+mWif/WUlratJcBALBOpzNAROSX5UkA0RqN/utEtZXSPh/Fef53myR1ANDuBBe6XK4gEVEgEHgFoA5AIQe0tHPc5w+1tZT2+aiX4+h2SUkfAIMKakRRbKCNktcnuwGwG7oxH2jqtli+vKmqotaCgulujlu5xPNu1UAbCoVGVQNBEG4A4LZtZ+CBy3fM5sUBSfrl57j3xRtBAgCjy+UaTCaTcxaLpQfA4V3uUyBotc2n9PrHPHABgHHTHUA1ACeAI7sdSB2G9RwYAeT8A0L0/bjRXZQXAAAAAElFTkSuQmCC'
        },
        {
            name: 'about:unloads',
            command: "openTrustedLinkIn('about:unloads', gBrowser.selectedTab.isEmpty ? 'current' : 'tab')",
            tooltiptext: 'Tabs entladen',
            subdir: 'about:',
            image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACkUlEQVQ4ja2SX0hTcRTHv27euz/qLvfqdtO8lRmEoLm2RTTUmWHFtlgYIlFPleNuI5cggYTJpDGIVnP+CaVQ3FtCkYQvPfYSprewxCZCUYwgUKIeHIidHvSKiPrUef2ez/ec3/l9gf9VoijmhcPhq7FYbKizszNSUVFRvFOfATggsqgEUA5AtynYbDb78PDwfCaToaWlJUokEk8A6LfxZfHThsG3rcKk38reA3Bwq8hJktQSiUSmstksLS8vr9XX11/cokv3bRih0fI1Shyi+euGNMfAAQCMw+E4KoriSQD5jY2NiUwmQ0REsiz3qnDMhhEaMBNN24nuFtH4GShGwA4AOo/Hc01RFOrq6nqZTCa/K4pCCwtpejqammIY5kTMiiHqK1yjaTtRTwk9d2sWLDoEAZgAACzLVvb393+amZmh2dlZGhsbo0g0Sg/jiWz0WO7HvwlhVYVfuDWLJgZBAGYAOer7dDqd7qzX632dSqXoZlvbvBzu+BFv2E+rj0ykwuPnMcczCAEQdvohlud5r8fjeceybDOg9QdrKn/+8YMouo8mzmmpLI95ACB/jzSgiGGY4wDMDoejnYio54p35VldLk1UW+mWif/WUlratJcBALBOpzNAROSX5UkA0RqN/utEtZXSPh/Fef53myR1ANDuBBe6XK4gEVEgEHgFoA5AIQe0tHPc5w+1tZT2+aiX4+h2SUkfAIMKakRRbKCNktcnuwGwG7oxH2jqtli+vKmqotaCgulujlu5xPNu1UAbCoVGVQNBEG4A4LZtZ+CBy3fM5sUBSfrl57j3xRtBAgCjy+UaTCaTcxaLpQfA4V3uUyBotc2n9PrHPHABgHHTHUA1ACeAI7sdSB2G9RwYAeT8A0L0/bjRXZQXAAAAAElFTkSuQmCC'
        },
        {
            name: 'about:url-classifier',
            command: "openTrustedLinkIn('about:url-classifier', gBrowser.selectedTab.isEmpty ? 'current' : 'tab')",
            subdir: 'about:',
            image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACkUlEQVQ4ja2SX0hTcRTHv27euz/qLvfqdtO8lRmEoLm2RTTUmWHFtlgYIlFPleNuI5cggYTJpDGIVnP+CaVQ3FtCkYQvPfYSprewxCZCUYwgUKIeHIidHvSKiPrUef2ez/ec3/l9gf9VoijmhcPhq7FYbKizszNSUVFRvFOfATggsqgEUA5AtynYbDb78PDwfCaToaWlJUokEk8A6LfxZfHThsG3rcKk38reA3Bwq8hJktQSiUSmstksLS8vr9XX11/cokv3bRih0fI1Shyi+euGNMfAAQCMw+E4KoriSQD5jY2NiUwmQ0REsiz3qnDMhhEaMBNN24nuFtH4GShGwA4AOo/Hc01RFOrq6nqZTCa/K4pCCwtpejqammIY5kTMiiHqK1yjaTtRTwk9d2sWLDoEAZgAACzLVvb393+amZmh2dlZGhsbo0g0Sg/jiWz0WO7HvwlhVYVfuDWLJgZBAGYAOer7dDqd7qzX632dSqXoZlvbvBzu+BFv2E+rj0ykwuPnMcczCAEQdvohlud5r8fjeceybDOg9QdrKn/+8YMouo8mzmmpLI95ACB/jzSgiGGY4wDMDoejnYio54p35VldLk1UW+mWif/WUlratJcBALBOpzNAROSX5UkA0RqN/utEtZXSPh/Fef53myR1ANDuBBe6XK4gEVEgEHgFoA5AIQe0tHPc5w+1tZT2+aiX4+h2SUkfAIMKakRRbKCNktcnuwGwG7oxH2jqtli+vKmqotaCgulujlu5xPNu1UAbCoVGVQNBEG4A4LZtZ+CBy3fM5sUBSfrl57j3xRtBAgCjy+UaTCaTcxaLpQfA4V3uUyBotc2n9PrHPHABgHHTHUA1ACeAI7sdSB2G9RwYAeT8A0L0/bjRXZQXAAAAAElFTkSuQmCC'
        },
        {
            name: 'about:webrtc',
            command: "openTrustedLinkIn('about:webrtc', gBrowser.selectedTab.isEmpty ? 'current' : 'tab')",
            subdir: 'about:',
            image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACkUlEQVQ4ja2SX0hTcRTHv27euz/qLvfqdtO8lRmEoLm2RTTUmWHFtlgYIlFPleNuI5cggYTJpDGIVnP+CaVQ3FtCkYQvPfYSprewxCZCUYwgUKIeHIidHvSKiPrUef2ez/ec3/l9gf9VoijmhcPhq7FYbKizszNSUVFRvFOfATggsqgEUA5AtynYbDb78PDwfCaToaWlJUokEk8A6LfxZfHThsG3rcKk38reA3Bwq8hJktQSiUSmstksLS8vr9XX11/cokv3bRih0fI1Shyi+euGNMfAAQCMw+E4KoriSQD5jY2NiUwmQ0REsiz3qnDMhhEaMBNN24nuFtH4GShGwA4AOo/Hc01RFOrq6nqZTCa/K4pCCwtpejqammIY5kTMiiHqK1yjaTtRTwk9d2sWLDoEAZgAACzLVvb393+amZmh2dlZGhsbo0g0Sg/jiWz0WO7HvwlhVYVfuDWLJgZBAGYAOer7dDqd7qzX632dSqXoZlvbvBzu+BFv2E+rj0ykwuPnMcczCAEQdvohlud5r8fjeceybDOg9QdrKn/+8YMouo8mzmmpLI95ACB/jzSgiGGY4wDMDoejnYio54p35VldLk1UW+mWif/WUlratJcBALBOpzNAROSX5UkA0RqN/utEtZXSPh/Fef53myR1ANDuBBe6XK4gEVEgEHgFoA5AIQe0tHPc5w+1tZT2+aiX4+h2SUkfAIMKakRRbKCNktcnuwGwG7oxH2jqtli+vKmqotaCgulujlu5xPNu1UAbCoVGVQNBEG4A4LZtZ+CBy3fM5sUBSfrl57j3xRtBAgCjy+UaTCaTcxaLpQfA4V3uUyBotc2n9PrHPHABgHHTHUA1ACeAI7sdSB2G9RwYAeT8A0L0/bjRXZQXAAAAAElFTkSuQmCC'
        },
        {
            name: 'about:windows-messages',
            command: "openTrustedLinkIn('about:windows-messages', gBrowser.selectedTab.isEmpty ? 'current' : 'tab')",
            subdir: 'about:',
            image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACkUlEQVQ4ja2SX0hTcRTHv27euz/qLvfqdtO8lRmEoLm2RTTUmWHFtlgYIlFPleNuI5cggYTJpDGIVnP+CaVQ3FtCkYQvPfYSprewxCZCUYwgUKIeHIidHvSKiPrUef2ez/ec3/l9gf9VoijmhcPhq7FYbKizszNSUVFRvFOfATggsqgEUA5AtynYbDb78PDwfCaToaWlJUokEk8A6LfxZfHThsG3rcKk38reA3Bwq8hJktQSiUSmstksLS8vr9XX11/cokv3bRih0fI1Shyi+euGNMfAAQCMw+E4KoriSQD5jY2NiUwmQ0REsiz3qnDMhhEaMBNN24nuFtH4GShGwA4AOo/Hc01RFOrq6nqZTCa/K4pCCwtpejqammIY5kTMiiHqK1yjaTtRTwk9d2sWLDoEAZgAACzLVvb393+amZmh2dlZGhsbo0g0Sg/jiWz0WO7HvwlhVYVfuDWLJgZBAGYAOer7dDqd7qzX632dSqXoZlvbvBzu+BFv2E+rj0ykwuPnMcczCAEQdvohlud5r8fjeceybDOg9QdrKn/+8YMouo8mzmmpLI95ACB/jzSgiGGY4wDMDoejnYio54p35VldLk1UW+mWif/WUlratJcBALBOpzNAROSX5UkA0RqN/utEtZXSPh/Fef53myR1ANDuBBe6XK4gEVEgEHgFoA5AIQe0tHPc5w+1tZT2+aiX4+h2SUkfAIMKakRRbKCNktcnuwGwG7oxH2jqtli+vKmqotaCgulujlu5xPNu1UAbCoVGVQNBEG4A4LZtZ+CBy3fM5sUBSfrl57j3xRtBAgCjy+UaTCaTcxaLpQfA4V3uUyBotc2n9PrHPHABgHHTHUA1ACeAI7sdSB2G9RwYAeT8A0L0/bjRXZQXAAAAAElFTkSuQmCC'
        },

        // Hauptmenü  Einträge
        {
            name: 'Neues privates Fenster',
            command: "OpenBrowserWindow({private: true});",
            id: 'AMprivate',
            image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAlNJREFUeNqkU89LVFEU/s6dH46+MZsZJFRCI5RISqFAQ62dNYtAMvoHykViLYcWNW2EahdBRma0KxrHkhZaQhvDhVBm0Y+xlYPhOIq9GufNjG9873buyxbtJrzwce757jnf++6PR1JK7GS48WyfHEi9Io0yEGRDCAHbsmpZeI7XLZbvJ2CI5y4iOgmiD/8K8OBiaUvVzADB56+AVhVQPIz1tXEtVM19BOOXPp83cg5vs7LihNqAzVnn8RYsb7gZAourJj4trOBjYgWtR5ucqHLFpw2PU9fecdjpE/x9mAXjq0+YONBYlZiJXQ/PTd7uqa22ngeDPuzWBFRUueJnYtGwqgtVWCgWzTTssQZ5NjI+GJtekrE5XY7MpB+yqTJGffTpN/nue0GqqHLFq3VVF59OyvPXYvdJCYjexT2Robfpc+FGLGUldMPkWoLmluhuDmHq8zqMLVKnhYDmxV4/YWwygRv9bXV8bC703VlcffEoGo5PLMBn5nGscRfa9vshf2Zw98l7bK7p6GiqdHhtq4D4RAKTj2+evjI0u0z5+EHpEzrRmZSnpr65vafv1lWfP9CtHOQ31l/Ovxkbae3qvVBeGTqlHBSy+tT4g8hgKvlllgVMyo4ekuUiRxeXX2P4UoNre6+B7Wv+wUgxahjBbU5nJLnZUgllRlukh4rELnCZRViMr8Yq+SUKZdWSLn4YFSgwtqSbjdL/CPBD4mDKMgzXdSFnV7KIt2QR8ScQN3lQsP24V3cCBkeVowQR8XciHREvNh2RThR5bpfo4shOfuffAgwAve4ZeIMLA1IAAAAASUVORK5CYII="
        },
        {
            name: 'separator'
        },
        {
            name: 'Einstellungen',
            command: "openPreferences();",
            id: 'AMsettings',
            image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADy0lEQVR4nAXBa0wbBQAH8P/d9XG9lrtrGV17pa6VjIbXBgwG6DoX/cJcYmZIXIwa5wcyNEajkanRJX7SxSzxi36Z02mEKZosI0zY3DLcmgwQhG1uhayjQIE+dtCVlj7u1fP3Iz74KYqyKgO6hnhaprxOWptfK+1jTISTptSbLo4oUBQJkiCgazLUYg7JyD3w2jJu3LgGUlI0SLKCucX8ie4OIfpfJP92+27HD1/1No1ui7GXDEQZRqIMiiyDAGA0kGB5FmYrD5a1geg7G8F0eIPNKaR46Yt2kw4COoCSCvz9z1IsmtSX0o/Xput8Ff2qIoPQClAySdh0EUo+DcrV3ktLcvlM936h1lfNWX4PJbUzfzyUF0QYDjQLXKCm0rcQjlZvi9Hv7Q5eMeoyzIQEh5UCW2EBGYvnjnYf2tV3qKPaHknIGDzdf8S0+Gt1KjQw9vP4Y2RloMpKVh1t526t3x/fqyklQC0BugaKMoBEcU3+8tyk+NfdNCRQ2NV0QH+uhjh79dy7h3cSBWzmgarWZy3TG7tb5a34i7Hw7R2J5fAe6GUQBEAFj52cfxIrrO8P1vaYaRNoXjiy9Gi1OaPwRIn1QCJNWEip4LIr+PjE4RcCT1e/VxeoOf7n5cujPp8vRaqqgkzZ/ObDRBHj99IwVTodda+8T67wjdCYCiyvZhG98HWZydxEqSTB5XLRW1tbhnD4gaCqKihP+6vQMvm5f69esG1GHmwqzgY/Y2Mwez+FrKxD1Skkb51/zUBk45pS6vD7/QiFQqssx39k53mN8u47hh0ORWyse+oSmxiuXdNbD26sp9G/N4a704u5xSvfvvN8sHawsaVzdP7O5MttbW0uv99vVxXleCgUukJuZ7OQi3moigTXM2+dst35vPcN7ySaGgR80mM11Xu2y+lUjJ69fT3Q2NhYIcsycrkcrFarIIpi2fBkNQLSYYSNsEGHWd/Jk8Guzj0oFArgeIf5s5Mfnl9ZWfmOZVmz3W6nstksBgYGNmdmZiaam5uXDFx+DmbaCUZxwla2IilJ0sjICIrFItxuN4LBIARBYPL5PHK5HCwWC6ampn5kWfaU1+uVKdZKwVFhhJMzg2MAhmGuDQ788ogkydOiKB4MBAKVmUxGHxoaysiybEkkEvrw8PBvPT09E6qqghAEAS0tLRAEAQxjAU1bQNM0dF3H2NjYN52dnX2hUOg6z/Ovx+PxT41G42xDQ8NFj8ejyrIMwu12o76+HgzDwGg0wmq1guM4UBQFgiAwMTEhkCSpdXV1pXRdBwCUSiUoigJJkvA/ZkG9QWy1G6AAAAAASUVORK5CYII=",
        },
        {
            name: 'Add-ons',
            command: "BrowserAddonUI.openAddonsMgr();",
            id: 'AMaddons',
            image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjbQg61aAAACkUlEQVQ4T43T60tTYRwH8HMQ9QQJRSBJ50xU8BL1QpJMsbxNc162edxcYlAoZdkFh6gZurF5WV6nc7M/oBdBb7q9DSPEVBDbZtN0c5tzNymolwXht2eDhVO0Dnx4Hn6/5/me8xx4KOqQR2rcYfjpIC81BpXiqWBnxUSgpWQ0kHrY+gN1xdOdu/XTQfDGIMSGAET6AMpG/TbhiD/uv0LqTYF7cmPgN2/wQzzhh2jMB+Gwz1I65I3/Z8A1o5eRTXqP85M+pVTv260Z86JieNtcMridXNjnZvI1Lia31xV7IIgf99AKg/e1wrAN+YQHtXoPJKNbqBrewlWdG6UDLlzRupCv3sTFns3vFx47SqJCFHoPoyAb5eNb4MlGyYgb1UNuiHQulPW7UKRx4rJqE5d6HMjpdiC7066mRFpHvFTnbCHuSJ84E+rIJumQExKdEzVE5YAT5RoHCnvsyO3aQHb7Os63rSHrwRoy76+qqErNBi/ut4PYrdFsKCWDDoj77CjvXUdu+yqyWleQcsuK5GYrBE0WcE0Wm6DZmsk1W7VEI1XRu6YUqb6gUh22W9BhQ8ZtCwQ3PoEjQuM+psi5SSBNCR/Zusq7bSju+IyMpmWwjUvgrh+hcWks6scVKs0tBQ/NSG5YBKtYNHOKRRxt4WUogKufTwmh8lqXU9MaFlY42UcLJ5tnOfk8yPwov0j/LfGNUIe/huXnYrm6uTiOn2UI7GEjcxMxTrwifu7rq6KOw0o+MAT2SI8sYGtnaVJ/s68fFUCfONd2jK2e+cFWv0dY1bu+mPiTocsTmyR8kU56X//2wmtmuiMvoMkkdEkEp3K0N08XPZsKScwzdNB0zFlSz0pIaxBG6mQ0JBU/1yXmm878AbFQoHrb98HyAAAAAElFTkSuQmCC"
        },
        {
            name: 'separator'
        },

        {
            name: 'Lesezeichen-Verwaltung',
            command: "PlacesCommandHook.showPlacesOrganizer('AllBookmarks');",
            id: 'AMbookmarks',
            image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACnklEQVQ4y6XTPYgVVxTA8f/ce2fu7Mx7vuf6srsa425cxFWEiDwCgpXpErELIVYWVolYWGmdKoVdLGwUGwXFJggWwq42hpBmiUaW1f2I7Pfs+p6773Pm3jspXtwEIhLwNIdTnB/nHDjwgeGNXrhz2JfysPC8/9fgrLAmez7105lnAOpAZejxwYGBiud5QA78N3cyRymSLG6kHBmJ+G1ueX0KPgJQ8ytppbXZ/tt/N5Aax9gnEUndUm84Xm/aytuJVBxZzn3VT0lbjMkoFIskawmDQ4MALC8ts3vPx9STJcKoSK3r8/CP9vZKqhhJjh/sZyB2ZFlGuVxmYSFleLgHzBaa7N8/SDJxlXj3SZZ0lesT8h/Aw1Kr1dAGjDEYY+h2uyRJAkCapiTzk4TpS7orIbUdo3jYbUD4SqJ1gNaaMAzRWhMEvVprjQ588pVHxJ+eQDRnCESGr/41QeALCnFEHAustcRxTNZcIepOkdsO0eZLivYZQh2lsKtEafUmJ8p93LldOZ21my3lkdNoNChKhXMOYwx27QnmzXVk3y524qEKZTCzyD7H3uwpl6ot8u7wXVbnppX2JYU4Jo57QBAEtPZ9CYsvoPWAoOCBWAMrgBwVtbGdOp3X6+M27fyglPRQvsL3fZxz+L6PHxbRY5fJFg9g1r9DFTKgB+TOMvnnCMNbW9+7jHlVb6Zr1x5OC19CnoMQHtZZpFBIPlMXR2VZ7ehC6noGMN0eMtWz87MAaiZ583UcBkIJsX3ZABOkqLQa3j+mj7euEIBdpeEFKLGH8ItDv7fe+zA3btyr/vrkl32dcXHeJWxlk0y0fubzzgNOmSmemle02/c5AqDeBUgpyzNzy9+M7B3b6F94/qPd4FZ0mlmAdJwFUeJbIXu9fwFVCBajMWIWPQAAAABJRU5ErkJggg=="
        },
/*         {
            name: 'separator'
        },
*/
        {
            name: 'Chronik',
            command: "PlacesCommandHook.showPlacesOrganizer('History');",
            id: 'AMhistory',
            image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAQCAYAAADwMZRfAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAEYUlEQVR42mKcdvgDw38GBoafjL8Zvvz6w/Dt72+xP3/+Gv9hYJRh+PVdkO3PDz5mxr/MzEyMr/8zMJ3+wy5wivWa9E+md6wM/5mBGoGaAQKIhQEKQAYxMTK4sjKzhP/79UuE/+dbeVluJmkFYW4h5n+/mTlZWRi+/vjx8uWXJ2fein3q/vpb6SATE0QvQACxMDIwAg34z8DIyBjGysqa9+fzBy5VprcKNgYSgtJCfAzMLCwMn758Y+Di5GDgYGcT//79u/eDJ0+cnoscKWJh/DeDkYWVASCAWH7//cnAwsZmxs7BUfv74yc2JeZ3kl6GCrxcXFwMP37+Zvj7+w8DJwc7A9AWhn///zPw8PAyaGtocnJzcEy6f+fuL6D98wACiOnzjw8Mv5l+FwFdJCf474OIs7Y0Lw83L8PvP/8YmIDuBWOgAexsbAwfP35iuHT5MsPfv38ZFBWVWUXFJRp+/vylDBBATD//M+p/+fnT4f3b10xSHH94xESEGP78gxjAzMzMwAL0Dhc3N8O7d+8Y1q9fz/D161cGoLeBckwMsrIysgz///sBBBDL529f1BlYmcV/vH//Q0VVio0F6EegI8AAZMifP38Y7j95wrBp0yYGFXl5BisrK1hcAL3Gw8DDzW0LEEAsL18842bn5mL48PYd8/fvggxv3r1n4OfnZ/j27RvDvv37Gd58+MDAev48g56uLoO9nx8DKEL+A8Pmw8fPDJ8/f2ZgZGKWAwggFgNn6/+Pr95jePf5M9N/RmYGERFhoDJGBi4uTrDGj9+/M0jLyTGI793LwHDzJsN/dXWGv0DvsrIyA13BCTLyK0AAsXx68+Hd3/9/GT58+cJ07PKdfyqKMkzbrjxhcFUXZ1BWVoY7/Z+kJAPD3LkMfwIDGX4YGDAwgQwChteN69cvAAQARQC6/wQLCgnV7wIB4/38/B2zzd7+vO4HAOz2/AA1Gw0AEAb/APj7/QD+/v4A/iYmAABYWAABwMAA9xkZAA8bGwDp5ub6oqSkuQKIiZ2H566gqPBCfnExhuc80szHHnwABuZfhvefvzB8+QLBoBj5+uoVw0eg5vdAl3ABwwwYzwwrV6xYc/z48T0AAcRy6so9Bi52tn8sEjIMHAyfGXj/fmP4+usvw+dvvxgYBNkZfv78yfAHqIER6CV2dnYGfqBB/37/ZliyaNG+iZMmNQBd+QsggFg42Zkyvnz9Wvn9NwMDBzcwyn7/Byaqz/9OXbj0SZpFiY9HQISJl5cXHC5///5huHnt2ueZs+YsX7p0ad+XL5/ugMQBAgBFALr/AWO21Rn5/fAW7+f0MO3d1jn0DCUx+Q4dJO+leo4g+uLrP0FEQhIUFBL8/Pz30tPV0sPDw8jy7enJDQD+7g38AP5MAAAAAgBFALr/AWW62wDt59EAvoJ6AB//2gAYHSkHChojLPDbzPHe3Ory5/cHDwD//QUAAQL9EwX79xwM/fMfFQD6GAEA/PHhAPwr8QD9AgwAIVy5BmpwqaQAAAAASUVORK5CYII="
        },
        {
            name: 'Downloads',
            command: "BrowserCommands.downloadsUI();",
            id: 'AMdownloads',
            image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAFo9M/3AAAACXBIWXMAAAsTAAALEwEAmpwYAAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAC7klEQVR42mJgAIL3K2X+AwQQy9VMzf+cIooMAAHE8H6i2n+QKEAAsbCrSjJ8vST4HyCAQByG13Mc/n+/D5EBCCAWsMByBQa2bz/BkgABxAAz5f1aYbAKgAACo6+XJP///OQFFgAIIJbvd23//z/NyPD/NQPDg8uS/wECiIlT+TDjr5/sDK9ZrjMo6D5nBAgguLYPC13/f7nN+v/bQ7H/P77awM0DCCAWGOPLp58MfE80GFiE+RiYOCXhGgECiAlE3PZI/i8iL8bAchMocV2C4d/+fwyPj2qBTQEIIBR02S7+/4N1AigSAAHECPcLyB9/OBkY/rMxMLxkYRDMvwWWAwggJpgCDidZBlazzwzsVg8ZGAXU4SYABBDckYy/2BmYvgsyMLLxMPz+g7AFIIAQCr6zA+0B+oCLn+HHV0Q4AgQQ48MTUv8FvwszsLwUhHhLlIeBkQ+oT+IXw8Pa3wwAAcQkb/GM8f2fbwwMr4CO+8ABDBABBua3wgzP8qQY1BbsZQQIILAj5V3vMj6Tv8Dw8/VbBqZ/nxjuT2BiUFw/D+wLgABCQXeX8v+/5pyAEg4AAYSh6v0il/+cMeIM/9+/YGBgZmNgZOSGKOSTYvi25A6DYOw2FD0AAcSCbsCfX38Y/n+4x/D37R0GZiY2hn/sQN//+8LAzGgClGPCcBVAAGEa8O8/A9MnVoZ/77gZ/gH5zHwCDP//czAwcnID5T5jGAAQQCx3o0L/s/znBXP+/fvD8E/sGgPjJ14GxrdCDAxszMBwBQYrAz8DAx8TA7P8d4anaXH/mf8yMfz/y87w6/9zBoAAYoSlJrbiAwzi7wwY/r38CNSIcCqTFB+E/wvonu//GVj4+Rie855k+NtjzaCwfjYjQAChBMhNt5T/7IV7GaTf6jD8fAZx7h9xXgZ2RmYGVjFBsMYfzZYMqjvmwvUBBBBWBIqqW2t5/n+eo/X/6zKj//d38v4HuRKbWoAAwouOher8Pxmtg1cjQIABAFbt8Z32Ai5RAAAAAElFTkSuQmCC"
        },
        {
            name: 'Seite speichern unter...',
            command: "saveBrowser(gBrowser.selectedBrowser)",
            id: 'AMsave',
            image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAmxJREFUeNqUU0tIVFEY/s7jztzRGedBaVMQJAMt3LjrAVaGzmjQKmphiyAialsrA7HotW8RGO0kRsighdVEhlBWRoSLkigse0jBCDWTijpz7z3958xtGA2KDlzuz//8/u98hyUv3P+xWHJjZQ/wFMCgDxm+tdZmjMHiQH1AFCzB41IXF891439PtP9erCHIwMt6rD7jncDTfcCzLvTfnQUmMuZbZd/5DDxpN+m6TldK+PV93wfAhYAkeDYv42LhmgFeJx1cJlufkHRxvnAdfTVIpPI7HO5oBqeKgABuj71FT2YryMTww2kcTKdM1s3RaRzIpCqFrMKM/N3JpsmmAddTGU4Nv8KNFx9M7ERuqsrlydxrQDA0BC0iXX2rNrg1OgVBHSzaIWpbyL78iInT+1FyPLRtlKsIfPzVoVuQyFzNbahGjnS10BUBQcI9Mv6+YsPDzsEZ5I834sHYI5PX2b4LewbzmDy6BR4RWW0QJOiVIsDy95tbdtEUFnBJJNt2tJk8bWufjumkaoMsraBFEqAV4iHL+ApLLhrrJHKfVrDbB5ubdYyvuOSB117jsXSL+WvnyPMKeT/LCglbYOCdgytvHOgbs4nABDFe1NLVCJivUl5DklAUVAoLJY/Y5uhpljjUup4iHoYm55Cd8bBYUmZNTnr+Q6bd21N0UwwrLkOE1unYbKP3zFl8yS9g76YAIrbEsufroF6yedJ1pOx65jFpLeim9FjAuEAybCMRDSC5LoymmE3oyuQjPpigXGaatGrUa1Eke4cuqVA07dAqjuJQlKxoAqP1tNwtmkR6m2d/eXDN9MX/8SjdXwIMAOhU0E/NNxUYAAAAAElFTkSuQmCC"
        },
        {
            name: 'Chronik löschen',
            command: "Sanitizer.showUI(window);",
            id: 'AMsanitize',
            image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACh0lEQVQ4jZWRa0jTARTFTyoYWqSpJGpEFGJ9sZIekFGZ5aOHJBSRkJhEho5AqIVmrBrLuU3BjNK9tBeZFSYZgSn5RDJTVNTmNNLN5eaDfMxw/j19E8QsvZ/v78e59+DaUey/eRyGtCgMiCMRgZVOWhTMz6+4sUTkzvRoTN2IQPiKBOlRGClLXcPqDA8WJ7sxPRoGCeCkluNOngxe/xWII3BVFus0+TFtHaszPCg9jfF8Kb5qFKBajm3LCeGUFo0HkpOYLLvuzqLMVax6s3OuVB8wrs7CgWWfIkvEbU0m5porD9PWJ2Zp0obpwj0w6bPRplFAnCuDz5KwRoHzOhXs3Y0xHDYmsVEUwhL/tex6e5FWYyqbKsOmH+estutV0D+Uwn+xQI54rRK2imdB9oroIH7Yt5H27gQK1kQKthQKoxn8bc3kl6rwGX22y7ROhSfqezgkkcBpXpIrgmvhVnS9Cls/67BKKQwnUxiTUhgWURiKpcMczomBS7T1itlSHTn3Wus3oVXAujDJLcR/Kg2eEsayKFjjKdgSKAzFUhgM5UTPdlpafWls8KCpLYr9HZepV2JogeC+HH5P8zynHSMKzppD6TDtpb0vmKNdW2hu9mZPrQsNNc4c7DzL+vchDp0KLxb9ozAbHb0tFzhiOEZLqy8HmjxprHOlocaZhhpnmtpP0Nh8jnqV86RajoBFgkdyHHlZ4Gf/aUihsd5jHjQ2+NDSFcfOxjNzhTkuvwqycHDJWnUq1NeX756xdMfz++dAmjtO0fJNxLp3uxxaFQYLZAhcEgaAPBm8dEr0t9XGCD/a49hQvmOmKMfVrlOiOF8C73/C8xIpNmmUGNEpMaxVQqe+i81/2/sDdNth33v8JSgAAAAASUVORK5CYII="
        },
        {
            name: 'separator',
        },
        {
            name: 'Neustart',
            tooltiptext: 'userChrome.js-Cache wird geleert',
            // command: "Services.appinfo.invalidateCachesOnRestart(); BrowserUtils.restartApplication();",
				command: 'Services.appinfo.invalidateCachesOnRestart(); \
                      Services.startup.quit(Ci.nsIAppStartup.eRestart | Ci.nsIAppStartup.eAttemptQuit);',
            id: 'AMreboot',
            image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89%2BbN%2FrXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz%2FSMBAPh%2BPDwrIsAHvgABeNMLCADATZvAMByH%2Fw%2FqQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf%2BbTAICd%2BJl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA%2Fg88wAAKCRFRHgg%2FP9eM4Ors7ONo62Dl8t6r8G%2FyJiYuP%2B5c%2BrcEAAAOF0ftH%2BLC%2BzGoA7BoBt%2FqIl7gRoXgugdfeLZrIPQLUAoOnaV%2FNw%2BH48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl%2FAV%2F1s%2BX48%2FPf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H%2FLcL%2F%2Fwd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s%2BwM%2B3zUAsGo%2BAXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93%2F%2B8%2F%2FUegJQCAZkmScQAAXkQkLlTKsz%2FHCAAARKCBKrBBG%2FTBGCzABhzBBdzBC%2FxgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD%2FphCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8%2BQ8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8%2BxdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR%2BcQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI%2BksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG%2BQh8lsKnWJAcaT4U%2BIoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr%2Bh0uhHdlR5Ol9BX0svpR%2BiX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK%2BYTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI%2BpXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q%2FpH5Z%2FYkGWcNMw09DpFGgsV%2FjvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY%2FR27iz2qqaE5QzNKM1ezUvOUZj8H45hx%2BJx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4%2FOBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up%2B6Ynr5egJ5Mb6feeb3n%2Bhx9L%2F1U%2FW36p%2FVHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm%2Beb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw%2B6TvZN9un2N%2FT0HDYfZDqsdWh1%2Bc7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc%2BLpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26%2FuNu5p7ofcn8w0nymeWTNz0MPIQ%2BBR5dE%2FC5%2BVMGvfrH5PQ0%2BBZ7XnIy9jL5FXrdewt6V3qvdh7xc%2B9j5yn%2BM%2B4zw33jLeWV%2FMN8C3yLfLT8Nvnl%2BF30N%2FI%2F9k%2F3r%2F0QCngCUBZwOJgUGBWwL7%2BHp8Ib%2BOPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo%2Bqi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt%2F87fOH4p3iC%2BN7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi%2FRNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z%2Bpn5mZ2y6xlhbL%2BxW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a%2FzYnKOZarnivN7cyzytuQN5zvn%2F%2FtEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1%2B1dT1gvWd%2B1YfqGnRs%2BFYmKrhTbF5cVf9go3HjlG4dvyr%2BZ3JS0qavEuWTPZtJm6ebeLZ5bDpaql%2BaXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO%2FPLi8ZafJzs07P1SkVPRU%2BlQ27tLdtWHX%2BG7R7ht7vPY07NXbW7z3%2FT7JvttVAVVN1WbVZftJ%2B7P3P66Jqun4lvttXa1ObXHtxwPSA%2F0HIw6217nU1R3SPVRSj9Yr60cOxx%2B%2B%2Fp3vdy0NNg1VjZzG4iNwRHnk6fcJ3%2FceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w%2B0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb%2B%2B6EHTh0kX%2Fi%2Bc7vDvOXPK4dPKy2%2BUTV7hXmq86X23qdOo8%2FpPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb%2F1tWeOT3dvfN6b%2FfF9%2FXfFt1%2Bcif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v%2B3Njv3H9qwHeg89HcR%2FcGhYPP%2FpH1jw9DBY%2BZj8uGDYbrnjg%2BOTniP3L96fynQ89kzyaeF%2F6i%2FsuuFxYvfvjV69fO0ZjRoZfyl5O%2FbXyl%2FerA6xmv28bCxh6%2ByXgzMV70VvvtwXfcdx3vo98PT%2BR8IH8o%2F2j5sfVT0Kf7kxmTk%2F8EA5jz%2FGMzLdsAAAAEZ0FNQQAAsY58%2B1GTAAAAIGNIUk0AAHolAACAgwAA%2Bf8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAN8SURBVHjaVJFNTBxlAIafb2Z29gd2l4VdYCkokAUt1AJplQRTrVqjUWMPPWHSCzb21IOn9qIHY2xMahoTTb00NmkUm5qAjdpUI61VaCxCpCVYixt%2ByvKzCwu7LDs7zMw3HmhM%2Bt6fJ0%2FyCp69wiOzZBCPcqSmIXg0HPHuC4R8nkLWyOXyYiIzfuVHzMIA%2BZsLtH18EApntUdhpzUSD5577nDLi%2FGWKjx%2BHVfR8HpFwNwsxTMzza%2BOXJ1%2B58Ev2sVEV%2ByEawXqxf8FllNWEQ9ePXzsqQOecIDU8jampSAVD76Al2BIIx4Dv2Nz7%2FYq%2B5%2BP8sNXE6WdAhdQlOM9rzUdaGiN8M9UjnKvQjzuA0UjV3AxDIcHywqRoEbXoVrKgyBtKXYEUvprmiN9oaoyvr9wl62NHJbtJeDzOo17YmprVzWOppLO2RRNwf1FSOzSUAXsCIR4QdP13UPfjhUde2mjuBXUjcXNEabOnJmq7Y4Nd7z1fu%2BJ%2FR2Jpgrm0jauAI8GlnSlBi4I0bO6sLBWHc9esxRdmjOZf5n%2B5CLWzCzOvsbKupBZ1xgmElUoC%2BgoKtRGQfNomoaND8P8XS%2Bby1olO7O6GHTl1DejGDOrNB%2BvpO7I%2Ba31%2FDP9Z28YUmqoqhCKcG2EYD6ZMUTojZ8WHmsqD%2BI6wnWFajugCkuuZaV%2FZS47wp99R7E3LbxPV6rtr7dV1pmyuBWs3hr7dZ380LC2tzseffvUHm86C1JC2A%2FrGcn509cn%2BPvTk9ibc1R06qL91Ms1CadF000ll9rVS2VykLzVr0lHOgtpuJ9yUFyXxqhKZjbH2nJRI9IZwyw2kXjvXV%2FIOWgaBcc2a%2BtjdVXR1J3iBDx8QUpQUJAuJJclseogxz441H5vrPO72cm0VSyVPJq27ZaHm8ST3Y0M9d9Kkr19A1A1x4VIObTGBfNrsJ5XmE9b6KqgvrOGhr1Vns2sgeNIkXiigvHf1liZuHWZYjINSEXRVLewZjN6bYmYbvN4rcDvVzFKLnOpErMLBpvbklClznyyyPDA6DjTX3wJWICr%2Bnb3ffjXSGpl5Nxnn88uh2ORUCBaHfVQU%2BsjVuGhKqJT5lFYShr8fGH4j42bH53EnJ4EtgEEPQOTzHx9mqXLl9AT9TS82RvreOmVcMTXVh4JhIr5kp3LFu6u3Lk%2ByMylQazU3ENYAvw3AFUTimFqj5i7AAAAAElFTkSuQmCC"
        },
        {
            name: 'Beenden',
            command: "goQuitApplication(event);",
            id: 'AMquit',
            image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAACB0RVh0U29mdHdhcmUATWFjcm9tZWRpYSBGaXJld29ya3MgTVi7kSokAAAAFnRFWHRDcmVhdGlvbiBUaW1lADExLzA1LzA33bqJ2wAAAsFJREFUeJxlk09oVFcUxn/3zR9HaoJKgphMFGtCrH9alUTqRgWhJtDFjBRsNybURVWwFCqUUmgyghTcaKlLQXeiopOVIEhtNaDjaNVYiNXYjHGeDmhokpcw89677x4XL5lM7AeXezn3O98957scJSLU4unBzz+2PliSUdF4h0RjSaN9ghmnqGem75mZqb5PLuaGavmqVuD50a+yKhpPTT/K4dqjiO+FpGiMSMNKrJa1GLc8sPXC7fQCgUrhaeL1mRPPKoV/ks79wapgpG4pAIEzUY1ZLa2Y+uXFYMO2tu2Z3yoWgH2673xt8rLdKQA2Zh+wMfuAQOZj5uUIMl5Kcvf6eQD+/enrzuc/7JfcOiS3Dnlz5ayIiFxrQ+ZwZnV4ti+frfIGP2uXm7tbOy3tTByffpSrvtyQ7gVgxJ03yp21qWlvL/7OsBJrvIS45eNWpH75etceBaAh3QPAYOa7MNEu4BQLAIz9Esaa0j1MBGCVHbRlrbeMMc1zbs/1+eTSOVri8Hd6MwPdm1mk4E32HABr9qR4q0EZQ6B1c9Ron/ehlKIhAoEzSasACQBVvZ8Iwt34Gst4rq2iMQCm7v4BQPsXPfNfqcLVONuefSfkiFIY7dmRb9oau0TrtWZ6Etcu0JjuZdWuLqYmJzGjT7AWJVjx5UFW/XgKgN+/74XXL6iLxwkCk1NDB7o6As/Ne/kboZGH+/jwSP//2gLIn+wnfypDewL8+GK0DjqViPDXvu1Z89/blHk5AoC3ZSdrvu2n+dNd1bLzJ/t5dedPmmJQn4jjBjLQPeyllYjw8NdMwrt19ZmMl5KqNAaAY+CVD86sYXURaIqBisUpB1Icq5i2Q6O6smCYbnd/lDVGUtZ4CavsoIypGuZZMWZUBNF6oHvYWzhMtRjc0bLJoI4FYjq0MUnja/DdItq/h/Z/3jPsP67lvwOjGG1S8vVScQAAAABJRU5ErkJggg=="
        },

/*         {
            name: 'separator',
        },
 */        ]
    },
    _externalAppPopup: null,
    _isready: false,
    init: function() {
        this.handleRelativePath(this.toolbar.apps);
        const XULNS = 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul';

        var ExternalAppBtn = document.createElementNS(XULNS, 'toolbarbutton');
        ExternalAppBtn.id = "AppMenuButton";
        ExternalAppBtn.setAttribute("label", "AppButton");
        //ExternalAppBtn.setAttribute("onclick", "event.preventDefault();event.stopPropagation();");
		ExternalAppBtn.addEventListener('click', event => {
          event.preventDefault();
          event.stopPropagation();
        });
        ExternalAppBtn.setAttribute("tooltiptext", "Firefox Menü");
        ExternalAppBtn.setAttribute("type", "menu");
        ExternalAppBtn.setAttribute("removable", "true");
		  
		  if (Appmenu.isButton) {
			  ExternalAppBtn.style.listStyleImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAAAUCAYAAAAwaEt4AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAF3SURBVFhH7ZUxS8RAEIX9M1fb29vb+wP8AdaCYCVY2FmInY1YWmlrp7WtNp6ihyKKCDYrb7kPxsuMJiG5CO6DR5LZmd2Zl9ndhduNUSqssggTsAgTsAgTsAgTsLEw71enyYPGHvZW8vvHzUUlrinvd5e/reX59Mk/K8zn5DrPBTyfPtlamOeTTXe8K4LHg1V3vG92KgwdI2ADT8fr+UmcfNVZ4OVspzIH0Joau9teSq/n+1Nryl1l8yA3/LUdgWLxq8NOthKJ/CQMUCE2YQuJEwkz3lqsbC+AOCoeaB5y1U8hn7qcmzB0hArkr79dHuVvhFLhs3GaU9+Tw7WpJWV/2SQIIA4bIpJbU85tK1Gg6IkLojgKtoV664kWbc+oQYRRpwh0DHZLQJztGM6LOh3T9oYcRBjrZ2F9ADYJGIFcZg9bxPFy/Y2DCCOqxe2tpHd7cwAbp3G6TVDh9mBlPp1h+va6rC4bC/NfWIQJWIQJWIQJWIRxOUpfQ+jqXwPuQ7IAAAAASUVORK5CYII=)";
		  } else {
			  ExternalAppBtn.style.listStyleImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAA6SURBVDhPYxgcIDg+6z8IQ7lwPiEMVT4YDBh4gO4kZGfiw1Dlg8GAgQfoTkJ2Jj4MVT4YDCAfMDAAAFSm42US1bMnAAAAAElFTkSuQmCC)";
		  }
        if (Appmenu.isUrlbar === 1) {
            var navBar = document.getElementById("nav-bar-customization-target");
            navBar.insertBefore(ExternalAppBtn, navBar.firstChild);
        } else if (Appmenu.isUrlbar === 2) {
            var menubar = document.getElementById("toolbar-menubar");
            menubar.insertBefore(ExternalAppBtn, menubar.firstChild);
        } else {
            var TabsToolbar = document.getElementById("TabsToolbar");
            TabsToolbar.insertBefore(ExternalAppBtn, TabsToolbar.firstChild);
        }

        var ExternalAppPopup = document.createElementNS(XULNS, 'menupopup');
        //ExternalAppPopup.setAttribute('onpopupshowing', 'event.stopPropagation(); Appmenu.onpopupshowing();');
		ExternalAppPopup.addEventListener('click', event => {
           event.stopPropagation();
        });
        ExternalAppPopup.setAttribute('id', 'AMpopup');
        this._externalAppPopup = ExternalAppPopup;
        ExternalAppBtn.appendChild(ExternalAppPopup);
        Appmenu.onpopupshowing();
        
	// Menü mit Tastaturkürzel öffnen
        if (Appmenu.hotkey) {
	  let key = document.createXULElement('key');
	  key.id = 'key_AppMenuPopup';
	  key.setAttribute('key', Appmenu.hotkey);
	  if (Appmenu.hotkeyModifier) {
		key.setAttribute('modifiers', Appmenu.hotkeyModifier);
	  }
	  key.addEventListener('command', () => {
		document.getElementById('AMpopup').openPopup();
	  });
	  document.getElementById('mainKeyset').appendChild(key);
	}
    },

    onpopupshowing: function() {
        if (this._isready)
            return;
        if (this._externalAppPopup === null)
            return;
        var ExternalAppPopup = this._externalAppPopup;
        for (let subdir of this.toolbar.subdirs) {
            if (subdir.name == 'separator') {
                ExternalAppPopup.appendChild(document.createXULElement('menuseparator'));
            } else {
                var subdirItem = ExternalAppPopup.appendChild(document.createXULElement('menu'));
                var subdirItemPopup = subdirItem.appendChild(document.createXULElement('menupopup'));
                subdirItem.setAttribute('class', 'menu-iconic');
                subdirItem.setAttribute('label', subdir.name);
                subdirItem.setAttribute('image', subdir.image);
                Appmenu.subdirPopupHash[subdir.name] = subdirItemPopup;
                Appmenu.subdirMenuHash[subdir.name] = subdirItem;
            }
        }

        for (let app of this.toolbar.apps) {
            var appItem;
            if (app.name == 'separator') {
                appItem = document.createXULElement('menuseparator');
            } else {
                appItem = document.createXULElement('menuitem');
                appItem.setAttribute('class', 'menuitem-iconic');
                appItem.setAttribute('label', app.name);
                appItem.setAttribute('image', app.image);
                //appItem.setAttribute('oncommand', "Appmenu.exec(this.path, this.args);");
				appItem.addEventListener('command', function () {
                Appmenu.exec(this.path, this.args);

            });
                appItem.setAttribute('tooltiptext', app.name);
                appItem.path = app.path;
                appItem.args = app.args;
            }
            if (app.subdir && Appmenu.subdirPopupHash[app.subdir])
                Appmenu.subdirPopupHash[app.subdir].appendChild(appItem);
            else ExternalAppPopup.appendChild(appItem);
        }

        for (let config of this.toolbar.configs) {
            var configItem;
            if (config.name == 'separator') {
                configItem = document.createXULElement('menuseparator');
            } else {
                configItem = ExternalAppPopup.appendChild(document.createXULElement('menuitem'));
                configItem.setAttribute('class', 'menuitem-iconic');
                configItem.setAttribute('label', config.name);
                configItem.setAttribute('image', config.image);
                //configItem.setAttribute('oncommand', config.command);
				configItem.addEventListener('command', () => {
                eval(config.command);
            });
                if (config.tooltiptext) {
                configItem.setAttribute('tooltiptext', config.tooltiptext);
                } else {
                   configItem.setAttribute('tooltiptext', config.name);
                }
                configItem.setAttribute('id', config.id);
            }
            if (config.subdir && Appmenu.subdirPopupHash[config.subdir]) {
                Appmenu.subdirPopupHash[config.subdir].appendChild(configItem);
            } else {
                ExternalAppPopup.appendChild(configItem);
            }
        }

        if (this.autohideEmptySubDirs) {
            for (let i = 0; i < Appmenu.subdirPopupHash.length; i++) {
                if (Appmenu.subdirPopupHash[i].hasChildNodes()) {
                    continue;
                } else {
                    Appmenu.subdirMenuHash[i].setAttribute("hidden", "true");
                }
            }
        }

        if (this.moveSubDirstoBottom) {
            let i = ExternalAppPopup.childNodes.length;
            while (ExternalAppPopup.firstChild.getAttribute('class') != 'menuitem-iconic' && i-- != 0) {
                ExternalAppPopup.appendChild(ExternalAppPopup.firstChild);
            }
        }
        this._isready = true;
    },

    handleRelativePath: function(apps) {
        for (let app of apps) {
            if (app.path) {
                app.path = app.path.replace(/\//g, '\\');
                var ffdir = Cc['@mozilla.org/file/directory_service;1'].getService(Ci.nsIProperties).get(app.root, Ci.nsIFile).path;
                if (/^(\\)/.test(app.path)) {
                    app.path = ffdir + app.path;
                }
            }
        }
    },

    exec: function(path, args) {
        args = args || [];
        var args_t = args.slice(0);
        for (let arg of args_t) {
            arg = arg.replace(/%u/g, gBrowser.currentURI.spec);
        }
        var file = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsIFile);
        file.initWithPath(path);
        if (!file.exists()) {
            //Cu.reportError('Datei nicht gefunden: ' + path);
            alert('Datei nicht gefunden: ' + path);
            return;
        }
        if (file.isExecutable() && !path.endsWith('.js')) {
            var process = Cc['@mozilla.org/process/util;1'].createInstance(Ci.nsIProcess);
            process.init(file);
            process.run(false, args_t, args_t.length);
        } else if (file.isFile()) {
            if (this.editor) {
                let UI = Cc["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Ci.nsIScriptableUnicodeConverter);
                UI.charset = window.navigator.platform.toLowerCase().includes('win') ? 'Shift_JIS' : 'UTF-8';
                let path = UI.ConvertFromUnicode(file.path);
                let app = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsIFile);
                app.initWithPath(this.editor);
                let process = Cc['@mozilla.org/process/util;1'].createInstance(Ci.nsIProcess);
                process.init(app);
                process.run(false, [path], 1);
            } else {
                file.launch();
            }
        } else if (file.isDirectory()) {
            if (this.fileManager) {
                let args=[this.FMParameter,path];
                let app = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsIFile);
                app.initWithPath(this.fileManager);
                let process = Cc['@mozilla.org/process/util;1'].createInstance(Ci.nsIProcess);
                process.init(app);
                process.run(false, args, args.length);
            } else {
                file.launch();
            }
        }
    },
};

if (window.gBrowser)
    Appmenu.init();
