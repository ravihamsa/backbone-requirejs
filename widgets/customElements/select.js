define(['models/app','text!./select.html', './../element'],function(app, elementTemplate, Element){


    var View = Element.View.extend({
        template:app.compileTemplate(elementTemplate)
    });

   return View;

});