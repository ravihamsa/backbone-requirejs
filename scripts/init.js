var pageRootEl = $('.page-container');
var currentPage ;

require.config({
    paths: {
        text: 'assets/requirejs-text-plugin'
    }
})


var Router = Backbone.Router.extend({
    routes: {
        ':pageId': 'renderPage',
        '':'renderDefaultPage'
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

    },
    renderDefaultPage: function(){
        this.renderPage('page1');
    }
})


var router = new Router();


Backbone.history.start({
    root: this.root
});