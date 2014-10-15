define(['text!./userTemplate.html'],function(userTemplate){


    var UserView = Backbone.Marionette.ItemView.extend({
        template: Handlebars.compile(userTemplate)
    });

    var UserCollectionView = Backbone.Marionette.CollectionView.extend({
        childView:UserView
    });




    return {
        View:UserView,
        CollectionView:UserCollectionView
    }
});