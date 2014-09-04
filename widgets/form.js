define(['text!./form.html', './element'], function (formTemplate, Element) {

    var FormView = Backbone.Marionette.CompositeView.extend({
        events: {
            'submit form': 'formSubmitHandler'
        },
        template: Handlebars.compile(formTemplate),
        getChildView: function () {
            return Element.View
        },
        childViewContainer: function () {
            return '.elements';
        },
        formSubmitHandler: function (e) {
            e.preventDefault();
            var valueObject = {};
            this.collection.each(function (elementModel) {
                valueObject[elementModel.id] = elementModel.get('value');
            })

            this.triggerMethod('form:submit', valueObject);
        },
        onFormSubmit: function (valueObject) {
            console.log(arguments);
        }
    });

    return {
        View: FormView,
        ElementCollection: Element.Collection
    };

});