function doDatUhrCallback() {try{doDatUhr();}catch(ex){} }
function doDatUhr() {
    var days = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
    var months = ["Jan", "Feb", "März", "Apr", "Mai", "Juni", "Juli", "Aug", "Sep", "Okt", "Nov", "Dez"];

    window.setTimeout(doDatUhrCallback, 1000);

    var D = new Date();
    var day = days[D.getDay()];
    var month = months[D.getMonth()];
    var year = D.getFullYear();
    var hour = D.getHours();
    var minute = D.getMinutes();
    var second = D.getSeconds();

    var date = " " + day + ", " + (D.getDate() < 10 ? "0" +D.getDate() : D.getDate()) + ". " + month + " " + year + "  -  ";
    var time = (hour < 10 ? "0" +hour : hour) + ":" + (minute < 10 ? "0" +minute : minute) + ":" + (second < 10 ? "0" +second : second);
    var timestr = date + time + "" + "    ";
    var FFstr = AppConstants.MOZ_MACBUNDLE_NAME.split('.');
    var mbName = FFstr[0];
    var text = mbName + ' ' + AppConstants.MOZ_APP_VERSION_DISPLAY + '          ' + "> gestaltet von EDV Oldie <          "; 

    var status = document.getElementById("statusbar-clock-display");
    status.setAttribute("value",text + timestr);}

    //var ClockStatus = document.getElementById("statusbar-display");
    var ClockStatus = document.getElementById("helpMenu");
    var ClockLabel = document.createXULElement("label");
    ClockLabel.setAttribute("id", "statusbar-clock-display");
    ClockLabel.setAttribute("class", "statusbarpanel-text");
    ClockLabel.setAttribute("style", "padding-top:0px; padding-left:10px;color:blue");
    ClockStatus.parentNode.insertBefore(ClockLabel, ClockStatus.nextSibling);
    doDatUhr();