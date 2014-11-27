define(['text!./table.html', 'text!./pagination.html'], function (tableTemplate, paginationTemplate) {

    var tableTemplateFunction = Handlebars.compile(tableTemplate);
    var paginationTemplateFunction = Handlebars.compile(paginationTemplate);


    var ColumnModel = Backbone.Model.extend({
        defaults: {
            sortable: false,
            type: 'value'
        }
    })

    var ColumnCollection = Backbone.Collection.extend({
        model: ColumnModel
    })


    var ValueView = Backbone.Marionette.ItemView.extend({
        tagName: 'td',
        template: Handlebars.compile(' {{#if renderHTML}} {{{value}}} {{else}} {{value}} {{/if}}'),
        className: function () {
            var classes = [this.model.id, 'cell'];
            if (this.model.get('sorted')) {
                classes.push('sorted');
                classes.push('order-' + this.model.get('sortOrder'));
            }
            return classes.join(' ');
        }
    })

    var HeaderValueView = Backbone.Marionette.ItemView.extend({
        tagName: 'th',
        template: Handlebars.compile('{{name}}'),
        className: function () {
            var classes = [this.model.id, 'headerCell'];
            var attributes = this.model.toJSON();
            if (attributes.sortable) {
                classes.push('sortable');
                if (attributes.sorted) {
                    classes.push('sorted');
                    classes.push('order-' + attributes.sortOrder);
                }
            }
            return classes.join(' ');
        },
        attributes: function () {
            return {
                'data-key': this.model.id
            }
        }
    });


    var SelectableValueView = ValueView.extend({
        template: Handlebars.compile('{{stringify this}}<div class="squaredThree"><label class="{{#if selected}}checked{{/if}}"></label></div>'),
        events: {
            'click label': 'toggleSelected'
        },
        toggleSelected: function () {
            var rowModel = this.getOption('rowModel');
            var selected = !rowModel.get('selected');
            rowModel.set('selected', selected);
            console.log(rowModel);
            //this.$('.squaredThree label').toggleClass('checked', selected)
        }
    })


    var SelectableHeaderValueView = HeaderValueView.extend({
        template: Handlebars.compile(' <div class="squaredThree"><label class="{{#if selected}}checked{{/if}}"></label></div>'),
        events: {
            'click label': 'toggleSelected'
        },
        toggleSelected: function () {
            var rowCollection = this.getOption('rowCollection');
            var model = this.model;
            var selected = !model.get('selected');
            rowCollection.each(function (model) {
                console.log(model, selected);
                model.set('selected', selected);
            })
            this.$('.squaredThree label').toggleClass('checked', selected)
        }
    })

    var typeViewIndex = {
        'value': ValueView,
        'selectable': SelectableValueView
    }

    var typeHeaderViewIndex = {
        'value': HeaderValueView,
        'selectable': SelectableHeaderValueView
    }

    var RowView = Backbone.Marionette.CollectionView.extend({
        onShow: function () {
            this.updateData();
            var rowModel = this.getOption('rowModel');
            this.listenTo(rowModel, 'change', this.updateData);
        },
        updateData: function(){
            var columnsCollection = this.getOption('columns');
            var rowModel = this.getOption('rowModel');
            var rowCollection = rowModel.collection;

            var valueArray = columnsCollection.map(function (columnModel) {
                var formatter = columnModel.get('formatter') || _.identity;
                var obj = {
                    id: columnModel.id,
                    type: columnModel.get('type'),
                    value: formatter.call(rowModel, rowModel.get(columnModel.id)),
                    renderHTML: columnModel.get('renderHTML'),
                    sorted: rowCollection.sortKey === columnModel.id,
                    selected: rowModel.get('selected') === true
                }
                //console.log(rowCollection, rowCollection.sortKey , columnModel.id,rowCollection.sortKey === columnModel.id);
                if (obj.sorted) {
                    obj.sortOrder = rowCollection.sortOrder;
                }

                return obj;
            });

            this.collection.reset(valueArray);
        },
        tagName: 'tr',
        getChildView: function (item) {
            return typeViewIndex[item.get('type')] || ValueView;
        },
        childViewOptions: function (model) {
            return {
                rowModel: this.getOption('rowModel')
            }
        },
        className: 'row'
    });


    var ColumnCollectionView = Backbone.Marionette.CollectionView.extend({
        tagName: 'tr',
        getChildView: function (item) {
            return typeHeaderViewIndex[item.get('type')] || HeaderValueView;
        },
        childViewOptions: function (model) {
            return {
                rowCollection: this.getOption('rowCollection')
            }
        }
    });


    var TableModel = Backbone.Model.extend({
        defaults: {
            perPage: 5,
            curPage: 1,
            start: 1,
            offset: 10,
            paginated: false,
            perPageOptions: [5, 10, 20, 50, 100],
            sortOrder: 'asc'
        }
    })


    var PaginationView = Backbone.Marionette.ItemView.extend({
        behaviors: {
            AnchorActions: {}
        },
        template: paginationTemplateFunction,
        events: {
            'change select': 'selectChangeHandler'
        },
        serializeData: function () {
            var json = this.model.toJSON();
            json.perPageOptions = _.map(json.perPageOptions, function (item) {
                return {
                    id: item,
                    name: item,
                    selected: item === json.perPage
                }
            })

            json.start += 1;

            return json;
        },
        selectChangeHandler: function () {
            this.model.set('perPage', +(this.$('select').val()));
        },
        onActionNextPage: function () {
            var json = this.model.toJSON();
            if (json.nextEnabled) {
                this.model.set('curPage', json.curPage + 1);
            }
        },
        onActionPrevPage: function () {
            var json = this.model.toJSON();
            if (json.prevEnabled) {
                this.model.set('curPage', json.curPage - 1);
            }
        }
    })


    var TableView = Backbone.Marionette.CompositeView.extend({
        tagName: 'table',
        template: Handlebars.compile('<thead> </thead> <tbody></tbody>'),
        childView: RowView,
        childViewContainer: 'tbody',
        childViewOptions: function (rowModel, index) {




            //console.log(valueArray);
            return {
                collection: new Backbone.Collection(),
                rowModel: rowModel,
                columns:this.getOption('columns')

            };
        },

        onRender: function () {
            this.renderHeader();
        },
        renderHeader: function () {
            if (!this.headerView) {
                var columnCollection = this.getColumnCollection();

                var headerView = new ColumnCollectionView({
                    collection: columnCollection,
                    rowCollection: this.getOption('rowCollection')
                });
                this.headerView = headerView;
                this.$('thead').append(headerView.render().el);
            } else {
                var columnCollection = this.getColumnCollection();
                this.headerView.render();
            }
        },
        getColumnCollection: function () {
            var columnCollection = this.getOption('columns');
            var rowCollection = this.getOption('rowCollection');
            columnCollection.each(function (model) {
                if (model.id === rowCollection.sortKey) {
                    model.set({
                        sorted: true,
                        sortOrder: rowCollection.sortOrder
                    });
                } else {
                    model.set('sorted', false);
                }
            });

            return columnCollection;
        }

    })

    var WidgetView = Backbone.Marionette.LayoutView.extend({
        constructor: function () {
            this.collection = new Backbone.Collection();
            this.filters = new Backbone.Collection();
            Backbone.Marionette.LayoutView.apply(this, arguments);
        },
        template: tableTemplateFunction,
        regions: {
            table: '.table-body',
            header: '.table-header',
            footer: '.table-footer'
        },
        onShow: function () {
            this.showHeader();
            this.showBody();
            this.showFooter();
        },
        showBody: function () {
            var sortKey = this.getOption('sortKey') || this.getOption('columns').at(0).id;
            var sortOrder = this.getOption('sortOrder') || 'asc';
            var rowCollection = this.getOption('rowCollection');
            rowCollection.sortKey = sortKey;
            rowCollection.sortOrder = sortOrder;
            this.triggerMethod('sort:collection', sortKey, sortOrder);
            var tableView = new TableView({
                rowCollection: this.getOption('rowCollection'),
                collection: this.collection,
                model: this.model,
                columns: this.getOption('columns')
            })
            this.table.show(tableView);
        },
        showFooter: function () {
            var paginationView = new PaginationView({
                model: this.model,
                collection: this.getOption('rowCollection')
            })
            this.footer.show(paginationView);
        },
        onResetCollection: function () {
            if (this.footer.hasView()) {
                this.footer.currentView.render();
                this.table.currentView.renderHeader();
            }
        },
        onSetCollection: function () {
            if (this.footer.hasView()) {
                this.footer.currentView.render();
                this.table.currentView.renderHeader();
            }

        },
        showHeader: function () {
            //do nothing
        }
    })


    var ServerSideTableView = WidgetView.extend({
        constructor: function () {
            var _this = this;
            WidgetView.apply(this, arguments);
            var rowCollection = this.getOption('rowCollection');
            rowCollection.on('sync', function (coll) {
                _this.triggerMethod('reset:collection');
            })
            _this.triggerMethod('fetch:collection');

        },
        showBody: function () {
            var sortKey = this.getOption('sortKey') || this.getOption('columns').at(0).id;
            var sortOrder = this.getOption('sortOrder') || 'asc';
            var rowCollection = this.getOption('rowCollection');
            rowCollection.sortKey = sortKey;
            rowCollection.sortOrder = sortOrder;
            var tableView = new TableView({
                rowCollection: rowCollection,
                collection: this.collection,
                model: this.model,
                columns: this.getOption('columns')
            })
            this.table.show(tableView);
        },
        onFetchCollection: function () {
            var _this = this;
            _this.updateCollectionParams();
            var rowCollection = this.getOption('rowCollection');
            var def = rowCollection.fetch({reset: true});
            _this.showLoading();
            def.always(function () {
                _this.hideLoading();
            })
        },
        updateCollectionParams: function () {
            var rowCollection = this.getOption('rowCollection');
            var attributes = this.model.toJSON();
            rowCollection.start = attributes.start;
            rowCollection.offset = attributes.perPage;
            rowCollection.sortKey = attributes.sortKey;
            rowCollection.sortOrder = attributes.sortOrder;
            rowCollection.filterKey = attributes.filterKey;
            rowCollection.filterQuery = attributes.filterQuery;
        },
        onResetCollection: function () {
            if (this.footer.hasView()) {
                this.footer.currentView.render();
                this.table.currentView.renderHeader();
            }
        },
        onSetCollection: function () {
            if (this.footer.hasView()) {
                this.footer.currentView.render();
                this.table.currentView.renderHeader();
            }

        },
        onPaginationRender: function () {
            if (this.footer.hasView()) {
                this.footer.currentView.render();
            }
        },
        showLoading: function () {
            this.$el.addClass('loading');
        },
        hideLoading: function () {
            this.$el.removeClass('loading');
        }

    })


    return {
        View: WidgetView,
        ValueView: ValueView,
        HeaderValueView: HeaderValueView,
        ServerSideView: ServerSideTableView,
        Model: TableModel,
        ColumnCollection: ColumnCollection,
        addToTypeView: function (type, CellView, CellHeaderView) {
            typeViewIndex[type] = CellView;
            if (CellHeaderView) {
                typeHeaderViewIndex[type] = CellHeaderView;
            }
        }
    };

});