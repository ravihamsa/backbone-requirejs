define(['pages/defaultPage', 'widgets/table', 'models/user','models/departments', 'models/designations'], function (DefaultPage, Table, user, departments,designations ) {

    "use strict";

    var UserTable = Table.View.extend({
        behaviors:{
            TableSorter:{},
            TableRowRemover:{},
            TableFilterNPagination:{
                paginated:true
            }
        }
    })

    var designationFormatter = function(value){
        var names = _.map(value.split(','), function(itemId){
            return designations.collection.get(itemId).get('name');
        })
        return names.join(', ');
    }

    var departmentFormatter = function(value){
        var names = _.map(value.split(','), function(itemId){
            return departments.collection.get(itemId).get('name');
        })
        return names.join(', ');
    }

    var View = DefaultPage.View.extend({

        template: '<a href="#createUser">Create User</a> <div class="user-table"> </div>',
        afterRender: function () {
            var _this = this;
            $.when( user.userDef, departments.def, designations.def).then(function () {
                var tableWidget = new UserTable({

                    rowCollection: user.userCollection,
                    model:new Table.Model({paginated:true}),
                    columns: new Table.ColumnCollection([
                        {id: 'firstName',
                            name: 'Full Name',
                            sortable:true,
                            formatter: function () {
                                return this.get('firstName') + ' ' + this.get('lastName');
                            }
                        },
                        {id: 'designation', name: 'Designation', sortable:true, formatter: designationFormatter, sorter:function(modela, modelb){
                            var r = designationFormatter(modela.get('designation')).toString().toLowerCase()
                            var l = designationFormatter(modelb.get('designation')).toString().toLowerCase()
                            if (l === void 0) return -1;
                            if (r === void 0) return 1;
                            if(this.order === 'asc'){
                                return  l < r ? 1 : l > r ? -1 : 0;
                            }else{
                                return  l < r ? -1 : l > r ? 1 : 0;
                            }

                        }},
                        {id: 'department', name: 'Department', sortable:true, formatter: departmentFormatter, sorter:function(modela, modelb){
                            var r = departmentFormatter(modela.get('department')).toString().toLowerCase()
                            var l = departmentFormatter(modelb.get('department')).toString().toLowerCase()
                            if (l === void 0) return -1;
                            if (r === void 0) return 1;
                            if(this.order === 'asc'){
                                return  l < r ? 1 : l > r ? -1 : 0;
                            }else{
                                return  l < r ? -1 : l > r ? 1 : 0;
                            }

                        }},
                        {id: 'remove', name: '',  renderHTML:true, formatter: function () {
                            return '<a href="#remove" data-id="'+this.id+'" class="remove">x</a>';
                        }},
                        {id: 'edit', name: '',  renderHTML:true, formatter: function () {

                            return '<a href="#editUser/userId='+this.id+'">edit</a>';
                        }}
                    ])
                });

                //tableWidget.on('all', function(){console.log(arguments)});

                tableWidget.render();
                tableWidget.$el.appendTo(_this.$('.user-table'));
            });
        }
    });

    return {
        View: View
    }
})