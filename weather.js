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
