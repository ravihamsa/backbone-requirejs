define(['pages/defaultPage'], function(DefaultPage){

    "use strict";

    var View = DefaultPage.View.extend({
        template: 'this is page 3 <a href="link to page4">page 4</a>'
    });

    return {
        View:View
    }
})