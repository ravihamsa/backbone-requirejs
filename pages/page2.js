define(['pages/defaultPage', 'widgets/table'], function(DefaultPage, TableWidget){

    "use strict";

    var UserModel = Backbone.Model.extend({
        idAttribute:'_id'
    });

    var UserCollection = Backbone.Collection.extend({
        model:UserModel,
        url:'http://localhost/api/rest/users/',
        parse: function(resp){
            return resp.result;
        }
    })

    var View = DefaultPage.View.extend({
        initialize:function(){

            var userCollection = this.userCollection = new UserCollection();
            userCollection.on('all', function(){
                console.log(arguments);
            });
            this.userDef = userCollection.fetch();
        },
        template: '<div class="user-table"> </div>',
        afterRender: function(){
            var _this = this;
            this.userDef.done(function(){
               var tableWidget = new TableWidget({
                   collection: _this.userCollection
               });
                tableWidget.render();
                tableWidget.$el.appendTo(_this.$('.user-table'));
            });
        }
    });

    return {
        View:View
    }
})