define(['./customElements/name','./customElements/select','./customElements/selectList'], function(NameElementView, SelectView, SelectListView){
    return {
        name:NameElementView,
        select:SelectView,
        selectList:SelectListView
    }
})