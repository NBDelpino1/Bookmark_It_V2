// Purpose of this file: functionality that Cheerio needs to scrape articles from whatever website.



// require the two packages (request and cheerio) which will make scrape possible
// go to whatever website and figure out how to grab the headline and summary
// create scrape variable that will be exported after; scrape variable will have a callback as the parameter


var request = require('request');
var cheerio = require('cheerio');

var scrape = function(cb){

    // use request package to request specified website,  will get err, res and body back
    request('http://www.nytimes.com', function(err,res,body){

        // so can be used kinda like jQuery
        var $ = cheerio.load(body);

        // new empty array that will hold the articles
        var articles = [];

        // select all the *[theme-summaries]* and on each one of these *[theme-summaries]* grab the text, cut off any white space at the end for .story-heading and .summary which are both children of theme summary
        // go through every .theme-summary found on the page until done and store inside the articles array (previously created and empty to start)
        // once done the call back function will send back articles

        $('.theme-summary').each(function(i,element) {

            // for this .story-heading that it's on right now; grab the child story-heading; grab the text out of that; remove any white sace and store into a variable called head
            // repeat for .summary
            var head = $(this).children('.story-heading').text().trim();

            var sum = $(this).children('.summary').text().trim();

            // if head and sum exist it means the scrape was successful so next run a replace rejex method which pretty just cleans up the text with white space
            if(head && sum) {
                var headNeat =  head.replace(/(\r\n|\n|\r\t|\s+)/gm, " ").trim();
                var sumNeat = sum.replace(/(\r\n|\n|\r|\t|\s +)/gm, " ").trim();

                // next make an object out of headNeat and sumNeat and then assign it to the attributes of headline and summary which are required to create an article in the model
                var dataToAdd = {
                    headline: headNeat,
                    summary: sumNeat
                };
                // push the new dataToAdd into the articles array
                articles.push(dataToAdd);
            }
        });
        console.log(articles);
        // call back sends back articles
        cb(articles);
    });
};

// export scrape variable to it can be used throughout the program
module.exports = scrape;





