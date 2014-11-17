define(function(){
    var UserModel = Backbone.Model.extend({
        idAttribute: '_id'
    });

    var UserCollection = Backbone.Collection.extend({
        model: UserModel,
        url:function(){
            return '/userapi/reportees/'+this.managerId;
        },
        parse: function (resp) {
            return resp;
        }
    })

    var cacheIndex = {};


    var getCachedDef =  function(managerId){
        return cacheIndex[managerId]
    }


    return {
        getReporteesFor: function(managerId){
            var cachedDef = getCachedDef(managerId);

            if(!cachedDef) {
                var reporteeCollection = new UserCollection();
                reporteeCollection.managerId = managerId;
                cachedDef = reporteeCollection.fetch();
                cacheIndex[managerId]=cachedDef;
            }
            return  cachedDef;
        }
    }
})