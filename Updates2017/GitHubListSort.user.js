// ==UserScript==
// @id             GitHubListSort
// @name           GitHub Die Listen der Dateien nach Änderungsdatum absteigend sortieren
// @include        https://github.com/*
// @version        2016/04/17 TagNameを"time-ago"に修正
// @version        2014/10/14 更新日時を日本時間に置換するようにした
// @version        2014/10/13
// ==/UserScript==

(function() {
	try {
		var time = document.getElementsByTagName("time-ago");
		if (!time[0]) return;
		var arr = [];
		for(i = 0; time[i] ; i++) {
			var utc = time[i].getAttribute("datetime").match(/^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)Z$/);
			if(!utc) continue;
			utc = Date.UTC(utc[1], --utc[2], utc[3], utc[4], utc[5], utc[6]);
			utc = new Date(utc + 32400000);
			var date = utc.toUTCString().match(/(\d\d) ([A-Za-z]{3}) (\d{4}) (\d\d:\d\d:\d\d)/);
			date[2] = utc.getUTCMonth() + 1;
			utc = date[3] + "/" + (date[2] < 10 ? "0" + date[2] : date[2]) + "/" + date[1] + " " + date[4];
			time[i].textContent = utc;
			var tppp = time[i].parentNode.parentNode.parentNode;
			if(tppp.tagName != "TR") continue;
			arr[i] = {"date" : utc, "node" : tppp};
		}
		arr.sort(function(a, b) {
			return a["date"] < b["date"] ? 1 : -1;
		});
		var tb = document.querySelector(".files > tbody");
		if(!tb) return;
		while(tb.firstChild) {
			tb.removeChild(tb.firstChild);
		}
		for(i = 0; arr[i] ; i++) {
			tb.appendChild(arr[i].node);
		}
	} catch(e) {
		console.log("UserScriptエラー\r\n" + e);
	}
})();
