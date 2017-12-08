// ==UserScript==
// @name           SendToPlayer.uc.js
// @description    Youtube Video in externen Player öffnen
// @include        main
// @charset        UTF-8
// @version        0.8 プレーヤーに送るYoutubeリンクに余計なパラメータを付加しないように、軽微な修正
// @version        0.8 Fx57以降に対応 使い方説明追加
// @version        0.7 コンテキストメニューの余計なイベントハンドラの呼び出しを行っていたのを修正
// @version        0.6 regExpにyoutube以外のサイトを書いた場合に開けなかったのを修正
// @version        0.5 微調整
// @version        0.4 Youtubeにてplaylist内の個別動画を再生できなかったのを修正。menuitemの表示位置を先頭に固定。コマンドライン引数をCUSTOM_ARGSで指定できるように。
// @version        0.3 youtu.be形式の短縮URLリンクに対応
// ==/UserScript==
/*
Wenn es sich um einen anderen Link als Youtube handelt, wenn der Link ein direkter 
Link zum Video ist, denke ich, dass er mit VLC oder MPC - BE (HC) usw. geöffnet werden kann.
In diesem Fall fügen Sie bitte die Domäne dieser Seite zu regExp hinzu.

Wenn Sie ein Skript verwenden, das einen direkten Link zu einer Filmdatei wie zbs. das Add-On SaveTube anzeigt, 
können Sie es über diesen Link an einen externe Player senden.
Damit es funktioniert, muss die entsprechende Seite zu regExp hinzufügt werden.
*/

(function() {

	var config = {
		playerPath: 'C:\\Program Files (x86)\\VideoLAN\\VLC\\vlc.exe',
		playerName: 'VLC Player',
		customArgs: '', // Befehlszeilenargument des Players angeben
		regExp: /dailymotion\.com/ //Zusätzliche Website
	};

	function initOverlay() {
		var cm = document.getElementById('contentAreaContextMenu')
		var mi = cm.insertBefore(document.createElement('menuitem'), cm.firstChild);
		mi.setAttribute('id', 'stplayer');
		mi.setAttribute('label', config.playerName + ' öffnen');
		mi.setAttribute('class', 'menuitem-iconic');
		mi.setAttribute('image', 'moz-icon:file://' + config.playerPath + '?size=16;');
		mi.addEventListener('click', launchPlayer);
		cm.addEventListener("popupshowing", event => {
			if (event.target !== event.currentTarget) return;
			if (mi) {
				mi.hidden = !isVideoUrl(getLinkOrPageUrl());
			}
		});
	}
	
	function getLinkOrPageUrl() {
		return gContextMenu.onLink ? gContextMenu.linkURL : gBrowser.currentURI.spec;
	}
	
	function isVideoUrl(url) {
		return /^(?:(?:(?:view-source:)?https?:)?\/\/)?(?:(?:www\.|m\.)?(?:youtube|youtube-nocookie)\.com\/(?:watch\?|embed\/|v\/|attribution_link\?a)|youtu\.be\/|\/watch\?|.+%2[Ff]watch%3[Ff][Vv]%3[Dd])/.test(url)
				|| config.regExp.test(url);
	}
	
	function getVideoIdFromUrl(url) {
		var regExp = /(youtu\.be\/|[?&]v=)([^&]+)/;
		var result = url.match(regExp);
		return result[2];
	}

	function getPlaylistIdFromUrl(url) {
		if (!url.includes('list=')) return '';
		var regExp = /(?:(?:\?|&)list=)((?!videoseries)[a-zA-Z0-9_]*)/g;
		var result = url.match(regExp);
		return result;
	}
	
	function getVideoUrl(url) {
		if (url.includes('youtu')) {
			const result = `https://www.youtube.com/watch?v=${getVideoIdFromUrl(url)}`;
			const playlistId = getPlaylistIdFromUrl(url);
			if (playlistId) {
				return result + `${playlistId}`;
			}
			return result;
		} else {
			return url;
		}
	}

	function launchPlayer(event) {
		if (event.button !== 0) {
			return;
		}

		var url = getVideoUrl(getLinkOrPageUrl());

		var file = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsIFile);
		file.initWithPath(config.playerPath);
		var proc = Cc['@mozilla.org/process/util;1'].createInstance(Ci.nsIProcess);
		proc.init(file);
		var args = [url].concat(config.customArgs.split(' '));
		proc.run(false, args, args.length);
	}

	initOverlay();

})();
