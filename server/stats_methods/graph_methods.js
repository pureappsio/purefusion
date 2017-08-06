Meteor.methods({

    getGraphSessions: function(type) {

        var sessions = Meteor.call('getSessions', type);

        data = [];

        for (i in sessions) {

            dataPoint = {}

            dataPoint.y = parseInt(sessions[i].count);
            var date = sessions[i]._id.year + '-' + sessions[i]._id.month + '-' + sessions[i]._id.day;
            dataPoint.x = new Date(date);

            data.push(dataPoint);

        }

        // Sort
        data.sort(date_sort);

        return data;

    },
    getGraphData: function(type) {

        var sessions = Statistics.findOne({ type: type }).value;

        if (type == 'visit') {

            var data = {
                datasets: [{
                    label: 'Views',
                    fill: false,
                    data: sessions,
                    pointHoverBackgroundColor: "darkblue",
                    pointHoverBorderColor: "darkblue",
                    pointBorderColor: "darkblue",
                    backgroundColor: "darkblue",
                    borderColor: "darkblue"
                }]
            };
        }

        if (type == 'subscribe') {

            var data = {
                datasets: [{
                    label: 'List Subscriptions',
                    fill: false,
                    data: sessions,
                    pointHoverBackgroundColor: "red",
                    pointHoverBorderColor: "red",
                    pointBorderColor: "red",
                    backgroundColor: "red",
                    borderColor: "red"
                }]
            };
        }

        if (type == 'affiliateClick') {

            var affiliateEarnings = Statistics.findOne({ type: 'amazonEarnings' }).value;

            var data = {
                datasets: [{
                    label: 'Affiliate Clicks',
                    fill: false,
                    data: sessions,
                    yAxisID: 'A',
                    pointHoverBackgroundColor: "orange",
                    pointHoverBorderColor: "orange",
                    pointBorderColor: "orange",
                    backgroundColor: "orange",
                    borderColor: "orange"
                }, {
                    label: 'Affiliate Earnings',
                    fill: false,
                    data: affiliateEarnings,
                    yAxisID: 'B',
                    pointHoverBackgroundColor: "red",
                    pointHoverBorderColor: "red",
                    pointBorderColor: "red",
                    backgroundColor: "red",
                    borderColor: "red"
                }]
            };
        }

        return data;

    },
    getConvGraphData: function(type) {

        var data = Statistics.findOne({ type: type + 'Conv' }).value;

        var socialColors = [
            "#27DE55",
            "#e52d27",
            "#3b5998",
            "#4099FF"
        ];

        var data = {
            labels: [
                "Organic",
                "Youtube",
                "Facebook",
                "Twitter"
            ],
            datasets: [{
                label: 'Conversions',
                data: data,
                backgroundColor: socialColors,
                hoverBackgroundColor: socialColors
            }]
        };
        console.log(data.datasets);

        return data;

    },
    getTagsGraphData: function() {

        var tags = Statistics.findOne({ type: 'bestTags' }).value;

        var tagsNames = [];
        var tagsVisits = [];
        var colors = [];

        for (i in tags) {
            colors.push(Meteor.call('getRandomColor'));
            tagsNames.push(tags[i].name);
            tagsVisits.push(tags[i].visits);
        }

        var data = {
            labels: tagsNames,
            datasets: [{
                label: 'Visits',
                data: tagsVisits,
                backgroundColor: colors,
                hoverBackgroundColor: colors
            }]
        };

        return data;

    },
    getCategoryGraphData: function() {

        var categories = Statistics.findOne({ type: 'bestCategories' }).value;
        console.log(categories);

        var categoriesNames = [];
        var categoriesVisits = [];
        var colors = [];

        for (i in categories) {
            colors.push(Meteor.call('getRandomColor'));
            categoriesNames.push(categories[i].name);
            categoriesVisits.push(categories[i].visits);
        }

        var data = {
            labels: categoriesNames,
            datasets: [{
                label: 'Visits',
                data: categoriesVisits,
                backgroundColor: colors,
                hoverBackgroundColor: colors
            }]
        };

        console.log(categoriesNames);
        console.log(categoriesVisits);

        return data;

    },
    getSocialGraphData: function() {

        // Get sessions
        var facebook = Statistics.findOne({ type: 'facebook' }).value;
        var youtube = Statistics.findOne({ type: 'youtube' }).value;
        var twitter = Statistics.findOne({ type: 'twitter' }).value;
        var pinterest = Statistics.findOne({ type: 'pinterest' }).value;
        var instagram = Statistics.findOne({ type: 'instagram' }).value;

        var socialColors = [
            "#e52d27",
            "#3b5998",
            "#4099FF",
            "#bd081b",
            "#885a4d"
        ];

        var data = {
            labels: [
                "Youtube",
                "Facebook",
                "Twitter",
                "Pinterest",
                "Instagram"
            ],
            datasets: [{
                label: 'Social Visits',
                data: [youtube, facebook, twitter, pinterest, instagram],
                backgroundColor: socialColors,
                hoverBackgroundColor: socialColors
            }]
        };
        // console.log(data.datasets);

        return data;


    },
    getCountryGraph: function() {

        var countries = Statistics.findOne({ type: 'countries' }).value;
        var countriesSessions = Statistics.findOne({ type: 'countriesSessions' }).value;

        var data = {
            labels: countries,
            datasets: [{
                label: 'Visits by Country',
                data: countriesSessions,
                backgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#36A2EB",
                    "#FFCE56"
                ],
                hoverBackgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#36A2EB",
                    "#FFCE56"
                ]
            }]
        };

        return data;

    },
    getConvCountryData: function(type) {

        // Limit
        var now = new Date();
        var limitDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Countries
        var countries = [];
        for (i in sessions) {
            if (countries.indexOf(sessions[i].country) == -1) {
                countries.push(sessions[i].country);
            }
        }

        var socialColors = [
            "#27DE55",
            "#e52d27",
            "#3b5998",
            "#4099FF"
        ];

        var data = {
            labels: [
                "Organic",
                "Youtube",
                "Facebook",
                "Twitter"
            ],
            datasets: [{
                label: 'Conversions',
                data: [organic, youtube, facebook, twitter],
                backgroundColor: socialColors,
                hoverBackgroundColor: socialColors
            }]
        };
        console.log(data.datasets);

        return data;

    },
    getOriginGraphData: function() {

        // Get sessions
        var social = Statistics.findOne({ type: 'social' }).value;
        var ads = Statistics.findOne({ type: 'ads' }).value;
        var organic = Statistics.findOne({ type: 'organic' }).value;

        var data = {
            labels: [
                "Organic",
                "Social",
                "Ads"
            ],
            datasets: [{
                data: [organic, social, ads],
                backgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56"
                ],
                hoverBackgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56"
                ]
            }]
        };

        return data;

    },
    getBoxGraphData: function() {

        var bestBoxes = Statistics.findOne({ type: 'bestBoxes' }).value;

        var boxesName = [];
        var boxesConversions = [];

        for (i in bestBoxes) {
            boxesName.push(bestBoxes[i].title);
            boxesConversions.push(bestBoxes[i].conversion);
        }

        var data = {
            labels: boxesName,
            datasets: [{
                label: 'Most Converting Boxes',
                data: boxesConversions,
                backgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#36A2EB",
                    "#FFCE56"
                ],
                hoverBackgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#36A2EB",
                    "#FFCE56"
                ]
            }]
        };

        return data;

    }

})

function date_sort(a, b) {
    return new Date(a.x).getTime() - new Date(b.x).getTime();
}