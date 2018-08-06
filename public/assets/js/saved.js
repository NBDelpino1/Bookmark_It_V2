// Purpose of this file : the javascript that will affect the saved notes page will live here

$(document).ready(function() {

    // get today's date and display it on the page

    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var today = new Date();
    today.setTime(today.getTime());
    document.getElementById("spanDate").innerHTML = months[today.getMonth()] + " " + today.getDate()+ ", " + today.getFullYear();

    // create div that will hold all of the articles

    var articleContainer = $('.article-container');

    // misc event listeners
    $(document).on('click', '.btn.delete', handleArticleDelete);
    $(document).on('click', '.btn.notes', handleArticleNotes);
    $(document).on('click', '.btn.save', handleNoteSave);
    $(document).on('click', '.btn.note-delete', handleNoteDelete);

    // Once page has loaded run the initPage function that will kick things off

    initPage();

    //==================================================================================================================
    // initPage():
    // first it empties the article-container
    // then it runs an ajax get request to the headlines route
    // if saved = true (meaning the user did sent it to the saved articles section) then run the main function
    // if the data exists go ahead and render the articles (renderArticles function) TODO add line number
    // otherwise render empty (renderEmpty function)TODO add line number
    //==================================================================================================================

    function initPage() {

        articleContainer.empty();
        $.get('/api/headlines?saved=true').then(function(data) {

                if(data && data.length) {
                    renderArticles(data);
                }
                else {
                    renderEmpty();
                }
            });
    }

    //==================================================================================================================
    // renderArticles():
    // if it finds any articles that match the saved parameter of 'true' it will create an array of article panels
    // it will then create an article panel for each article that exists
    // then append it to the article-container
    //==================================================================================================================

    function renderArticles(articles) {

        var articlePanels = [];

        for(var i = 0; i < articles.length; i ++) {

            articlePanels.push(createPanel(articles[i])); //TODO - createPanel() list line number

        }

        articleContainer.append(articlePanels);

    }

    //==================================================================================================================
    // createPanel():
    // the variable panel will hold the panel inside of which the article headline and button that will allow you to save the article will be inserted
    // the article summary then comes below that
    // it will then associate the panel data id with the article id so that when the user clicks save article the app knows which one they want to save
    //==================================================================================================================

    function createPanel(article) { //TODO - verify cb name && change <a> to a button instead

        var panel =
            $([
                '<div class="card mb-3 article-holder">',
                '<div class="card-body article-content">',
                '<i class="fas fa-bookmark fa-lg float-right pt-1 mr-2 grey-icon"></i>',
                '<h5 class="card-title article-headline">',article.headline,'</h5>',
                '<p class="card-text article-summary">',article.summary,'</p>',
                '<div class="date-div text-center float-left">',
                '<div class="border"></div>',
                '<p class="content-date">',months[today.getMonth()] + " " + today.getDate()+ ", " + today.getFullYear(),'</p>',
                '</div>',
                '<div class="float-right">',
                '<a href="#" class="btn btn-primary shadow icon-button btn-see-article-note notes"><i class="fas fa-search"></i></a>',
                '<a href="#" class="btn btn-primary shadow icon-button btn-delete-article delete red-button" data-toggle="modal" data-target="#delete-confirmation"><i class="fas fa-trash-alt"></i></a>',
                '<div>',
                '</div>',
                '</div>'
                // '<div class="card mb-3 shadow article-holder">',
                // '<div class="card-body article-content">',
                // '<i class="fas fa-bookmark fa-lg float-right pt-1 mr-2 grey-icon"></i>',
                // '<h5 class="card-title article-headline">',article.headline,'</h5>',
                // '<p class="card-text article-summary">',article.summary,'</p>',
                // '<a href="#" class="btn btn-primary shadow icon-button btn-see-article-note notes"><i class="fas fa-search"></i></a>',
                // '<a href="#" class="btn btn-primary shadow icon-button btn-delete-article delete"><i class="fas fa-trash-alt"></i></a>',
                // '</div>',
                // '</div>'
            ].join(""));

        panel.data('_id', article._id);

        return panel;

    }

    //==================================================================================================================
    // renderEmpty():
    // runs if there are no saved articles to display to the user
    // it will tell the user we have none and present the option to browse available articles via a button
    //==================================================================================================================

    function renderEmpty() {
//MODAL MAYBE????
        var emptyAlert =
            $([
                '<div class="card mb-3 pt-4 pb-4 shadow text-center article-holder">',
                '<div class="card-body article-content">',
                '<i class="far fa-smile-wink fa-3x mb-3"></i>',
                '<p class="card-text lead">You dont have anything bookmarked yet</p>',
                '</div>',
                '</div>'
            ].join(""));
        articleContainer.append(emptyAlert);
    }

    //==================================================================================================================
    // handleArticleDelete():
    // if user clicks on a delete button it will delete from the api headlines the article to delete's id
    // then it will run initPage() again which will reload the articles that are saved minus the one that was deleted
    //==================================================================================================================

    function handleArticleDelete() {

        var articleToDelete = $(this).parents('.article-holder').data();

        $.ajax({
            method:'DELETE',
            url:'/api/headlines/' + articleToDelete._id
        }).then(function(data) {

            if(data.ok){

                initPage();

            }

        });
    }

    //==================================================================================================================
    // handleArticleNotes():
    // the variable current article will include the panel the user is clicking on in relation to the notes
    // then it will grab all the notes that are attached to that article id and create a modal that displays all of it
    // next it will create a modl tat will show the note data associated with the article
    // the save button will take in the article that is associated with it and the note data (note data is what the user would have typed in)
    // lastly it will render the notes list with the note data
    //==================================================================================================================

    function handleArticleNotes(){

        var currentArticle = $(this).parents('.article-holder').data();

        $.get('/api/notes/' + currentArticle._id).then(function(data) {

            var modalText = [
                // '<ul class="list-group list-group-flush note-container pt-3 m-3">',
                // '</ul>',
                '<div class=" note-container mb-3">',
                '</div>',
                '<div class="shadow p-3">',
                '<div class="form-group">',
                '<label for="exampleFormControlTextarea1"><i class="fas fa-pen fa-lg ml-3 grey-icon"></i></label>',
                '<textarea class="form-control" id="exampleFormControlTextarea1" rows="3" placeholder="Type you note here"></textarea>',
                '</div>',
                '<div class="form-group">',
                '<button type="button" class="btn btn-primary btn-save-a-note save shadow m-0 icon-button"><i class="fas fa-plus"></i></button>',
                '</div>',
                '</div>'
            ].join("");

            bootbox.dialog({
                message: modalText,
                closeButton: true
            });

            var noteData = {
                _id: currentArticle._id,
                notes: data || []
            };

            $('.btn.save').data('article', noteData);

            renderNotesList(noteData);

        });
    }

    //==================================================================================================================
    // renderNotesList():
    // creates an empty array of notes to render and a variable called currentNote
    // if there are no notes - display message to user advising there are no notes for this article yet then push the current note to notesToRender()
    // otherwise it will go through all the notes that are associated with that article and append the note text as list items along with a button that will allow the user to delete it in the future
    // if a current note is entered it is going to be attached to the id associated with the article and it will push that current note into the notesToRender array
    // lastly it will append the whole notesToRender array into the note-container
    //==================================================================================================================

    function renderNotesList(data){

        var notesToRender = [];
        var currentNote;

        if(!data.notes.length){

            currentNote = [
                // '<i class="fas fa-pen fa-lg"></i>',
            ].join("");
            notesToRender.push(currentNote);

        } else {
            for(var i=0; i < data.notes.length; i ++) {
                currentNote = $([
                    '<div class="p-3 shadow">',
                    // '<li class="list-group-item mt-3 shadow">',
                    '<p>', data.notes[i].noteText, '</p>',
                    '<a class="btn btn-primary note-delete btn-delete-article-note m-0 icon-button red-button" role="button"><i class="fas fa-trash-alt"></i></a>',
                    // '<button class="btn note-delete btn-delete-article-note btn-lg"><i class="glyphicon glyphicon-minus"></i></button>',
                    // '</li>',
                   ' </div>'
                ].join(""));

                currentNote.children('a').data('_id', data.notes[i]._id);

                notesToRender.push(currentNote);

            }

        }

        $('.note-container').append(notesToRender); //TODO...verify if this class is inside the html

    }

    //==================================================================================================================
    // handleNoteSave()
    // creates a variable called noteData and one called newNote that will take the text area, get the value and trim off the white spaces
    // if newNote is 'true' or in other words if the user typed anything there, then it will associate the article id with the id for that note
    // it will also associate the note text with the new note
    // then it post to the api route notes, it will send the note data as the request
    // once it is complete it will close the modal
    //==================================================================================================================

    function handleNoteSave(){

        var noteData;
        var newNote = $('.bootbox-body textarea').val(); //TODO deleted the .trim() from the end here as was throwing an error in console

        if(newNote) {
            noteData = {
                _id: $(this).data('article')._id,
                noteText: newNote
            };
            $.post('/api/notes', noteData).then(function() {

                bootbox.hideAll();

            });

        }

    }

    //==================================================================================================================
    // handleNoteDelete()
    // creates a variable called noteToDelete that is associated with the id of the note that the user wants to delete (this will be the one the user clicked on)
    // then run an ajax request that goes to the api notes route and send the note to delete alongside the url
    // it then uses the method delete and closes the modal
    //==================================================================================================================

    function handleNoteDelete() {

        var noteToDelete = $(this).data('_id');

        $.ajax({
            url:'/api/notes/' + noteToDelete,
            method:'DELETE'
        }).then(function() {

            bootbox.hideAll();

        });

    }

    //====================================================
});