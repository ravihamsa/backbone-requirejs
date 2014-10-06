define(['text!./element.html', './validator'], function (elementTemplate, validator) {


    var View = Backbone.Marionette.ItemView.extend({
        events: {
            'keyup .js-update-keyup': 'updateAndValidateValue',
            'change .js-update-change': 'updateAndValidateValue',
            'blur .js-update-blur': 'updateAndValidateValue'
        },
        modelEvents: {
            'change:isValid': 'isValidChangeHandler',
            'change:errorCode': 'errorCodeChangeHandler'
        },
        template: Handlebars.compile(elementTemplate),
        updateValue: function () {
            var value = this.$('.js-update-change').val();
            this.model.set('value', value);
        },
        updateAndValidateValue: function () {
            this.updateValue();
            var _this = this;
            if(!this.model.get('dirty')){
                setTimeout(function(){
                    _this.setDirty();
                    _this.model.validateValue();
                },10)
            }else{
                _this.model.validateValue();
            }


            //this.model.validateValue();
        },
        setDirty: function(){
            var activeContainer = $(document.activeElement).parents('.element-container')[0];
            //console.log(this.$el, document.activeElement, this.$el.has(document.activeElement)[0], $(document.activeElement).has(this.el)[0]);
            if(activeContainer && (activeContainer == this.el)){
                return false;
            }else{
                this.model.set('dirty', true);
            }
        },
        postRenderElement: function () {

        },
        onRender: function () {
            this.postRenderElement();
            var value = this.model.get('value');
            if (value !== undefined && value !== null) {
                this.readValueFromModel(value);
            } else {
                this.handleNoValue();
            }
            this.updateValue();
        },
        readValueFromModel: function () {
            //does nothing here if handled by template;
        },
        handleNoValue: function () {

        },
        isValidChangeHandler: function () {
            this.$el.toggleClass('valid', this.model.get('isValid'));
        },
        errorCodeChangeHandler: function () {
            this.$('.error-text').html(this.model.get('errorCode'));
        },
        className:'element-container'
    });

    var Model = Backbone.Model.extend({
        defaults: {
            value: null,
            valid: true,
            active: true,
            dirty:false
        },
        validateValue: function (skipShowErrors) {
            var validationRules = this.get('validationRules');
            var errors = [];
            if (!this.get('active') || !this.get('dirty')) {
                return [];
            }


            var errorRule;
            var isValid = _.every(validationRules, function (rule) {
                var isValidForRule = validator.validationRuleMethods[rule.expr].call(this, rule, this.get('value'));
                if (!isValidForRule) {
                    errors.push(rule);
                    errorRule = rule;
                }
                return isValidForRule;
            }, this);
            this.set('valid', isValid);
            if (!skipShowErrors) {
                if (errorRule) {
                    var message = errorRule.message || ('error.' + errorRule.expr);
                    this.set('errorCode', message);
                } else {
                    this.set('errorCode', '');
                }
            }
            return errors;
        }
    });

    var Collection = Backbone.Collection.extend({
        model: Model
    })

    return {
        View: View,
        Model: Model,
        Collection: Collection
    };

});