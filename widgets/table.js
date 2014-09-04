define(['text!./table.html'],function(tableTemplate){

    var tableTemplateFunction = Handlebars.compile(tableTemplate);

    var CellView = Backbone.Marionette.ItemView.extend({
        tagName:'td',
        template:Handlebars.compile('{{#if renderHTML}} {{{value}}} {{else}} {{value}} {{/if}}'),
        className:function(){
            return this.model.id + ' cell';
        }
    })

    var RowView = Backbone.Marionette.CollectionView.extend({
        tagName:'tr',
        childView:CellView,
        childViewOptions: function(){
            return {
                rowModel:this.getOption('rowModel')
            }
        },
        className:'row'
    });

    var ColumnItemView = Backbone.Marionette.ItemView.extend({
       tagName:'th',
       template:Handlebars.compile('{{name}}')
    });

    var ColumnCollectionView = Backbone.Marionette.CollectionView.extend({
        tagName:'tr',
        childView:ColumnItemView
    });

    var TableView = Backbone.Marionette.CompositeView.extend({
        template:tableTemplateFunction,
        childView: RowView,
        childViewOptions:function(rowModel, index){
            var columnsCollection = this.getOption('columns');
            var valueArray = columnsCollection.map(function(columnModel){
                var formatter = columnModel.get('formatter') || _.identity;
                return {
                    id:columnModel.id,
                    value:formatter.call(rowModel, rowModel.get(columnModel.id)),
                    renderHTML:columnModel.get('renderHTML')
                }
            });
            return {
                collection: new Backbone.Collection(valueArray),
                rowModel:rowModel
            };
        },
        childViewContainer:'tbody',
        onRender:function(){
            var columnCollection = this.getOption('columns');
            var headerView = new ColumnCollectionView({
                collection:columnCollection
            });
            headerView.render();
            headerView.$el.appendTo(this.$('thead'));
        }
    })


    return TableView;

});