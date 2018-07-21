// Purpose of this file: functionality that will convert the date into the format wanted.

var makeDate = function(){

    // create variable ' d ' that will make a date
    var d = new Date();

    // start with empty string
    var formattedDate = "";

    // add month to string (added +1 because js starts index with 0 and that won't work sir)
    formattedDate += (d.getMonth() + 1) + "_";

    // add date to string
    formattedDate += d.getDate() + "_";

    // add year to string
    formattedDate += d.getFullYear();

    // return the fully formatted date
    return formattedDate;

    // push the date into the array
    var articles = [];
    var dataToAdd = {
        date: formattedDate,
    };
    // push the new dataToAdd into the articles array
    articles.push(dataToAdd);
};

// export the date  variable so it can be used throughout the program
module.exports = makeDate;