var popupCh = Backbone.Wreqr.radio.channel('popup')
var documentEl = $(document);

var startWatchingClickOutside = function(toggleView){
    documentEl.on('click.popup', function(e){
        if(toggleView.$el.has(e.target).length > 0){
            return;
        }else{
            toggleView.$el.trigger('forceHideBody');
        }
    })
}

var stopWatchingClickOutside = function(){
    documentEl.off('click.popup');
}

popupCh.commands.setHandler('hide:popup', function(toggleView, bodyEl){
    bodyEl.hide();
    stopWatchingClickOutside(toggleView);
})

popupCh.commands.setHandler('show:popup', function(toggleView, bodyEl){
    bodyEl.show();
    startWatchingClickOutside(toggleView);


})