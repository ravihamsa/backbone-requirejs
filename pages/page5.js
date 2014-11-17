define(['pages/defaultPage', 'pages/page5/user', 'models/user', 'models/departments', 'models/designations','models/reportees', 'models/app'], function (DefaultPage, User, users, departments, designations, reportees, app) {

    "use strict";

    var View = DefaultPage.View.extend({
        regions: {
            'manager': '.manager',
            'reportees': '.reportees'
        },
        template: Handlebars.compile('this is page 5 <a href="#page1">page 1</a> <div class="manager"> Manager Comes here</div>   <div class="reportees"> Reportees Comes here</div>'),
        onShow: function () {
            var _this = this;
            $.when(users.userDef, departments.def, designations.def).then(function () {
                var managerModel = users.userCollection.get(app.getPageAttribute('userId'));
                _this.manager.show(new User.ManagerView({
                    model: managerModel
                }));

                var reporteesDef = reportees.getReporteesFor(managerModel.id);

                reporteesDef.done(function(resp){
                     _this.reportees.show(new User.ReporteeCollectionView({
                         collection:new Backbone.Collection(resp)
                     }))
                })

            });


        }
    });

    return {
        View: View
    }
})