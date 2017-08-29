getBrandId = function() {

    if (Session.get('selectedBrand')) {

        if (Session.get('selectedBrand') == 'all') {
            return { $exists: true };
        } else {
            return Session.get('selectedBrand');
        }

    } else {
        return { $exists: true };
    }

}

getFileLink = function(fileId) {

    var fileRef = Images.findOne(fileId);

    if (fileRef.meta.bucket) {
        var path = fileRef.versions.original.meta.pipePath;
        return 'https://s3-us-west-2.amazonaws.com/' + fileRef.meta.bucket + '/' + path;
    } else {
        return fileRef.link();
    }
}

getAllStats = function(metric) {

    // Visits
    var allVisits = {
        current: 0,
        past: 0,
        variation: 0
    };

    if (metric == 'revenue') {
        var earnings = Statistics.find({ type: 'earnings' }).fetch();
        var affEarnings = Statistics.find({ type: 'affiliateEarnings' }).fetch();

        var visitStat = earnings.concat(affEarnings);
    } else {
        var visitStat = Statistics.find({ type: metric }).fetch();
    }

    // Count all
    for (i in visitStat) {
        allVisits.current += parseInt(visitStat[i].value.current);
        allVisits.past += parseInt(visitStat[i].value.past);
    }

    // Variation
    if (allVisits.past != 0) {
        allVisits.variation = ((allVisits.current - allVisits.past) / allVisits.past * 100).toFixed(2);
    } else {
        allVisits.variation = 0;
    }

    allVisits.current = convertBigNumber(allVisits.current);
    allVisits.past = convertBigNumber(allVisits.past);

    console.log('allVisits');
    console.log(allVisits);

    return allVisits;

}

convertBigNumber = function(number) {

    result = number;

    if (number > 1000 && number < 100000) {
        result = (number / 1000).toFixed(1) + 'k'
    }
    if (number > 100000) {
        result = (number / 1000).toFixed(0) + 'k'
    }

    return result;

}

isAppUser = function() {

    if (Meteor.user()) {

        if (Meteor.user().role == 'appuser' || Meteor.user().role == 'admin') {
            return true;
        }
    }
}

setDiscount = function(query) {

    if (query.discount) {

        // Get code
        if (Discounts.findOne({ code: query.discount })) {
            var discount = Discounts.findOne({ code: query.discount });

            if (discount.expiryDate) {

                // Check if expired 
                var currentDate = new Date();
                var expiryDate = new Date(discount.expiryDate);
                if (currentDate.getTime() < expiryDate.getTime()) {
                    Session.setTemp('usingDiscount', discount);
                }

            } else {
                Session.setTemp('usingDiscount', discount);
            }

        }

    }

}

// getSessionData = function(parameters) {

//     // Insert session
//     session = {
//         date: new Date(),
//         type: parameters.type,
//         country: Session.get('countryCode'),
//         userId: Session.get('sellerId')
//     };

//     if (parameters.productId) {
//         session.productId = parameters.productId;
//     }

//     // Mobile or Desktop
//     if (/Mobi/.test(navigator.userAgent)) {
//         session.browser = 'mobile';
//     } else {
//         session.browser = 'desktop';
//     }

//     // Origin & medium
//     if (Session.get('origin')) {
//         session.origin = Session.get('origin');
//     } else {
//         session.origin = 'organic';
//     }
//     if (Session.get('medium')) {
//         session.medium = Session.get('medium');
//     }

//     return session;

// }

computePrice = function(price) {

    console.log('Price: ');
    console.log(price);

    // if (price[Session.get('currency')]) {
    //     return price[Session.get('currency')];
    // } else {

    //     var rates = Metas.findOne({ type: 'rates' }).value;

    //     var finalPrice = price.EUR * rates[Session.get('currency')];

    //     return parseFloat(finalPrice.toFixed(0) + '.99');
    // }

    return price;

}

getPlanPrice = function(planDetails) {

    var planPrice = {};
    planPrice[planDetails.currencyIsoCode] = planDetails.price;
    planPrice['EUR'] = planDetails.price;

    console.log('Plan price:');
    console.log(planPrice);

    return planPrice;

}

getBasePrice = function(item) {

    console.log('Item: ');
    console.log(item);

    if (item.price) {
        var price = computePrice(item.price);
    } else if (Session.get('planDetails')) {

        var planPrice = getPlanPrice(Session.get('planDetails'));

        var price = computePrice(planPrice);
    }

    // Apply discount
    price = applyDiscount(price, item._id);

    // Calculate base price
    price = getPriceWithoutTax(price);

    return price.toFixed(2);

}

getPriceWithoutTax = function(price) {

    if (Session.get('useTaxes') == true) {
        price = price * (1 - Session.get('tax') / 100);
    }
    return price;
}

applyDiscount = function(price, productId) {

    if (Session.get('usingDiscount')) {

        var discount = Session.get('usingDiscount');
        discounted = true;

        if (typeof productId !== 'undefined') {
            if (discount.productId) {
                if (discount.productId != productId) {
                    discounted = false;
                }
            }

        }

        if (discounted == true) {
            if (discount.type == 'amount') {
                price = price - parseFloat(Session.get('usingDiscount').amount);
            } else {
                price = price * (1 - parseFloat(Session.get('usingDiscount').amount) / 100);
            }
        }

    }

    return price;

}

showExitIntent = function(event, location, type) {

    // Exit intent
    if (Metas.findOne({ type: location + 'ExitIntent', userId: Session.get('sellerId') })) {

        if (Metas.findOne({ type: location + 'ExitIntent', userId: Session.get('sellerId') }).value == true) {

            if (location == 'cart') {
                location = 'checkout';
            }

            if (event.pageY < 10 && Session.get(location + 'ExitIntent') == 'armed') {

                Session.set(location + 'ExitIntent', 'fired');

                if (type == 'offer') {
                    $('#offer-modal').modal('show');
                }

                if (type == 'help') {
                    $('#help-modal').modal('show');
                }

            }
        }

    }

}

showMobileExitIntent = function(percent, location, type) {

    // Exit intent
    if (Metas.findOne({ type: location + 'ExitIntent', userId: Session.get('sellerId') })) {

        if (Metas.findOne({ type: location + 'ExitIntent', userId: Session.get('sellerId') }).value == true) {

            console.log('Checking exit intent');
            console.log('Percent: ' + percent);
            console.log('Location: ' + location);
            console.log('Type: ' + type);

            if (percent > 50) {
                Session.set('scrollTrigger', true);
            }

            if (location == 'cart') {
                location = 'checkout';
            }

            if (Session.get('scrollTrigger') == true && percent < 45 && Session.get(location + 'ExitIntent') == 'armed') {
                // if (Session.get('scrollTrigger') == true && percent < 45) {

                Session.set(location + 'ExitIntent', 'fired');

                if (type == 'offer') {
                    $('#offer-modal').modal('show');
                } else if (type == 'help') {
                    $('#help-modal').modal('show');
                }
            }


        }

    }

}