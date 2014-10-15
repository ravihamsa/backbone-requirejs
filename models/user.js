define(function(){
    var UserModel = Backbone.Model.extend({
        idAttribute: '_id'
    });

    var UserCollection = Backbone.Collection.extend({
        model: UserModel,
        url: '/userapi/rest/users/',
        parse: function (resp) {
            _.each(resp.result, function(item){
                item.id = item._id;
            })

            return resp.result;
        }
    })

    var userCollection = new UserCollection();
    var userDef = userCollection.fetch();

    return {
        userCollection:userCollection,
        userDef: userDef
    }
})