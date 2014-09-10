define(['models/app','text!./selectList.html', './itemSelect', '../element'],function(app, elementTemplate, ItemSelect, Element){



    var idCounter = 1;

    var SelectListView = Backbone.Marionette.CollectionView.extend({
        childViewEventPrefix:'option',
        childView:ItemSelect,
        addItem: function(){
            ++idCounter;
            var obj = {
                id:'name_'+idCounter,
                name:'name_'+idCounter,
                options:this.model.get('options')
            };
            this.collection.add(obj);
        },
        onOptionRemoveItem: function(view, options){
            this.collection.remove(options.model);
        },
        onOptionAddItem: function(){
            this.addItem();
        }
    })

    var View = Element.View.extend({
        template:app.compileTemplate(elementTemplate),
        onRender: function(){
            var listView = new SelectListView({
                model:this.model,
                collection:new Backbone.Collection()
            });
            listView.addItem();
            listView.render();
            listView.$el.appendTo(this.$('.element'));
        }

    });
   return View;

});