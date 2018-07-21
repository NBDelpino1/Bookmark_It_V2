// Purpose for this file: Mongoose schema associated with notes will live here. It will contain what pieces will be saved in the schema table.

// require mongoose
var mongoose = require('mongoose');
// create the schema class using mongoose's schema method
var Schema = mongoose.Schema;

// create the noteSchema with the schema object
var noteSchema = new Schema({
    // the headline is the article associate with the note
    _headlineId: {
        type: Schema.Types.ObjectId,
        ref: 'Headline'
    },
    // date is just a string
    date: String,
    // noteText is just a string
    noteText: String
});

// create the Note model using the noteSchema
var Note = mongoose.model('Note', noteSchema);

// export the Note model
module.exports = Note;
