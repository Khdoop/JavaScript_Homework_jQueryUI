function validateRequired(variable) {
    return variable.val().length != 0
}

function validateLength(variable, length) {
    length = typeof length == 'undefined' ? 0 : length;
    return variable.val().length >= length;
}

function validateAlpha(variable) {
    return !variable.val().match(/[^a-z]/gi);
}

function validateDate(variable) {
    var testdate;
    try {
        testdate = $.datepicker.parseDate('mm/dd/yy', variable.val());
    } catch(e) {
        return false;
    }
    return true;
}