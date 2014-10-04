define(['./bareModel'], function(BareModel){
    var pageModel = new BareModel();


    var app = new Backbone.Marionette.Application();

    _.extend(app, {
        setPageId: function(pageId){
            pageModel.set('pageId', pageId);
        },
        getPageId: function(){
            return this.getPageAttribute('pageId');
        },
        setPageAttributes: function(obj){
            pageModel.reset(obj);
        },
        getPageAttributes: function(){
            return pageModel.toJSON();
        },
        getPageAttribute:function(attrName){
            return pageModel.get(attrName);
        },
        compileTemplate: function(str){
            return Handlebars.compile(str);
        }
    })

    app.addRegions({
        pageRoot:'.page-container'
    })

    app.on("start", function(options){
        if (Backbone.history){
            Backbone.history.start();
        }
    });

    return app;
})