Template.registerHelper("selectedBrand", function() {
    return Session.get('selectedBrand');
});

Template.registerHelper("adminUser", function() {
    return Meteor.user()._id
});

Template.registerHelper("getMeta", function(meta) {
    return Metas.findOne({ type: meta, userId: Meteor.user()._id }).value;
});

Template.registerHelper("isTheme", function(theme) {

    var brand = Brands.findOne(Session.get('selectedBrand'));

    if (brand.teaching.coursesTheme == theme) {
        return true;
    }

});

Template.registerHelper("langEN", function() {

    var brand = Brands.findOne(Session.get('selectedBrand'));

    if (brand.language == 'en') {
        return true;
    } else {
        return false;
    }

});

Template.registerHelper("isAdmin", function() {

    if (Session.get('preview')) {
        return false;

    } else {
        if (Meteor.user()) {

            if (Meteor.user().role == 'admin') {
                return true;
            }
        }
    }

});

Template.registerHelper("isAppUser", function() {

    if (Session.get('preview')) {
        return false;

    } else {
        if (Meteor.user()) {

            if (Meteor.user().role == 'appuser' || Meteor.user().role == 'admin') {
                return true;
            }
        }
    }

});

Template.registerHelper("formatDate", function(date) {
    return moment(date).format('MMMM Do YYYY, h:mm:ss a');
});

Template.registerHelper("variationColor", function(variation) {
    variation = parseInt(variation);
    if (variation > 0) {
        return 'green';
    } else {
        return 'red';
    }
});
Template.registerHelper("variationDirection", function(variation) {
    variation = parseInt(variation);
    if (variation > 0) {
        return 'up';
    } else {
        return 'down';
    }
});

Template.registerHelper("startCurrency", function() {

    if (Session.get('currency')) {

        if (Session.get('currency') == 'USD') {
            return '$';
        }
        if (Session.get('currency') == 'GBP') {
            return '£';
        }

    } else {
        return '$';
    }

});

Template.registerHelper("getDiscountPrice", function(price, location, productId) {

    // Rates
    var rates = Metas.findOne({ type: 'rates' }).value;

    // Brand
    var brand = Brands.findOne(Session.get('selectedBrand'));

    // If currency is defined
    if (Session.get('currency')) {

        // Price
        if (Session.get('currency') == brand.store.baseCurrency) {
            var currencyPrice = price;
        } else if (brand.store.baseCurrency == 'EUR') {
            var currencyPrice = price * rates[Session.get('currency')];
        }
        else {

            // Get EUR price
            var eurPrice = price / rates[brand.store.baseCurrency];
            var currencyPrice = price * rates[Session.get('currency')];

        }

        // Discount
        if (Session.get('usingDiscount')) {

            var discount = Session.get('usingDiscount');
            var discounted = true;

            if (discount.productId) {

                if (discount.productId != productId) {
                    discounted = false;
                }

            }

            if (discounted == true) {
                if (discount.type == 'amount') {
                    currencyPrice = currencyPrice - parseFloat(Session.get('usingDiscount').amount);
                } else {
                    currencyPrice = currencyPrice * (1 - parseFloat(Session.get('usingDiscount').amount) / 100);
                }
            }

        }

        if (Session.get('currency') == brand.store.baseCurrency) {
            return currencyPrice.toFixed(2);
        }
        else {
            if (currencyPrice == 0) {
                return 0;
            }
            else {
                return currencyPrice.toFixed(0) + '.99';
            }
            
        }

    } else {

        // Price
        var finalPrice = price;

        // Discount
        if (Session.get('usingDiscount')) {
            if (discount.type == 'amount') {
                finalPrice = finalPrice - parseFloat(Session.get('usingDiscount').amount);
            } else {
                finalPrice = finalPrice * (1 - parseFloat(Session.get('usingDiscount').amount) / 100);
            }

        }

        return finalPrice.toFixed(2);

    }

});


Template.registerHelper("getPrice", function(price) {

    // Brand
    var brand = Brands.findOne(Session.get('selectedBrand'));

    // Rates
    var rates = Metas.findOne({ type: 'rates' }).value;

    if (Session.get('currency')) {

        // Price
        if (Session.get('currency') == brand.store.baseCurrency) {
            var currencyPrice = price;
        } else if (brand.store.baseCurrency == 'EUR') {
            var currencyPrice = price * rates[Session.get('currency')];
        }
        else {

            // Get EUR price
            var eurPrice = price / rates[brand.store.baseCurrency];
            var currencyPrice = price * rates[Session.get('currency')];

        }

        if (Session.get('currency') == brand.store.baseCurrency) {
            return currencyPrice.toFixed(2);
        }
        else {
            if (currencyPrice == 0) {
                return 0;
            }
            else {
                return currencyPrice.toFixed(0) + '.99';
            }
            
        }

    } else {
        return price.toFixed(2);
    }

});

Template.registerHelper("endCurrency", function() {

    if (Session.get('currency')) {

        if (Session.get('currency') == 'EUR') {
            return ' €';
        }

    }

});