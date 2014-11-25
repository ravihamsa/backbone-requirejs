define(['models/app'],function(app){

    var Selectable = Backbone.Marionette.Selectable;

    var SingleSelectDropDownView = Selectable.SingleSelectView.extend({
        modelEvents:{
            'selectionChange':'handleSelectionChange'
        },
        template: app.compileTemplate('<div class="js-toggle-but drop-down-but"><div class="js-summary-container summary-container"> </div>  <em class="ic-dropdown"></em> </div> <div class="js-toggle-body drop-down-body"> <div class="js-list-container single-select"> </div></div>'),
        behaviors:{
            Toggle:{}
        },
        showSummary:true,
        className:'drop-down',
        handleSelectionChange:function(){
            this.$el.trigger('forceHideBody');
        }
    })


    var MultiSelectDropDownView = Selectable.MultiSelectView.extend({
        template: app.compileTemplate('<div class="js-toggle-but drop-down-but"><div class="js-summary-container summary-container"> </div>  <em class="ic-dropdown"></em> </div> <div class="js-toggle-body drop-down-body"> <div class="js-list-container multi-select"> </div></div>'),
        behaviors:{
            Toggle:{
                multiSelect:true
            }
        },
        showSummary:true,
        className:'drop-down'
    })

    return {
        SingleSelect:SingleSelectDropDownView,
        MultiSelect:MultiSelectDropDownView
    }
})