define(['pages/defaultPage'], function(DefaultPage){

    "use strict";

    var View = DefaultPage.View.extend({
        template: 'this is page 4 <a href="#page1">page 1</a>'
    });

    return {
        View:View
    }
})