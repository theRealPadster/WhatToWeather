function setBackground(temperature) {
    var colour = "white";
    if (temperature < -3) {
        colour = "#cbe8ff";
    }
    else if (temperature < 3) {
        colour = "#a5d8ff";
    }
    else if (temperature < 14) {
        colour = "#a1e5fb";
    }
    else if (temperature < 19) {
        colour = "#97ddff";
    }
    else if (temperature < 23) {
        colour = "#55d8ff";
    }
    else if (temperature < 30) {
        colour = "#fbefbf";
    }
    else {
        colour = "#fba892";
    }

    // TODO - fade this...
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
