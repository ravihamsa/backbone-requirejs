define(['text!./element.html'],function(elementTemplate){



  var View = Backbone.Marionette.ItemView.extend({
      events:{
          'change input.js-change':'updateValue'
      },
      template:Handlebars.compile(elementTemplate),
      updateValue: function(){
          var value = this.$('input.js-change').val();
          this.model.set('value', value);
      }
  });

    var Model = Backbone.Model.extend({
        defaults:{
            value:null,
            valid:true,
            active:true
        }
    });

    var Collection = Backbone.Collection.extend({
        model:Model
    })

    return {
        View:View,
        Model:Model,
        Collection:Collection
    };

});