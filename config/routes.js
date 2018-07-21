// Purpose of this file: routes will live here

// do a module.exports so the app routes can be included in the server.js file
// create routes that render home and saved handlebars

// bring in scrape function from scripts directory
var scrape = require('../scripts/scrape');

// bring in headlines and notes controllers (CRUD stuff)
var headlinesController = require('../controllers/headlines');
var notesController = require('../controllers/notes');


module.exports = function(router) {

    //==================================================================================================================
    // this route renders the home handlebars page
    //==================================================================================================================

    router.get('/', function(req, res) {
        res.render('home');
    });

    //==================================================================================================================
    // this route renders the saved handlebars page
    //==================================================================================================================

    router.get('/saved', function(req, res) {
        res.render('saved');
    });



    //==================================================================================================================
    //==================================================================================================================
                            // *** Routes that will use the different controllers *** //
    //==================================================================================================================
    //==================================================================================================================



    //==================================================================================================================
    // /api/fetch route will:
    // go to headlines controller and run fetch function
    // the request will be passed in and we will get back the response
    // pop up a message to the user advising if no articles were added or if so how many
    //==================================================================================================================

    router.get('/api/fetch', function(req,res) {

        headlinesController.fetch(function (err,docs) {
            if(!docs || docs.insertedCount === 0) {
                res.json({
                    message: 'Nothing new yet! Try again in a few!'
                });
            }
            else {
                res.json({
                    message: 'Added ' + docs.insertedCount + ' new articles!'
                });
            }
        });
    });

    //==================================================================================================================
    // /api/headlines route will:
    // go to the headlines controller get run the get function
    // grab all the headlines that are in the database
    // take in what the user requested
    // the user's request is defined by query (at first query is empty)
    // if user specifies a saved article or any specific parameter, the query will be set equal to whatever that parameter was
    // if user doesn't specify something, it will return everything
    //==================================================================================================================

    router.get('/api/headlines', function(req,res) {

        var query = {};
        if(req.query.saved) {
            query = req.query;
        }

        headlinesController.get(query, function(data) {

            res.json(data);
        });
    });

    //==================================================================================================================
    // /api/headlines/id route will:
    // delete a specific article
    // the id parameter at the end is going to refer to the headline id associated earlier
    // query is first set to blank but then is set to the request params id
    // it is then passed into the headlines controller delete function
    // it responds with tha data
    //==================================================================================================================

    router.delete('/api/headlines/:id', function(req,res) {

        var query = {};
        query._id = req.params.id;

        headlinesController.delete(query, function(err,data) {
            res.json(data);
        });
    });

    //==================================================================================================================
    // /api/headlines route will:
    // update headlines as needed
    // run the headlines controller update function on whatever the user sends in their request
    //==================================================================================================================

    router.patch('/api/headlines', function(req,res) {

        headlinesController.update(req.body, function(err,data) {
            res.json(data);
        });
    });

    //==================================================================================================================
    // /api/notes/:headline_id? route will:
    // grab all the notes associated with an article so that it can be displayed to the user
    // on the note associated with the that headline id;
    // first set the query to blank else if the parameters the user selects are true - set the query id to the parameter sent
    // then run the notes controller get function
    // pass in the query for that specific param that the user choose
    // return the data associated in json format
    // so it can be used on the front end of the app if needed
    //==================================================================================================================

    router.get('/api/notes/:headline_id?', function(req,res) {

        var query = {};
        if(req.params.headline_id) {
            query._id = req.params.headline_id;
        }

        notesController.get(query, function(err,data) {
            res.json(data);
        });
    });

    //==================================================================================================================
    // /api/notes/:id route will:
    // delete notes
    // create a query based on the id of the note specified
    // associate that query with whatever parameter the user choose
    // then run the notes controller delete function based on the query the user choose
    // return the data in json format
    // so it can be used on the front end of the app if needed
    //==================================================================================================================

    router.delete('/api/notes/:id', function(req,res) {

        var query = {};
        query._id = req.params.id;

        notesController.delete(query, function(err,data) {
            res.json(data);
        });
    });

    //==================================================================================================================
    // /api/notes route will:
    // post new notes
    // run the notes controller save function
    // will use what the user sent as the request
    // return the data in json format
    // so it can be used on the front end of the app if needed
    //==================================================================================================================

    router.post('/api/notes', function(req,res) {

        notesController.save(req.body, function(data) {
            res.json(data);
        });
    });

};