Template.stats.helpers({

    visitsVariation: function() {

        var visitStat = Statistics.findOne({ type: 'visit', brandId: getBrandId() }).value;
        console.log(visitStat);

        var variation = visitStat.variation;

        variation = parseInt(variation);
        if (variation > 999) {
            variation = 999;
        }
        return variation.toFixed(0) + '%';

    },
    allVisits: function() {

        var visitStat = Statistics.findOne({ type: 'visit', brandId: getBrandId() }).value;
        var visits = visitStat.current;

        visits = parseInt(visits);

        if (visits > 1000 && visits < 100000) {
            visits = (visits / 1000).toFixed(1) + 'k'
        }
        if (visits > 100000) {
            visits = (visits / 1000).toFixed(0) + 'k'
        }

        return visits;
    },
    liveVisitors: function() {

        return Visitors.find({ brandId: getBrandId(), date: { $gte: Session.get("limitDate") } }).count();

    },
    mobile: function() {
        return (Statistics.findOne({ brandId: getBrandId(), type: 'visitmobile' }).value.current / Statistics.findOne({ brandId: getBrandId(), type: 'visit' }).value.current * 100).toFixed(1) + '%';
    },
    affEarnings: function() {

        return '$' + (Statistics.findOne({ brandId: getBrandId(), type: 'totalAmazonEarnings' }).value).toFixed(2);

    },
    areAffiliates: function() {

        var affiliates = Statistics.findOne({ brandId: getBrandId(), type: 'affiliateClick' }).value.current;

        if (affiliates > 0) {
            return true;
        }

    },
    areSales: function() {

        if (Sales.findOne({ brandId: getBrandId() })) {
            return true;
        }

    },
    sales: function() {

        return '$' + Statistics.findOne({ brandId: getBrandId(), type: 'sales' }).value;

    },
    areConversions: function() {

        if (Subscribers.findOne({ brandId: getBrandId() })) {
            return true;
        }

    },
    listConversions: function() {

        return (Statistics.findOne({ brandId: getBrandId(), type: 'subscribed' }).value.current / Statistics.findOne({ brandId: getBrandId(), type: 'visit' }).value.current * 100).toFixed(1) + '%';

    },
    subscribers: function() {

        return Statistics.findOne({ brandId: getBrandId(), type: 'subscribed' }).value.current;

    },
    subscribersVariation: function() {

        return Statistics.findOne({ brandId: getBrandId(), type: 'subscribed' }).value.variation + '%';

    },
    podcastEpisodes: function() {
        return Posts.find({ brandId: getBrandId(), podcastFileId: { $exists: true } })
    },
    arePodcasts: function() {
        if (Posts.findOne({ brandId: getBrandId(), podcastFileId: { $exists: true } })) {
            return true;
        } else {
            return false;
        }
    },
    postsWithBox: function() {

        return Statistics.findOne({ brandId: getBrandId(), type: 'convertingPosts' }).value;

    },
    affiliatePosts: function() {

        return Statistics.findOne({ brandId: getBrandId(), type: 'affiliatePosts' }).value;

    },
    postsEarnings: function() {

        var posts = Statistics.findOne({ brandId: getBrandId(), type: 'postsEarnings' }).value;
        return posts.slice(0, 7);

    },
    posts: function() {

        return (Statistics.findOne({ brandId: getBrandId(), type: 'visitedPosts' }).value).slice(0, 7);

    },
    pages: function() {

        return (Statistics.findOne({ brandId: getBrandId(), type: 'visitedPages' }).value).slice(0, 7);

    },
    postsShared: function() {
        return Posts.find({ socialShare: { $exists: true } }, { sort: { socialShare: -1 } });
    }

});

Template.stats.onRendered(function() {

    Session.set("limitDate", new Date(new Date().getTime() - 60 * 1000));
    Meteor.setInterval(function() {
        Session.set("limitDate", new Date(new Date().getTime() - 60 * 1000));
    }, 10000);

    Meteor.call('getGraphData', 'visit', Session.get('selectedBrand'), function(err, graphData) {

        var ctx = document.getElementById("views-chart");

        var myLineChart = new Chart(ctx, {
            type: 'line',
            data: graphData,
            options: {
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            unit: 'day'
                        }
                    }]
                }
            }
        });

    });

    Meteor.call('getGraphData', 'affiliateClick', Session.get('selectedBrand'), function(err, graphData) {

        var affChart = document.getElementById("affiliate-chart");
        console.log(graphData);

        var myAffChart = new Chart(affChart, {
            type: 'line',
            data: graphData,
            options: {
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            unit: 'day'
                        }
                    }],
                    yAxes: [{
                        id: 'A',
                        type: 'linear',
                        position: 'left',
                    }, {
                        id: 'B',
                        type: 'linear',
                        position: 'right'
                    }]
                }
            }
        });

    });

    Meteor.call('getGraphData', 'subscribed', Session.get('selectedBrand'), function(err, graphData) {

        var subChart = document.getElementById("subscribed-chart");

        var myLineChart = new Chart(subChart, {
            type: 'line',
            data: graphData,
            options: {
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            unit: 'day'
                        }
                    }]
                }
            }
        });

    });

    Meteor.call('getOriginGraphData', Session.get('selectedBrand'), function(err, graphData) {

        var ctx = document.getElementById("origin-chart");

        var myPieChart = new Chart(ctx, {
            type: 'pie',
            data: graphData,
            options: {
                title: {
                    display: true,
                    text: 'Visits by Origin'
                }
            }
        });

    });

    Meteor.call('getSocialGraphData',Session.get('selectedBrand'), function(err, graphData) {

        var socialChart = document.getElementById("social-chart");

        var myPieChart = new Chart(socialChart, {
            type: 'bar',
            data: graphData,
            options: {
                title: {
                    display: true,
                    text: 'Social Visits'
                }
            }
        });

    });

    Meteor.call('getCategoryGraphData',Session.get('selectedBrand'), function(err, graphData) {

        var categoryChart = document.getElementById("category-chart");

        var myPieChart = new Chart(categoryChart, {
            type: 'bar',
            data: graphData,
            options: {
                title: {
                    display: true,
                    text: 'Visits by Categories'
                }
            }
        });

    });

    Meteor.call('getTagsGraphData',Session.get('selectedBrand'), function(err, graphData) {

        var tagsChart = document.getElementById("tags-chart");

        var myPieChart = new Chart(tagsChart, {
            type: 'bar',
            data: graphData,
            options: {
                title: {
                    display: true,
                    text: 'Visits by Tags'
                }
            }
        });

    });

    Meteor.call('getCountryGraph', Session.get('selectedBrand'),function(err, graphData) {

        var countriesChart = document.getElementById("countries-chart");

        var myPieChart = new Chart(countriesChart, {
            type: 'bar',
            data: graphData,
            options: {
                title: {
                    display: true,
                    text: 'Visits by Countries'
                }
            }
        });

    });

    Meteor.call('getConvGraphData', 'affiliateClick',Session.get('selectedBrand'), function(err, graphData) {

        var affConvChart = document.getElementById("affiliate-conversions");

        var myPieChart = new Chart(affConvChart, {
            type: 'bar',
            data: graphData,
            options: {
                title: {
                    display: true,
                    text: 'Affiliate Conversions'
                }
            }
        });

    });

    Meteor.call('getConvGraphData', 'subscribe', Session.get('selectedBrand'), function(err, graphData) {

        var listConvChart = document.getElementById("list-conversions");

        var myPieChart = new Chart(listConvChart, {
            type: 'bar',
            data: graphData,
            options: {
                title: {
                    display: true,
                    text: 'List Conversions'
                }
            }
        });

    });

    Meteor.call('getBoxGraphData', Session.get('selectedBrand'),function(err, graphData) {

        var boxConvChart = document.getElementById("box-conversions");

        var myPieChart = new Chart(boxConvChart, {
            type: 'bar',
            data: graphData,
            options: {
                title: {
                    display: true,
                    text: 'Box Conversions'
                }
            }
        });

    });

});