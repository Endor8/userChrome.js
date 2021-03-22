# Loading Bar
Dieses Skript "zaubert" einen animierten Progressmeter in die Adressleiste, der den "Ladevorgang" einer Seite optisch darstellt.

Das **Ergebnis des Skripts** je nach Werten im CSS Code:

![Screenshot Loading Bar](https://github.com/Endor8/userChrome.js/raw/master/loadingbar/scr_loadingbar.png)    
Mit anderen Farbwerten:
```css
#urlbar-background {
background-image: repeating-linear-gradient(-45deg, rgba(255,255,255,0), rgba(255,255,255,0) 6px,
rgba(255,255,255,1) 6px, rgba(255,255,255,1) 12px), linear-gradient(to right, rgba(255,255,255) 0%,
rgba(237,2,11,.7) 100%);
```
![Screenshot Loading Bar](https://github.com/Endor8/userChrome.js/raw/master/loadingbar/scr_loadingbar6.png)     
Flächigen Farbverlauf:
```css
#urlbar-background {
background-image: repeating-linear-gradient(-45deg, rgba(255,255,255,0), rgba(255,255,255,0) 6px,
rgba(255,255,255,1) 6px, rgba(255,255,255,1) 6px), linear-gradient(to right, rgba(255,255,255) 0%,
rgba(237,2,11,.7) 100%);
```

![Screenshot Loading Bar](https://github.com/Endor8/userChrome.js/raw/master/loadingbar/scr_loadingbar4.png)
```css
#urlbar-background {
background-image: repeating-linear-gradient(-45deg, rgba(255,255,255,0), rgba(255,255,255,0) 6px,
rgba(255,255,255,1) 6px, rgba(255,255,255,1) 12px), linear-gradient(to right, rgba(255,255,255) 0%,
rgba(237,2,11,.7) 100%);
```         

![Screenshot Loading Bar](https://github.com/Endor8/userChrome.js/raw/master/loadingbar/scr_loadingbar5.png)
     

![Screenshot Loading Bar](https://github.com/Endor8/userChrome.js/raw/master/loadingbar/scr_loadingbar3.png)


## Installation
Kopiere die uc.js-Datei in den Chromeordner des Profils.

