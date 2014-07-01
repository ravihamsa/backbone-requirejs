define( function(){

    "use strict";

    var View = Backbone.View.extend({
        template: 'this is default page',
        render: function () {
            this.$el.html(this.template);
            return this;
        }
    });

    return {
        View:View
    }
})