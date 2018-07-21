// Purpose of this file : the javascript that will display everything from the database to the homepage (index.js)

$(document).ready(function() {

    // get today's date and display it on the page

    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var today = new Date();
    today.setTime(today.getTime());
    document.getElementById("spanDate").innerHTML = months[today.getMonth()] + " " + today.getDate()+ ", " + today.getFullYear();

    // create div that will hold all of the articles

    var articleContainer = $('.article-container');

    // if user clicks the button with a class of save : run the handleArticleSave() function //TODO add line number
    // if user clicks the button with a class of scrape-new button : run the handleArticleScrape() function //TODO add line number

    $(document).on('click', '.btn.save', handleArticleSave);
    $(document).on('click', '.scrape-new', handleArticleScrape);

    // Once page has loaded run the initPage function that will kick things off

    initPage();

    //==================================================================================================================
    // initPage():
    // first it empties the article-container
    // then it runs an ajax get request to the headlines route
    // if saved = false (meaning the user has not sent it to the saved articles section) then run the main function
    // if the data exists go ahead and render the articles (renderArticles function) TODO add line number
    // otherwise render empty (renderEmpty function)TODO add line number
    //==================================================================================================================

    function initPage() {

        articleContainer.empty();
        $.get('/api/headlines?saved=false')
            .then(function(data) {
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
    // creates an array of article panels that is empty
    // then for every single article that is returned it will push it into the array and create a panel for it
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
            $([ '<div class="article-holder">',
                '<div class="article-content">',
                '<h3 class="article-headline">',
                article.headline,
                '</h3>',
                '<p class="article-summary">', article.summary,'</p>',
                '</div>',
                '<div>',
                '<div class="article-button-wrapper text-center">',
                '<a class="btn btn-save-an-article save article-button blue-button" data-toggle="modal" data-target="#exampleModalCenter">',
                // 'Save Article',
                '<img src="../../save-button-icon.png" class="button-image">',
                '</a>',
                '<p class="article-icon-text">Bookmark It!</p>',
                '</div>',
                '<div class="article-icons-wrapper">',
                '<div class="article-icons-wrapper-content text-center">',
                '<img src="../../not-saved-icon.png" class="article-holder-icon">',
                '<p class="article-icon-text">Not Saved</p>',
                '</div>',
                '<div class="article-icons-wrapper-content text-center">',
                '<img src="../../view-icon.png" class="article-holder-icon">',
                '<p class="article-icon-text">View</p>',
                '</div>',
                '<div class="article-icons-wrapper-content text-center">',
                '<img src="../../link-icon.png" class="article-holder-icon">',
                '<p class="article-icon-text">Copy Link</p>',
                '</div>',
                '</div>',
                '</div>',
                '</div>',
            ].join(""));

        panel.data('_id', article._id);

        return panel;

    }

    //==================================================================================================================
    // renderEmpty():
    // runs if there are no new articles to display to the user
    // it will tell the user we have none and present the option of either scraping new articles or going to your saved articles
    //==================================================================================================================

    function renderEmpty() {

        var emptyAlert =
            $([ '<div class="alert alert-info text-center">',
                '<h4>Uh oh. Looks like we do not have any new articles.</h4>',
                '</div>',
                '<div class="panel panel-default">',
                '<div class="panel-heading text-center">',
                '<h3>What would you like to do?</h3>',
                '</div>',
                '<div class="panel-body text-center">',
                '<button type="button" class="btn btn-lg scrape-new">Try Scraping New Articles</button>',
                '<button href="/saved" type="button" class="btn btn-lg">Go to Saved Articles</button>',
                '</div>',
                '</div>'
            ].join(""));
        articleContainer.append(emptyAlert);
    }

    //==================================================================================================================
    // handleArticleSave():
    // the variable articleToSave is set to whatever the panel data id associated with what the user clicked on is
    // saved is set to true because the user has decided they want to save it (initially set to false)
    // next run the ajax method against PATCH on the listed url and change the data to articleToSave
    // then if the data is okay (in other words if its 'true' or if it exists)- run the initPage() function again TODO add line number
    // this will reload all of the articles BUT it will remove the one the user has saved so they will not have the option to save it anymore (it's already in the saved articles section don't need it twice
    //==================================================================================================================

    function handleArticleSave() {

        var articleToSave = $(this).parents('.article-holder').data();
        articleToSave.saved = true;

        $.ajax({
            method:'PATCH',
            url:'/api/headlines',
            data:articleToSave
        })
            .then(function(data) {

                if(data.ok) {
                    initPage();
                }

            });

    }

    //==================================================================================================================
    // handleArticleScrape():
    // goes to the api fetch route
    // runs the initPage() function again so that it can reload all of the new articles
    // it will also go ahead and alert the user (using bootbox modal and data.message) if there were no new articles or a certain number was added
    //==================================================================================================================

    function handleArticleScrape() {

        $.get('/api/fetch')
            .then(function(data) {

                initPage();
                bootbox.alert('<h3 class="text-center m-top-80">' + data.message + '</h3>');

            });

    }

    //====================================================

});



