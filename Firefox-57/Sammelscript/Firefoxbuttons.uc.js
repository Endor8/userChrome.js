// ==UserScript==
// @name    Firefox_ToolBarButtons.uc.js
// @charset UTF-8
// Date     2017/01/16 2017/11/09版と同じようにボタンを一つにまとめ直しました。初期導入時、再起動するボタンのみツールバーに表示するようにしてみました。
// Date     2017/11/23 ブックマーク、履歴、同期タブのサイドバーを開閉するボタンを追加して、個別に導入できるようにバラバラにしてみました。
// Date     2017/11/09 RestartFirefoxButton_Movable.uc.js をベースに、再起動+ about:config、プロファイルフォルダ、クッキーマネージャのボタンをセットにしてみました。
// @note    
// @note    初期導入時、再起動するボタンのみツールバーに表示するようにしました。
// @note    その他のボタンは、ツールバーのカスタマイズ内に格納されていると思います。
// @note    カスタマイズから追加したいボタンを好きなところに出して使ってください。
// @note    
// @note    Firefox_ToolBarButtons.zip のボタンとIDがいっしょなので
// @note    追加していたボタンは、同じ場所に追加されます。
// @note    
// @note    再起動するボタン
// @note    about:configを開くボタン
// @note    新しいタブを開くボタン
// @note    プロファイルフォルダを開くボタン
// @note    クッキーマネージャを開くボタン
// @note    ブックマークのサイドバーを開閉するボタン
// @note    履歴のサイドバーを開閉するボタン
// @note    同期タブのサイドバーを開閉するボタン
// @note    
// @note    Firefox Developer Edition 59.0b1 Waterfox 56.03 で動作確認しました。
// @note    http://wiki.nothing.sh/page/userChrome.js%CD%D1%A5%B9%A5%AF%A5%EA%A5%D7%A5%C8
// @note    ↑ここの「Firefox57以降でuserChrome.js用スクリプトを利用する方法」の「その1」を導入して確認しています。
// ==/UserScript==

(function() {

   if (location != 'chrome://browser/content/browser.xul') return;

	try {
//		Firefox neustarten
		CustomizableUI.createWidget({
			id: 'restart-ToolBarButton',
			type: 'custom',
			defaultArea: CustomizableUI.AREA_NAVBAR,
			onBuild: function(aDocument) {			
				var toolbaritem = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
				var props = {
					id: 'restart-ToolBarButton',
					class: 'toolbarbutton-1 chromeclass-toolbar-additional',
					label: 'Neustart',
					tooltiptext: 'Firefox neustarten',
					style: 'list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89%2BbN%2FrXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz%2FSMBAPh%2BPDwrIsAHvgABeNMLCADATZvAMByH%2Fw%2FqQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf%2BbTAICd%2BJl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA%2Fg88wAAKCRFRHgg%2FP9eM4Ors7ONo62Dl8t6r8G%2FyJiYuP%2B5c%2BrcEAAAOF0ftH%2BLC%2BzGoA7BoBt%2FqIl7gRoXgugdfeLZrIPQLUAoOnaV%2FNw%2BH48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl%2FAV%2F1s%2BX48%2FPf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H%2FLcL%2F%2Fwd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s%2BwM%2B3zUAsGo%2BAXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93%2F%2B8%2F%2FUegJQCAZkmScQAAXkQkLlTKsz%2FHCAAARKCBKrBBG%2FTBGCzABhzBBdzBC%2FxgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD%2FphCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8%2BQ8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8%2BxdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR%2BcQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI%2BksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG%2BQh8lsKnWJAcaT4U%2BIoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr%2Bh0uhHdlR5Ol9BX0svpR%2BiX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK%2BYTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI%2BpXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q%2FpH5Z%2FYkGWcNMw09DpFGgsV%2FjvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY%2FR27iz2qqaE5QzNKM1ezUvOUZj8H45hx%2BJx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4%2FOBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up%2B6Ynr5egJ5Mb6feeb3n%2Bhx9L%2F1U%2FW36p%2FVHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm%2Beb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw%2B6TvZN9un2N%2FT0HDYfZDqsdWh1%2Bc7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc%2BLpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26%2FuNu5p7ofcn8w0nymeWTNz0MPIQ%2BBR5dE%2FC5%2BVMGvfrH5PQ0%2BBZ7XnIy9jL5FXrdewt6V3qvdh7xc%2B9j5yn%2BM%2B4zw33jLeWV%2FMN8C3yLfLT8Nvnl%2BF30N%2FI%2F9k%2F3r%2F0QCngCUBZwOJgUGBWwL7%2BHp8Ib%2BOPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo%2Bqi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt%2F87fOH4p3iC%2BN7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi%2FRNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z%2Bpn5mZ2y6xlhbL%2BxW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a%2FzYnKOZarnivN7cyzytuQN5zvn%2F%2FtEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1%2B1dT1gvWd%2B1YfqGnRs%2BFYmKrhTbF5cVf9go3HjlG4dvyr%2BZ3JS0qavEuWTPZtJm6ebeLZ5bDpaql%2BaXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO%2FPLi8ZafJzs07P1SkVPRU%2BlQ27tLdtWHX%2BG7R7ht7vPY07NXbW7z3%2FT7JvttVAVVN1WbVZftJ%2B7P3P66Jqun4lvttXa1ObXHtxwPSA%2F0HIw6217nU1R3SPVRSj9Yr60cOxx%2B%2B%2Fp3vdy0NNg1VjZzG4iNwRHnk6fcJ3%2FceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w%2B0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb%2B%2B6EHTh0kX%2Fi%2Bc7vDvOXPK4dPKy2%2BUTV7hXmq86X23qdOo8%2FpPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb%2F1tWeOT3dvfN6b%2FfF9%2FXfFt1%2Bcif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v%2B3Njv3H9qwHeg89HcR%2FcGhYPP%2FpH1jw9DBY%2BZj8uGDYbrnjg%2BOTniP3L96fynQ89kzyaeF%2F6i%2FsuuFxYvfvjV69fO0ZjRoZfyl5O%2FbXyl%2FerA6xmv28bCxh6%2ByXgzMV70VvvtwXfcdx3vo98PT%2BR8IH8o%2F2j5sfVT0Kf7kxmTk%2F8EA5jz%2FGMzLdsAAAAEZ0FNQQAAsY58%2B1GTAAAAIGNIUk0AAHolAACAgwAA%2Bf8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAN8SURBVHjaVJFNTBxlAIafb2Z29gd2l4VdYCkokAUt1AJplQRTrVqjUWMPPWHSCzb21IOn9qIHY2xMahoTTb00NmkUm5qAjdpUI61VaCxCpCVYixt%2ByvKzCwu7LDs7zMw3HmhM%2Bt6fJ0%2FyCp69wiOzZBCPcqSmIXg0HPHuC4R8nkLWyOXyYiIzfuVHzMIA%2BZsLtH18EApntUdhpzUSD5577nDLi%2FGWKjx%2BHVfR8HpFwNwsxTMzza%2BOXJ1%2B58Ev2sVEV%2ByEawXqxf8FllNWEQ9ePXzsqQOecIDU8jampSAVD76Al2BIIx4Dv2Nz7%2FYq%2B5%2BP8sNXE6WdAhdQlOM9rzUdaGiN8M9UjnKvQjzuA0UjV3AxDIcHywqRoEbXoVrKgyBtKXYEUvprmiN9oaoyvr9wl62NHJbtJeDzOo17YmprVzWOppLO2RRNwf1FSOzSUAXsCIR4QdP13UPfjhUde2mjuBXUjcXNEabOnJmq7Y4Nd7z1fu%2BJ%2FR2Jpgrm0jauAI8GlnSlBi4I0bO6sLBWHc9esxRdmjOZf5n%2B5CLWzCzOvsbKupBZ1xgmElUoC%2BgoKtRGQfNomoaND8P8XS%2Bby1olO7O6GHTl1DejGDOrNB%2BvpO7I%2Ba31%2FDP9Z28YUmqoqhCKcG2EYD6ZMUTojZ8WHmsqD%2BI6wnWFajugCkuuZaV%2FZS47wp99R7E3LbxPV6rtr7dV1pmyuBWs3hr7dZ380LC2tzseffvUHm86C1JC2A%2FrGcn509cn%2BPvTk9ibc1R06qL91Ms1CadF000ll9rVS2VykLzVr0lHOgtpuJ9yUFyXxqhKZjbH2nJRI9IZwyw2kXjvXV%2FIOWgaBcc2a%2BtjdVXR1J3iBDx8QUpQUJAuJJclseogxz441H5vrPO72cm0VSyVPJq27ZaHm8ST3Y0M9d9Kkr19A1A1x4VIObTGBfNrsJ5XmE9b6KqgvrOGhr1Vns2sgeNIkXiigvHf1liZuHWZYjINSEXRVLewZjN6bYmYbvN4rcDvVzFKLnOpErMLBpvbklClznyyyPDA6DjTX3wJWICr%2Bnb3ffjXSGpl5Nxnn88uh2ORUCBaHfVQU%2BsjVuGhKqJT5lFYShr8fGH4j42bH53EnJ4EtgEEPQOTzHx9mqXLl9AT9TS82RvreOmVcMTXVh4JhIr5kp3LFu6u3Lk%2ByMylQazU3ENYAvw3AFUTimFqj5i7AAAAAElFTkSuQmCC)',
					oncommand: "Services.appinfo.invalidateCachesOnRestart() || BrowserUtils.restartApplication();"
				};
				for (var p in props)
					toolbaritem.setAttribute(p, props[p]);
				return toolbaritem;
			}
		});
//		about:config öffnen
		CustomizableUI.createWidget({
			id: 'aboutconfig-ToolBarButton',
			type: 'custom',
			defaultArea: CustomizableUI.AREAS,
			onBuild: function(aDocument) {			
				var toolbaritem = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
				var props = {
					id: 'aboutconfig-ToolBarButton',
					class: 'toolbarbutton-1 chromeclass-toolbar-additional',
					label: 'About:Config',
					tooltiptext: 'About:Config öffnen',
					style: 'list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABOVJREFUeNrElm1MW1UYx597b2/pgMh4aSkMeakNMBacU7MYcLwkZnMB3fiwGL/MRaPGxLghTmY3dUzajJh9UKNBWTAxIQMW4Is6/TA2YRCziXFKKbFlvPYNyltb+jJ6e33O3W0sCzCBu3iTJ5yW0/P7P+c8z/8eiud5oCgKJHzos+f0NTRNn+A4Ll2pVILT6QSCCHNcpz8Q+ODCpw1mnMeTyZTEAth6Q8NEujpNXVq+D5QpKRBZPxgMgtk8Ale7r4HVOpnf+NWXfxMRMgkzJ/DJvNzc1JKSZ+H2n4PQ1/cr4E4IoUpVQeGuAsjISIemi83DOF+BEZRKAP3+Kd2r6Wo1wouh+3oPcKEQsCwLbrebZAxDpiG41t1NNh0Yhia/iZVSQExcXHxdaXkJZm4U4DTNIIiBxcVFOHf244M4Zzlq/nxkIJUABZ51qipFKWw7AdM0BTKZDMTyGo2GimKWpBTAkmJzezxAiKToiAi5nI3OeHrVs5OqAokAGYMZ4/geXCbUAMD6HSaZAC501z46egdU2PcsK0MRGDIG+HB43d9JdQTc0pLPAhSdlp2dBWaLRTh/GRZiZlYm1JysdZJWFIwHj4eMzxvqY/DjXSkEMPW6U988V/HivrxcLfyB/U+OQ6FQCCI0Gg0U7NwpfGZZBuw2B3R0dd0R23BLAlhV3ZUpmudUIS0FTz1eADdvG8Hv92H4QRETA0nbtwtihAJFPzAND4PJZEI/uFoTWWSzVszmGH4e11eVpfVOeeHmuB0eXbbDu9owTDhd0NvXb01ISEhCs98WFxsLHtId+Ljdi/1NXzfW4nAcw0l2YDMC2CzDT2P1h0rTf3cGwOYNwHKYhoGRUahgLBA2Xp9pbLr4MqkLUuSpanW80+EgPR/CWBTBcwROmmcjAqiUtxs1yuw8i+75Z2DA6QebJwChMA/LPAUBFGEy/QZTH1UW49wpDL/YZZT45iOCguL3oY12AZX01heP5eQXmvUvFMEPlvl/4bgsh8sveOYgSMmJ4Vgx7FHWGxGwaR+gkt78PEdT8KT5k8oi+N5M4P4oOAUu9xxYJ8yumQ/3HxC3Odr3+a34AJ1c23p0b37ut++U74EfMXO7l8BhJXzS4rLVHT4kbv3SRgpqvRqgk0+2vFK+Z3fzifJd0DY4Bw4suBC/Em5zTIL1zMFi8YXjui/7Bz5r7QCd+F7L0bIndjcfR3irCOdWgc+3NxwR22rD8LUEyBJPd7W/UfJ0VUVhBmY+i/Dg6vC28y/5/vrl1mbhqwlgEnWd7dX7i6pKtCpoM86Ccy34Jf0Rn/HGrYihbNZOZSsy13Verj5QfJjALxP40urw4FC/HuEDIjz4oEr/LwIYpa6j6bWyvWvA8Ubhdd+DG28YXJf030kBj/aBbTFx8ccqC3fcB+eFv95AEOHjEBzs1YtwYjSBrcKjd0ChVSaC04cr45mjxwhGQ7adwMemzBCac/S4Wg0tONcm9npYiotERADt8HjxBgOCyRABK+Cz9h77hWPHcZ5DSnj0EfCzswtjI9MzoJDLcXUG3D4fjAuZ23sRXi26nEdKeLQTJuBYqz7d0UkpYjPxRi24Izc9ecX+2etn8H8T4s2WA4mfiAByfU3G2IHxiLgzyyKUFNxC9Cv0YQgQLhriPU0uvkLDYqX7H0bmK+7z/+fzjwADAKjckmpp+9qUAAAAAElFTkSuQmCC)',
					onclick: 'if (event.button == 0) { \
										openUILinkIn("about:config", "tab");\
								 }; '
				};
				for (var p in props)
					toolbaritem.setAttribute(p, props[p]);
				return toolbaritem;
			}
		});
//		Neuen Tab öffnen
		CustomizableUI.createWidget({
			id: 'newtab-ToolBarButton',
			type: 'custom',
			defaultArea: CustomizableUI.AREAS,
			onBuild: function(aDocument) {			
				var toolbaritem = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
				var props = {
					id: 'newtab-ToolBarButton',
					class: 'toolbarbutton-1 chromeclass-toolbar-additional',
					label: 'Neuer Tab',
					tooltiptext: '\Neue Tab öffnen',
					style: 'list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAABWFJREFUWIXtl79vHMcVxz/zdvfuluSRFEOGMgxRia3YMZTIMEADAtKkSZXCXYpUKfJHBBBUpEobQAD/CRdBilQpUgZIIxgqbEGUrViWTUrHI3l33B+zM++luOP5GN4psWIgQJAvMLd7s3PzPvN982MP/ldlRqZK2wx5WTv3rQb9jI5ttK6DfAexZVziUK1w8YTl5pkIRwsB9vb2bh8eHv4mTdMSIMY4n9i5WkTu3r179+lsvQ7ZxjpvI9l1kG0z6QLinJVOrWfSfEEMj2XNP7wEcOfOnWubm5t/3N3dfa8sS1QVVcXMUNVxgMlVRNjf3//k0aNH7+/t7Y0AbMCmufZ70HrHXOsGpK+DWwOXYJxBOHCueYKGTzD/YBYinYx2VJZlPhgMeP78OTFGYoxTkFkgM0NEtrIs+zHwVzOcDfI3cdlbRvtH0HoHS78HW0KSOuJAsWHPnOs6AdBCT31P1sbpSABu3bqV5nn+652dna2qqnDOTcvE9gslSZLO0dERt2/f9k8ev/a+qvzESHfFtW45t/Ym6bsdk5tts522pOuGhJxY5GCFGENEB7/9nR5OHUiSpGmahrquKYqCEAIxRkIIqOrUDTMbTzYz2d7e/tXS0tIvN7c2pI5XpPRfJCv6QiI3QG8i6Q+ckw5Rn7QSYYA73YRw1aTZRJN1s0acQwXg3r173ntPXdeUZUlVVZeu56Usy/O6tN/vL/V6X3bORv1WaIokSaKDrnNy1Ul6E0l3UdvJ4LsJyargWDZzOSIdM7KpA4Cpajwfdd1EysYRAsQIqufFpi6cq1sZpQcfDLOImWLmMR2BgFmNEZ01UWqftn1YyddXCnMOmwUgxtgkSUKWZXx8usGxrpEmAmKTji4Ghsl3d8CK7rPqUzaqyGrax8JTlATI0PiV1HVvNYTKPj18a+Xhl9feWE2fPfjgZ3/2FwBCCHVVVRRFQWmb/Pyn7zKowpydYGb9Au10h9fWOnS7KSqQuM8Rl4KdAoJzQxJ5mpzp6+RL30+H5RX395MsubAMAZqmaeq6pq5rjAQflP7QLwT4Wh1i3CCGLWIc4YOylvfIW58DKU0UhtU6R6Or9IttXpzmxf2Ptx9fAogx1uP1r0iSYt9gl+6NrpNKBYAPOcNqnXZWIM7woc2ZX6V/tsWwvsZnvWz07DjtXQIwMy8iWNIib7fQSzlfrKgZB4O3CdrhrFljpTihlRU4jCa2KXyXF8MNzL3B4YujSqU/nOtAWZaclQ3ZSkqM/z7AOcTh4Aan5TbLrWOytJwAZByfrTCornB1fRmvz4NP0ssAIYTae0/plU47I34DB2ZVNV2qpjvuU43ax/P1Qpo4Qoj6w142eDDHgSqEgI/QbbVowqsBAEQ1fFCi/lMfBg47+/DDX0yP2imAqlYigkvbJFmbEHVhADVDjcnhNOnbwLDxhrXAvSZEMDudrZtNQVWWJVVISSS9kIKoNi2qxqt60wTFxF14KZndByrvPd6WQKCJSt0oQZVXnA6X5JtAVOvN1s2moIwxoq5NiA4fFu+CdunmJW0mcg6KusFCPJwLEGMsRQRL21RBifPeJe2lMRnPgvkk4hxF3dBEXQzgvcdrSh0ud2VzxzUn1oImzhmDovZRQ38egFRVJSEEIkLVRES+dmBhWPsXz2cBgGLYVMOjZxeanwPkg8HgpLBlc1numqDA4mX4KnJA//ho2PvoD4+AHChnAcL9+/f/snzzg4dp62B71D9AdTwJZlMxtthYOHQ3/QDnJndSNUn+qSMOv/roT7/v7//tGGgu/GSiDrAOLAEBWPnPxnxB9QR3BJwA03N+3pnrAGFmgn4LCsD8fzr/139b/wA0wmcpTSnePAAAAABJRU5ErkJggg==)',
					onclick: 'if (event.button == 0) { \
									BrowserOpenTab(event); \
								 }; '
				};
				for (var p in props)
					toolbaritem.setAttribute(p, props[p]);
				return toolbaritem;
			}
		});
//		Profilordner öffnen
		CustomizableUI.createWidget({
			id: 'profilefolder-ToolBarButton',
			type: 'custom',
			defaultArea: CustomizableUI.AREAS,
			onBuild: function(aDocument) {			
				var toolbaritem = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
				var props = {
					id: 'profilefolder-ToolBarButton',
					class: 'toolbarbutton-1 chromeclass-toolbar-additional',
					label: 'Profilordner',
					tooltiptext: 'Profilordner öffnen',
					style: 'list-style-image: url(data:image/png;base64,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)',
					onclick: 'if (event.button == 0) { \
									Cc["@mozilla.org/file/directory_service;1"].getService(Ci.nsIProperties).get("ProfD", Ci.nsIFile).launch(); \
								 }; '
				};
				for (var p in props)
					toolbaritem.setAttribute(p, props[p]);
				return toolbaritem;
			}
		});
//		Cookies anzeigen
		CustomizableUI.createWidget({
			id: 'showCookies-ToolBarButton',
			type: 'custom',
			defaultArea: CustomizableUI.AREAS,
			onBuild: function(aDocument) {			
				var toolbaritem = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
				var props = {
					id: 'showCookies-ToolBarButton',
					class: 'toolbarbutton-1 chromeclass-toolbar-additional',
					label: 'Cookie anzeigen',
					tooltiptext: 'Cookie anzeigen',
					style: 'list-style-image: url(data:image/png;base64,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)',
					onclick: 'if (event.button == 0) { \
									window.open("chrome://browser/content/preferences/cookies.xul","cookie","chrome,dialog,centerscreen,dependent"); \
								 }; '
				};
				for (var p in props)
					toolbaritem.setAttribute(p, props[p]);
				return toolbaritem;
			}
		});	
//		Lesezeichen-Seitenleiste Öffnen/Schließen
		CustomizableUI.createWidget({
			id: 'BookmarksSidebar-ToolBarButton',
			type: 'custom',
			defaultArea: CustomizableUI.AREAS,
			onBuild: function(aDocument) {			
				var toolbaritem = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
				var props = {
					id: 'BookmarksSidebar-ToolBarButton',
					class: 'toolbarbutton-1 chromeclass-toolbar-additional',
					label: 'Lesezeichen-Sidebar öffnen',
					tooltiptext: 'Lesezeichen-Sidebar öffnen/schließen',
					style: 'list-style-image: url(data:image/png;base64,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)',
					onclick: 'if (event.button == 0) { \
									SidebarUI.toggle("viewBookmarksSidebar"); \
								 }; '
				};
				for (var p in props)
					toolbaritem.setAttribute(p, props[p]);
				return toolbaritem;
			}
		});
//		Chronik-Seitenleiste Öffnen/Schließen
		CustomizableUI.createWidget({
			id: 'HistorySidebar-ToolBarButton',
			type: 'custom',
			defaultArea: CustomizableUI.AREAS,
			onBuild: function(aDocument) {			
				var toolbaritem = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
				var props = {
					id: 'HistorySidebar-ToolBarButton',
					class: 'toolbarbutton-1 chromeclass-toolbar-additional',
					label: 'Chronik-sidebar',
					tooltiptext: 'Chronik-sidebar Öffnen/Schließen',
					style: 'list-style-image: url(data:image/png;base64,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)',
					onclick: 'if (event.button == 0) { \
									SidebarUI.toggle("viewHistorySidebar"); \
								 }; '
				};
				for (var p in props)
					toolbaritem.setAttribute(p, props[p]);
				return toolbaritem;
			}
		});
//		Tabs-Seitenleiste Öffnen/Schließen
		CustomizableUI.createWidget({
			id: 'viewTabsSidebar-ToolBarButton',
			type: 'custom',
			defaultArea: CustomizableUI.AREAS,
			onBuild: function(aDocument) {			
				var toolbaritem = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
				var props = {
					id: 'viewTabsSidebar-ToolBarButton',
					class: 'toolbarbutton-1 chromeclass-toolbar-additional',
					label: 'Tabs-sidebar',
					tooltiptext: 'Tabs-sidebar Öffnen/Schließen',
					style: 'list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAB4UlEQVR4Xu2WP2sUQRjGn3f3bo+YvTMhIoaQpAhcokRCkCu2SBp7USyECAFtrERBEkggX0A02IhcY2Fhq3aCNqYICEoaAynTREi4kOSKXHI3M6/MMssycCgr3F0zD8y+7zMs7/549g9LzIxeykOP5QAcgANwADn8RS/Wq3nf966Fxf4AWgxT7IaZjTUyXkiJo+OT3bWVJ7XMAJvb21SpzHyr3JiJQARWCooZrJdiKFZpH1ftk55Nr3BwUGu8fFWdf/b00Y9MAF8/fbl0/96d6Py8GQ9KhzLYeBuo/X4Yhn1joyM3AWQDCHIFX0iBxtkZ2L5Q4qGUgbG8vfSe7/l+5luQDwI0WwI6gWQQoGuaBJjt2FNvgxAhM0BQyENogGbLSsD01oXAMM8E2iYA/A9AUIAQCq2WALeLlmF5e9kgIO/fAJ83Nuhw7/DWZHmi7HseZq9PFgGOU2AwYIYCZjiA5EC6EMWV44PZNeddHhqY29r6tQQAJ/X66eb3nx9Wlx//1p6Soc/Xqw/K5am3nf42eR6hVtvfebh496qVwPDw6HRYHEA3NKh46t37j7nFhdsiAdDv63GpdBFdUv3KUFFaCUipXgshJvou9I8TETolKWWTWb2JolnW3v0VOwAH4AAcwB+e16VmcXWe1QAAAABJRU5ErkJggg==)',
					onclick: 'if (event.button == 0) { \
									SidebarUI.toggle("viewTabsSidebar"); \
								 }; '
				};
				for (var p in props)
					toolbaritem.setAttribute(p, props[p]);
				return toolbaritem;
			}
		});
//      Weitere Schaltflächen
//      DownloadsFenster öffnen
             CustomizableUI.createWidget({
             id: 'Download-button',
             type: 'custom',
             defaultArea: CustomizableUI.AREAS,
             onBuild: function(aDocument) {         
                var toolbaritem = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
                var props = {
                   id: 'Download-button',
                   class: 'toolbarbutton-1 chromeclass-toolbar-additional',
                   removable: true,
                   label: 'Download Fenster öffnen',
				   accesskey: 'D',
                   tooltiptext: 'Download Fenster öffnen',
                   style: 'list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAFo9M/3AAAACXBIWXMAAAsTAAALEwEAmpwYAAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAC7klEQVR42mJgAIL3K2X+AwQQy9VMzf+cIooMAAHE8H6i2n+QKEAAsbCrSjJ8vST4HyCAQByG13Mc/n+/D5EBCCAWsMByBQa2bz/BkgABxAAz5f1aYbAKgAACo6+XJP///OQFFgAIIJbvd23//z/NyPD/NQPDg8uS/wECiIlT+TDjr5/sDK9ZrjMo6D5nBAgguLYPC13/f7nN+v/bQ7H/P77awM0DCCAWGOPLp58MfE80GFiE+RiYOCXhGgECiAlE3PZI/i8iL8bAchMocV2C4d/+fwyPj2qBTQEIIBR02S7+/4N1AigSAAHECPcLyB9/OBkY/rMxMLxkYRDMvwWWAwggJpgCDidZBlazzwzsVg8ZGAXU4SYABBDckYy/2BmYvgsyMLLxMPz+g7AFIIAQCr6zA+0B+oCLn+HHV0Q4AgQQ48MTUv8FvwszsLwUhHhLlIeBkQ+oT+IXw8Pa3wwAAcQkb/GM8f2fbwwMr4CO+8ABDBABBua3wgzP8qQY1BbsZQQIILAj5V3vMj6Tv8Dw8/VbBqZ/nxjuT2BiUFw/D+wLgABCQXeX8v+/5pyAEg4AAYSh6v0il/+cMeIM/9+/YGBgZmNgZOSGKOSTYvi25A6DYOw2FD0AAcSCbsCfX38Y/n+4x/D37R0GZiY2hn/sQN//+8LAzGgClGPCcBVAAGEa8O8/A9MnVoZ/77gZ/gH5zHwCDP//czAwcnID5T5jGAAQQCx3o0L/s/znBXP+/fvD8E/sGgPjJ14GxrdCDAxszMBwBQYrAz8DAx8TA7P8d4anaXH/mf8yMfz/y87w6/9zBoAAYoSlJrbiAwzi7wwY/r38CNSIcCqTFB+E/wvonu//GVj4+Rie855k+NtjzaCwfjYjQAChBMhNt5T/7IV7GaTf6jD8fAZx7h9xXgZ2RmYGVjFBsMYfzZYMqjvmwvUBBBBWBIqqW2t5/n+eo/X/6zKj//d38v4HuRKbWoAAwouOher8Pxmtg1cjQIABAFbt8Z32Ai5RAAAAAElFTkSuQmCC)',
                   oncommand: "DownloadsPanel.showDownloadsHistory();"
				};
				for (var p in props)
					toolbaritem.setAttribute(p, props[p]);
				return toolbaritem;
			}
		});
//      Tabs neuladen ohne Cache
             CustomizableUI.createWidget({
             id: 'reload-skip-cache-button',
             type: 'custom',
             defaultArea: CustomizableUI.AREAS,
             onBuild: function(aDocument) {         
                var toolbaritem = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
                var props = {
                   id: 'reload-skip-cache-button',
                   class: 'toolbarbutton-1 chromeclass-toolbar-additional',
                   removable: true,
                   label: 'Tab neu laden',
                   tooltiptext: 'Tab neu laden, ohne den Browsercache zu benutzen',
                   style: 'list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAC+klEQVQ4y2WSW2gcdRTGfzM7l51sdne6s2k36zYmdk1qxRVaiyA+NJAHpUILDYooluKlL4LvKoqivokUBUsRRArSB580lHqh1BDaFCoGNklLsk3bVIZku8lespeZnf/M+JKatH5w3s7345zzHYn/SwHMzVKAABBAE2gAzsPND+gipGUY7yXzqqwYhUB0ZIG3LmhPCTpnQb1wCC+4BM/JqO9J281/KIylxO6vd77+8l5JlaA3Tui5eNUmYr1Ce2ae+r25cwLvbA/WDw7t7n+Aiwpj2fzoL7tOvBatF4v4rTahLyFFQpBVZAUkXccp3aZ2eZL8p5/w40fvIm+OnUv6A9/3v308unZlGn+jiaypGCHENzrooQ9BiL/RRO3vp+/YK+j9ma0bCHjjkZPHc7VrM9Bogq7RvTDJr+7i0lSM2kutaObpPc9kjSf3IQmP0A3wq/UtgELqTdWXqBVvENF12n9d5v3U8k8TLqdoUbbTzviHN6c/T99cRiOG8cQI0r3WFiDak8h1Z0uEi3dQFJVzieXZiXU+AJYmouxzapw0SaLgEdDCvT5LODS0LUYnwLsyj0+NqtumkaYElE4nyCw1+BYYsFl7MO/zX20BVgI7GCROlzpNPPZKPPZdFu0tmwZwAohuPtR2yYAjAywnhB0AXUJkIFulUDY49U4eGVj4YpiV07spzO14qnDr8bHMP/uPapPmkPPZo5QjAHaSPYfD1LOKJ9GiTl9gkax6B+J+cORoksOmzfiwcXBYGszHa/HeRMOIGb+VLikfV7kbAVhtsZJKrr0wdvCI2bljI/AwSYpBNxdLt6wduYEDYFlOJyK5oax6C8U//TM9jVKlw+3I5j6VyTb1kUpxtDAyqutlH4ELRHwtaXZDK+5oVsoJVd25e+Nq8I1xa2GmzBTg3gcEwOLPHnZHXcwPBUrfLm2nlLYyqmaZRGKJYHV1QVy9ft79Ul+b/nuVCaAKID102V6gEFV48fksh6I+ppBxhETDbnNtvsLvwAxQuW/4F2IsPJT8fGTdAAAAAElFTkSuQmCC)',
                   oncommand: "BrowserReloadSkipCache();"
				};
				for (var p in props)
					toolbaritem.setAttribute(p, props[p]);
				return toolbaritem;
			}
		});
//      Einstellungen öffnen
             CustomizableUI.createWidget({
             id: 'Einstellungen-button',
             type: 'custom',
             defaultArea: CustomizableUI.AREAS,
             onBuild: function(aDocument) {         
                var toolbaritem = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
                var props = {
                   id: 'Einstellungen-button',
                   class: 'toolbarbutton-1 chromeclass-toolbar-additional',
                   removable: true,
                   label: 'Einstellungen-button',
                   tooltiptext: 'Einstellungen-button',
                   style: 'list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADy0lEQVR4nAXBa0wbBQAH8P/d9XG9lrtrGV17pa6VjIbXBgwG6DoX/cJcYmZIXIwa5wcyNEajkanRJX7SxSzxi36Z02mEKZosI0zY3DLcmgwQhG1uhayjQIE+dtCVlj7u1fP3Iz74KYqyKgO6hnhaprxOWptfK+1jTISTptSbLo4oUBQJkiCgazLUYg7JyD3w2jJu3LgGUlI0SLKCucX8ie4OIfpfJP92+27HD1/1No1ui7GXDEQZRqIMiiyDAGA0kGB5FmYrD5a1geg7G8F0eIPNKaR46Yt2kw4COoCSCvz9z1IsmtSX0o/Xput8Ff2qIoPQClAySdh0EUo+DcrV3ktLcvlM936h1lfNWX4PJbUzfzyUF0QYDjQLXKCm0rcQjlZvi9Hv7Q5eMeoyzIQEh5UCW2EBGYvnjnYf2tV3qKPaHknIGDzdf8S0+Gt1KjQw9vP4Y2RloMpKVh1t526t3x/fqyklQC0BugaKMoBEcU3+8tyk+NfdNCRQ2NV0QH+uhjh79dy7h3cSBWzmgarWZy3TG7tb5a34i7Hw7R2J5fAe6GUQBEAFj52cfxIrrO8P1vaYaRNoXjiy9Gi1OaPwRIn1QCJNWEip4LIr+PjE4RcCT1e/VxeoOf7n5cujPp8vRaqqgkzZ/ObDRBHj99IwVTodda+8T67wjdCYCiyvZhG98HWZydxEqSTB5XLRW1tbhnD4gaCqKihP+6vQMvm5f69esG1GHmwqzgY/Y2Mwez+FrKxD1Skkb51/zUBk45pS6vD7/QiFQqssx39k53mN8u47hh0ORWyse+oSmxiuXdNbD26sp9G/N4a704u5xSvfvvN8sHawsaVzdP7O5MttbW0uv99vVxXleCgUukJuZ7OQi3moigTXM2+dst35vPcN7ySaGgR80mM11Xu2y+lUjJ69fT3Q2NhYIcsycrkcrFarIIpi2fBkNQLSYYSNsEGHWd/Jk8Guzj0oFArgeIf5s5Mfnl9ZWfmOZVmz3W6nstksBgYGNmdmZiaam5uXDFx+DmbaCUZxwla2IilJ0sjICIrFItxuN4LBIARBYPL5PHK5HCwWC6ampn5kWfaU1+uVKdZKwVFhhJMzg2MAhmGuDQ788ogkydOiKB4MBAKVmUxGHxoaysiybEkkEvrw8PBvPT09E6qqghAEAS0tLRAEAQxjAU1bQNM0dF3H2NjYN52dnX2hUOg6z/Ovx+PxT41G42xDQ8NFj8ejyrIMwu12o76+HgzDwGg0wmq1guM4UBQFgiAwMTEhkCSpdXV1pXRdBwCUSiUoigJJkvA/ZkG9QWy1G6AAAAAASUVORK5CYII=)',
                   oncommand: "openPreferences();"
				};
				for (var p in props)
					toolbaritem.setAttribute(p, props[p]);
				return toolbaritem;
			}
		});
//      about:plugins öffnen
            CustomizableUI.createWidget({
			id: 'aboutplugins-ToolBarButton',
			type: 'custom',
			defaultArea: CustomizableUI.AREAS,
			onBuild: function(aDocument) {			
				var toolbaritem = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
				var props = {
					id: 'aboutplugins-ToolBarButton',
					class: 'toolbarbutton-1 chromeclass-toolbar-additional',
					label: 'About:Plugins',
					tooltiptext: 'About:Plugins öffnen',
					style: 'list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAC/0lEQVR4XnXPXWwUVRjG8f85M7N22e52+WitFZspha2IYjVbatVEK02xQiDaGExJxQjohdrAhd+FK0yM12gMkTTGKtoQlMQYNCGtGFBCRW5QkVYpxBbb7Rfbj9kzZ85oZC/WJv6SJ+/V8+Z9xe79Pye07x2dnxn/wp+dPyADC7IaAxGtgpXCMldzvsp6yiOX81BaUUjG4okH44lojZkzX3rX5jBTGt83dzuO3VW9uvxkCIeMMUv4H9KJOPFFsUg8EsitQogOE5rOmrtuObntuYa21vb6pY9srH1SStmjfV2OYCHEC6/2l6DnPy8vizdOj05SV1dJw8NVaAOeB2EIZ89c5dhnfWenpq63G4KLFJAD/f3TV34bPJX5a4Itj9/Bhs1VEILRQAg6gNr0bbTteKyuvGJZt/aDCgrI4liCIqso2dLkcl9DKb4HUoDIBwFaQ/WqpbTt3JR2q5cfM8a45EkhxPqm5pXPNz/q4uUACdICW4Al81OAp2G5G6Nl071ppYKtQSj5J8hksujlLU/UOOQ58kZRWCAlCAmhBcXXfyD1xys43uUwxM4WOzPE7FlkICglGsMYsCUI8d8XhAUlYoLUpWeJjnfhXtg1s3vthwNfNb3B0cZOpJdT3uUhGMnky9aNkm2BZcPiOLhVJfwylyYbJKlrScSfqjn/FoYVUTtAjo2Ov9nzUe/wtbGA6VmQ5C+REA9HKYmFfNA9yPaPW7uHf8y8RGZ8lnX3p4naJwhYI8Mw7Dv93bmNXQe/GRweUeQ0SBtiF99h8elmzh18kd7D77+74ebDu5KL1AF+/bOdod8zJBMuIWWiaf17KJ3DV8HqO9eu+KRjT0vt7ambsI7Uw5IZspmAyfNX9laWevtRQAgE1CMoQ/L1vwt8rQBQSlesSt3a/cyOhxq/P358Zltkz1Dl5nvWMDEGZy68DexFoCkgKRCJ2MMDl0Za973+6aEjvXaHmuMBTvT1ULwMUu5rGLazgM0CjiMngZ3SVwgbUDzNt6c8ovY6LH5igb8BucA1WORtKKUAAAAASUVORK5CYII=)',
					onclick: 'if (event.button == 0) { \
										openUILinkIn("about:plugins", "tab");\
								 }; '
				};
				for (var p in props)
					toolbaritem.setAttribute(p, props[p]);
				return toolbaritem;
			}
		});		
//      Lesezeichenmanager öffnen	
		     CustomizableUI.createWidget({
             id: 'bookmarks-manager-button',
             type: 'custom',
             defaultArea: CustomizableUI.AREAS,
             onBuild: function(aDocument) {         
                var toolbaritem = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
                var props = {
                   id: 'bookmarks-manager-button',
                   class: 'toolbarbutton-1 chromeclass-toolbar-additional',
                   label: 'Lesezeichen Manager',
                   tooltiptext: 'Lesezeichen Manager öffnen',
                   style: 'list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACnklEQVQ4y6XTPYgVVxTA8f/ce2fu7Mx7vuf6srsa425cxFWEiDwCgpXpErELIVYWVolYWGmdKoVdLGwUGwXFJggWwq42hpBmiUaW1f2I7Pfs+p6773Pm3jspXtwEIhLwNIdTnB/nHDjwgeGNXrhz2JfysPC8/9fgrLAmez7105lnAOpAZejxwYGBiud5QA78N3cyRymSLG6kHBmJ+G1ueX0KPgJQ8ytppbXZ/tt/N5Aax9gnEUndUm84Xm/aytuJVBxZzn3VT0lbjMkoFIskawmDQ4MALC8ts3vPx9STJcKoSK3r8/CP9vZKqhhJjh/sZyB2ZFlGuVxmYSFleLgHzBaa7N8/SDJxlXj3SZZ0lesT8h/Aw1Kr1dAGjDEYY+h2uyRJAkCapiTzk4TpS7orIbUdo3jYbUD4SqJ1gNaaMAzRWhMEvVprjQ588pVHxJ+eQDRnCESGr/41QeALCnFEHAustcRxTNZcIepOkdsO0eZLivYZQh2lsKtEafUmJ8p93LldOZ21my3lkdNoNChKhXMOYwx27QnmzXVk3y524qEKZTCzyD7H3uwpl6ot8u7wXVbnppX2JYU4Jo57QBAEtPZ9CYsvoPWAoOCBWAMrgBwVtbGdOp3X6+M27fyglPRQvsL3fZxz+L6PHxbRY5fJFg9g1r9DFTKgB+TOMvnnCMNbW9+7jHlVb6Zr1x5OC19CnoMQHtZZpFBIPlMXR2VZ7ehC6noGMN0eMtWz87MAaiZ583UcBkIJsX3ZABOkqLQa3j+mj7euEIBdpeEFKLGH8ItDv7fe+zA3btyr/vrkl32dcXHeJWxlk0y0fubzzgNOmSmemle02/c5AqDeBUgpyzNzy9+M7B3b6F94/qPd4FZ0mlmAdJwFUeJbIXu9fwFVCBajMWIWPQAAAABJRU5ErkJggg==)',
                   oncommand: "PlacesCommandHook.showPlacesOrganizer('AllBookmarks');"
                };            
                for (var p in props)
                   toolbaritem.setAttribute(p, props[p]);            
                return toolbaritem;
             }      
        });
//      Chrome Ordner öffnen
             CustomizableUI.createWidget({
             id: 'Open-Chrome-Folderbutton',
             type: 'custom',
             defaultArea: CustomizableUI.AREAS,
             onBuild: function(aDocument) {         
                var toolbaritem = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
                var props = {
                   id: 'Open-Chrome-Folderbutton',
                   class: 'toolbarbutton-1 chromeclass-toolbar-additional',
                   removable: true,
                   label: 'Chrome Ordner öffnen',
                   tooltiptext: 'Chrome Ordner öffnen',
                   style: 'list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABc0lEQVR42mNkoBAwUmxAw7LHC/nYfsWhS2zYfIDp0MLk/wQNKJtz639ptArDmSc/4IJ//vxluH31FU5NZy7dZV/W5PYLboCyujjDj5+sKIrEhRHs33+gBv9lYHj69CPD7eu3pBbW2D+3i5/Lylg6++Z/cRl+hm9f/jF8fPeOoJ+ZWVkZzp04nfjr58/HQO4toAE3/guKcDG8f/cdrKAmVo3h2MPvRAVge8tyP8aSWTf+MzH/ZPj7h5lBV1+B4c17guEGBh/fv//15OEjU6AB1////PmRQUtTieHLT3aGf8TpZ3jy4OHxyTl6VowlM6////jxBYOltRHDi9f/iNL888cPhqePHqXPKTOfxVg889p/GSkeht8MvMCYIM761y+evZqcoyMOjkaQAfr6UgzPXvxjYGVjIqj5/79/DLdv3Fs1s8QkHGyAd9rEWH0rjwUfP/0iyvY/v3//3bmgxPLB5X1nwQYAsQVxwYYBTsAMoAhQbAAAAjCiCL9JqqgAAAAASUVORK5CYII=)',
                   oncommand: 'Services.dirsvc.get("UChrm", Ci.nsIFile).launch();'
                };            
                for (var p in props)
                   toolbaritem.setAttribute(p, props[p]);            
                return toolbaritem;
             }      
          });
//        Seiteninformationen anzeigen
             CustomizableUI.createWidget({
             id: 'context-viewinfo',
             type: 'custom',
             defaultArea: CustomizableUI.AREAS,
             onBuild: function(aDocument) {         
                var toolbaritem = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
                var props = {
                   id: 'context-viewinfo',
                   class: 'toolbarbutton-1 chromeclass-toolbar-additional',
                   removable: true,
                   label: 'Seiteninformationen',
				   accesskey: 'i',
                   tooltiptext: 'Seiteninformationen anzeigen',
                   style: 'list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACp0lEQVQ4jV2TPW9cVRCGn3fOuffu9Xo3TnCEkANYQotB2WJpUqWwJSqIUuQPRKKlsAUFpeUmEpXXEv+ACClFitQowmUIMmxASowIkjuQk9jr/fDd7F3fQ7HWdcxI04zmfc47RzPif9G4cXdR0iqy5flL9VYRAoe9rCNpG9nW7v1be2/2qxR+/v0c0vp7C/NrV5euMCkijoYTXucnEALDYcaLwx7DLGsjbTy7d7NbAk7FP12/ttSq1uZ48vyYLA/UZhwg+qMCZ5A6GGVDesODDtLK0x8+69rUh9avX1tqWVzn0dMhWR4A8eDOxzy48xEyEWQcB4O0Tlq73JK5dQBr3Li7+P7C/NpsbY4nf2dTTxKYyhnNG/KGeQfeEVXrRJXqWvP2w0UvafXq0rv8+vz4TCwhJz795s/p62ZlHQkJ4uoFTnqvVj2y5UnwZOP8XNPj75rlTze/3MV5YU4IoQCJS5Bzy3b5rXrraDgBQQEMRgUH/QmNL/4oAXHiiSueJPUkM554JmK2FlGppC1fBBjnBeNJ4HAwQWZEicN7KwFRxeHjaU1mSDCbBIZ9jx0cHXfyyQkvD3NCAHPCnOEid85BUvEkMxGV6jQvzkVk45OOSdp+dTDAOZDpFCCcK3cMnziiiidJp+JaPcZZgZzfNmRbR4MBl2aENE0zIXc2go8cUeKJU0+lGvPhlYh/9kfI3Jbt3r+1N85ftykyUkcJ6Ww2SsCPX7+Nc4aPHY2FiH5vzL8vx+2dzeaeP93Ejfykv+zMtwKzAHzy1V8kaVTOXavFfDAP3f0BP+8cdGS2AWAAz+7d7CKtSL22D11U5MQBqha4GAfeqQYuKOP33/Z59PhFmxBWfvm2cXZMb0bz9sNFma3K+eUkSVs+dozyoiPnt2Vua2ezee6c/wN/E94boB6vcgAAAABJRU5ErkJggg==)',
                   command: "View:PageInfo"
                };            
                for (var p in props)
                   toolbaritem.setAttribute(p, props[p]);            
                return toolbaritem;
             }      
          });
//        Zertifikate Anzeigen
             CustomizableUI.createWidget({
             id: 'context-viewcert',
             type: 'custom',
             defaultArea: CustomizableUI.AREAS,
             onBuild: function(aDocument) {         
                var toolbaritem = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
                var props = {
                   id: 'context-viewcert',
                   class: 'toolbarbutton-1 chromeclass-toolbar-additional',
                   removable: true,
                   label: 'Zertifikate anzeigen',
                   tooltiptext: 'Zertifikate anzeigen',
                   style: 'list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2lpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wUmlnaHRzPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvcmlnaHRzLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcFJpZ2h0czpNYXJrZWQ9IkZhbHNlIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkQ1REVFMjI3ODQzMjExRTA4QzZCQkNCQTk0MDlCMTEwIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkQ1REVFMjI2ODQzMjExRTA4QzZCQkNCQTk0MDlCMTEwIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzMgV2luZG93cyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ1dWlkOkFDMUYyRTgzMzI0QURGMTFBQUI4QzUzOTBEODVCNUIzIiBzdFJlZjpkb2N1bWVudElEPSJ1dWlkOkM5RDM0OTY2NEEzQ0REMTFCMDhBQkJCQ0ZGMTcyMTU2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+22TEXgAAAY1JREFUeNqkk79LQlEUx7/vvauVg/0QGpIKBCdFUHCwqaRoMqKhsVpb+wscWmoJWtqCnB2iaAo0GnIIGipoiFqCBlHUIrPevdfuuaY5OKQeuBzufefzPd97eNeo1+voJ4x+BVhyNZhQeaJH/pVJWfcmjy4OhLS7Ii3TgeT67CYTUpo2/8L9da4rgWA0BmKZENKSQoBm4Q+F/gU/3t6CGGIZF9LkgquNAOccN7kcRj0eXVgqFhGJxXCVyeCzWsWQy4WZeLxRqxhiScASCpRSaoFQNNrqNOnz6bNKuYKFpQTOT071nmqJ4Q0Hwmp30HFgzMJZOq0dUM2fA6EEuBJoc9CMucN3rIcHsBF2atvNaK8l1rTpCm0Ommt3nuH47g0vpW8spwqt3HRAjK2vwAWjA1It5fO6y13RxHb2A3uLTuxnP7EyLXV2mwYuHwqYgvxtKBh7r9aGTPXBFwi0bD48lZFaG8OEm2HH32kq4yCGWCPidWwND8LXy39cqeHZUNmp1gi9iy55mni579f4I8AAEIoGFNnyuUoAAAAASUVORK5CYII=)',
                   oncommand: "window.open('chrome://pippki/content/certManager.xul', 'mozilla:certmanager', 'chrome,resizable=yes,all,width=830,height=400');"
                };            
                for (var p in props)
                   toolbaritem.setAttribute(p, props[p]);            
                return toolbaritem;
             }      
          });
//      Passwörter anzeigen		  
             CustomizableUI.createWidget({
             id: 'context-viewpassword',
             type: 'custom',
             defaultArea: CustomizableUI.AREAS,
             onBuild: function(aDocument) {         
                var toolbaritem = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
                var props = {
                   id: 'context-viewpassword',
                   class: 'toolbarbutton-1 chromeclass-toolbar-additional',
                   removable: true,
                   label: 'Passwörter anzeigen',
                   tooltiptext: 'Passwörter anzeigen',
                   style: 'list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAs5JREFUeNp0U11IU2EYfs5+canzF8ufICmvTJOTpWg/CrnIi6BQ+tUuFC/CupHqIokYRnnvhWIIRSQ6hX4RNOeFFUyXbS2GgXNh6tJtbPNvO+dsp+87U5mhHzzn/d7vvO/7ve/zfi8jiiKGHiqgkoORyZAPoJwgE9G1QDAeicDGhSFil6XYlIwQQXXS/ryawyU15aJam8ttrEAMehx/vg+V+FyOfmLzgUDcNUCIFwtSs45cOVbdct081mufnTYNhyMCMrMPZp88daluarRf7l10zpFkLf8HkNFPkENlQVWjzmrqdTjmhw3Q+uvlyWv1roDdYLO8dRwtO6+jNiGeXrYTUgbrHA4lJKanLXgm5hQa6MiRbuuGv6tOPxunyKU2e3KwHhJXQlwwqKtqLwoLAny+ZayteKBRCYhXi+A4Pkht9gwQ5PHl2+dhXdGJSjYUCMDrWkDAN4+UBAZxGemwTk3/pDYMsZ1JVUqQ6OTFbRJHjO8Nue6lpVBh8ek8tWZfWpygBQ/BPTZm+mW32noZBiOz6Sp0l2qjzoRRrEXA0Hfw5BoDIQwl2dI3cLvxvv6yZ9GBwRc9A0TvIM7jcxlKvrs8iTQcOwLIYsohnMJIoKSKXCkJ+jE6U4hzmZbqncR5UpKxbeSFaMBYXvqfd30kopU4o6c4gdQp0prZhnO3WColfSsAdY4BTRI3mu9VkP1TZ7KCptwJQZxEKAJ/2A8qJZ2cS7c9NgBXS4GcFCmo1K6uZ+3viGjjgyJ1YCsuVbL03C24UXHhrLQ3Do5uzwJefwUuFgIHtAhS/c6j1tq2Fn2I+yHUISdiNr4akezyawtZW5/FHJ0gmLeHiRL2xgL1TRZqOpYPmvR9v30YmJgh/fwUuEv+c9DHm7xhL7BBSlAyx6Fgom1kGIZyoSFILMrEmbxUNNiX8dLqwsRmSQGCVTSrOkjtLHE0EzQhS41/AgwAEXpPSomMNg0AAAAASUVORK5CYII=)',
				   onclick: 'if (event.button == 0) { \
									window.open("chrome://passwordmgr/content/passwordManager.xul","PasswordManager","chrome,dialog,centerscreen,dependent"); \
								 }; '
                };            
                for (var p in props)
                   toolbaritem.setAttribute(p, props[p]);            
                return toolbaritem;
             }      
          });
//       Chronik löschen öffnen
             CustomizableUI.createWidget({
             id: 'context-deletehistory',
             type: 'custom',
             defaultArea: CustomizableUI.AREAS,
             onBuild: function(aDocument) {         
                var toolbaritem = aDocument.createElementNS('http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul', 'toolbarbutton');
                var props = {
                   id: 'context-deletehistory',
                   class: 'toolbarbutton-1 chromeclass-toolbar-additional',
                   removable: true,
                   label: 'Chronik löschen',
                   tooltiptext: 'Chronik löschen öffnen',
                   style: 'list-style-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAC6klEQVQ4ja2TT0yTBxyGv5Vw13jxsIsmJh48OA9LlrhkEjk2WXBu08iyKCEENXFW29KNIASU6YisCQWZUAZosUOcUWmrBYEUBFdtWhQp9I+lyL+W+rWlLX7I9+y0OjOyk+/9efLml/cnCB86fdcv5A2by/ucdzTLLqtOct4tkxxdpxasV0/92dNU9tn/wkPmGoPHpn0T9o6yNO8nHo8hilFmX3rwOLqwXi1eMV0uLd8QHjBV/+pzNhKLhPCGYnT3BzHcfI7e/IwOi4+nUwsEvSP0/lZCS83Rs+/Blvbavc47Kim6GGTINUfPwyC+cJxoPEkkvoJ3Jk7HfR+3BgNMuix0VH2Taqwq+SQrsLepe6ddFl68XMbcFwAgJopMvZonA2SApAxNd3043CEedKpo+unbjqyg//cT83OhcTpt00yE46TWZJKpFA2tRhZFkcTqKjdt/QxNiVwyuRl/fINmXUHw3eXbjmdi0VkuXnOzmJaIra7zBig7V0lnz200FZXcHxljXJQ43TDGTHCMVt1X6azA2lyciS75qTS6mElKLKbXCYsJqn+pQ1NRyZDLQ2QNnFGJk/WPCPkHadEeeCforisM+Mct1JvdDE6LzGUgnJDoHRgmsBxn4S14/migv3An9rxc7Ae2YDqyU8wKjNWFxoEbWkbcU9SavURkiEmQWIeEDNO3DHjUn5O5V4c8YSXVdZq/SnfJtjzFSUEQBKG5pnR3e9XX6UlnO9csT/jZPIkr+JpkWiKZkrAf2k76Xh3olaDZDOe3Ebn4Bbb9ikC2xZVz32uv1x5kYtTAw8dOzhtHUeuHUdU7sOflIj/p4d95XbEV+74c+b1BNeiOlF/Rfpm83XiYp301BCY6CTxv40HBJlZajkHFVlbVAjG1QKgkB9t+xex/Jq3/8btP688UmPQ/KEMGlTJtUCnT3UV7xNFjO+Q5zTaWynLxF32EXZnz1pqv0G38VRvEcfBjrTVfEbTvy5Gt+YrwP/DfJyYwPd442XkAAAAASUVORK5CYII=)',
				   oncommand: "window.open('chrome://browser/content/sanitize.xul', 'Toolkit:SanitizeDialog', 'chrome,resizable=yes');"
                };            
                for (var p in props)
                   toolbaritem.setAttribute(p, props[p]);            
                return toolbaritem;
             }      
          });	
	} catch(e) { };

})();
