define(['text!./table.html'],function(tableTemplate){

    var tableTemplateFunction = Handlebars.compile(tableTemplate);

    var TableView = Backbone.View.extend({
        events:{
            'click a.remove':'handleRemove'
        },
        templateFunction:tableTemplateFunction,
        render: function () {
            this.$el.html(this.templateFunction(this.serializeData()));
            return this;
        },
        serializeData: function(){
            return {records: this.collection.toJSON()}
        },
        handleRemove: function(e){
            e.preventDefault();
            var $target = $(e.target);
            var rowId = $target.data('id');
            var toRemove = this.collection.get(rowId);
            toRemove.destroy();
            this.render();
        }
    })


    return TableView;

});