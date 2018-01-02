
function getWeatherSchematicFromTemperature(temperature) {

    var weatherObject = null;
    $.each(weatherSchematics, function (key, value) {
        if (temperature > value.LowerTempRange && temperature <= value.UpperTempRange) {
            weatherObject = value;
        }
    });

    return weatherObject;
}

function setBackground(temperature) {

    var colour = getWeatherSchematicFromTemperature(temperature).Colour;

    $("body").css({
        "background-color": colour
    });
}

//TODO - merge these somehow, like an object with ranges, with colours and things attached to each one...

function getWeatherColour(temperature) {
    var colour = "frigid";
    if (temperature < -3) {
        colour = "freezing";
    }
    else if (temperature < 3) {
        colour = "colder";
    }
    else if (temperature < 14) {
        colour = "cold";
    }
    else if (temperature < 19) {
        colour = "cool";
    }
    else if (temperature < 23) {
        colour = "warm";
    }
    else if (temperature < 30) {
        colour = "hot";
    }
    else {
        colour = "hotter";
    }

    return colour;
}

var weatherSchematics = {
    "DeepFreeze": {
        LowerTempRange: -99,
        UpperTempRange: -15,
        Colour: "#84b6e0",
        LegsGarment: "Pants",
        TorsoGarment: "Sweater",
        Shoes: "WinterBoots",
        OuterWear: ["ParkaCoat", "WinterHat", "Gloves", "SnowPants"]
    },
    "Freezing": {
        LowerTempRange: -15,
        UpperTempRange: -5,
        Colour: "#cbe8ff",
        LegsGarment: "Pants",
        TorsoGarment: "Sweater",
        Shoes: "WinterBoots",
        OuterWear: ["ParkaCoat", "WinterHat", "FingerMitts"]
    },
    "Cold": {
        LowerTempRange: -5,
        UpperTempRange: 5,
        Colour: "#e3f1fc",
        LegsGarment: "Pants",
        TorsoGarment: "LongSleeves",
        Shoes: "Shoes",
        OuterWear: ["WinterCoat", "WinterHat", "FingerMitts"]
    },
    "KindaCold": {
        LowerTempRange: 5,
        UpperTempRange: 12,
        Colour: "#fff7d3",
        LegsGarment: "Pants",
        TorsoGarment: "LongSleeves",
        Shoes: "Shoes",
        OuterWear: ["Jacket"]
    },
    "Mild": {
        LowerTempRange: 12,
        UpperTempRange: 18,
        Colour: "#fcdda6",
        LegsGarment: "Pants",
        TorsoGarment: "LongSleeves",
        Shoes: "Shoes",
        OuterWear: []
    },
    "Warm": {
        LowerTempRange: 18,
        UpperTempRange: 23,
        Colour: "#ffcd87",
        LegsGarment: "Pants",
        TorsoGarment: "T-Shirt",
        Shoes: "Shoes",
        OuterWear: []
    },
    "Hot": {
        LowerTempRange: 23,
        UpperTempRange: 30,
        Colour: "#ffb977",
        LegsGarment: "Shorts",
        TorsoGarment: "T-Shirt",
        Shoes: "Sandals",
        OuterWear: []
    },
    "VeryHot": {
        LowerTempRange: 30,
        UpperTempRange: 99,
        Colour: "#ffa277",
        LegsGarment: "Shorts",
        TorsoGarment: "TankTop",
        Shoes: "Sandals",
        OuterWear: []
    }

}