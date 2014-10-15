define(['text!./managerTemplate.html', 'text!./reporteeTemplate.html'],function(managerTemplate, reporteeTemplate){


    var ManagerView = Backbone.Marionette.ItemView.extend({
        template: Handlebars.compile(managerTemplate)
    });


    var ReporteeView = Backbone.Marionette.ItemView.extend({
        template: Handlebars.compile(reporteeTemplate)
    })


    var ReporteeCollectionView = Backbone.Marionette.CollectionView.extend({
        childView:ReporteeView
    });




    return {
        ManagerView:ManagerView,
        ReporteeCollectionView:ReporteeCollectionView
    }
});