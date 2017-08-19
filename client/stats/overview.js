Template.overview.helpers({

    brands: function() {

        return Brands.find({});
    },
    allVisits: function() {

        return getAllStats('visit');

    },
    allSubscribers: function() {

        return getAllStats('subscribed');

    },
    allRevenue: function() {

        return getAllStats('revenue');

    }

});