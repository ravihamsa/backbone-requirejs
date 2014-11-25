define(function(){
    var templateIndex = {
        'selectable.item':'<a href="#select" data-id="{{id}}" class="js-action">' +
            '{{#if showIcon}} <em class="icon"></em> {{/if}} {{name}}</a>',
        'single.select.summary': '{{summary}}',
        'multi.select.summary': '{{selectedCount}} {{summary}}'
    }
    _.each(templateIndex, function(template, templateName){
        templateIndex[templateName] = Handlebars.compile(template);
    });

    Handlebars.registerHelper('stringify', function(){
        return JSON.stringify(this);
    })

    Marionette.templateLookup = function(key) {
        return templateIndex[key];
    };

});