define(['pages/defaultPage', 'widgets/form', 'models/user', 'models/app'], function(DefaultPage, Form, user, app){

    "use strict";

    var CreateUserFormView = Form.View.extend({
        onFormSubmit: function(valueObject){
            user.userCollection.create(valueObject);
        }
    })


    var View = DefaultPage.View.extend({
        template: 'Page 4 <div class="user-form"> </div>',
        afterRender: function(){
            var _this = this;
            user.userDef.done(function(){


                var elements = [{
                    id:'firstName',
                    label:'First Name',
                    type:'text'
                },{
                    id:'lastName',
                    label:'Last Name',
                    type:'text'
                }, {
                    id:'designation',
                    label:'Designation',
                    type:'text'
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