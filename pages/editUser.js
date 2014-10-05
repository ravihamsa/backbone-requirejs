define(['pages/defaultPage', 'widgets/form', 'models/user', 'models/departments', 'models/designations', 'models/app'], function(DefaultPage, Form, user, departments,designations,app){

    "use strict";

    var EditUserFormView = Form.View.extend({
        onFormSubmit: function(valueObject){
            var userModel = user.userCollection.get(app.getPageAttribute('userId'));
            _.each(valueObject, function(value, attributeName){
                userModel.set(attributeName, value);
            })
            var def = userModel.save(valueObject, {patch:true});
            def.done(function(){
                app.router.navigate('#page2', {trigger:true});
            })
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

                var userModel = user.userCollection.get(app.getPageAttribute('userId'));

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

                _.each(elements, function(item){
                    if(item.id === 'name'){
                        item.value = {
                            firstName:userModel.get('firstName'),
                            lastName:userModel.get('lastName')
                        }

                    }else{
                        item.value = userModel.get(item.id);
                    }

                });

                var elementCollection = new Form.ElementCollection(elements);

                var formView = new EditUserFormView({
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