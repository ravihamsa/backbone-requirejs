var pageRootEl = $('.page-container');
var currentPage ;

var paramsToObject = function(params) {
    if (!params) {
        return {};
    }
    var paramsArray = _.map(params.split(';'), function(str) {
        return str.split('=');
    });
    var obj = {};
    _.each(paramsArray, function(arr) {
        obj[arr[0]] = arr[1];
    });
    return obj;
};


Handlebars.registerHelper('logThis', function(options) {
    console.log(this);
    return '';
});


require.config({
    paths: {
        text: 'assets/requirejs-text-plugin',
        marionette:'assets/backbone.marionette',
        backbone:'assets/backbone',
        underscore:'assets/underscore'
    },
    shim:{
        backbone:{
            exports:'Backbone'
        },
        underscore:{
            exports:'_'
        }
    }
})


require(['models/app', 'helpers/handlebars', 'helpers/behavior'], function(app){
    var Router = Backbone.Router.extend({
        routes: {
            ':pageId': 'renderPage',
            ':pageId/*params': 'renderPage',
            '':'renderDefaultPage'
        },
        renderPage: function (pageId, params) {
            if(currentPage){
                currentPage.remove();
            }
            pageRootEl.empty();

            var paramsObject = paramsToObject(params);
            paramsObject.pageId = pageId;


            require(['models/app', 'pages/'+pageId], function(app, Page){
                app.setPageAttributes(paramsObject);
                currentPage = new Page.View({

                });


                var pageRoot = app.getRegion('pageRoot');
                //currentPage.render().$el.appendTo(pageRootEl);
                pageRoot.reset();
                pageRoot.show(currentPage);
            })

        },
        renderDefaultPage: function(){
            this.renderPage('page1');
        }
    })

    app.router = new Router();

    app.start();


});

