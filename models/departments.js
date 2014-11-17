define(function(){
    var UserModel = Backbone.Model.extend({
        idAttribute: '_id'
    });

    var DeptCollection = Backbone.Collection.extend({
        model: UserModel,
        url: '/userapi/rest/departments/',
        parse: function (resp) {
            _.each(resp.result, function(item){
                item.id = item._id;
            })
            return resp.result;
        }
    })

    var deptCollection = new DeptCollection();
    var deptDef = deptCollection.fetch();

    return {
        collection:deptCollection,
        def: deptDef
    }
})
