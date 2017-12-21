$(document).ready(function(){
    checkPreferencesSet();
});

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {

    $.ajax({
        url: "http://api.openweathermap.org/data/2.5/weather?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&appid=8e62e050c29fc061b770beda0908a51c",
        success: function(data) {

            var city = data.name;
            var temp = Math.round(data.main.temp - 273);
            var weather = data.weather[0].main;

            $("#city").text(city);
            $("#temperature").text(temp + " degrees C");
            $("#weather").text(weather);

            setBackground(temp);
        }
    })
}

//TODO - validate, or parsley?
function submitPreferences() {

    //TODO - don't set expiry...

    var name = $("#nameInput").val();
    var preferenceValue = $("#preferenceSliderInput").val();

    setCookie("name", name, 7);
    setCookie("preferenceValue", preferenceValue, 7);

    setCookie("preferencesSet", true, 7);
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkPreferencesSet() {
    if (getCookie("preferencesSet") != "") {
        $("#nameSpan").text(getCookie("name"));
        getLocation();
    } else {
        $("#preferenceSection").removeClass("hidden");
    }
}
