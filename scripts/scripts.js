$(document).ready(function(){
    $("#nameSpan").text(getCookie("name"));
    getLocation();
});

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showErrorMsg);
    } else {
        showErrorMsg();
    }
}

function showErrorMsg() {
    $("#errorMsg").removeClass("hidden");
}

function showPosition(position) {

    $(".container").removeClass("hidden");

    //call for current weather
    $.ajax({
        url: "http://api.openweathermap.org/data/2.5/weather?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&units=metric&appid=8e62e050c29fc061b770beda0908a51c",
        success: function(data) {

            var city = data.name;
            var temp = Math.round(data.main.temp);
            var weather = data.weather[0].description;
            weather = weather.charAt(0).toUpperCase() + weather.slice(1);
            var options = { hour: 'numeric', minute:'numeric' };
            var time = getDate(data).toLocaleString("en-US", options);

            $("#city").text(city);
            $("#time").text(time);
            $("#temperature").text(temp + " degrees C");
            $("#weather").text(weather);
            $("#weatherIcon").append("<img id='weatherIcon' src='WeatherIcons/" + data.weather[0].icon + ".png'" +
                " alt='" + weather + " icon' title='" + weather + "'>");

            setBackground(temp);
            
            var userPrefsOffset = parseInt(getCookie("preferenceValue"));
            addClothingImages(getWeatherSchematicFromTemperature(temp + userPrefsOffset));
            addAdditionalClothingItems(data.weather[0].main, temp);
        }
    });

    //call for forecast
    $.ajax({
        url: "http://api.openweathermap.org/data/2.5/forecast?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&units=metric&appid=8e62e050c29fc061b770beda0908a51c",
        success: function(data) {
            //TODO - can I make "tomorrow" one line?
            var tomorrow = new Date();
            var span = 15;
            //set it to show 15 hours (5 blocks)
            // tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(tomorrow.getHours() + span);

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

    var options = { hour: 'numeric', minute:'numeric' };
    var temperature = Math.round(weatherItem.main.temp);

    var forecastChunk = "<div class='forecastChunk " + getWeatherColour(temperature) + "'></div>";
    // var time = "<p class='time'>" + date.getHours() + ":" + date.getMinutes() + "</p>";
    var time = "<p class='time'>" + date.toLocaleString("en-US", options) + "</p>";
    var temp = "<p class='temp'>" + temperature + "</p>";
    var weather = "<p class='weather'>" + weatherItem.weather[0].main + "</p>";

    var toAdd = $(forecastChunk)
    toAdd.append(time);
    toAdd.append(temp);
    toAdd.append(weather);

    return toAdd;
}

function addClothingImages(weatherSchematicObject) 
{
    var container = "<div id='clothingContainer'></div>"
    var torsoGarment = "<img title='" + weatherSchematicObject.TorsoGarment + "' alt='" + 
        weatherSchematicObject.TorsoGarment + "' src='ClothingImages/" + weatherSchematicObject.TorsoGarment + ".png'/>"
    var legsGarment = "<img title='" + weatherSchematicObject.LegsGarment + "' alt='" + 
        weatherSchematicObject.LegsGarment + "' src='ClothingImages/" + weatherSchematicObject.LegsGarment + ".png'/>"
    var shoes = "<img title='" + weatherSchematicObject.Shoes + "' alt='" + 
        weatherSchematicObject.Shoes + "' src='ClothingImages/" + weatherSchematicObject.Shoes + ".png'/>"

    var containerElement = $(container);
    containerElement.append(torsoGarment);
    containerElement.append(legsGarment);
    containerElement.append(shoes);

    //Get the OuterWear
    $.each(weatherSchematicObject.OuterWear, function (key, clothingItem) {
        var outerWear = "<img title='" + clothingItem + "' alt='" + 
        clothingItem  + "' src='ClothingImages/" + clothingItem  + ".png'/>"
        containerElement.append(outerWear);
    });


    $("#clothesSection").append(containerElement);
}

function addAdditionalClothingItems(weatherCondition, temp)
{

    //If it's raining, wear a rain jacket
    if (weatherCondition == "Rain" || weatherCondition == "Thunderstorm" || weatherCondition == "Drizzle")
    {
        var rainCoat = "<img title='RainJacket' alt='Rainjacket' src='ClothingImages/RainJacket.png'/>"
        $("#clothingContainer").append(rainCoat);

        // if it's raining hard, bring an umbrella
        if (weatherCondition == "Rain" || weatherCondition == "Thunderstorm")
        {
            var umbrella = "<img title='Umbrella' alt='Umbrella' src='ClothingImages/Umbrella.png'/>"
            $("#clothingContainer").append(umbrella);
        }
        
    }   
    //If it's sunny and warm outside, wear a cap to protect yourself from the sun
    if (weatherCondition == "Clear" && temp > 20)
    {
        var cap = "<img title='Cap' alt='Cap' src='ClothingImages/Cap.png'/>"
        $("#clothingContainer").append(cap);
    }
}