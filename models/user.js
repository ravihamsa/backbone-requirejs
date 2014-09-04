define(function(){
    var UserModel = Backbone.Model.extend({
        idAttribute: '_id'
    });

    var UserCollection = Backbone.Collection.extend({
        model: UserModel,
        url: 'http://localhost/api/rest/users/',
        parse: function (resp) {
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