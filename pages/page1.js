define(['pages/defaultPage', 'text!./page1Template.html'], function(DefaultPage, page1TemplateString){

    "use strict";

    var View = DefaultPage.View.extend({
        template: page1TemplateString
    });

    return {
        View:View
    }
})