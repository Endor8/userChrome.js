function doDatClockCallback() { try{ doDatClock(); } catch(ex){} }

function doDatClock() {
	var options = { 
		weekday: 'long', 
		year: 'numeric', 
		month: 'long', 
		day: 'numeric', 
		hour: '2-digit', 
		minute: '2-digit', 
		second: '2-digit' 
	};
	
	var locale = language || window.navigator.languages[0];
	var timestr = new Date().toLocaleDateString( locale , options ) + " Uhr";
	if( count == 1 ) {
		var counter = new Date( 1000 * sec ).toISOString().substr( 11 , 8 ); // .replace(/^[0:]+/, '') // if you want to replace zeroes and :
		timestr = timestr + ' (' + counter + ')';
		sec++;
	}
	
	var ua = window.navigator.userAgent;
	var FFstr = ua.split(' ');
	var FF = FFstr[FFstr.length-1].replace( '/' , ' ' );
	
	var text = "Thunderbird " + AppConstants.MOZ_APP_VERSION_DISPLAY;

	var agent = document.getElementById('statusbar-agent-display');
	agent.setAttribute( 'value', text );
	
	var status = document.getElementById('statusbar-clock-display');
	status.setAttribute( 'value', timestr );
	
	window.setTimeout( doDatClockCallback , 1000 );	
}

var sec = 0;
var count = 0; // if you don't want a counter set this to zero
var language = 'de-DE'; // locale, e.g. 'de-DE' , 'en-US' , 'fr-FR'

var css = 'padding-top: 2px !important; padding-bottom: 2px !important; color: black; font-weight: bold; font-size: 13px; text-shadow: none;';

// var ClockStatus = document.getElementById('helpMenu');
var ClockStatus = document.getElementById('offline-status');

var AgentLabel = document.createXULElement('label');
AgentLabel.setAttribute('id', 'statusbar-agent-display');
AgentLabel.setAttribute('class', 'statusbarpanel-text');
AgentLabel.setAttribute('style', css);

var ClockLabel = document.createXULElement('label');
ClockLabel.setAttribute('id', 'statusbar-clock-display');
ClockLabel.setAttribute('class', 'statusbarpanel-text');
ClockLabel.setAttribute('style', css);	

ClockStatus.parentNode.insertBefore(ClockLabel, ClockStatus.nextSibling);
ClockStatus.parentNode.insertBefore(AgentLabel, ClockStatus.nextSibling);

doDatClock();
