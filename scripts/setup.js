//TODO - validate, or parsley?
function submitPreferences() {

    //TODO - don't set expiry...

    var name = $("#nameInput").val();
    var preferenceValue = $("#preferenceSliderInput").val();

    setCookie("name", name, 7);
    setCookie("preferenceValue", preferenceValue, 7);

    setCookie("preferencesSet", true, 7);

    return true;
}