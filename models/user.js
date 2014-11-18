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

    var UserPaginatedCollection = UserCollection.extend({
        url:function(){
            var collection = this;
            return  this.urlTemplate({
                start:collection.start,
                offset:collection.offset,
                sortKey:collection.sortKey,
                sortOrder:collection.sortOrder,
                filterKey:collection.filterKey,
                filterQuery:collection.filterQuery
            })
        },
        urlTemplate: Handlebars.compile('/userapi/rest/users/?start={{start}}&offset={{offset}}&sortKey={{sortKey}}&sortOrder={{sortOrder}}&filterKey={{filterKey}}&filterQuery={{filterQuery}}'),
        start:1,
        offset:5,
        sortKey:'_id',
        sortOrder:'asc',
        filterKey:'_id',
        filterQuery:''
    })

    var userCollection = new UserCollection();
    var userDef = userCollection.fetch();

    return {
        userCollection:userCollection,
        userDef: userDef,
        PaginatedCollection:UserPaginatedCollection
    }
})