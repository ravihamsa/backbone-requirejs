define(['models/app','text!./name.html', './../element'],function(app, elementTemplate, Element){


    var View = Element.View.extend({
        template:app.compileTemplate(elementTemplate),
        updateValue: function(){
            var value =  {
                firstName:this.$('.js-firstName').val(),
                lastName:this.$('.js-lastName').val()
            }
            this.model.set('value', value);
            this.model.validateValue()
        },
        readValueFromModel: function(value){
            this.$('.js-firstName').val(value.firstName);
            this.$('.js-lastName').val(value.lastName);
        }
    });


   return View;

});