define(['text!./form.html', './element', './customElements'], function (formTemplate, Element, customElements) {

    var FormView = Backbone.Marionette.CompositeView.extend({
        events: {
            'submit form': 'formSubmitHandler'
        },
        template: Handlebars.compile(formTemplate),
        getChildView: function (model) {
            var elementType = model.get('type');
            return customElements[elementType] || Element.View;
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