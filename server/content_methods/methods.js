import Images from '/lib/images.collection.js';

Meteor.methods({

    getTimezone: function(headers) {

        // Find IP
        if (headers['cf-connecting-ip']) {
            ip = headers['cf-connecting-ip'];
        } else {
            ip = headers['x-forwarded-for'];
        }

        var answer = HTTP.get('http://ip-api.com/json/' + ip);

        if (answer.data.timezone) {
            return answer.data.timezone;
        } else {
            return 'Europe/Paris';
        }

    },
    autoUpdatePage: function(page) {

        console.log(page);

    },
    removeTripwireVideo: function(pageId) {

        Pages.update(pageId, { $unset: { 'header.video': "" } });
        Pages.update(pageId, { $set: { cached: false } });

        console.log(Pages.findOne(pageId));

    },
    convertSessions: function() {

        var sessions = Sessions.find({}).fetch();

        for (i in sessions) {
            var newDate = new Date(sessions[i].date);
            Sessions.update(sessions[i]._id, { $set: { date: newDate } });
            console.log(Sessions.findOne(sessions[i]._id));
        }

    },
    // getSessions: function(pageId, type) {

    //     var now = new Date();
    //     var limitDate = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30);

    //     return Sessions.aggregate(
    //         [
    //             { $match: { date: { $gte: limitDate }, pageId: pageId, type: type } }, {
    //                 $group: {
    //                     _id: {
    //                         "year": {
    //                             "$substr": ["$date", 0, 4]
    //                         },
    //                         "month": {
    //                             "$substr": ["$date", 5, 2]
    //                         },
    //                         "day": {
    //                             "$substr": ["$date", 8, 2]
    //                         }
    //                     },
    //                     count: { $sum: 1 }
    //                 }
    //             }
    //         ]);

    // },
    // getGraphSessions: function(pageId, type) {

    //     var sessions = Meteor.call('getSessions', pageId, type);

    //     data = [];

    //     for (i in sessions) {

    //         dataPoint = {};

    //         dataPoint.y = parseInt(sessions[i].count);
    //         var date = sessions[i]._id.year + '-' + sessions[i]._id.month + '-' + sessions[i]._id.day;
    //         dataPoint.x = new Date(date);

    //         data.push(dataPoint);

    //     }

    //     // Sort
    //     data.sort(date_sort);

    //     return data;

    // },
    // getGraphData: function(pageId, type) {

    //     var visits = Meteor.call('getGraphSessions', pageId, 'visit');
    //     var clicks = Meteor.call('getGraphSessions', pageId, 'click');

    //     console.log(visits);

    //     // // Adjust clicks on visits
    //     // for (i in visits.dates) {

    //     //     if (clicks.dates[i]) {
    //     //         if (visits.dates[i].getTime() != clicks.dates[i].getTime()) {
    //     //             console.log('Splicing');
    //     //             clicks.dates.splice(i, 0, visits.dates[i]);
    //     //             clicks.values.splice(i, 0, 0);
    //     //         }
    //     //     } else {

    //     //         console.log('Adding missing value');
    //     //         clicks.dates.push(visits.dates[i]);
    //     //         clicks.values.push(0);

    //     //     }

    //     // }

    //     if (type == 'conversion') {

    //         var conversions = [];

    //         for (i in visits) {

    //             for (j in clicks) {

    //                 if (clicks[j].x.getTime() == visits[i].x.getTime()) {

    //                     dataPoint = {
    //                         y: (clicks[j].y / visits[i].y * 100).toFixed(2),
    //                         x: clicks[j].x
    //                     }
    //                     conversions.push(dataPoint);

    //                 }
    //             }

    //         }

    //         conversions.sort(date_sort);

    //         var data = {
    //             labels: visits.dates,
    //             datasets: [{
    //                 label: "Conversions",
    //                 fill: false,
    //                 lineTension: 0.1,
    //                 backgroundColor: "orange",
    //                 borderColor: "orange",
    //                 borderCapStyle: 'butt',
    //                 borderDash: [],
    //                 borderDashOffset: 0.0,
    //                 borderJoinStyle: 'miter',
    //                 pointBorderColor: "orange",
    //                 pointBackgroundColor: "#fff",
    //                 pointBorderWidth: 1,
    //                 pointHoverRadius: 5,
    //                 pointHoverBackgroundColor: "orange",
    //                 pointHoverBorderColor: "orange",
    //                 pointHoverBorderWidth: 2,
    //                 pointRadius: 1,
    //                 pointHitRadius: 10,
    //                 data: conversions,
    //                 spanGaps: false,
    //             }]
    //         }
    //     }

    //     if (type == 'trend') {

    //         var data = {
    //             datasets: [{
    //                 label: 'Sessions',
    //                 fill: false,
    //                 data: visits,
    //                 pointHoverBackgroundColor: "darkblue",
    //                 pointHoverBorderColor: "darkblue",
    //                 pointBorderColor: "darkblue",
    //                 backgroundColor: "darkblue",
    //                 borderColor: "darkblue"
    //             }, {
    //                 label: 'Clicks',
    //                 fill: false,
    //                 data: clicks,
    //                 pointHoverBackgroundColor: "red",
    //                 pointHoverBorderColor: "red",
    //                 pointBorderColor: "red",
    //                 backgroundColor: "red",
    //                 borderColor: "red"
    //             }]
    //         };
    //     }

    //     return data;

    // },

    getUSDLocations: function() {

        return ['US', 'CA', 'AU', 'NZ'];

    },
    getDiscount: function(code, brandId) {

        // Get brand
        var brand = Brands.findOne(brandId);

        // Get integration
        if (Integrations.findOne(brand.cartId)) {

            var integration = Integrations.findOne(brand.cartId);

            // Get lists
            var url = "https://" + integration.url + "/api/discounts/" + code + "?key=" + integration.key;

            try {
                var answer = HTTP.get(url);
                return answer.data;
            } catch (e) {
                return {};
            }

        }

    },

    getBrandPages: function(brandId) {

        return Pages.find({ brandId: brandId }).fetch();

    },

    redirectCheckout: function(pageId) {

        // Get page
        var page = Pages.findOne(pageId);

        // Get brand
        var brand = Brands.findOne(page.brandId);

        // Get integration
        var integration = Integrations.findOne(brand.cartId);

        return 'https://' + integration.url + '?product_id=' + page.productId;

    },
    getCartIntegrations: function() {

        return Integrations.find({ type: 'purecart' }).fetch();

    },

    optIn: function(data, integration) {

        // Make request
        var answer = HTTP.post("https://" + integration.url + "/subscribe", { data: data });

        // Redirect
        return answer.headers.location;

    },
    getFacebookPixel: function() {
        return Metas.findOne({ type: 'pixelId' }).value;
    }
});

function date_sort(a, b) {
    return new Date(a.x).getTime() - new Date(b.x).getTime();
}