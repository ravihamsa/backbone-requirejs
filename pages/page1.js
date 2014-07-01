define(['pages/defaultPage'], function(DefaultPage){

    "use strict";

    var View = DefaultPage.View.extend({
        template: 'this is page 1 <a href="link to page2">page 2</a>'
    });

    return {
        View:View
    }
})