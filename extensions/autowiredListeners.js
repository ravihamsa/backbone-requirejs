define(function(){

    "use strict";

    var AutoWiredView = Backbone.View.extend({
        constructor: function(){
            Backbone.View.apply(this, arguments);

            var model = this.model;

            //sync view to model first time, to distinguish first call isInitial passed as true
            this.syncAttributes(model.toJSON(), true);

            //after that sync attributes every time model change
            this.listenTo(model, 'change', function(){
                this.syncAttributes(model.changedAttributes());
            });
        },
        syncAttributes: function(changes, isInitial){
            _.each(changes, function(value, attribute) {
                var handler = this[attribute + 'ChangeHandler'];
                if (handler && typeof handler === 'function') {
                    handler.call(this, value, isInitial);
                }
            }, this);

            var changeHandler = this.changeHandler;
            if (changeHandler && typeof changeHandler === 'function') {
                changeHandler.call(this, changes, isInitial);
            }
        },
        changeHandler: function(){
            //handler which listen to change event on model
        },
        attribute1ChangeHandler: function(){
            //handler that get executed when attribute1 is changed
        }
    })

})