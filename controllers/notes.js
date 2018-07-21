// Purpose for this file: CRUD functionality for adding notes will live here

// bring in date.js script
var makeDate = require('../scripts/date');

// bring in Note model
var Note = require('../models/Note');

// CRUD functionality placed inside of a module.export so it can be exported for use throughout the program:
// 1. Get: grabs all the notes that are associated with an article out of the database
// 2. Save: takes in  data from the user and a call back function and saves it in the database
// 3. Delete: removes the note associated with an article

module.exports = {

    //==================================================================================================================
    // anytime get runs, find all the notes associated with the headline id in question
    //==================================================================================================================

    get: function(data,cb) {

        Note.find({
            _headlineId: data._id
        }, cb);
    },

    //==================================================================================================================
    // anytime save runs, it takes in data from the user and the call back function
    // a object newNote is created that has the headline id associated with the note that is being created,
    // ...date that comes from the makeDate function that was brought in the noteText which is what the user types in
    // next it takes the note and it goes ahead and creates one. It runs a function that will return an error or a document
    // if there is an error it will say so otherwise it will pass the newly created note to the call back function
    //==================================================================================================================

    save: function(data,cb) {
        var newNote= {
            _headlineId: data._id,
            date: makeDate(),
            noteText: data.noteText
        };

        Note.create(newNote, function(err,doc) {
            if(err) {
                console.log(err);
            }
            else {
                console.log(doc);
                cb(doc);
            }
        });
    },

    //==================================================================================================================
    // anytime delete runs, it removes the note associated with the article
    //==================================================================================================================

    delete: function(data,cb) {
        Note.remove({
            _id: data._id
        }, cb);
    }

};