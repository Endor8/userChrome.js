// AnimationToggleButton.uc.js
// v. 0.4.2a
// 16.05.24 Endor Anpassung an Firefox 126+
//	211104:	BrokenHeart zuletzt in:
//	https://www.camp-firefox.de/forum/thema/133649

(function() {

   if (location != 'chrome://browser/content/browser.xhtml')
      return;

   try {

      CustomizableUI.createWidget({

         id: 'animation-button',
         type: 'custom',
         defaultArea: CustomizableUI.AREA_NAVBAR,

         onBuild: function(aDocument) {

            var button = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
            var attributes = {
               id: 'animation-button',
               class: 'toolbarbutton-1 chromeclass-toolbar-additional',
               removable: 'true',
               label: 'Animation',
               tooltiptext: 'Klick li: Gif ∞\nKlick mi: Gif 1x \nKlick re: Gif aus',
               oncontextmenu: 'return false'
            };
            for (var a in attributes)
               button.setAttribute(a, attributes[a]);
            var animmode = Services.prefs.getCharPref('image.animation_mode');
            button.setAttribute('anim', animmode);
            button.IsOnce = (animmode == 'once');

            function onClick() {

               var button = document.getElementById('animation-button');
               function setPref(value) {
                  Services.prefs.setCharPref('image.animation_mode', value);
               };
               function getPref() {
                  return Services.prefs.getCharPref('image.animation_mode');
               };
               function setIsOnce(value) {
                  var windows = Services.wm.getEnumerator('navigator:browser');
                  while (windows.hasMoreElements()) {
                     windows.getNext().document.getElementById('animation-button').IsOnce = value;
                  };
               };

               switch (event.button) {

                  case 0:
                     var animmode = getPref();
                     setPref('normal');
                     if (button.IsOnce) {
                        BrowserCommands.reloadSkipCache();
                        setIsOnce(false);
                     } else {
                        if (animmode == 'normal')
                           BrowserCommands.reloadSkipCache()
                        else
                           BrowserCommands.reload();
                     };
                     break;

                  case 1:
                     setPref('once');
                     BrowserCommands.reloadSkipCache();
                     setIsOnce(true);
                     break;

                  case 2:
                     setPref('none');
                     event.preventDefault();
                     event.stopPropagation();    
                     BrowserCommands.reload();
                     break;
               };

               var windows = Services.wm.getEnumerator('navigator:browser');
               while (windows.hasMoreElements()) {
                  windows.getNext().document.getElementById('animation-button').setAttribute('anim', getPref());
               };
            };

            button.setAttribute('onclick', '(' + onClick.toString() + ')();');
            return button;
         }
      });

   } catch(e) { };

   var css =
      '#animation-button[anim="normal"] {list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAoCAYAAAC4h3lxAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH4wkNFRE2JfCuMgAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAS6SURBVFjD7ZnNTxtHFMDfm7ENtbGxoV7b2A4gATZ2VEybCyAB5d4qUntLBZcI5dQ/oKcee4l6qBRFgTYqaUqjSFS5tVUrIEJCjQqYDxmIAwUMCV+GxMYfLDs7PQQQjhcKxY03Up60WntmZ/b93pdmdhAAoK2tTQCA9yRJsgEAgoqEUvoCEWc7Ojoet7e3Z/Vjc3Ozh1J6GRE5qFdQluXxgYGBXzjPVFODiB8dKM8Z13JQFwchRAIEjojvNzU1TQHAcgYApZQAAGxXbFeEykKdnHOqJgB30v1H+Xj5b4go6XQ6dxbAwY+UMVWyq92laoudOI9XHg2lzs5OGg6HWX9//0sPwRsmc3Nz1xHxbltbW22GB5REz/TbzhfOP43bxiWOnMRKYhXLpuWGXbJryGdhQkQPANxsaWm5ciyARbRs+Cf8t3QJXeywLWIJWy3WyUnf5NWEJmHME8D2/t2AiJ8dG0LV4ep7R5U/9Mq2frU6Uv1zvsxvsVi+OkwIRJsigDVtjRRtFkWOm6RkoWTasGeI/0cdzlWnrVarCADssMwqPaRj2ZbPLM7ACliBdNaXl+2UhS+FL32t4Zp4rjyiCCBS0XSipWSgIhU1Z1I+WTbtGfPcNj01rdXP1d/IFYQiwGbhpjNpSTqPG/T8wvOaHe3OqZPYkXTM1vxV8yPKyAAAjCvGrcBcoCsXEEQ5SDkJe8KfSoVS0at9aWP63XB5+PKplU845r0j3h7CiXi03bRiWgvMB7oop4nzABwbBtGCqDP4QfCaa8v1sChaFOGE03hp/MKSZenDJE2aTjO5PWV/7B3zfo8yKuaLadm0Vo/1N4OVwWsSSoacAgAAxDQxa0gIfQLC2Se2p+xPvCPeH5DhicluipjW66CuO1gZvMqQGXISQucVW9K26B313iaM7J7m+eJI8dPAQqCLcpp8HQAn1nFb2vakdqy2m0jkTGW2eKn4WWAxcIsCTf1vAAgoX1y92ONOuEeV+oW0MO8d8d4hUmbCnhpisfhZ3d9131Kg6ZwDIKDsX/X3CLNCqGqk6r57xz2RoXxKWPKN+r6j0ulfriTmJXOkJlrzIKcACCj71/x3hFlhBgAAOcpVo1W9roRrEgBA2BWe1I7VdpE9speT5SajYk6q0IHyvjVfrzAjhDLaOcrVI9W9er8+4ph1PKJ7VIQ8yL8ByL51X69txjahCMeRuaZcg3ndM59Ubfwb/l7btG1SzTu0Yz3g2/Dds4WULa+qrxaK65eUY8oesgffhD2yIgDhhJ9346GGHIC3APlK4rQm/c5mzaYzbx+zDHH7uQCiumhV1BH9/G0IvaYQIgAgG7eMa85C54Taqo95xzx75G/WEl3DGItRSouMK8YVz4rnrlotzTlHURQXsks+5/dlWWZqDhPOOTLGfh8aGlrP8sDg4OBGY2PjjYKCglqNRmPknBOVKb+TTqcXh4eH15UXlK8c2TQ0NLj0ev2XL8fySDwe75YkSTV5YTabKwkh3wAAl2X5YRYAIkJra+uvhJDSfQuo6tBj/zhMBgBgjF0nCi4DrVb7BQCI+wOYmq4D5QHgkVar/SnLAwdeaG5udlNKPwaASs65ao5eCSExSZLGS0tLH/T19fF/AGeo9vFEBn4KAAAAAElFTkSuQmCC)} ' +
      '#animation-button[anim="once"] {list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAoCAYAAAC4h3lxAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH4wkNFQw22pzCLgAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAATOSURBVFjD7VlvTFtVFD/3vtcWWlpAUkrbDazQkWkilfhl+zAahARNZjIT9QMzkS8EPm+wADMxWdRhsk842cYgbsbExWRqBkMGCwrbPpBsisi/V9rCZsBoHGwPKO277x0/sJqxviKVah/Gk7y89+7Nve/8zvmdc++5jwAAVFRUFCPia4wxGyIS0JDwPC9SSr8tLS0daG1tjeknXq/XSyn9EAAoaFcIIn4RDAZPBoPBjQAB4J2o8owhRdSW5jxPkBBAAHjT5XL1AMDYhn5KaSYAwMGDa7o3XheeB9AWgqkpx/x771sXCCEyIr4YAyD6UPhM2GQyMc1xx+FYsQBYF6JUqq2t5Xw+nzw4OAigcd6rit/vP0UI+ay8vHzvBg+oyeqqMXT7tm1+YiJNIgRYScmq2eP5xWkwhPkUYuAIIcUAcKasrKw6riL375sjJ064/HN3+XC07Zu+9LCnxBw6csRfZDKFUgVi8dHdRAg5HJdC5zryA48rH5UfRvUrly4VBFJl/uzs7JN/5lZCbKoA5heeEkdGDCvxJvnyK+OyKKb/zYgn20pzVqs1AgBy9F0VwFqI3/QjOh0ooRCf8Io9Pu4Ya2t77nvG9OGkrRNqjQYD21Q5SQKalsYSsuTkpHO05bgtQilQjtszUVsrPMvzEcN2AVD13LuY4fFETPEGvfJyyGixbD2Ip6acPzY15zJK1783cF2vdHS4p5PhCVUAhCCpq7tXYMuV9U/2FRUyQ3X13YIEVtKJ5hZbhNKNTu0fMEidne5pxvSRpFMIACDX+iC9tTVQeOuW7eexnwwSAaJ4PCH9/v0Lu4zG1fStTC4IzvGmZluIEFClZN81g0Q592TN28Jenpf0SQUAAGCxiMaqKnFPVVXiE/tmHJONx3JDlMKm8dTba2AE3EJNja+Y4yRdUii0XfHN2H0NDXkipWRLmepqb1r4kwvuKVnWSSkH4A84phsa7EuUApfIuJ6etMiFi4mDSAgAIsHuHve0IOTdV+sPBOy+o0fzxGi2SVS6u9MiFz8tEmSZZ/8AAIJXr7qFri7zcstx+6zgsy1tVD4v0NBoX4wXsFuVK1fS127cKJhLKgBEgr29Rb7OrowVAABZJtjS4gzMzNgeAADMztpnGo85fkdMjDZxd8EhiknJQlHl+/oK/R3nzeLj7bIM2NTsCNTXZRhPf2wREVNTW/B/RZtr/YX+cx2WB2q9skyUj05nLgNAyk4yNrVaf3+h/+xZy0MtV2hxPdA/UORvP6NueS2Jqgfm5qxL7e2WpZ1QI9M43CawQ2THnUr85wCoBrHZLMFbh0MpA5efv0a3BcBqXcw8dGjxhf8p9C9RiAAA3rmTvrJrt21RY2e7MD1t+e2x15gamlcUJUgpfXpoWC8NDTsDGja2IknSTTUKNSqK8lDjTEFZlj+oq6ubjd2tIUJlZWUmY+wlnuddGoyLX8Ph8HfDw8OziAj19fW8IAg3AYBTFGWY4BO/ZPbt27fLaDS+CwCIiPdEUTzPGNNMZGRlZbkopW0AgIqiDMUAIISA1+vto5TmrNcDyGnJHYQQBABlfcsjn6KxBQyCTqdrBoDIowGylq6o8gAwotPpPo/xQNQLBw4c2M1x3KsA4NLSr1dK6UPG2GhOTs7Xly9fxj8A10cIqTl/HS8AAAAASUVORK5CYII=)} ' +
      '#animation-button[anim="none"] {list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAoCAYAAAC4h3lxAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH4wkNFRMXW6/c7gAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAATFSURBVFjD7ZlfTFtVHMd/55z+Adrbv7fg5E9L/4hLpg/GkABJwcb4plnilhg18OBC9rQnn3wyZosQJXswIwzQRRBxWcbcMnSaEf6EhMiDjj9hQssmVMV20FG4QHu59x4fRgnQWwTajUviL2nannPPvb/P7/f9/dLTgwAAfD5fLgC8LAhCHgAgUJARQqIIocmampqp6urqpHnk9XpLCCEnEUIUlGtIkqSRvr6+O5Rud1OFEHoz4TxPqRqosjjUGAsIgCKEXqmoqBgHgD+3ARBCMADAO9Goo/Thw1oKQJQEEGbZnvqCgp8RQoJGoylMAkh8eD4Ws2QLAlGadiyrq8VbpVRbW0v8fr/Y29sLAAAYjphNT083IIQ6fD7f8W0ZkLN1jebxDMv+EtDrZwml2M1xjsL5+TLV+rruMBsTQqgEAJoqKyvfSwmwkpPz6LLH0+xXq5c2B41Gf6nFMvZuIHBGG48zhwTweONdhxB6P6WEbtntV7c5v2HD2dn/DBYW3jis8JvN5rrNgkAoTxYgyjDBAZ0umOomHSbT/ZhWu3xAH9Lq0zabjQcAMfFdFoCXifxW0wKIcZVK2O/DQ2az/3ZJyUWJkOVMZUQWQL2+btgtUjwA0QiCaj8Pmjeb79c5nVe6GSb0o8fTmCkIWQATx+WXrq7mp1p0Ohp9IXsfRbxgNk9eKC7+NoaQCABwW6+P/OB2t9AMQMgXMaX41OzsqQJB0O+ceikeZ6uCwZN7jrzJ9OCC09kWw5jfOt7NMKE7bneLhPFKOgApZcBwXP6Hk5Nn/TbbwIROF9RQSl7kuCJXOPyamucNe7l5xGSaqnO5vl5DSLZebjFMiHg8Ta8HAmexKOoyCgAAoF1bs52YnX37xEGatdEY+NTp/GYlhfMJu8EwYepytb4RCJxBkqTLjITStAWjcabe5brCYRzfy/XfGwx/33W7WyjGq88CYNc+vmg0Bj53uVqjGO+rzXYZDHM9Hk8zxXjtaQJIvzkcbSGW/VXWeYPhQb3T2b64o2D3atcZZq7H5fqSYhx7GgDSPYejrZllJ87b7ddCVuvoNs0bDLOfud1fLRISS0d+143G4FR+/s1MA0gjDkf7ZZb9HQBAQEg673B0hq3WMQCAJYMh0OB2t0QwXs9EDcUJ4TPShTadt9s7m1h2YuuggJD0icPReS4rK9iemzu8cEDZpGv/BSCN2e2dTTbbqNykiJB48dix/sPc4OwmITput3c22mxjSt6hpczAeFHR1UspIq8kk81AxGwev5Sbe+8o7JFlAaQn/xPRIwtwlOzIA8gWcRbPZ38QieQfllN5KyvPpQWg5zj3qxx37n8JPSMJYQCQJvX6kNliGVVa95ljmMmtv2CSAERRXCKE6Lt1ur+6nc4OpUaaUop4nv8jSUKU0muSJIlKlgmlFImieHdwcDCclIH+/v5H5eXljVqt9rhKpWIopVhhznOxWGxmaGgoLDePdh7ZlJWVFeTk5Hz8ZC0NLi8vtwqCoJi6MJlMxRjjLwCASpI0kASAEIKqqqqfMMbWjQgo6tBj4zhMAgAQRbEBy6QM1Gr1RwDAbywQlfRKOA8Aw2q1+rukDCSy4PV6CwkhbwFAMaVUMUevGOMlQRBGrFbrza6uLvovNfXp2AJLOUkAAAAASUVORK5CYII=)}';
   var stylesheet = document.createProcessingInstruction('xml-stylesheet', 'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(css) + '"');
   document.insertBefore(stylesheet, document.documentElement);

})();
