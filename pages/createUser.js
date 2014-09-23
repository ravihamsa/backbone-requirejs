define(['pages/defaultPage', 'widgets/form', 'models/user', 'models/departments', 'models/designations', 'models/app'], function(DefaultPage, Form, user, departments,designations,  app){

    "use strict";

    var CreateUserFormView = Form.View.extend({
        onFormSubmit: function(valueObject){

            valueObject.firstName = valueObject.name.firstName;
            valueObject.lastName = valueObject.name.lastName;
            delete valueObject.name;
            console.log(valueObject);
            var def = user.userCollection.create(valueObject);
            def.done(function(){
                app.router.navigate('#page2', {trigger:true});
            });

        }
    })


    var View = DefaultPage.View.extend({
        template: 'Page 4 <div class="user-form"> </div>',
        afterRender: function(){
            var _this = this;
            $.when( user.userDef, departments.def, designations.def).then(function(){

                var elements = [{
                    id:'name',
                    label:'Name',
                    type:'name'
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
                formView.render();
                formView.$el.appendTo(_this.$('.user-form'));
            })
        }
    });

    return {
        View:View
    }
})