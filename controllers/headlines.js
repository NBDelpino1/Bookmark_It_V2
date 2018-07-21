// Purpose for this file: CRUD functionality for news articles will live here

// bring in scrape.js script and date.js scripts
var scrape = require('../scripts/scrape');
var makeDate = require('../scripts/date');

// bring in Headline model
var Headline = require('../models/Headline');

// CRUD functionality placed inside of a module.export so it can be exported for use throughout the program:
// 1. Fetch: runs the scrape function, grab all of the articles and insert them into the headline collection in the mongo database
// 2. Delete: removes an article from the database
// 3. Get: gets all the articles out of the database
// 4. Update: updates articles in the database

module.exports = {

    //==================================================================================================================
    // anytime fetch runs: pass call back into the function then run scrape;
    // when scrape runs: set the data to be called articles
    // go through each article then run the makeDate function to insert the date and set saved to false on all of them
    // then run a mongo function: take headline and insert into that collection different articles, don't care if they are ordered so set that to false
    // (err,docs) so that IF one of these articles fail it won't throw an error and stop the whole process; it will skip over it and keep going
    // call back will return any errors in the docs
    //==================================================================================================================

    fetch: function(cb) {
        scrape(function(data){

            var articles = data;

            for (var i = 0; i < articles.length; i ++) {
                articles[i].date = makeDate();
                articles[i].saved = false;
            }
            Headline.collection.insertMany(articles, {ordered:false}, function(err,docs) {
                cb(err, docs);

            });

        });
    },

    //==================================================================================================================
    // anytime delete runs, whatever headline that was queried will be removed
    //==================================================================================================================

    delete: function(query, cb) {
        Headline.remove(query, cb);
    },

    //==================================================================================================================
    // anytime get runs, find all the headlines in the query and sort them most recent to least recent
    // then once done pass all those documents to the call back function
    //==================================================================================================================

    get: function(query, cb) {

        Headline.find(query)
            .sort({
                _id: -1
            })
            .exec(function(err,doc) {
                cb(doc);
            });
    },

    //==================================================================================================================
    // update new articles scraped with the relevant id and update any information that is passed to those articles with that information as well
    //==================================================================================================================

    update: function(query,cb) {
        Headline.update({_id: query._id}, {

            $set: query
        }, {}, cb);
    }
};