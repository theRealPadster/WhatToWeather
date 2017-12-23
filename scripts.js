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

    //call for current weather
    $.ajax({
        url: "http://api.openweathermap.org/data/2.5/weather?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&units=metric&appid=8e62e050c29fc061b770beda0908a51c",
        success: function(data) {

            var city = data.name;
            var temp = Math.round(data.main.temp);
            var weather = data.weather[0].main;

            $("#city").text(city);
            $("#temperature").text(temp + " degrees C");
            $("#weather").text(weather);

            setBackground(temp);
        }
    });

    //call for forecast
    $.ajax({
        url: "http://api.openweathermap.org/data/2.5/forecast?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&units=metric&appid=8e62e050c29fc061b770beda0908a51c",
        success: function(data) {
            var now = new Date();
            //TODO - can I make "tomorrow" one line?
            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);

            //TODO - this filters out so it shows a 24 hour period, tweak it. only show till end of day, or what?
            data.list.some(function (item) {
                var itemDate = getDate(item);
                if (itemDate.getTime() < tomorrow.getTime()) {
                    console.log(itemDate);
                    var elem = makeWeatherChunkElement(item, itemDate);
                    $("#forecastSection").append(elem);
                }
                else {
                    return true;
                }
            });
        }
    });
}

function makeWeatherChunkElement(weatherItem, date) {

    var options = { month:'short', day: 'numeric', hour: 'numeric', minute:'numeric' };

    var forecastChunk = "<div class='forecastChunk'></div>";
    // var time = "<p class='time'>" + date.getHours() + ":" + date.getMinutes() + "</p>";
    var time = "<p class='time'>" + date.toLocaleString("en-US", options) + "</p>";
    var temp = "<p class='temp'>" + Math.round(weatherItem.main.temp) + "</p>";
    var weather = "<p class='weather'>" + weatherItem.weather[0].main + "</p>";

    var toAdd = $(forecastChunk)
    toAdd.append(time);
    toAdd.append(temp);
    toAdd.append(weather);

    return toAdd;
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

function checkPreferencesSet() {
    if (getCookie("preferencesSet") != "") {
        $("#nameSpan").text(getCookie("name"));
        getLocation();
    } else {
        $("#preferenceSection").removeClass("hidden");
    }
}
