define(['pages/defaultPage', 'widgets/form', 'models/user', 'models/app'], function(DefaultPage, Form, user, app){

    "use strict";

    var CreateUserFormView = Form.View.extend({
        onFormSubmit: function(valueObject){

            valueObject.firstName = valueObject.name.firstName;
            valueObject.lastName = valueObject.name.lastName;
            delete valueObject.name;
            console.log(valueObject);
            //user.userCollection.create(valueObject);
            //app.router.navigate('#page2', {trigger:true});
        }
    })


    var View = DefaultPage.View.extend({
        template: 'Page 4 <div class="user-form"> </div>',
        afterRender: function(){
            var _this = this;
            user.userDef.done(function(){

                var elements = [{
                    id:'name',
                    label:'Name',
                    type:'name'
                }, {
                    id:'designation',
                    label:'Designation',
                    type:'text'
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
                    options:[{
                        id:'dep1',
                        name:'Department1'
                    }, {
                        id:'dep2',
                        name:'Department2'
                    }, {
                        id:'dep3',
                        name:'Department3'
                    }, {
                        id:'dep4',
                        name:'Department4'
                    }, {
                        id:'dep5',
                        name:'Department5'
                    }, {
                        id:'dep6',
                        name:'Department6'
                    }, {
                        id:'dep7',
                        name:'Department7'
                    }]
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