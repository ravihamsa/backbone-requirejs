define(['pages/defaultPage', 'widgets/form', 'models/user', 'models/departments', 'models/designations', 'models/app'], function(DefaultPage, Form, user, departments,designations,  app){

    "use strict";

    var CreateUserFormView = Form.View.extend({
        onFormSubmit: function(valueObject){
            valueObject.firstName = valueObject.name.firstName;
            valueObject.lastName = valueObject.name.lastName;
            delete valueObject.name;
            var def = user.userCollection.create(valueObject);
            def.done(function(){
                app.router.navigate('#page2', {trigger:true});
            });

        }
    })


    var View = DefaultPage.View.extend({
        template: Handlebars.compile('Page 4 <div class="user-form"> </div>'),
        regions:{
            form:'.user-form'
        },
        onShow: function(){
            var _this = this;
            $.when( user.userDef, departments.def, designations.def).then(function(){

                var elements = [{
                    id:'name',
                    label:'Name',
                    type:'name',
                    validationRules:[{
                        expr:'function',
                        func:function(value, rule){
                            return $.trim(value.firstName) !== '';
                        },
                        message:'first name cannot be empty'
                    },{
                        expr:'function',
                        func:function(value, rule){
                            return $.trim(value.lastName) !== '';
                        },
                        message:'last name cannot be empty'
                    }]
                }, {
                    id:'designation',
                    label:'Designation',
                    type:'selectList',
                    options:designations.collection.toJSON()
                }, {
                    id:'gender',
                    label:'Gender',
                    type:'select',
                    options:[{
                        id:'m',
                        name:'Male'
                    }, {
                        id:'f',
                        name:'Female'
                    }]
                }, {
                    id:'department',
                    label:'Department',
                    type:'selectList',
                    options:departments.collection.toJSON()
                }]

                var elementCollection = new Form.ElementCollection(elements);

                var formView = new CreateUserFormView({
                    collection:elementCollection
                });
                _this.form.show(formView);
            })
        }
    });

    return {
        View:View
    }
})