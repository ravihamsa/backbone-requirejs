define(['models/app','text!./selectList.html', './itemSelect', '../element'],function(app, elementTemplate, ItemSelect, Element){



    var idCounter = 1;

    var SelectListView = Backbone.Marionette.CollectionView.extend({
        initialize: function(){
            this.collection.on('all', function(){
                console.log(arguments)
            })
        },
        childViewEventPrefix:'option',
        childView:ItemSelect,
        addItem: function(){
            ++idCounter;
            var valueOptions = this.model.get('options');
            var obj = {
                id:'name_'+idCounter,
                name:'name_'+idCounter,
                options:this.model.get('options'),
                showRemove:this.collection.length !== 0,
                showAdd:true
            };
            var objModel = this.collection.add(obj);
            this.updateRemoveStatus();
            this.render();
            return this.collection.get(obj.id);
        },
        onOptionRemoveItem: function(view, options){
            this.collection.remove(options.model);
            var selectedOption = options.model.get('selectedOption');
            if(selectedOption){
                var valueOptions = this.model.get('options');
                _.some(valueOptions, function(item){
                    if(item.id ===  selectedOption.id){
                        item.selected=false;
                        return true;
                    }
                })
            }
            this.updateRemoveStatus();
            this.render();
        },
        onOptionAddItem: function(){
            var valueOptions = this.model.get('options');
            if(this.collection.length < valueOptions.length){
                this.addItem();
            }

        },
        onOptionSelected: function(view, options){
            var valueOptions = this.model.get('options');
            var selectedModel = options.model;
            var selectedOption = view.getValue();

            var curSelected = selectedModel.get('selectedOption');
            if(curSelected){
                _.some(valueOptions, function(item){
                    if(item.id ===  curSelected.id){
                        item.selected=false;
                        return true;
                    }
                });
            }

            _.some(valueOptions, function(item){
                if(item.id ===  selectedOption){
                    item.selected=true;
                    selectedModel.set('selectedOption', item);
                    return true;
                }
            })
            this.updateRemoveStatus();
            this.render();
        },
        updateRemoveStatus: function(){

            var _this = this;
            var valueOptions = _this.model.get('options');
            var last = _this.collection.last();
            this.collection.each(function(model, index){
                model.set({
                    showRemove:index !== 0,
                    showAdd:model.id === last.id
                })
            });
            this.updateValue();
        },
        updateValue: function(){
            var value = []
            this.collection.each(function(model, index){
                var selectedOption = model.get('selectedOption');
                if(selectedOption){
                    value.push(selectedOption.id);
                }
            });

            this.model.set('value', value.join(','));
        }
    })

    var View = Element.View.extend({
        template:app.compileTemplate(elementTemplate),
        postRenderElement: function(){
            var listView = new SelectListView({
                model:this.model,
                collection:new Backbone.Collection()
            });
            this.listView = listView;
            listView.render();
            listView.$el.appendTo(this.$('.list-container'));
        },
        updateValue: function(){
            this.listView.updateValue();
        },
        readValueFromModel: function(value){
            var _this = this;
            var valueOptionCollection = new Backbone.Collection(this.model.get('options'));
            var valueArray = _.map(value.split( ','), function(item){
                return valueOptionCollection.get($.trim(item)).toJSON();
            })


            _.each(valueArray, function(valueItem){
                var addedModel = _this.listView.addItem();
                var childView = _this.listView.children.findByModelCid(addedModel.cid);
                childView.$('select').val(valueItem.id);
                console.log(childView.$('select').trigger('change'));

            });
            console.log(valueArray);


        },
        handleNoValue: function(){
            this.listView.addItem();
        }

    });
   return View;

});