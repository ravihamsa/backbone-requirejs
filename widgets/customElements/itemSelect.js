define(['models/app','text!./itemSelect.html'],function(app, elementTemplate){


    var View = Backbone.Marionette.ItemView.extend({
        triggers:{
             'click .remove':'remove:item',
            'click .add':'add:item',
            'change select':'selected'
        },
        template:app.compileTemplate(elementTemplate),
        getValue: function(){
            return this.$('select').val();
        }
    });

   return View;

});