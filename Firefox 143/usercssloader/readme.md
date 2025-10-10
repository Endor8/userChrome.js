
## Icon für Symbolleiste ##
Zwei Symbole stehen hier im Icons Ordner zur Verfügung.    
Es kann aber jedes nach Wahl verwendet werden.    
Es muss nur mit einem entsprechenden CSS Code geladen werden.    
      
# Beispiel CSS Code: #     
    
```CSS
@-moz-document url(chrome://browser/content/browser.xhtml){

#usercssloader-menu-item {
	background-image: url("../icons/CSS.png");
	background-position: center;
	background-repeat: no-repeat;
	background-size: 16px;
	margin-right: -5px !important;
	margin-left: -6px !important;
}

#usercssloader-menu-item:hover {
	background-color: var(--toolbarbutton-hover-background);
	border-radius: 3px!important;
}

#usercssloader-menu-item #usercssloader-menu > .menu-text[value="CSS"] {
	opacity: 0;
	width: calc(2 * var(--toolbarbutton-inner-padding) + 16px);
	height: calc(2 * var(--toolbarbutton-inner-padding) + 16px);
}
}
```
#### Direkter Download CSS Code: **⇒** [css-Symbol.css](https://github.com/Endor8/userChrome.js/blob/master/Firefox%20143/usercssloader/css-Symbol.css).    

**Symbole:**      
![Screenshot](https://github.com/Endor8/userChrome.js/blob/master/Firefox%20143/usercssloader/icons/css.png?raw=true)     
![Screenshot](https://github.com/Endor8/userChrome.js/blob/master/Firefox%20143/usercssloader/icons/CSS1.png?raw=true)     
    
