define(['pages/defaultPage', 'widgets/form', 'models/user', 'models/app'], function(DefaultPage, Form, user, app){

    "use strict";

    var EditUserFormView = Form.View.extend({
        onFormSubmit: function(valueObject){
            var userModel = user.userCollection.get(app.getPageAttribute('userId'));
            _.each(valueObject, function(value, attributeName){
                userModel.set(attributeName, value);
            })
            userModel.save(valueObject, {patch:true});
        }
    })


    var View = DefaultPage.View.extend({
        template: 'Page 4 <div class="user-form"> </div>',
        afterRender: function(){
            var _this = this;
            user.userDef.done(function(){
                var userModel = user.userCollection.get(app.getPageAttribute('userId'));

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

                _.each(elements, function(element){
                    element.value = userModel.get(element.id);
                })

                var elementCollection = new Form.ElementCollection(elements);

                var formView = new EditUserFormView({
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