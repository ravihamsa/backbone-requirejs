define(['text!./element.html'],function(elementTemplate){



  var View = Backbone.Marionette.ItemView.extend({
      events:{
          'change .js-update-change':'updateValue'
      },
      template:Handlebars.compile(elementTemplate),
      updateValue: function(){
          var value = this.$('.js-update-change').val();
          this.model.set('value', value);
      },
      postRenderElement: function(){

      },
      onRender: function () {
          this.postRenderElement();
          var value = this.model.get('value');
          if(value !== undefined && value !== null){
              this.readValueFromModel(value);
          }else{
              this.handleNoValue();
          }
          this.updateValue();
      },
      readValueFromModel: function(){
       //does nothing here if handled by template;
      },
      handleNoValue:function(){

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