module.exports.getDate = getDate;

function getDate() {
    var today = new Date();

    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    var temp = today.toLocaleDateString("en-US", options);

    return temp;
}

module.exports.getDay = getDay;

function getDay() {
    var today = new Date();

    var options = {
        weekday: "long"
    };

    var temp = today.toLocaleDateString("en-US", options);

    return temp;
}