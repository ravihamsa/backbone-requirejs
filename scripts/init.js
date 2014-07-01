var pageRootEl = $('.page-container');
var currentPage ;


//require.config();

var Router = Backbone.Router.extend({
    routes: {
        ':pageId': 'renderPage'
    },
    renderPage: function (pageId) {

        if(currentPage){
            currentPage.remove();
        }
        pageRootEl.empty();


        require(['pages/'+pageId], function(Page){
            currentPage = new Page.View({
            });
            currentPage.render().$el.appendTo(pageRootEl);
        })

    }
})


var router = new Router();


Backbone.history.start({
    root: this.root
});