define(function(){

    Handlebars.registerHelper('stringify', function (val1) {
        return JSON.stringify(val1);
    });


    Handlebars.registerHelper('ifEqual', function (val1, val2, obj) {

        if (val1 === val2) {
            return obj.fn(this);
        }
        else if (obj.inverse) {
            return obj.inverse(this);
        }
    });
    Handlebars.registerHelper('isTrue', function (val1, obj) {

        if (val1 === true) {
            return obj.fn(this);
        }
        else if (obj.inverse) {
            return obj.inverse(this);
        }
    });

    Handlebars.registerHelper('isNotTrue', function (val1, obj) {

        if (val1 !== true) {
            return obj.fn(this);
        }
        else if (obj.inverse) {
            return obj.inverse(this);
        }
    });
})