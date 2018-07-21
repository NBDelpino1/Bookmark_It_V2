// Purpose for this file: Mongoose schema associated with new articles will live here. It will contain what pieces will be saved in the schema table.

// require mongoose
var mongoose = require('mongoose');

// create a schema class using mongoose's schema method
var Schema = mongoose.Schema;

// create the headlineSchema with our schema class
var headlineSchema = new Schema({
    // headline, a string, must be entered, unique so the same articles are NOT scraped again
    headline: {
        type: String,
        required: true,
        unique: true
    },
    // summary, a string, must be entered
    summary:{
        type: String,
        required: true
    },
    // date is just a string
    date: String,
    // saved, boolean, set to false but will change to true if user decides to save an article
    saved: {
        type: Boolean,
        default: false
    }
});

// create the Headline model using the headlineSchema
var Headline = mongoose.model('Headline', headlineSchema);

// export the Headline model
module.exports = Headline;
