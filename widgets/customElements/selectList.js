define(['models/app','text!./selectList.html', './itemSelect', '../element'],function(app, elementTemplate, ItemSelect, Element){



    var idCounter = 1;

    var SelectListView = Backbone.Marionette.CollectionView.extend({
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
                showAdd:this.collection.length < valueOptions.length
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
            this.collection.each(function(model, index){
                model.set({
                    showRemove:index !== 0,
                    showAdd:_this.collection.length < valueOptions.length
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
        onRender: function(){
            console.log(this.model.toJSON())

            var listView = new SelectListView({
                model:this.model,
                collection:new Backbone.Collection()
            });
            this.listView = listView;
            this.setValue();
            listView.render();
            listView.$el.appendTo(this.$('.element'));


        },
        updateValue: function(){
            this.listView.updateValue();
        },
        setValue: function(){
            var _this = this;
            var value = this.model.get('value');
            if(!value){
                _this.listView.addItem();
                return;
            }
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


        }

    });
   return View;

});