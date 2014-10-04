define(['text!./tableFilter.html'],function(filterTemplate){

    var FilterView = Backbone.Marionette.ItemView.extend({
        events:{
            'keyup input':'handleKeyPress'
        },
        handleKeyPress: function(event){
            if(event.keyCode === 13){
                event.preventDefault();
            }
            var searchVal = $.trim(this.$('input').val());
            if(searchVal.length < 3){
                this.triggerMethod('clear:filter', '');
            }else{
                this.triggerMethod('set:filter', searchVal);
            }
        },
        template:Handlebars.compile(filterTemplate),
        onSetFilter: function(searchString){
            var tableView = this.getOption('tableView');
            tableView.triggerMethod('set:filter', function(model){
                return model.get('firstName').toLowerCase().indexOf(searchString) > -1;
            })
        },
        onClearFilter: function(){
            var tableView = this.getOption('tableView');
            tableView.triggerMethod('clear:filter');
        }

    });

    return FilterView;


});