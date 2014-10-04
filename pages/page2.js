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

    var designationFormatter = function (value) {
        var names = _.map(value.split(','), function (itemId) {
            return designations.collection.get(itemId).get('name');
        })
        return names.join(', ');
    }

    var departmentFormatter = function (value) {
        var names = _.map(value.split(','), function (itemId) {
            return departments.collection.get(itemId).get('name');
        })
        return names.join(', ');
    }

    var BodyView = Backbone.Marionette.LayoutView.extend({
        template: Handlebars.compile('<a href="#createUser">Create User</a> <div class="user-table"> </div>'),
        regions: {
            table: '.user-table'
        },
        onShow: function () {
            var _this = this;
            $.when(user.userDef, departments.def, designations.def).then(function () {
                var tableWidget = new UserTable({

                    rowCollection: user.userCollection,
                    model: new Table.Model({paginated: true}),
                    columns: new Table.ColumnCollection([
                        {id: 'firstName',
                            name: 'Full Name',
                            sortable: true,
                            formatter: function () {
                                return this.get('firstName') + ' ' + this.get('lastName');
                            }
                        },
                        {id: 'designation', name: 'Designation', sortable: true, formatter: designationFormatter, sorter: function (modela, modelb) {
                            var r = designationFormatter(modela.get('designation')).toString().toLowerCase()
                            var l = designationFormatter(modelb.get('designation')).toString().toLowerCase()
                            if (l === void 0) return -1;
                            if (r === void 0) return 1;
                            if (this.order === 'asc') {
                                return  l < r ? 1 : l > r ? -1 : 0;
                            } else {
                                return  l < r ? -1 : l > r ? 1 : 0;
                            }

                        }},
                        {id: 'department', name: 'Department', sortable: true, formatter: departmentFormatter, sorter: function (modela, modelb) {
                            var r = departmentFormatter(modela.get('department')).toString().toLowerCase()
                            var l = departmentFormatter(modelb.get('department')).toString().toLowerCase()
                            if (l === void 0) return -1;
                            if (r === void 0) return 1;
                            if (this.order === 'asc') {
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
                    ])
                });

                tableWidget.on('all', function(){console.log(arguments)});

                _this.table.show(tableWidget);
            });

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