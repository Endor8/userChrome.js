
## Icon für Symbolleiste ##
Zwei Symbole stehen hier im Icons Ordner zur Verfügung.    
Es kann aber jedes nach Wahl verwendet werden.    
Es muss nur mit einem entsprechenden CSS Code geladen werden.    
      
# Beispiel CSS-Code: #     
    
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
#### Direkter Download CSS-Code: **⇒** [css-Symbol.css](https://github.com/Endor8/userChrome.js/blob/master/Firefox%20143/usercssloader/css-Symbol.css).    

Wird CSS1.png verwendet, muss entweder sie selbst in CSS.png umbenannt werden    
oder der Aufruf in der CSS-Datei zu CSS1.png geändert werden.

**Symbole:**\
![css.png](https://github.com/Endor8/userChrome.js/blob/master/Firefox%20143/usercssloader/icons/css.png?raw=true) (Herkunft: [Crystal Project stylesheet.png](https://commons.wikimedia.org/wiki/File:Crystal_Project_stylesheet.png), Crystal Project Icons, Link zu Wikimedia Commons)\
![CSS1.png](https://github.com/Endor8/userChrome.js/blob/master/Firefox%20143/usercssloader/icons/CSS1.png?raw=true) (Herkunft: [CSS text representation (short).png](https://commons.wikimedia.org/wiki/File:CSS_text_representation_(short).png), Wikimedia Commons)   

Für weitere Symbole siehe beispielsweise in Wikimedia Commons in der Kategorie [Cascading Style Sheets icons](https://commons.wikimedia.org/wiki/Category:Cascading_Style_Sheets_icons).
    
