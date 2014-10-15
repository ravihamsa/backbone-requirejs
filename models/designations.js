define(function(){
    var UserModel = Backbone.Model.extend({
        idAttribute: '_id'
    });

    var DesignationCollection = Backbone.Collection.extend({
        model: UserModel,
        url: '/userapi/rest/designations/',
        parse: function (resp) {
            _.each(resp.result, function(item){
                item.id = item._id;
            })
            return resp.result;
        }
    })

    var designationCollection = new DesignationCollection();
    var desDef = designationCollection.fetch();

    return {
        collection:designationCollection,
        def: desDef
    }
})
