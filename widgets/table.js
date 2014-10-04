define(['text!./table.html','text!./pagination.html'], function (tableTemplate, paginationTemplate) {

    var tableTemplateFunction = Handlebars.compile(tableTemplate);
    var paginationTemplateFunction = Handlebars.compile(paginationTemplate);

    var ColumnModel = Backbone.Model.extend({
        defaults: {
            sortable: false
        }
    })

    var ColumnCollection = Backbone.Collection.extend({
        model:ColumnModel
    })

    var CellView = Backbone.Marionette.ItemView.extend({
        tagName: 'td',
        template: Handlebars.compile('{{#if renderHTML}} {{{value}}} {{else}} {{value}} {{/if}}'),
        className: function () {
            return this.model.id + ' cell';
        }
    })

    var RowView = Backbone.Marionette.CollectionView.extend({
        tagName: 'tr',
        childView: CellView,
        childViewOptions: function () {
            return {
                rowModel: this.getOption('rowModel')
            }
        },
        className: 'row'
    });

    var ColumnItemView = Backbone.Marionette.ItemView.extend({
        tagName: 'th',
        template: Handlebars.compile('{{name}}'),
        className: function () {
            return this.model.get('sortable') ? 'sortable':''
        },
        attributes: function () {
            return {
                'data-key': this.model.id
            }
        }
    });

    var ColumnCollectionView = Backbone.Marionette.CollectionView.extend({
        tagName: 'tr',
        childView: ColumnItemView
    });


    var TableModel = Backbone.Model.extend({
        defaults:{
            perPage:10,
            curPage:1,
            paginated:false,
            perPageOptions:[10,20,50,100]
        }
    })


    var PaginationView=Backbone.Marionette.ItemView.extend({
        behaviors:{
            AnchorActions:{}
        },
        template:paginationTemplateFunction,
        events:{
            'change select':'selectChangeHandler'
        },
        serializeData: function(){
            var json = this.model.toJSON();
            json.perPageOptions = _.map(json.perPageOptions, function(item){
                return {
                    id:item,
                    name:item,
                    selected:item === json.perPage
                }
            })

            json.start +=1;

            return json;
        },
        selectChangeHandler:function(){
            this.model.set('perPage', +(this.$('select').val()));
        },
        onActionNextPage: function(){
            var json = this.model.toJSON();
            if(json.nextEnabled){
                this.model.set('curPage', json.curPage + 1);
            }
        },
        onActionPrevPage: function(){
            var json = this.model.toJSON();
            if(json.prevEnabled){
                this.model.set('curPage', json.curPage - 1);
            }
        }
    })






    var TableView = Backbone.Marionette.CompositeView.extend({
        tagName:'table',
        template:Handlebars.compile('<thead> </thead> <tbody></tbody>'),
        childView: RowView,
        childViewContainer:'tbody',
        childViewOptions: function (rowModel, index) {
            var columnsCollection = this.getOption('columns');
            var valueArray = columnsCollection.map(function (columnModel) {
                var formatter = columnModel.get('formatter') || _.identity;
                return {
                    id: columnModel.id,
                    value: formatter.call(rowModel, rowModel.get(columnModel.id)),
                    renderHTML: columnModel.get('renderHTML')
                }
            });
            return {
                collection: new Backbone.Collection(valueArray),
                rowModel: rowModel
            };
        },
        onRender: function(){
            var columnCollection = this.getOption('columns');
            var headerView = new ColumnCollectionView({
                collection: columnCollection
            });
            this.$('thead').append(headerView.render().el);
        }

    })

    var WidgetView = Backbone.Marionette.LayoutView.extend({
        constructor: function(){
            this.collection = new Backbone.Collection();
            this.filters = new Backbone.Collection();
            Backbone.Marionette.LayoutView.apply(this, arguments);
        },
        template: tableTemplateFunction,
        regions:{
            table:'.table-body',
            header:'.table-header',
            footer:'.table-footer'
        },
        onShow: function(){
            this.showHeader();
            this.showBody();
            this.showFooter();
        },
        showBody: function(){
            var tableView = new TableView({
                rowCollection:this.getOption('rowCollection'),
                collection:this.collection,
                model:this.model,
                columns:this.getOption('columns')
            })
            this.table.show(tableView);
        },
        showFooter: function(){
            var paginationView = new PaginationView({
                model:this.model,
                collection:this.getOption('rowCollection')
            })
            this.footer.show(paginationView);
        },
        onResetCollection: function(){
            this.footer.currentView.render();
        },
        onSetCollection: function(){
           if(this.footer.hasView()){
               this.footer.currentView.render();
           }

        },
        showHeader: function(){
            //do nothing
        }
    })


    return {
        View: WidgetView,
        Model:TableModel,
        ColumnCollection:ColumnCollection
    };

});