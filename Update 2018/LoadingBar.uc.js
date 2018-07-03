/* LoadingBar.uc.js */

(function(){
//Location Bar Enhancer5.1;Loading Bar0.3.0
	var cssStr = (function(){/*
			#urlbar {
				background-image: -moz-repeating-linear-gradient(top -45deg, rgba(255,255,255,0), rgba(255,255,255,0) 6px, rgba(255,255,255,1) 6px, rgba(255,255,255,1) 12px), -moz-linear-gradient(left, rgba(255,255,255,0) 0%, rgba(17,238,238,.7) 100%);
				background-size:0 0;
				background-repeat:repeat-x, no-repeat;
				transition: background-size 350ms ease 0s !important;
			}
			#urlbar:not([style="background-size: 0% 100%;"]) {
				animation: progress-bar-stripes 2s linear infinite;
			}
			@-moz-keyframes progress-bar-stripes {
				from {
					background-position: 0, 0;
				}
				to {
					background-position: 51px 0, 0;
				}
			}
	*/}).toString().replace(/^.+\s|.+$/,"");
	
	var style = document.createProcessingInstruction("xml-stylesheet", "type=\"text/css\"" + " href=\"data:text/css;base64," + btoa(cssStr) + "\"");
	var mainW = document.getElementById("main-window");
	document.insertBefore(style, mainW);

	function main(window) {
	  var {document, gBrowser} = window;
	  function $(id) { return document.getElementById(id) };
	  var urlbar = $("urlbar");
	  let pageProgress = 0;
	  let async = makeWindowHelpers(window).async;
	  var LoadingBar = {
		listener: {
		  onChangeTab: function(e) {
			urlbar.style.backgroundSize = '0% 100%';
			pageProgress = 0;
		  },
		  onProgressChange: function(aBrowser,webProgress,request,curSelfProgress,maxSelfProgress,curTotalProgress,maxTotalProgress) {
			if (gBrowser.contentDocument === aBrowser.contentDocument) {
				var val = (curTotalProgress-1)/(maxTotalProgress-1);
				pageProgress = val;
				urlbar.style.backgroundSize = (100*val) + '% 100%';
				if (val > 0.9)
				  async(function() {
					if (pageProgress > 0.95)
						urlbar.style.backgroundSize = '100% 100%';
				}, 1000);
			}
		  },
		  onStateChange: function() {
			if (pageProgress > 0.95){
				async(function() {
					urlbar.style.backgroundSize = '0% 100%';
					pageProgress = 0;
				}, 1000);
			}else{
				urlbar.style.backgroundSize = '0% 100%';
			}
		  }
		}
	  };

	  gBrowser.tabContainer.addEventListener('TabSelect',LoadingBar.listener.onChangeTab,false);
	  gBrowser.addTabsProgressListener(LoadingBar.listener);

	  unload(function() {
		gBrowser.tabContainer.removeEventListener('TabSelect',LoadingBar.listener.onChangeTab,false);

		gBrowser.removeTabsProgressListener(LoadingBar.listener);
	  }, window);
	}



	watchWindows(main, "navigator:browser");

	function runOnLoad(window, callback, winType) {
	  window.addEventListener("load", function() {
		window.removeEventListener("load", arguments.callee, false);

		if (window.document.documentElement.getAttribute("windowtype") == winType)
		  callback(window);
	  }, false);
	}

	function runOnWindows(callback, winType) {
	  function watcher(window) {
		try {
		  callback(window);
		}
		catch(ex) {}
	  }

	  let browserWindows = Services.wm.getEnumerator(winType);
	  while (browserWindows.hasMoreElements()) {
		let browserWindow = browserWindows.getNext();
		if (browserWindow.document.readyState == "complete")
		  watcher(browserWindow);
		else
		  runOnLoad(browserWindow, watcher, winType);
	  }
	}

	function watchWindows(callback, winType) {
	  function watcher(window) {
		try {
		  callback(window);
		}
		catch(ex) {}
	  }

	  runOnWindows(callback, winType);

	  function windowWatcher(subject, topic) {
		if (topic == "domwindowopened")
		  runOnLoad(subject, watcher, winType);
	  }
	  Services.ww.registerNotification(windowWatcher);

	  unload(function() { Services.ww.unregisterNotification(windowWatcher) });
	}

	function unload(callback, container) {
	  let unloaders = unload.unloaders;
	  if (unloaders == null)
		unloaders = unload.unloaders = [];

	  if (callback == null) {
		unloaders.slice().forEach(function(unloader) { unloader() });
		unloaders.length = 0;
		return null;
	  }

	  if (container != null) {
		container.addEventListener("unload", removeUnloader, false);

		let origCallback = callback;
		callback = function() {
		  container.removeEventListener("unload", removeUnloader, false);
		  origCallback();
		}
	  }

	  function unloader() {
		try {
		  callback();
		}
		catch(ex) {}
	  }
	  unloaders.push(unloader);


	function removeUnloader() {
		let index = unloaders.indexOf(unloader);
		if (index != -1)
		  unloaders.splice(index, 1);
	  }
	  return removeUnloader;
	}
	
	function makeWindowHelpers(window) {
	  let {clearTimeout, setTimeout} = window;

	  function async(callback, delay) {
		delay = delay || 0;
		let timer = setTimeout(function() {
		  stopTimer();
		  callback();
		}, delay);

		function stopTimer() {
		  if (timer == null)
			return;
		  clearTimeout(timer);
		  timer = null;
		}
	  }

	  return {
		async: async,
	  };
	}

})();
