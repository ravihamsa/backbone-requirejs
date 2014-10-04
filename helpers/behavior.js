var Behaviors = {
    AnchorActions: Marionette.Behavior.extend({
        ui: {
            'action': 'a.js-action'
        },
        events: {
            'click @ui.action': 'triggerActionEvents'
        },
        triggerActionEvents: function (e) {
            e.preventDefault();
            if (this.ui.action.index(e.target) > -1) {
                var target = $(e.target);
                var action = target.attr('href').substr(1);
                this.view.triggerMethod('action', action);
                this.view.triggerMethod('action:' + action);
            }
        }
    }),
    TriggerModelEvents: Marionette.Behavior.extend({
        modelEvents: {
            'change': '_triggerChangeEvents'
        },
        _triggerChangeEvents: function (changedAttributes) {
            var _this = this;
            _.each(changedAttributes, function (value, attributeName) {
                _this.view.triggerMethod(attributeName + ':change', value);
            });
            _this.view.triggerMethod('change', changedAttributes);
        },
        triggerChangeEvents: function (model) {
            var changedAttributes = model.changedAttributes();
            this._triggerChangeEvents(changedAttributes);
        }
    }),
    TriggerCollectionEvents: Marionette.Behavior.extend({
        collectionEvents: {
            'all': 'triggerCollectionEvents'
        },
        triggerCollectionEvents: function (eventName) {

            var args = Array.prototype.slice.call(arguments);
            args.unshift('collectionEvent:' + eventName);
            this.view.triggerMethod.apply(this.view, args);
            args.shift();
            args.unshift('collectionEvent');
            this.view.triggerMethod.apply(this.view, args);
        }
    }),
    Toggle: Marionette.Behavior.extend({
        ui: {
            'toggleButton': '.js-toggle-but',
            'toggleBody': '.js-toggle-body'
        },
        events: {
            'click @ui.toggleButton': 'toggleBody',
            'forceHideBody':'hideBody'
        },
        toggleBody: function () {
            if (this._open) {
                this.hideBody();
            } else {
                this.showBody();
            }
            this.view.$el.toggleClass('open', this._open);
        },
        hideBody: function () {
            popupCh.commands.execute('hide:popup', this.view, this.ui.toggleBody);
            this._open = false
        },
        showBody: function () {
            popupCh.commands.execute('show:popup', this.view, this.ui.toggleBody);
            this._open = true
        },
        onShow: function () {
           this.hideBody();
        }
    }),
    TableSorter: Marionette.Behavior.extend({
        ui:{
            'sortEl':'.sortable'
        },
        events:{
            'click @ui.sortEl':'onSortColumn'
        },
        sorterIndex:{
            'text':  function (modela, modelb) {
                var r = modela.get(this.sortKey).toLowerCase();
                var l = modelb.get(this.sortKey).toLowerCase();
                if (l === void 0) return -1;
                if (r === void 0) return 1;
                if(this.order === 'asc'){
                    return  l < r ? 1 : l > r ? -1 : 0;
                }else{
                    return  l < r ? -1 : l > r ? 1 : 0;
                }

            },
            number: function (modela, modelb) {
                var r = modela.get(this.sortKey).toLowerCase();
                var l = modelb.get(this.sortKey).toLowerCase();
                if (l === void 0) return -1;
                if (r === void 0) return 1;
                if(this.order === 'asc'){
                    return  l < r ? 1 : l > r ? -1 : 0;
                }else{
                    return  l < r ? -1 : l > r ? 1 : 0;
                }
            }
        },
        onSortColumn: function (e) {
            var view = this.view;
            var target = $(e.currentTarget);
            var collection = view.getOption('rowCollection');
            var sortKey = collection.sortKey = target.data('key');
            var columnsCollection = view.getOption('columns');
            var column = columnsCollection.get(sortKey);
            collection.order = collection.order === 'asc' ? 'dsc' : 'asc';
            var sorter = column.get('sorter') || 'text';
            var comparator = this.sorterIndex[sorter];
            if(_.isFunction(sorter)){
                collection.comparator = sorter
            }else{
                collection.comparator = comparator;
            }
            collection.sort();
            this.view.triggerMethod('reset:collection');
        }
    }),
    TableRowRemover: Marionette.Behavior.extend({
        ui:{
            'removeEl':'a.remove'
        },
        events:{
            'click @ui.removeEl':'removeRowHandler'
        },
        removeRowHandler: function(e){
            e.preventDefault();
            var target = $(e.target);
            var modelId = target.data('id');
            var model = this.view.collection.get(modelId);
            model.destroy();
        }
    }),
    TableFilterNPagination: Marionette.Behavior.extend({

        modelEvents:{
            'change:perPage': 'onSetCollection',
            'change:curPage': 'onSetCollection'
        },
        ui:{
          'paginationEl':'.pagination-container'
        },
        filterFunction: function(){
            return true;
        },
        getPaginated: function(){
            var viewModel = this.view.model;
            var rowCollection = this.view.getOption('rowCollection');
            var options = viewModel.toJSON();
            var toReturn = this.getFiltered();
            var filteredCount = toReturn.length;
            var pageCount = Math.ceil(filteredCount / options.perPage)
            var start =  (options.curPage - 1) * options.perPage;
            var end = Math.min(filteredCount, start + options.perPage);
           
            this.view.model.set({
                totalCount:rowCollection.length,
                filteredCount:filteredCount,
                pageCount:pageCount,
                start:start,
                end:end,
                nextEnabled:end < filteredCount,
                prevEnabled:start > 0
            });

            if(options.paginated){

                toReturn = toReturn.splice(start, options.perPage);
            }

            return toReturn;
        },
        getFiltered: function(){
            var rowCollection = this.view.getOption('rowCollection');
            return rowCollection.filter(this.filterFunction);
        },
        setFilterFunction: function(fn){
            this.filterFunction=fn;
            this.view.triggerMethod('set:collection');
        },
        removeFilterFunction: function(){
            delete this.filterFunction;
            this.view.triggerMethod('set:collection');
        },
        onBeforeRender: function(){
            this.view.triggerMethod('set:collection');
        },
        onResetCollection: function(){
            this.view.collection.reset(this.getPaginated());
            this.view.renderPagination();
        },
        onSetCollection: function(){
            this.view.collection.set(this.getPaginated());
            this.view.renderPagination();
        }
    })
};


Marionette.Behaviors.behaviorsLookup = function () {
    return Behaviors;
};
