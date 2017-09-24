// ==UserScript==
// @name			AutoCopyLite.uc.js
// @description		マウスで選択した文字列をクリップボードにコピーします。
// @version			1.0.3 文字列選択時にエラーが出るのを修正(e10sには非対応)
// @include			main
// ==/UserScript==
(function (win) {

var disableTag = { INPUT: true, TEXTAREA: true };
var startCopy = false;

win.addEventListener("mousedown", (event) => {
	var target = event.target;
	if ((event.button === 0)
		 && (target instanceof HTMLElement)
		 && !disableTag[target.tagName]) {
		startCopy = true;
	}
}, true);

win.addEventListener("mouseup", (event) => {
	if ((event.button === 0) && startCopy) {
		var sel = win.getSelection().toString().trim();
		if (sel) {
			goDoCommand("cmd_copy");
		}
		startCopy = false;
	}
}, true);

}(window));
