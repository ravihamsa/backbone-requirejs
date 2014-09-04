define(['./bareModel'], function(BareModel){
    var pageModel = new BareModel();


    var app = {
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
        }
    }


    return app;
})