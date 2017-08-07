Meteor.methods({

    inJsonArray: function(value, array, field) {

        var found = false;

        for (r in array) {

            if (array[r][field] == value) {
                found = true;
            }

        }

        return found;

    },
    addOffer: function(offer) {

        console.log(offer);

        return Offers.insert(offer);

    },
    removeOffer: function(offerId) {

        Offers.remove(offerId);

    },
    getLatestSubscribers: function(brandId) {
        return Subscribers.find({ brandId: brandId }, { sort: { date_added: -1 }, limit: 100 }).fetch();
    },
    getMode: function() {

        if (Meteor.settings.mode) {
            if (Meteor.settings.mode == 'demo') {
                return 'demo';
            } else {
                return 'live';
            }
        } else {
            return 'live';
        }

    }

});
