define(function () {

    "use strict";

    var View = Backbone.Marionette.LayoutView.extend({
        regions: {
            header: '.page-header',
            footer: '.page-footer',
            body: '.page-body'
        },
        template: Handlebars.compile('<div class="page-header"> </div> <div class="page-body"> </div> <div class="page-footer"> </div>'),
        onShow: function () {


            this.showHeader();
            this.showBody();
            this.showFooter();
        },
        showHeader: function () {

        },
        showBody: function () {

        },
        showFooter: function () {

        }
    });

    return {
        View: View
    }
})