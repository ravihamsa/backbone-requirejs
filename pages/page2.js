define(['pages/defaultPage', 'widgets/table', 'models/user', 'models/departments', 'models/designations', './page2/tableFilter'], function (DefaultPage, Table, user, departments, designations, TableFilterView) {

    "use strict";




    var UserTable = Table.View.extend({
        behaviors: {
            TableSorter: {},
            TableRowRemover: {},
            TableFilterNPagination: {
                paginated: true
            }
        },
        showHeader: function(){
            var filterView = new TableFilterView({
                tableView:this
            });
            this.header.show(filterView);
        }
    })



    var UserServerSideTable = Table.ServerSideView.extend({
        behaviors: {
            TableServerSorter: {},
            TableRowRemover: {},
            TableServerFilterNPagination: {
                paginated: true
            }
        },
        showHeader: function(){
            var filterView = new TableFilterView({
                tableView:this
            });
            this.header.show(filterView);
        }
    })

    var designationFormatter = function (value) {
        var names = _.map(value, function (itemId) {
            return designations.collection.get(itemId._id).get('name');
        })
        return names.join(', ');
    }

    var departmentFormatter = function (value) {
        var names = _.map(value, function (itemId) {
            return departments.collection.get(itemId._id).get('name');
        })
        return names.join(', ');
    }

    var BodyView = Backbone.Marionette.LayoutView.extend({
        template: Handlebars.compile('<a href="#createUser">Create User</a> <div class="user-table"> </div> <div class="user-table-2"> </div>'),
        regions: {
            table: '.user-table',
            table2: '.user-table-2'
        },
        onShow: function () {
            var _this = this;

            var columnsCollection = new Table.ColumnCollection([
                {
                    id:'id',
                    type:'selectable'
                },
                {id: 'firstname',
                    name: 'Full Name',
                    sortable: true,
                    formatter: function () {
                        return this.get('firstname') + ' ' + this.get('lastname');
                    }
                },
                {id: 'designations', name: 'Designation', sortable: true, formatter: designationFormatter, sorter: function (modela, modelb) {
                    var r = designationFormatter(modela.get('designations')).toString().toLowerCase()
                    var l = designationFormatter(modelb.get('designations')).toString().toLowerCase()
                    if (l === void 0) return -1;
                    if (r === void 0) return 1;
                    if (this.sortOrder === 'asc') {
                        return  l < r ? 1 : l > r ? -1 : 0;
                    } else {
                        return  l < r ? -1 : l > r ? 1 : 0;
                    }

                }},
                {id: 'departments', name: 'Department', sortable: true, formatter: departmentFormatter, sorter: function (modela, modelb) {
                    var r = departmentFormatter(modela.get('departments')).toString().toLowerCase()
                    var l = departmentFormatter(modelb.get('departments')).toString().toLowerCase()
                    if (l === void 0) return -1;
                    if (r === void 0) return 1;
                    if (this.sortOrder === 'asc') {
                        return  l < r ? 1 : l > r ? -1 : 0;
                    } else {
                        return  l < r ? -1 : l > r ? 1 : 0;
                    }

                }},
                {id: 'remove', name: '', renderHTML: true, formatter: function () {
                    return '<a href="#remove" data-id="' + this.id + '" class="remove">x</a>';
                }},
                {id: 'edit', name: '', renderHTML: true, formatter: function () {

                    return '<a href="#editUser/userId=' + this.id + '">edit</a>';
                }}
            ]);


/*

            $.when(user.userDef, departments.def, designations.def).then(function () {
                var tableWidget = new UserTable({
                    rowCollection: user.userCollection,
                    model: new Table.Model({paginated: true}),
                    columns: columnsCollection

                });

                //tableWidget.on('all', function(){console.log(arguments)});

                _this.table.show(tableWidget);
            });*/


            $.when( departments.def, designations.def).then(function(){
                var userRowCollection = new user.PaginatedCollection();
                userRowCollection.on('change:selected', function(model, value){
                    console.log(model.cid, value, model.id)
                });
                var tableWidget2 = new UserServerSideTable({
                    rowCollection: userRowCollection,
                    model: new Table.Model({paginated: true, sortKey:'firstname'}),
                    columns: columnsCollection
                });

                _this.table2.show(tableWidget2);
            })






        }
    })

    var View = DefaultPage.View.extend({
        showBody: function () {
            this.body.show(new BodyView);
        }
    });

    return {
        View: View
    }
})