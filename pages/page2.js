define(['pages/defaultPage', 'widgets/table', 'models/user'], function (DefaultPage, TableWidget, user) {

    "use strict";

    var UserTable = TableWidget.extend({
        events:{
            'click a.remove':'removeHandler'
        },
        removeHandler:function(e){
            e.preventDefault();
            var target = $(e.target);
            var modelId = target.data('id');
            var model = this.collection.get(modelId);
            model.destroy();
        }
    })

    var View = DefaultPage.View.extend({
        initialize: function () {

        },
        template: '<a href="#createUser">Create User</a> <div class="user-table"> </div>',
        afterRender: function () {
            var _this = this;
            user.userDef.done(function () {
                var tableWidget = new UserTable({
                    collection: user.userCollection,
                    columns: new Backbone.Collection([
                        {id: 'firstName',
                            name: 'Full Name',
                            formatter: function () {
                                return this.get('firstName') + ' ' + this.get('lastName');
                            }
                        },
                        {id: 'designation', name: 'Designation'},
                        {id: 'department', name: 'Department'},
                        {id: 'remove', name: '',  renderHTML:true, formatter: function () {
                            return '<a href="#remove" data-id="'+this.id+'" class="remove">x</a>';
                        }},
                        {id: 'edit', name: '',  renderHTML:true, formatter: function () {

                            return '<a href="#editUser/userId='+this.id+'">edit</a>';
                        }}
                    ])
                });
                tableWidget.render();
                tableWidget.$el.appendTo(_this.$('.user-table'));
            });
        }
    });

    return {
        View: View
    }
})