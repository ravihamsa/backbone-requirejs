define(['models/app','text!./itemSelect.html'],function(app, elementTemplate){


    var View = Backbone.Marionette.ItemView.extend({
        triggers:{
             'click .remove':'remove:item',
            'click .add':'add:item'
        },
        template:app.compileTemplate(elementTemplate)
    });

   return View;

});