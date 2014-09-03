define( function(){

    "use strict";

    var View = Backbone.View.extend({
        template: 'this is default page',
        render: function () {
            this.$el.html(this.template);
            this.afterRender();
            return this;
        },
        afterRender: function(){

        }
    });

    return {
        View:View
    }
})