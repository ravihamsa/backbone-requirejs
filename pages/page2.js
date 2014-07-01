define(['pages/defaultPage'], function(DefaultPage){

    "use strict";

    var View = DefaultPage.View.extend({
        template: 'this is page 2 <a href="link to page3">page 3</a>'
    });

    return {
        View:View
    }
})